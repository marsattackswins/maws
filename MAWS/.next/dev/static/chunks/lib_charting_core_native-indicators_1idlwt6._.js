(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/charting/core/native-indicators/NativeIndicator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNativeIndicator",
    ()=>getNativeIndicator,
    "nativeIndicatorDescriptors",
    ()=>nativeIndicatorDescriptors,
    "nativeIndicatorTypes",
    ()=>nativeIndicatorTypes,
    "nativeInstanceChannel",
    ()=>nativeInstanceChannel,
    "registerNativeIndicator",
    ()=>registerNativeIndicator,
    "unregisterNativeIndicator",
    ()=>unregisterNativeIndicator
]);
function nativeInstanceChannel(type, instanceId) {
    return `${type}#${instanceId}`;
}
/** Process-wide catalog of native-indicator types. Built-ins (volume, VPVR) register via the composition root. */ const REGISTRY = new Map();
function registerNativeIndicator(descriptor) {
    REGISTRY.set(descriptor.type, descriptor);
}
function unregisterNativeIndicator(type) {
    REGISTRY.delete(type);
}
function getNativeIndicator(type) {
    return REGISTRY.get(type);
}
function nativeIndicatorTypes() {
    return [
        ...REGISTRY.keys()
    ];
}
function nativeIndicatorDescriptors() {
    return [
        ...REGISTRY.values()
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/averages.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MA_TYPES",
    ()=>MA_TYPES,
    "averageSpecs",
    ()=>averageSpecs,
    "movingAverageOf",
    ()=>movingAverageOf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)");
;
;
;
;
const MA_TYPES = [
    'SMA',
    'EMA',
    'WMA',
    'RMA (SMMA)',
    'HMA',
    'ALMA',
    'VWMA',
    'DEMA',
    'TEMA',
    'KAMA',
    'LSMA',
    'McGinley',
    'Hamming'
];
/** The subset an envelope basis offers. */ const ENVELOPE_MA_TYPES = [
    'SMA',
    'EMA',
    'WMA',
    'RMA (SMMA)',
    'HMA',
    'VWMA'
];
function movingAverageOf(kind, src, bars, len, opts = {}) {
    switch(kind){
        case 'EMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(src, len);
        case 'WMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wma"])(src, len);
        case 'RMA':
        case 'RMA (SMMA)':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(src, len);
        case 'HMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hma"])(src, len);
        case 'ALMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alma"])(src, len, opts.almaOffset ?? 0.85, opts.almaSigma ?? 6);
        case 'VWMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vwma"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars), len);
        case 'DEMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dema"])(src, len);
        case 'TEMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tema"])(src, len);
        case 'KAMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["kama"])(src, len);
        case 'LSMA':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linreg"])(src, len, opts.lsmaOffset ?? 0);
        case 'McGinley':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mcginley"])(src, len);
        case 'Hamming':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hamming"])(src, len);
        default:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(src, len);
    }
}
/** Per-bar ink from the line's own slope: rising bullish, falling bearish, flat neutral. */ function slopeColors(values, bull, bear, flat) {
    return values.map((x, i)=>{
        if (!Number.isFinite(x)) return null;
        const prev = i > 0 ? values[i - 1] : Number.NaN;
        if (!Number.isFinite(prev)) return flat;
        return x > prev ? bull : x < prev ? bear : flat;
    });
}
/** The bullish/bearish/neutral trio every slope-colored average shares. */ function directionInputs() {
    return [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('trendColor', 'Slope Trend Coloring', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Colors the line by its slope — bullish while it rises, bearish while it falls. Disable to draw it in the neutral color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Neutral', 'neutralColor'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["widthInput"])()
    ];
}
function slopeColoredPlot(key, title, values, inputs) {
    const neutral = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'neutralColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
    const colored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'trendColor', true);
    return {
        key,
        title,
        values,
        color: neutral,
        width: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lineWidth', 2),
        ...colored ? {
            colors: slopeColors(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]), neutral)
        } : {}
    };
}
const offsetInput = {
    key: 'offset',
    title: 'Offset',
    type: 'int',
    defval: 0,
    min: -500,
    max: 500,
    step: 1,
    group: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"],
    tooltip: 'Bars the plotted line is displaced by. Positive values push it to the right.'
};
/** A single-kind average: the same inputs as the generic study minus the type picker. */ function fixedAverage(type, title, shortTitle, smooth) {
    return {
        type,
        title,
        shortTitle,
        overlay: true,
        inputs: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, `Number of bars used in the ${shortTitle} calculation.`),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', `Price series the ${shortTitle} is calculated on.`),
            offsetInput,
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])()
        ],
        compute: (bars, inputs)=>{
            const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20);
            let values = smooth((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close')), len);
            const offset = Math.trunc((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'offset', 0));
            if (offset !== 0) values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(values, offset);
            return {
                plots: [
                    {
                        key: shortTitle.toLowerCase(),
                        title: shortTitle,
                        values,
                        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"]),
                        width: 2
                    }
                ]
            };
        }
    };
}
const simpleMa = fixedAverage('sma', 'Simple Moving Average', 'SMA', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"]);
const exponentialMa = fixedAverage('ema', 'Exponential Moving Average', 'EMA', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"]);
const movingAverage = {
    type: 'moving-average',
    title: 'Moving Average',
    shortTitle: 'MA',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('maType', 'MA 1 Type', 'SMA', MA_TYPES, 'Moving average calculation used for MA 1.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'MA 1 Length', 5000, 'Number of bars used in the MA 1 calculation.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'MA 1 Source', 'Price series MA 1 is calculated on.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showMa2', 'Show MA 2', false, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], 'Displays the optional second moving average.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('ma2Type', 'MA 2 Type', 'SMA', MA_TYPES, 'Moving average calculation used for MA 2.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(50, 'ma2Length', 'MA 2 Length', 5000, 'Number of bars used in the MA 2 calculation.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'ma2Source', 'MA 2 Source', 'Price series MA 2 is calculated on.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('almaOffset', 'ALMA Offset', 0.85, 0, 1, 0.05, 'ALMA type only. Values near 1 make the average more responsive, values near 0 make it smoother.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('almaSigma', 'ALMA Sigma', 6, 0.1, 100, 0.5, 'ALMA type only. Larger values widen the Gaussian window for a smoother average.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('lsmaOffset', 'LSMA Offset', 0, 0, 500, 'LSMA type only. Bar offset applied to the linear regression value.'),
        offsetInput,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 'MA 1', 'color', 'MA 1 line color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'MA 2', 'ma2Color', 'MA 2 line color.')
    ],
    compute: (bars, inputs)=>{
        const opts = {
            almaOffset: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'almaOffset', 0.85),
            almaSigma: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'almaSigma', 6),
            lsmaOffset: Math.trunc((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lsmaOffset', 0))
        };
        const offset = Math.trunc((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'offset', 0));
        const displace = (v)=>offset === 0 ? v : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(v, offset);
        const kind = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'maType', 'SMA');
        const ma1 = displace(movingAverageOf(kind, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close')), bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20), opts));
        const plots = [
            {
                key: 'ma',
                title: kind,
                values: ma1,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"]),
                width: 2
            }
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showMa2', false)) {
            const kind2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'ma2Type', 'SMA');
            const ma2 = displace(movingAverageOf(kind2, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'ma2Source', 'Close')), bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'ma2Length', 50), opts));
            plots.push({
                key: 'ma2',
                title: `${kind2} 2`,
                values: ma2,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'ma2Color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"]),
                width: 2
            });
        }
        return {
            plots
        };
    }
};
const smoothedMa = {
    type: 'rma',
    title: 'Smoothed Moving Average',
    shortTitle: 'RMA',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', "Price series the average smooths. Wilder computed his 1978 indicators on the close, but the recursion accepts any source."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'RMA Length', 5000, "Number of bars N in Wilder's smoothing: the line keeps (N − 1)/N of its previous value and blends in 1/N of the new price. That alpha is smaller than an EMA's, so an N-period RMA responds like a (2N − 1)-period EMA."),
        ...directionInputs()
    ],
    compute: (bars, inputs)=>({
            plots: [
                slopeColoredPlot('rma', 'RMA', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close')), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14)), inputs)
            ]
        })
};
const zlema = {
    type: 'zlema',
    title: 'Zero-Lag Exponential Moving Average',
    shortTitle: 'ZLEMA',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the average de-lags and then smooths.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(21, 'length', 'ZLEMA Length', 5000, 'EMA length N. It sets both the smoothing (alpha = 2 / (N + 1)) and the correction: an EMA of length N lags by about (N − 1)/2 bars, and the de-lagging step is sized to cancel exactly that.'),
        ...directionInputs()
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 21);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const lag = Math.round((len - 1) / 2);
        const delagged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(src, lag), (a, b)=>2 * a - b);
        return {
            plots: [
                slopeColoredPlot('zlema', 'ZLEMA', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(delagged, len), inputs)
            ]
        };
    }
};
const MOMENTUM_SCALER = 'Momentum (|CMO|)';
const VOLATILITY_SCALER = 'Volatility (StDev Ratio)';
const REGIME = 'Trend Regime';
const vidya = {
    type: 'vidya',
    title: 'Variable Index Dynamic Average',
    shortTitle: 'VIDYA',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the average smooths. VIDYA is classically computed on the close.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(12, 'length', 'VIDYA Length', 5000, 'EMA-equivalent length N of the base smoothing constant, alpha = 2 / (N + 1). The adaptive scaler rescales this base speed bar by bar.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('scaler', 'Adaptive Scaler', MOMENTUM_SCALER, [
            MOMENTUM_SCALER,
            VOLATILITY_SCALER
        ], "Bar-by-bar measure that rescales the smoothing constant. Momentum divides the absolute Chande Momentum Oscillator by 100; Volatility is Chande's original short-term over reference standard deviation."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('scalerLength', 'Scaler Lookback', 9, 1, 5000, 'Lookback of the adaptive scaler — the CMO period in momentum mode, or the short-term standard deviation window in volatility mode.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('refLength', 'Reference StDev Length', 30, 2, 5000, 'Volatility mode only — window of the reference standard deviation the short-term reading is divided by.'),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('flatThreshold', 'Flat Threshold', 0.05, 0, 10, 0.01, 'One-bar change of VIDYA, as a fraction of ATR, below which the line reads as flat.'),
            group: REGIME
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('atrLength', 'ATR Normalization Length', 14, 1, 5000, "ATR window used to normalize VIDYA's one-bar slope, so the flat threshold behaves consistently across symbols and timeframes."),
            group: REGIME
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('trendColor', 'Trend Regime Coloring', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Colors VIDYA by its regime read — bullish while sloping up beyond the flat threshold, bearish while sloping down, flat inside congestion.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('adaptiveGradient', 'Adaptive Gradient', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Blends the trend color toward the flat color according to the adaptive scaler, so the line pales as momentum dies.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Flat', 'flatColor'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Neutral', 'neutralColor'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["widthInput"])()
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 12);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const scalerLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'scalerLength', 9);
        const momentum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cmo"])(src, scalerLen), (x)=>Math.abs(x) / 100);
        const shortDev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stdev"])(src, scalerLen);
        const refDev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stdev"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'refLength', 30));
        const volatility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(shortDev, refDev, (s, r)=>r > 0 ? s / r : 0);
        const scale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'scaler', MOMENTUM_SCALER) === VOLATILITY_SCALER ? volatility : momentum;
        const alphaBase = 2 / (len + 1);
        const out = new Array(src.length).fill(Number.NaN);
        let prev = Number.NaN;
        for(let i = 0; i < src.length; i++){
            const x = src[i];
            if (!Number.isFinite(x)) continue;
            const k = scale[i];
            if (!Number.isFinite(prev) || !Number.isFinite(k)) prev = x;
            else {
                const alpha = Math.min(alphaBase * k, 1);
                prev = alpha * x + (1 - alpha) * prev;
            }
            out[i] = prev;
        }
        const neutral = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'neutralColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'trendColor', true)) {
            return {
                plots: [
                    {
                        key: 'vidya',
                        title: 'VIDYA',
                        values: out,
                        color: neutral,
                        width: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lineWidth', 2)
                    }
                ]
            };
        }
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const flat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'flatColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const threshold = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'flatThreshold', 0.05);
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atr"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'atrLength', 14));
        const fade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'adaptiveGradient', true);
        const colors = out.map((x, i)=>{
            if (!Number.isFinite(x)) return null;
            const r = range[i];
            const slope = i > 0 && Number.isFinite(out[i - 1]) ? x - out[i - 1] : 0;
            const normalized = Number.isFinite(r) && r !== 0 ? slope / r : 0;
            const ink = normalized > threshold ? bull : normalized < -threshold ? bear : null;
            if (ink == null) return flat;
            return fade ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gradient"])(Math.min(scale[i] ?? 0, 1), 0, 1, flat, ink) : ink;
        });
        return {
            plots: [
                {
                    key: 'vidya',
                    title: 'VIDYA',
                    values: out,
                    color: flat,
                    width: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lineWidth', 2),
                    colors
                }
            ]
        };
    }
};
const maEnvelope = {
    type: 'ma-envelope',
    title: 'Moving Average Envelope',
    shortTitle: 'MA Env',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('maType', 'MA Type', 'SMA', ENVELOPE_MA_TYPES, 'Moving average type used as the envelope basis.'),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, 'Number of bars in the basis moving average.'),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the basis moving average is calculated on.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('percent', 'Percent', 2.5, 0, 50, 0.1, 'Envelope offset as a percentage of the basis. Upper = basis × (1 + percent / 100), lower = basis × (1 − percent / 100).'),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["channelStyleInputs"])()
    ],
    compute: (bars, inputs)=>{
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const basis = movingAverageOf((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'maType', 'SMA'), src, bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20));
        const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'percent', 2.5) / 100;
        const ink = {
            bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
            bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
            neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'basisColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directionalChannel"])(bars, basis, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(basis, (x)=>x * (1 + k)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(basis, (x)=>x * (1 - k)), ink, 'envelope');
    }
};
const LINREG_CURVE = 'Curve';
const LINREG_SLOPE = 'Slope';
const linearRegression = {
    type: 'linear-regression',
    title: 'Linear Regression Curve',
    shortTitle: 'LinReg',
    // Slope lives in its own pane; Curve force-overlays itself onto the price candles.
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('mode', 'Mode', LINREG_CURVE, [
            LINREG_CURVE,
            LINREG_SLOPE
        ], 'Curve plots the regression value on the price chart; Slope plots the per-bar slope of the fit in the pane.'),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(100, 'length', 'Length', 5000, 'Number of bars used to fit the linear regression.'),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the regression is fitted to.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Rising', 'bullColor', 'Color of the regression curve and slope line while the fit slopes upward.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Falling', 'bearColor', 'Color of the regression curve and slope line while the fit slopes downward.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Regression Line', 'lineColor', 'Color of the regression curve and slope line while the fit is flat.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 100);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const curve = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linreg"])(src, len, 0);
        const slope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(curve, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linreg"])(src, len, 1), (a, b)=>a - b);
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const flat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'lineColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const colors = slope.map((s)=>Number.isFinite(s) ? s > 0 ? bull : s < 0 ? bear : flat : null);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'mode', LINREG_CURVE) === LINREG_SLOPE) {
            return {
                plots: [
                    {
                        key: 'slope',
                        title: 'Slope',
                        values: slope,
                        color: flat,
                        width: 2,
                        colors
                    }
                ],
                levels: [
                    {
                        key: 'zero',
                        price: 0,
                        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 50),
                        lineStyle: 'dashed'
                    }
                ]
            };
        }
        return {
            plots: [
                {
                    key: 'curve',
                    title: 'Curve',
                    values: curve,
                    color: flat,
                    width: 2,
                    colors,
                    overlay: true
                }
            ]
        };
    }
};
const averageSpecs = [
    simpleMa,
    exponentialMa,
    movingAverage,
    smoothedMa,
    zlema,
    vidya,
    maEnvelope,
    linearRegression
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/bands.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bandSpecs",
    ()=>bandSpecs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)");
;
;
;
;
/** Bands and channels — envelopes around price plus their derived oscillators. */ /** Bill Williams' balance lines are drawn in their own inks, unrelated to direction. */ const JAW_COLOR = '#ab47bc'; // palette-exempt: the Alligator's own jaw hue, not a semantic color
const TEETH_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"];
const LIPS_COLOR = '#ffd700'; // palette-exempt: the Alligator's own lips hue, not a semantic color
function bollinger(bars, inputs) {
    const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20);
    const mult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'mult', 2);
    const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
    const basis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(src, len);
    const dev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stdev"])(src, len), (x)=>x * mult);
    return {
        src,
        basis,
        upper: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(basis, dev, (b, d)=>b + d),
        lower: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(basis, dev, (b, d)=>b - d)
    };
}
/** Length / source / multiplier, as the derived %B and BandWidth studies declare them. */ function bollingerInputs(multMin, multStep) {
    return [
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, 'Number of bars used for the Bollinger Bands basis (a simple moving average) and for the standard deviation.'),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the bands are computed from.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('mult', 'Multiplier', 2, multMin, 50, multStep, 'Standard deviation multiplier for the upper and lower bands.')
    ];
}
const bollingerBands = {
    type: 'bollinger-bands',
    title: 'Bollinger Bands',
    shortTitle: 'BB',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, 'Number of bars used to calculate the basis SMA and the standard deviation.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the bands are calculated on.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('mult', 'Multiplier', 2, 0, 50, 0.1, 'Number of standard deviations added above and below the basis to form the bands.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Basis', 'basisColor', 'Color of the basis (middle band) moving average.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 'Bands', 'color', 'Color of the upper and lower bands.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 92), 'Fill', 'fillColor', 'Fill color of the area between the upper and lower bands.')
    ],
    compute: (bars, inputs)=>{
        const { basis, upper, lower } = bollinger(bars, inputs);
        const ink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"]);
        return {
            plots: [
                {
                    key: 'basis',
                    title: 'Basis',
                    values: basis,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'basisColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
                },
                {
                    key: 'upper',
                    title: 'Upper',
                    values: upper,
                    color: ink
                },
                {
                    key: 'lower',
                    title: 'Lower',
                    values: lower,
                    color: ink
                }
            ],
            bands: [
                {
                    key: 'bb',
                    from: 'upper',
                    to: 'lower',
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fillColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 92))
                }
            ]
        };
    }
};
const PERCENT_B_MID = 0.5;
const THRESHOLDS = 'Thresholds';
const percentB = {
    type: 'percent-b',
    title: 'Bollinger Bands %B',
    shortTitle: '%B',
    overlay: false,
    inputs: [
        ...bollingerInputs(0.001, 0.25),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('overbought', 'Overbought', 1, -10, 10, 0.05, 'Level treated as overbought. 1 is the upper band itself, so readings above the default mean price sits outside the bands.'),
            group: THRESHOLDS
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('oversold', 'Oversold', 0, -10, 10, 0.05, 'Level treated as oversold. 0 is the lower band itself, so readings below the default mean price sits outside the bands.'),
            group: THRESHOLDS
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of %B above the 0.5 midline, where price trades in the upper half of the bands.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of %B below the 0.5 midline, where price trades in the lower half of the bands.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Vertical gradient between %B and the 0.5 midline, fully transparent at the midline and more opaque at the oscillator value.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Levels Color', 'levelsColor', 'Color of the dashed overbought/oversold levels and of the dotted midline.')
    ],
    compute: (bars, inputs)=>{
        const { src, upper, lower } = bollinger(bars, inputs);
        const values = src.map((x, i)=>{
            const u = upper[i];
            const l = lower[i];
            return Number.isFinite(u) && Number.isFinite(l) && u !== l ? (x - l) / (u - l) : Number.NaN;
        });
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const levels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'levelsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const colors = values.map((x)=>Number.isFinite(x) ? x > PERCENT_B_MID ? bull : bear : null);
        const plots = [
            {
                key: 'pb',
                title: '%B',
                values,
                color: bear,
                colors
            },
            {
                key: 'mid',
                title: 'Midline',
                values: values.map((x)=>Number.isFinite(x) ? PERCENT_B_MID : Number.NaN),
                color: levels,
                display: {
                    pane: false,
                    legend: false,
                    dataWindow: false
                }
            }
        ];
        const bands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true) ? [
            {
                key: 'pbFill',
                from: 'pb',
                to: 'mid',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
                // Opaque at the oscillator, invisible where it meets the midline.
                gradient: values.map((x)=>{
                    if (!Number.isFinite(x)) return null;
                    const up = x > PERCENT_B_MID;
                    const ink = up ? bull : bear;
                    return {
                        topValue: Math.max(x, PERCENT_B_MID),
                        bottomValue: Math.min(x, PERCENT_B_MID),
                        topColor: up ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(ink, 50) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(ink, 100),
                        bottomColor: up ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(ink, 100) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(ink, 50)
                    };
                })
            }
        ] : [];
        return {
            plots,
            bands,
            levels: [
                {
                    key: 'overbought',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', 1),
                    color: levels,
                    lineStyle: 'dashed',
                    title: 'Overbought'
                },
                {
                    key: 'oversold',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', 0),
                    color: levels,
                    lineStyle: 'dashed',
                    title: 'Oversold'
                },
                {
                    key: 'midline',
                    price: PERCENT_B_MID,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(levels, 50),
                    lineStyle: 'dotted',
                    title: 'Midline'
                }
            ]
        };
    }
};
const SQUEEZE_BULGE = 'Squeeze & Bulge';
const bandwidth = {
    type: 'bandwidth',
    title: 'Bollinger Bands Width',
    shortTitle: 'BandWidth',
    overlay: false,
    inputs: [
        ...bollingerInputs(0.001, 0.25),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('lookback', 'Reference Lookback', 125, 2, 5000, 'Window used to locate the lowest (Squeeze) and highest (Bulge) BandWidth references.'),
            group: SQUEEZE_BULGE
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showSqueeze', 'Show Squeeze Level', true, SQUEEZE_BULGE, 'Plots the lowest BandWidth of the reference lookback — unusually compressed volatility, a condition rather than a directional signal.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showBulge', 'Show Bulge Level', true, SQUEEZE_BULGE, 'Plots the highest BandWidth of the reference lookback — extreme width that is unlikely to be sustained.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'BandWidth', 'color', 'Color of the BandWidth line. At its Squeeze reference the line takes the Squeeze color, at its Bulge reference the Bulge color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Fills the area between zero and BandWidth with a vertical gradient, fully transparent at zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Squeeze Level', 'squeezeColor', 'Color of the lowest-BandWidth reference line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bulge Level', 'bulgeColor', 'Color of the highest-BandWidth reference line.')
    ],
    compute: (bars, inputs)=>{
        const { basis, upper, lower } = bollinger(bars, inputs);
        // Dividing the span by the basis normalizes it, so readings compare across instruments.
        const values = basis.map((b, i)=>{
            const u = upper[i];
            const l = lower[i];
            return Number.isFinite(b) && b !== 0 && Number.isFinite(u) && Number.isFinite(l) ? (u - l) / b : Number.NaN;
        });
        const lookback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lookback', 125);
        const squeezeLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])(values, lookback);
        const bulgeLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])(values, lookback);
        const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const squeezeInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'squeezeColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"]);
        const bulgeInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bulgeColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const colors = values.map((x, i)=>{
            if (!Number.isFinite(x)) return null;
            if (x <= squeezeLevel[i]) return squeezeInk;
            if (x >= bulgeLevel[i]) return bulgeInk;
            return base;
        });
        const plots = [
            {
                key: 'bbw',
                title: 'BandWidth',
                values,
                color: base,
                colors
            },
            {
                key: 'zero',
                title: 'Zero Line',
                values: values.map((x)=>Number.isFinite(x) ? 0 : Number.NaN),
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90)
            }
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showSqueeze', true)) plots.push({
            key: 'squeeze',
            title: 'Squeeze Level',
            values: squeezeLevel,
            color: squeezeInk
        });
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showBulge', true)) plots.push({
            key: 'bulge',
            title: 'Bulge Level',
            values: bulgeLevel,
            color: bulgeInk
        });
        const bands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true) ? [
            {
                key: 'bbwFill',
                from: 'bbw',
                to: 'zero',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
                gradient: values.map((x, i)=>{
                    if (!Number.isFinite(x)) return null;
                    const ink = colors[i] ?? base;
                    return {
                        topValue: x,
                        bottomValue: 0,
                        topColor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(ink, 50),
                        bottomColor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(ink, 100)
                    };
                })
            }
        ] : [];
        return {
            plots,
            bands
        };
    }
};
const keltner = {
    type: 'keltner-channels',
    title: 'Keltner Channels',
    shortTitle: 'KC',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'EMA Length', 5000, 'Number of bars used to compute the exponential moving average basis line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('atrLength', 'ATR Length', 10, 1, 5000, 'Number of bars used to compute the Average True Range (Wilder smoothing).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('mult', 'Multiplier', 2, 0, 50, 0.1, 'ATR multiple used to offset the upper and lower bands from the basis line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series used to compute the basis line.'),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["channelStyleInputs"])('Basis Color')
    ],
    compute: (bars, inputs)=>{
        const basis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close')), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20));
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atr"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'atrLength', 10)), (x)=>x * (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'mult', 2));
        const ink = {
            bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
            bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
            neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'basisColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directionalChannel"])(bars, basis, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(basis, range, (b, r)=>b + r), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(basis, range, (b, r)=>b - r), ink, 'kc');
    }
};
const donchian = {
    type: 'donchian-channels',
    title: 'Donchian Channels',
    shortTitle: 'DC',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, 'Lookback length. The upper and lower channels are the highest high and lowest low over this many bars.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Upper', 'upperColor', 'Color of the upper channel line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Middle', 'middleColor', 'Color of the channel midline.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Lower', 'lowerColor', 'Color of the lower channel line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 92), 'Fill', 'fillColor', 'Color of the channel interior fill.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20);
        const upper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), len);
        const lower = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), len);
        return {
            plots: [
                {
                    key: 'upper',
                    title: 'Upper',
                    values: upper,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'upperColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
                },
                {
                    key: 'middle',
                    title: 'Middle',
                    kind: 'circles',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(upper, lower, (u, l)=>(u + l) / 2),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'middleColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
                },
                {
                    key: 'lower',
                    title: 'Lower',
                    values: lower,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'lowerColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"])
                }
            ],
            bands: [
                {
                    key: 'dc',
                    from: 'upper',
                    to: 'lower',
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fillColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 92))
                }
            ]
        };
    }
};
const chandelier = {
    type: 'chandelier-exit',
    title: 'Chandelier Exit',
    shortTitle: 'CE',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(22, 'length', 'Length', 5000, 'Lookback used for both the highest high / lowest low extremes and the ATR.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('mult', 'ATR Multiplier', 3, 0, 50, 0.1, 'Multiple of ATR subtracted from the highest high (long stop) and added to the lowest low (short stop).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('ratchet', 'Ratchet Stops', false, undefined, 'Prevents the long stop from falling and the short stop from rising, resetting once close crosses through the stop.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Long Stop', 'longColor', 'Color of the long trailing stop line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Short Stop', 'shortColor', 'Color of the short trailing stop line.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 22);
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atr"])(bars, len), (x)=>x * (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'mult', 3));
        const basicLong = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), len), range, (h, r)=>h - r);
        const basicShort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), len), range, (l, r)=>l + r);
        let long = basicLong;
        let short = basicShort;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'ratchet', false)) {
            long = new Array(bars.length).fill(Number.NaN);
            short = new Array(bars.length).fill(Number.NaN);
            for(let i = 0; i < bars.length; i++){
                const bl = basicLong[i];
                const bs = basicShort[i];
                const prevClose = i > 0 ? bars[i - 1].close : bars[i].close;
                const prevLong = i > 0 && Number.isFinite(long[i - 1]) ? long[i - 1] : bl;
                const prevShort = i > 0 && Number.isFinite(short[i - 1]) ? short[i - 1] : bs;
                long[i] = Number.isFinite(bl) ? prevClose > prevLong ? Math.max(bl, prevLong) : bl : Number.NaN;
                short[i] = Number.isFinite(bs) ? prevClose < prevShort ? Math.min(bs, prevShort) : bs : Number.NaN;
            }
        }
        return {
            plots: [
                {
                    key: 'long',
                    title: 'Long Stop',
                    values: long,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'longColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"])
                },
                {
                    key: 'short',
                    title: 'Short Stop',
                    values: short,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'shortColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
                }
            ]
        };
    }
};
const chandeKroll = {
    type: 'chande-kroll-stop',
    title: 'Chande Kroll Stop',
    shortTitle: 'CKS',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('p', 'ATR Length (P)', 10, 1, 5000, 'Lookback used for both the ATR and the highest high / lowest low price extremes.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('x', 'ATR Multiplier (X)', 1, 0, 50, 0.1, 'Multiplier applied to the ATR to offset the preliminary stops from the price extremes.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('q', 'Stop Length (Q)', 9, 1, 5000, 'Lookback over which the preliminary stops are extended into the final stop levels.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Stop Short', 'shortColor', 'Color of the protective stop line for short positions.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Stop Long', 'longColor', 'Color of the protective stop line for long positions.')
    ],
    compute: (bars, inputs)=>{
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'p', 10);
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'q', 9);
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atr"])(bars, p), (v)=>v * (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'x', 1));
        const firstHigh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), p), range, (h, r)=>h - r);
        const firstLow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), p), range, (l, r)=>l + r);
        return {
            plots: [
                {
                    key: 'stopShort',
                    title: 'Stop Short',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])(firstHigh, q),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'shortColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
                },
                {
                    key: 'stopLong',
                    title: 'Stop Long',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])(firstLow, q),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'longColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"])
                }
            ]
        };
    }
};
const supertrend = {
    type: 'supertrend',
    title: 'SuperTrend',
    shortTitle: 'SuperTrend',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('atrLength', 'ATR Length', 10, 1, 5000, 'Number of bars used to compute the Wilder ATR.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('mult', 'Factor', 3, 0, 50, 0.1, 'ATR multiplier setting how far the trailing stop sits from the bar midpoint.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Uptrend Color', 'upColor', 'Line color while the trend is up.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Downtrend Color', 'downColor', 'Line color while the trend is down.')
    ],
    compute: (bars, inputs)=>{
        const mult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'mult', 3);
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atr"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'atrLength', 10));
        const n = bars.length;
        const up = new Array(n).fill(Number.NaN);
        const down = new Array(n).fill(Number.NaN);
        let finalUpper = Number.NaN;
        let finalLower = Number.NaN;
        let trend = -1;
        for(let i = 0; i < n; i++){
            const r = range[i];
            if (!Number.isFinite(r)) continue;
            const b = bars[i];
            const mid = (b.high + b.low) / 2;
            const basicUpper = mid + mult * r;
            const basicLower = mid - mult * r;
            const prevUpper = Number.isFinite(finalUpper) ? finalUpper : basicUpper;
            const prevLower = Number.isFinite(finalLower) ? finalLower : basicLower;
            const prevClose = i > 0 ? bars[i - 1].close : b.close;
            // Bands only ratchet while the prior close holds inside them; otherwise they reset.
            finalUpper = prevClose <= prevUpper ? Math.min(basicUpper, prevUpper) : basicUpper;
            finalLower = prevClose >= prevLower ? Math.max(basicLower, prevLower) : basicLower;
            trend = b.close > finalUpper ? 1 : b.close < finalLower ? -1 : trend;
            if (trend === 1) up[i] = finalLower;
            else down[i] = finalUpper;
        }
        return {
            plots: [
                {
                    key: 'up',
                    title: 'Uptrend',
                    values: up,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'upColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"])
                },
                {
                    key: 'down',
                    title: 'Downtrend',
                    values: down,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'downColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
                }
            ]
        };
    }
};
const alligator = {
    type: 'williams-alligator',
    title: 'Williams Alligator',
    shortTitle: 'Alligator',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('jawLength', 'Jaw Length', 13, 1, 5000, 'Smoothing length of the Jaw SMMA of median price (hl2), 13 in the classic setup.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('teethLength', 'Teeth Length', 8, 1, 5000, 'Smoothing length of the Teeth SMMA of median price (hl2), 8 in the classic setup.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('lipsLength', 'Lips Length', 5, 1, 5000, 'Smoothing length of the Lips SMMA of median price (hl2), 5 in the classic setup.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('jawOffset', 'Jaw Offset', 8, 0, 100, 'Number of bars the Jaw plot is shifted into the future, 8 in the classic setup.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('teethOffset', 'Teeth Offset', 5, 0, 100, 'Number of bars the Teeth plot is shifted into the future, 5 in the classic setup.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('lipsOffset', 'Lips Offset', 3, 0, 100, 'Number of bars the Lips plot is shifted into the future, 3 in the classic setup.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(JAW_COLOR, 'Jaw', 'jawColor', 'Color of the Jaw line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(TEETH_COLOR, 'Teeth', 'teethColor', 'Color of the Teeth line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(LIPS_COLOR, 'Lips', 'lipsColor', 'Color of the Lips line.')
    ],
    compute: (bars, inputs)=>{
        const hl2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, 'HL2');
        // Offsets plot each balance line within the available bars (no future timestamps to plot onto).
        const jaw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(hl2, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'jawLength', 13)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'jawOffset', 8));
        const teeth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(hl2, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'teethLength', 8)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'teethOffset', 5));
        const lips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(hl2, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lipsLength', 5)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lipsOffset', 3));
        return {
            plots: [
                {
                    key: 'jaw',
                    title: 'Jaw',
                    values: jaw,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'jawColor', JAW_COLOR)
                },
                {
                    key: 'teeth',
                    title: 'Teeth',
                    values: teeth,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'teethColor', TEETH_COLOR)
                },
                {
                    key: 'lips',
                    title: 'Lips',
                    values: lips,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'lipsColor', LIPS_COLOR)
                }
            ]
        };
    }
};
const GATOR_LINES = 'Alligator Lines';
const SMMA_TYPE = 'SMMA (Wilder)';
const gator = {
    type: 'gator-oscillator',
    title: 'Gator Oscillator',
    shortTitle: 'Gator Oscillator',
    overlay: false,
    inputs: [
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('HL2', 'source', 'Source', "Price series fed to the three Alligator averages. Bill Williams' original recipe uses the median price (high + low) / 2."),
            group: GATOR_LINES
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('maType', 'Smoothing', SMMA_TYPE, [
                SMMA_TYPE,
                'SMA',
                'EMA'
            ], 'Moving average applied to the source for the jaw, teeth and lips. The original uses the smoothed (Wilder-style) moving average.'),
            group: GATOR_LINES
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('jawLength', 'Jaw Length', 13, 1, 500, 'Averaging length of the jaw line.'),
            group: GATOR_LINES
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('jawOffset', 'Jaw Offset', 8, 0, 100, 'Bars the jaw is displaced forward, 8 in the original recipe. The upper histogram measures the absolute spread between the displaced jaw and teeth.'),
            group: GATOR_LINES
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('teethLength', 'Teeth Length', 8, 1, 500, 'Averaging length of the teeth line.'),
            group: GATOR_LINES
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('teethOffset', 'Teeth Offset', 5, 0, 100, 'Bars the teeth are displaced forward, 5 in the original recipe. The teeth line enters both spreads.'),
            group: GATOR_LINES
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('lipsLength', 'Lips Length', 5, 1, 500, 'Averaging length of the lips line.'),
            group: GATOR_LINES
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('lipsOffset', 'Lips Offset', 3, 0, 100, 'Bars the lips are displaced forward, 3 in the original recipe. The lower histogram measures the negative absolute spread between the displaced teeth and lips.'),
            group: GATOR_LINES
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Expanding', 'growColor', 'Column color while a spread grew against its own previous bar — the averages are spreading apart.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Contracting', 'shrinkColor', 'Column color while a spread shrank — the averages are converging. Color encodes expansion, not trade direction.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Zero Line', 'zeroColor', 'Color of the zero line separating the two histograms.')
    ],
    compute: (bars, inputs)=>{
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'HL2'));
        const kind = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'maType', SMMA_TYPE);
        const smooth = (len)=>kind === 'SMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(src, len) : kind === 'EMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(src, len) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(src, len);
        const jaw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(smooth((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'jawLength', 13)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'jawOffset', 8));
        const teeth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(smooth((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'teethLength', 8)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'teethOffset', 5));
        const lips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(smooth((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lipsLength', 5)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lipsOffset', 3));
        const upper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])(jaw, teeth), Math.abs);
        const lower = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])(teeth, lips), Math.abs);
        const grow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'growColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const shrink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'shrinkColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        // Each side is graded against its own previous bar; an exact tie keeps the state.
        const expansionColors = (v)=>{
            let growing = false;
            return v.map((x, i)=>{
                if (!Number.isFinite(x)) return null;
                const prev = i > 0 ? v[i - 1] : Number.NaN;
                if (Number.isFinite(prev)) growing = x > prev ? true : x < prev ? false : growing;
                return growing ? grow : shrink;
            });
        };
        return {
            plots: [
                {
                    key: 'upper',
                    title: 'Upper Histogram (Jaw - Teeth)',
                    values: upper,
                    kind: 'columns',
                    color: grow,
                    colors: expansionColors(upper),
                    base: 0
                },
                {
                    key: 'lower',
                    title: 'Lower Histogram (Teeth - Lips)',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(lower, (x)=>-x),
                    kind: 'columns',
                    color: shrink,
                    colors: expansionColors(lower),
                    base: 0
                }
            ],
            levels: [
                {
                    key: 'zero',
                    price: 0,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'zeroColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                    lineStyle: 'solid',
                    title: 'Zero Line'
                }
            ]
        };
    }
};
const bandSpecs = [
    bollingerBands,
    percentB,
    bandwidth,
    keltner,
    donchian,
    chandelier,
    chandeKroll,
    supertrend,
    alligator,
    gator
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bool",
    ()=>bool,
    "classicDescriptor",
    ()=>classicDescriptor,
    "num",
    ()=>num,
    "str",
    ()=>str
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/model/identity.ts [app-client] (ecmascript)");
;
function num(inputs, key, fallback) {
    const v = inputs[key];
    return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
function str(inputs, key, fallback) {
    const v = inputs[key];
    return typeof v === 'string' && v !== '' ? v : fallback;
}
function bool(inputs, key, fallback) {
    const v = inputs[key];
    return typeof v === 'boolean' ? v : fallback;
}
function toPoints(bars, values, colors) {
    const pts = new Array(bars.length);
    for(let i = 0; i < bars.length; i++){
        const v = values[i];
        const p = {
            time: bars[i].time,
            value: v != null && Number.isFinite(v) ? v : null
        };
        const c = colors?.[i];
        if (c != null) p.color = c;
        pts[i] = p;
    }
    return pts;
}
class ClassicIndicator {
    spec;
    /** Null until start() — a pre-start setInputs must record without computing. */ ctx;
    inputs;
    constructor(spec){
        this.spec = spec;
        this.ctx = null;
        this.inputs = {};
    }
    start(ctx, inputs) {
        this.ctx = ctx;
        this.inputs = inputs;
        this.recompute();
    }
    onBars() {
        this.recompute();
    }
    onViewport() {}
    setInputs(inputs) {
        this.inputs = inputs;
        // Pre-start edits (a workspace restore applies stored inputs the moment the
        // handle exists) just record: `ctx` lands at start(), which recomputes with
        // the orchestrator's replayed values — computing here would read no bars.
        if (!this.ctx) return;
        this.recompute();
    }
    /** Nothing to free — the compute reads the live bar accessor on demand. */ suspend() {}
    resume() {
        this.recompute();
    }
    stop() {}
    recompute() {
        if (!this.ctx) return;
        const bars = this.ctx.bars();
        const out = this.spec.compute(bars, this.inputs);
        const instanceId = this.spec.type;
        const series = [];
        const idsByKey = new Map();
        out.plots.forEach((plot, ordinal)=>{
            const kind = plot.kind ?? 'line';
            const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stableSeriesId"])({
                instanceId,
                kind,
                title: plot.title,
                ordinal
            });
            idsByKey.set(plot.key, id);
            series.push({
                id,
                title: plot.title,
                paneId: '',
                kind,
                points: toPoints(bars, plot.values, plot.colors),
                style: {
                    color: plot.color,
                    width: plot.width ?? 1,
                    lineStyle: plot.lineStyle ?? 'solid',
                    ...plot.base != null ? {
                        base: plot.base
                    } : {}
                },
                ...plot.overlay ? {
                    overlay: true
                } : {},
                ...plot.display ? {
                    display: plot.display
                } : {}
            });
        });
        if (out.markers && out.markers.length > 0) {
            series.push({
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stableSeriesId"])({
                    instanceId,
                    kind: 'markers',
                    title: 'markers',
                    ordinal: 0
                }),
                title: this.spec.shortTitle ?? this.spec.title,
                paneId: '',
                kind: 'markers',
                markers: out.markers
            });
        }
        const fills = (out.bands ?? []).flatMap((band, ordinal)=>{
            const from = idsByKey.get(band.from);
            const to = idsByKey.get(band.to);
            if (!from || !to) return [];
            return [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stableSeriesId"])({
                        instanceId,
                        kind: 'fill',
                        title: band.key,
                        ordinal
                    }),
                    paneId: '',
                    fromSeriesId: from,
                    toSeriesId: to,
                    color: band.color,
                    ...band.colors ? {
                        colors: [
                            ...band.colors
                        ]
                    } : {},
                    ...band.gradient ? {
                        gradient: [
                            ...band.gradient
                        ]
                    } : {}
                }
            ];
        });
        const priceLines = (out.levels ?? []).map((level, ordinal)=>({
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stableSeriesId"])({
                    instanceId,
                    kind: 'hline',
                    title: level.key,
                    ordinal
                }),
                paneId: '',
                price: level.price,
                ...level.color != null ? {
                    color: level.color
                } : {},
                lineStyle: level.lineStyle ?? 'dashed',
                width: 1,
                ...level.title != null ? {
                    title: level.title
                } : {}
            }));
        const polylines = (out.polylines ?? []).map((poly, ordinal)=>{
            const { key, ...rest } = poly;
            return {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stableSeriesId"])({
                    instanceId,
                    kind: 'polyline',
                    title: key,
                    ordinal
                }),
                paneId: '',
                ...rest
            };
        });
        this.ctx.emit({
            series,
            fills,
            priceLines,
            polylines
        });
        this.ctx.setStatus('idle');
    }
}
function classicDescriptor(spec) {
    return {
        type: spec.type,
        title: spec.title,
        ...spec.shortTitle != null ? {
            shortTitle: spec.shortTitle
        } : {},
        paneHint: spec.overlay ? 'price' : 'new',
        overlay: spec.overlay,
        // Studies stack (a 20 and a 200 moving average side by side) — unlike the layer-backed natives.
        multiInstance: true,
        inputsSchema: ()=>spec.inputs,
        defaultInputs: ()=>Object.fromEntries(spec.inputs.map((i)=>[
                    i.key,
                    i.defval
                ])),
        create: ()=>new ClassicIndicator(spec)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classicSpecs",
    ()=>classicSpecs,
    "registerClassicIndicators",
    ()=>registerClassicIndicators
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/NativeIndicator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$averages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/averages.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$bands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/bands.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$oscillators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/oscillators.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$trend$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/trend.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$volatility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/volatility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$volume$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/volume.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$overlays$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/overlays.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
const classicSpecs = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$averages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["averageSpecs"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$bands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bandSpecs"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$oscillators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["oscillatorSpecs"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$trend$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trendSpecs"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$volatility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volatilitySpecs"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$volume$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumeSpecs"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$overlays$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["overlaySpecs"]
];
function registerClassicIndicators() {
    for (const spec of classicSpecs)(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerNativeIndicator"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["classicDescriptor"])(spec));
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SOURCES",
    ()=>SOURCES,
    "add",
    ()=>add,
    "alma",
    ()=>alma,
    "atr",
    ()=>atr,
    "barIndex",
    ()=>barIndex,
    "barsSinceHighest",
    ()=>barsSinceHighest,
    "barsSinceLowest",
    ()=>barsSinceLowest,
    "change",
    ()=>change,
    "closes",
    ()=>closes,
    "cmo",
    ()=>cmo,
    "correlation",
    ()=>correlation,
    "cumSum",
    ()=>cumSum,
    "dema",
    ()=>dema,
    "ema",
    ()=>ema,
    "fill",
    ()=>fill,
    "hamming",
    ()=>hamming,
    "highest",
    ()=>highest,
    "highs",
    ()=>highs,
    "hma",
    ()=>hma,
    "kama",
    ()=>kama,
    "linreg",
    ()=>linreg,
    "lowest",
    ()=>lowest,
    "lows",
    ()=>lows,
    "map",
    ()=>map,
    "mcginley",
    ()=>mcginley,
    "meanDev",
    ()=>meanDev,
    "opens",
    ()=>opens,
    "percentRank",
    ()=>percentRank,
    "rma",
    ()=>rma,
    "roc",
    ()=>roc,
    "rsi",
    ()=>rsi,
    "shift",
    ()=>shift,
    "sma",
    ()=>sma,
    "sourceValues",
    ()=>sourceValues,
    "stdev",
    ()=>stdev,
    "stoch",
    ()=>stoch,
    "sub",
    ()=>sub,
    "sum",
    ()=>sum,
    "swma",
    ()=>swma,
    "tema",
    ()=>tema,
    "trueRange",
    ()=>trueRange,
    "volumes",
    ()=>volumes,
    "vwma",
    ()=>vwma,
    "wma",
    ()=>wma,
    "zip",
    ()=>zip
]);
const SOURCES = [
    'Close',
    'Open',
    'High',
    'Low',
    'HL2',
    'HLC3',
    'OHLC4',
    'HLCC4'
];
function sourceValues(bars, source) {
    const out = new Array(bars.length);
    for(let i = 0; i < bars.length; i++){
        const b = bars[i];
        switch(source){
            case 'Open':
                out[i] = b.open;
                break;
            case 'High':
                out[i] = b.high;
                break;
            case 'Low':
                out[i] = b.low;
                break;
            case 'HL2':
                out[i] = (b.high + b.low) / 2;
                break;
            case 'HLC3':
                out[i] = (b.high + b.low + b.close) / 3;
                break;
            case 'OHLC4':
                out[i] = (b.open + b.high + b.low + b.close) / 4;
                break;
            case 'HLCC4':
                out[i] = (b.high + b.low + b.close + b.close) / 4;
                break;
            default:
                out[i] = b.close;
        }
    }
    return out;
}
function volumes(bars) {
    return bars.map((b)=>b.volume != null && Number.isFinite(b.volume) ? b.volume : Number.NaN);
}
function highs(bars) {
    return bars.map((b)=>b.high);
}
function lows(bars) {
    return bars.map((b)=>b.low);
}
function closes(bars) {
    return bars.map((b)=>b.close);
}
function opens(bars) {
    return bars.map((b)=>b.open);
}
function zip(a, b, f) {
    const out = new Array(a.length);
    for(let i = 0; i < a.length; i++){
        const x = a[i];
        const y = b[i];
        out[i] = Number.isFinite(x) && Number.isFinite(y) ? f(x, y) : Number.NaN;
    }
    return out;
}
function map(a, f) {
    const out = new Array(a.length);
    for(let i = 0; i < a.length; i++){
        const x = a[i];
        out[i] = Number.isFinite(x) ? f(x) : Number.NaN;
    }
    return out;
}
function add(a, b) {
    return zip(a, b, (x, y)=>x + y);
}
function sub(a, b) {
    return zip(a, b, (x, y)=>x - y);
}
/** Windowed fold: NaN until `len` consecutive finite values end at the index. */ function windowed(v, len, fold) {
    const out = new Array(v.length).fill(Number.NaN);
    if (len <= 0) return out;
    // Track the length of the finite run ending at i so a single mid-stream NaN
    // restarts the warm-up instead of poisoning one output only.
    let run = 0;
    for(let i = 0; i < v.length; i++){
        run = Number.isFinite(v[i]) ? run + 1 : 0;
        if (run >= len) out[i] = fold(v, i - len + 1, i);
    }
    return out;
}
function sum(v, len) {
    return windowed(v, len, (w, from, to)=>{
        let s = 0;
        for(let k = from; k <= to; k++)s += w[k];
        return s;
    });
}
function sma(v, len) {
    return windowed(v, len, (w, from, to)=>{
        let s = 0;
        for(let k = from; k <= to; k++)s += w[k];
        return s / len;
    });
}
function wma(v, len) {
    const norm = len * (len + 1) / 2;
    return windowed(v, len, (w, from, to)=>{
        let s = 0;
        for(let k = from; k <= to; k++)s += w[k] * (k - from + 1);
        return s / norm;
    });
}
function vwma(src, vol, len) {
    const pv = zip(src, vol, (p, q)=>p * q);
    return zip(sum(pv, len), sum(vol, len), (a, b)=>b > 0 ? a / b : Number.NaN);
}
function stdev(v, len) {
    return windowed(v, len, (w, from, to)=>{
        let s = 0;
        for(let k = from; k <= to; k++)s += w[k];
        const mean = s / len;
        let sq = 0;
        for(let k = from; k <= to; k++){
            const d = w[k] - mean;
            sq += d * d;
        }
        return Math.sqrt(sq / len);
    });
}
function meanDev(v, len) {
    return windowed(v, len, (w, from, to)=>{
        let s = 0;
        for(let k = from; k <= to; k++)s += w[k];
        const mean = s / len;
        let dev = 0;
        for(let k = from; k <= to; k++)dev += Math.abs(w[k] - mean);
        return dev / len;
    });
}
function highest(v, len) {
    return windowed(v, len, (w, from, to)=>{
        let m = -Infinity;
        for(let k = from; k <= to; k++)if (w[k] > m) m = w[k];
        return m;
    });
}
function lowest(v, len) {
    return windowed(v, len, (w, from, to)=>{
        let m = Infinity;
        for(let k = from; k <= to; k++)if (w[k] < m) m = w[k];
        return m;
    });
}
function barsSinceHighest(v, len) {
    return windowed(v, len, (w, from, to)=>{
        let m = -Infinity;
        let at = to;
        for(let k = from; k <= to; k++){
            if (w[k] >= m) {
                m = w[k];
                at = k;
            }
        }
        return to - at;
    });
}
function barsSinceLowest(v, len) {
    return windowed(v, len, (w, from, to)=>{
        let m = Infinity;
        let at = to;
        for(let k = from; k <= to; k++){
            if (w[k] <= m) {
                m = w[k];
                at = k;
            }
        }
        return to - at;
    });
}
/** Recursive average with seed = SMA of the first clean window; re-seeds after a gap. */ function recursive(v, len, alpha) {
    const out = new Array(v.length).fill(Number.NaN);
    let run = 0;
    let prev = Number.NaN;
    for(let i = 0; i < v.length; i++){
        const x = v[i];
        if (!Number.isFinite(x)) {
            run = 0;
            prev = Number.NaN;
            continue;
        }
        run += 1;
        if (Number.isFinite(prev)) {
            prev = alpha * x + (1 - alpha) * prev;
            out[i] = prev;
        } else if (run >= len) {
            let s = 0;
            for(let k = i - len + 1; k <= i; k++)s += v[k];
            prev = s / len;
            out[i] = prev;
        }
    }
    return out;
}
function ema(v, len) {
    return recursive(v, len, 2 / (len + 1));
}
function rma(v, len) {
    return recursive(v, len, 1 / len);
}
function change(v, n = 1) {
    const out = new Array(v.length).fill(Number.NaN);
    for(let i = n; i < v.length; i++){
        const a = v[i];
        const b = v[i - n];
        if (Number.isFinite(a) && Number.isFinite(b)) out[i] = a - b;
    }
    return out;
}
function roc(v, len) {
    const out = new Array(v.length).fill(Number.NaN);
    for(let i = len; i < v.length; i++){
        const a = v[i];
        const b = v[i - len];
        if (Number.isFinite(a) && Number.isFinite(b) && b !== 0) out[i] = 100 * (a - b) / b;
    }
    return out;
}
function shift(v, n) {
    const out = new Array(v.length).fill(Number.NaN);
    for(let i = 0; i < v.length; i++){
        const j = i - n;
        if (j >= 0 && j < v.length) out[i] = v[j];
    }
    return out;
}
function trueRange(bars) {
    const out = new Array(bars.length).fill(Number.NaN);
    for(let i = 0; i < bars.length; i++){
        const b = bars[i];
        if (i === 0) {
            out[i] = b.high - b.low;
            continue;
        }
        const pc = bars[i - 1].close;
        out[i] = Math.max(b.high - b.low, Math.abs(b.high - pc), Math.abs(b.low - pc));
    }
    return out;
}
function atr(bars, len) {
    return rma(trueRange(bars), len);
}
function rsi(v, len) {
    const d = change(v);
    const up = map(d, (x)=>Math.max(x, 0));
    const dn = map(d, (x)=>Math.max(-x, 0));
    return zip(rma(up, len), rma(dn, len), (u, w)=>w === 0 ? 100 : 100 - 100 / (1 + u / w));
}
function stoch(v, hi, lo, len) {
    const hh = highest(hi, len);
    const ll = lowest(lo, len);
    const out = new Array(v.length).fill(Number.NaN);
    for(let i = 0; i < v.length; i++){
        const x = v[i];
        const h = hh[i];
        const l = ll[i];
        if (!Number.isFinite(x) || !Number.isFinite(h) || !Number.isFinite(l)) continue;
        out[i] = h === l ? 50 : 100 * (x - l) / (h - l);
    }
    return out;
}
function linreg(v, len, offset = 0) {
    // Closed form over x = 0..len-1 with y newest-last: slope/intercept from the
    // standard normal equations, evaluated at x = len - 1 - offset.
    const sx = (len - 1) * len / 2;
    const sxx = (len - 1) * len * (2 * len - 1) / 6;
    const denom = len * sxx - sx * sx;
    return windowed(v, len, (w, from, to)=>{
        let sy = 0;
        let sxy = 0;
        for(let k = from; k <= to; k++){
            const x = k - from;
            sy += w[k];
            sxy += x * w[k];
        }
        const slope = denom === 0 ? 0 : (len * sxy - sx * sy) / denom;
        const intercept = (sy - slope * sx) / len;
        return intercept + slope * (len - 1 - offset);
    });
}
function hma(v, len) {
    const n = Math.max(2, Math.trunc(len));
    const raw = sub(map(wma(v, Math.max(1, Math.trunc(n / 2))), (x)=>2 * x), wma(v, n));
    return wma(raw, Math.max(1, Math.round(Math.sqrt(n))));
}
function alma(v, len, offset, sigma) {
    const m = offset * (len - 1);
    const s = len / Math.max(sigma, 1e-9);
    const weights = new Array(len);
    let norm = 0;
    for(let i = 0; i < len; i++){
        const d = i - m;
        const w = Math.exp(-(d * d) / (2 * s * s));
        weights[i] = w;
        norm += w;
    }
    return windowed(v, len, (win, from, to)=>{
        let acc = 0;
        for(let k = from; k <= to; k++)acc += win[k] * weights[k - from];
        return norm === 0 ? Number.NaN : acc / norm;
    });
}
function dema(v, len) {
    const e1 = ema(v, len);
    return sub(map(e1, (x)=>2 * x), ema(e1, len));
}
function tema(v, len) {
    const e1 = ema(v, len);
    const e2 = ema(e1, len);
    const e3 = ema(e2, len);
    return zip(zip(map(e1, (x)=>3 * x), map(e2, (x)=>3 * x), (a, b)=>a - b), e3, (a, b)=>a + b);
}
function kama(v, len, fastAlpha = 2 / 3, slowAlpha = 2 / 31) {
    const direction = map(change(v, len), Math.abs);
    const volatility = sum(map(change(v), Math.abs), len);
    const out = new Array(v.length).fill(Number.NaN);
    let prev = Number.NaN;
    for(let i = 0; i < v.length; i++){
        const x = v[i];
        if (!Number.isFinite(x)) continue;
        const d = direction[i];
        const w = volatility[i];
        if (!Number.isFinite(d) || !Number.isFinite(w)) {
            prev = Number.isFinite(prev) ? prev : x;
            out[i] = prev;
            continue;
        }
        const er = w === 0 ? 0 : d / w;
        const sc = (er * (fastAlpha - slowAlpha) + slowAlpha) ** 2;
        prev = Number.isFinite(prev) ? prev + sc * (x - prev) : x;
        out[i] = prev;
    }
    return out;
}
function mcginley(v, len) {
    const out = new Array(v.length).fill(Number.NaN);
    let prev = Number.NaN;
    for(let i = 0; i < v.length; i++){
        const x = v[i];
        if (!Number.isFinite(x)) continue;
        if (!Number.isFinite(prev)) {
            prev = x;
        } else {
            const ratio = prev === 0 ? 0 : x / prev;
            const denom = len * ratio ** 4;
            prev += denom === 0 ? 0 : (x - prev) / denom;
        }
        out[i] = prev;
    }
    return out;
}
function hamming(v, len, a0 = 0.54, a1 = 0.46) {
    if (len <= 1) return v.map((x)=>Number.isFinite(x) ? x : Number.NaN);
    const weights = new Array(len);
    let norm = 0;
    for(let i = 0; i < len; i++){
        const w = a0 - a1 * Math.cos(2 * Math.PI * i / (len - 1));
        weights[i] = w;
        norm += w;
    }
    // Weight 0 belongs to the OLDEST bar of the window, matching the reference's `src[i]`
    // walk from the newest bar backwards over a window symmetric about its centre.
    return windowed(v, len, (win, from, to)=>{
        let acc = 0;
        for(let k = from; k <= to; k++)acc += win[k] * weights[to - k];
        return norm === 0 ? Number.NaN : acc / norm;
    });
}
function cmo(v, len) {
    const d = change(v);
    const up = sum(map(d, (x)=>Math.max(x, 0)), len);
    const dn = sum(map(d, (x)=>Math.max(-x, 0)), len);
    return zip(up, dn, (u, w)=>u + w === 0 ? 0 : 100 * (u - w) / (u + w));
}
function correlation(a, b, len) {
    const out = new Array(a.length).fill(Number.NaN);
    for(let i = len - 1; i < a.length; i++){
        let sa = 0;
        let sb = 0;
        let ok = true;
        for(let k = i - len + 1; k <= i; k++){
            const x = a[k];
            const y = b[k];
            if (!Number.isFinite(x) || !Number.isFinite(y)) {
                ok = false;
                break;
            }
            sa += x;
            sb += y;
        }
        if (!ok) continue;
        const ma = sa / len;
        const mb = sb / len;
        let cov = 0;
        let va = 0;
        let vb = 0;
        for(let k = i - len + 1; k <= i; k++){
            const da = a[k] - ma;
            const db = b[k] - mb;
            cov += da * db;
            va += da * da;
            vb += db * db;
        }
        const denom = Math.sqrt(va * vb);
        out[i] = denom === 0 ? 0 : cov / denom;
    }
    return out;
}
function barIndex(length) {
    const out = new Array(length);
    for(let i = 0; i < length; i++)out[i] = i;
    return out;
}
function swma(v) {
    const out = new Array(v.length).fill(Number.NaN);
    for(let i = 3; i < v.length; i++){
        const a = v[i - 3];
        const b = v[i - 2];
        const c = v[i - 1];
        const d = v[i];
        if (Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c) && Number.isFinite(d)) {
            out[i] = (a + 2 * b + 2 * c + d) / 6;
        }
    }
    return out;
}
function percentRank(v, len) {
    const out = new Array(v.length).fill(Number.NaN);
    for(let i = len; i < v.length; i++){
        const x = v[i];
        if (!Number.isFinite(x)) continue;
        let below = 0;
        let count = 0;
        for(let k = i - len; k < i; k++){
            const y = v[k];
            if (!Number.isFinite(y)) {
                count = -1;
                break;
            }
            count += 1;
            if (y <= x) below += 1;
        }
        if (count === len) out[i] = 100 * below / len;
    }
    return out;
}
function cumSum(v) {
    const out = new Array(v.length).fill(Number.NaN);
    let acc = 0;
    let seen = false;
    for(let i = 0; i < v.length; i++){
        const x = v[i];
        if (Number.isFinite(x)) {
            acc += x;
            seen = true;
        }
        if (seen) out[i] = acc;
    }
    return out;
}
function fill(len, value) {
    return new Array(len).fill(value);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/oscillators.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "oscillatorSpecs",
    ()=>oscillatorSpecs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)");
;
;
;
;
/** Momentum oscillators — study-pane classics driven by a price source. */ /** Overbought / oversold thresholds, as every bounded oscillator declares them. */ function thresholdInputs(obDefault, osDefault, min = 0, max = 100, obTitle = 'Overbought Level', osTitle = 'Oversold Level') {
    return [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('overbought', obTitle, obDefault, min, max, 1, 'Level above which the oscillator is considered overbought.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('oversold', osTitle, osDefault, min, max, 1, 'Level below which the oscillator is considered oversold.')
    ];
}
const rsiSpec = {
    type: 'rsi',
    title: 'Relative Strength Index',
    shortTitle: 'RSI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 5000, 'Number of bars used in the Wilder smoothing of average gains and losses.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the RSI is calculated on.'),
        ...thresholdInputs(70, 30, 0, 100, 'Overbought', 'Oversold'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'RSI', 'color', 'Color of the RSI line at the midline. Toward either threshold it blends into that threshold’s color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Oversold', 'oversoldColor', 'Color of the line and zone shading at and below the oversold level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Overbought', 'overboughtColor', 'Color of the line and zone shading at and above the overbought level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Levels', 'levelsColor', 'Color of the overbought, midline and oversold levels.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90), 'Band Fill', 'fillColor', 'Color of the fill between the overbought and oversold levels.')
    ],
    compute: (bars, inputs)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boundedOscillator"])({
            key: 'rsi',
            title: 'RSI',
            values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rsi"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close')), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14)),
            scale: {
                top: 100,
                bottom: 0
            },
            overbought: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', 70),
            oversold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', 30),
            ink: {
                low: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'oversoldColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                mid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                high: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'overboughtColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
            },
            levelInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'levelsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
            width: 2,
            midline: 50,
            bandFill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fillColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90))
        })
};
/** %K / %D over a threshold band — the shape the two stochastics share. */ function stochasticOutput(k, d, inputs) {
    const overbought = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', 80);
    const oversold = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', 20);
    return {
        plots: [
            {
                key: 'k',
                title: '%K',
                values: k,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'kColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"])
            },
            {
                key: 'd',
                title: '%D',
                values: d,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'dColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
            },
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anchorPlot"])('obAnchor', 'Overbought Anchor', k.length, overbought),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anchorPlot"])('osAnchor', 'Oversold Anchor', k.length, oversold)
        ],
        bands: [
            {
                key: 'band',
                from: 'obAnchor',
                to: 'osAnchor',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fillColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 90))
            }
        ],
        levels: [
            {
                key: 'overbought',
                price: overbought,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
                lineStyle: 'dashed',
                title: 'Overbought'
            },
            {
                key: 'oversold',
                price: oversold,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
                lineStyle: 'dashed',
                title: 'Oversold'
            }
        ]
    };
}
const stochastic = {
    type: 'stochastic',
    title: 'Stochastic',
    shortTitle: 'Stoch',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'kLength', '%K Length', 5000, 'Number of bars used for the highest high / lowest low range of the raw %K.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(3, 'kSmoothing', '%K Smoothing', 500, 'Simple moving average length applied to the raw %K. 1 gives the fast stochastic, 3 the classic slow stochastic.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(3, 'dLength', '%D Smoothing', 500, 'Simple moving average length of the %D signal line, applied to the smoothed %K.'),
        ...thresholdInputs(80, 20),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], '%K', 'kColor', 'Color of the %K line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], '%D', 'dColor', 'Color of the %D signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 90), 'Band Fill', 'fillColor', 'Fill color of the area between the overbought and oversold levels.')
    ],
    compute: (bars, inputs)=>{
        const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stoch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'kLength', 14)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'kSmoothing', 3));
        return stochasticOutput(k, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(k, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'dLength', 3)), inputs);
    }
};
const stochasticRsi = {
    type: 'stochastic-rsi',
    title: 'Stochastic RSI',
    shortTitle: 'Stoch RSI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'RSI Source', 'Price series the RSI is computed on.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'rsiLength', 'RSI Length', 5000, 'Lookback length of the Wilder RSI.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'stochLength', 'Stochastic Length', 5000, 'Lookback over which the highest and lowest RSI values are taken.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(3, 'kSmoothing', '%K Smoothing', 500, 'Simple moving average length applied to the stochastic of RSI to form %K.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(3, 'dLength', '%D Smoothing', 500, 'Simple moving average length applied to %K to form the %D signal line.'),
        ...thresholdInputs(80, 20),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], '%K Color', 'kColor', 'Color of the %K line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], '%D Color', 'dColor', 'Color of the %D signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 90), 'Zone Fill', 'fillColor', 'Fill color of the area between the overbought and oversold levels.')
    ],
    compute: (bars, inputs)=>{
        const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rsi"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close')), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'rsiLength', 14));
        const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stoch"])(r, r, r, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'stochLength', 14)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'kSmoothing', 3));
        return stochasticOutput(k, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(k, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'dLength', 3)), inputs);
    }
};
const macd = {
    type: 'macd',
    title: 'MACD',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(12, 'fastLength', 'Fast Length', 5000, 'Length of the fast EMA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(26, 'slowLength', 'Slow Length', 5000, 'Length of the slow EMA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'signalLength', 'Signal Smoothing', 500, 'Length of the EMA applied to the MACD line to obtain the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series used to compute the fast and slow EMAs.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 'MACD Line', 'color', 'Color of the MACD line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal Line', 'signalColor', 'Color of the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Grow Above', 'growAboveColor', 'Histogram color when above zero and rising.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 50), 'Fall Above', 'fallAboveColor', 'Histogram color when above zero and falling.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 50), 'Grow Below', 'growBelowColor', 'Histogram color when below zero and rising.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Fall Below', 'fallBelowColor', 'Histogram color when below zero and falling.')
    ],
    compute: (bars, inputs)=>{
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'fastLength', 12)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'slowLength', 26)));
        const signal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(line, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 9));
        const hist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])(line, signal);
        const colors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["momentumColumnColors"])(hist, {
            growAbove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'growAboveColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
            fallAbove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fallAboveColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 50)),
            growBelow: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'growBelowColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 50)),
            fallBelow: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fallBelowColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
        });
        return {
            plots: [
                {
                    key: 'hist',
                    title: 'Histogram',
                    values: hist,
                    kind: 'columns',
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"],
                    colors,
                    base: 0
                },
                {
                    key: 'macd',
                    title: 'MACD',
                    values: line,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"])
                },
                {
                    key: 'signal',
                    title: 'Signal',
                    values: signal,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
                }
            ],
            levels: [
                {
                    key: 'zero',
                    price: 0,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
                    lineStyle: 'dashed',
                    title: 'Zero Line'
                }
            ]
        };
    }
};
const ppo = {
    type: 'ppo',
    title: 'Percentage Price Oscillator',
    shortTitle: 'PPO',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series fed into the fast and slow averages.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(12, 'fastLength', 'Fast Length', 5000, 'Length of the fast moving average.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(26, 'slowLength', 'Slow Length', 5000, 'Length of the slow moving average. The spread is divided by it and scaled to a percentage of price.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('maType', 'Average Type', 'EMA', [
            'EMA',
            'SMA'
        ], 'Moving average type used for the fast and slow averages.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'signalLength', 'Signal Smoothing', 500, 'Length of the signal line that smooths the PPO line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('signalType', 'Signal Type', 'EMA', [
            'EMA',
            'SMA'
        ], 'Moving average type used for the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the PPO line, gradient fill and histogram above the zero line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the PPO line, gradient fill and histogram below the zero line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal Line', 'signalColor', 'Color of the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showHistogram', 'Show Histogram', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Displays the histogram (PPO minus signal line) as columns. Bright columns mark a spread still widening, faded ones a spread narrowing back.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Fills the area between the zero line and the PPO line with a vertical gradient.')
    ],
    compute: (bars, inputs)=>{
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const average = (kind, v, len)=>kind === 'SMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(v, len) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(v, len);
        const kind = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'maType', 'EMA');
        const fast = average(kind, src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'fastLength', 12));
        const slow = average(kind, src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'slowLength', 26));
        const line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(fast, slow, (f, s)=>s === 0 ? Number.NaN : (f - s) / s * 100);
        const signal = average((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalType', 'EMA'), line, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 9));
        const hist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])(line, signal);
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const out = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'ppo',
            title: 'PPO Line',
            values: line,
            ink: {
                bull,
                bear,
                neutral: bear
            },
            zeroInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90),
            fill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true),
            extraPlots: [
                {
                    key: 'signal',
                    title: 'Signal Line',
                    values: signal,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
                }
            ]
        });
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showHistogram', true)) {
            // Bright while the spread between the averages widens, faded once it narrows again.
            const colors = hist.map((x, i)=>{
                if (!Number.isFinite(x)) return null;
                const prev = i > 0 && Number.isFinite(hist[i - 1]) ? hist[i - 1] : x;
                const ink = x >= 0 ? bull : bear;
                const expanding = x >= 0 ? x > prev : x < prev;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(ink, expanding ? 40 : 70);
            });
            out.plots.unshift({
                key: 'hist',
                title: 'Histogram',
                values: hist,
                kind: 'columns',
                color: bull,
                colors,
                base: 0
            });
        }
        return out;
    }
};
const awesome = {
    type: 'awesome-oscillator',
    title: 'Awesome Oscillator',
    shortTitle: 'AO',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Rising', 'risingColor', 'Histogram color when the oscillator is higher than on the previous bar.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Falling', 'fallingColor', 'Histogram color when the oscillator is lower than or equal to the previous bar.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Zero Line', 'zeroColor', 'Color of the zero reference line.')
    ],
    compute: (bars, inputs)=>{
        const hl2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, 'HL2');
        const ao = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(hl2, 5), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(hl2, 34));
        const rising = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'risingColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const falling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fallingColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const colors = ao.map((x, i)=>{
            if (!Number.isFinite(x)) return null;
            const prev = i > 0 ? ao[i - 1] : Number.NaN;
            return Number.isFinite(prev) && x > prev ? rising : falling;
        });
        return {
            plots: [
                {
                    key: 'ao',
                    title: 'AO',
                    values: ao,
                    kind: 'columns',
                    color: rising,
                    colors,
                    base: 0
                }
            ],
            levels: [
                {
                    key: 'zero',
                    price: 0,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'zeroColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                    lineStyle: 'dashed',
                    title: 'Zero Line'
                }
            ]
        };
    }
};
/** Lambert's scaling constant. */ const CCI_SCALING = 0.015;
const cci = {
    type: 'commodity-channel-index',
    title: 'Commodity Channel Index',
    shortTitle: 'CCI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, 'Number of bars used for the moving average and the mean absolute deviation of the source.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('HLC3', 'source', 'Source', 'Price series measured by the CCI; the typical price hlc3 is the classic choice.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('upper', 'Upper Level', 100, -1000, 1000, 10, 'Overbought reference level, +100 classically.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('lower', 'Lower Level', -100, -1000, 1000, 10, 'Oversold reference level, −100 classically.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'CCI Line', 'color', 'Color of the CCI line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Line and fill color while the CCI reads above zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Line and fill color while the CCI reads below zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Levels', 'levelsColor', 'Color of the upper, lower and zero reference lines.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'HLC3'));
        const basis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(src, len);
        const dev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["meanDev"])(src, len);
        const values = src.map((x, i)=>{
            const b = basis[i];
            const d = dev[i];
            if (!Number.isFinite(b) || !Number.isFinite(d)) return Number.NaN;
            return d === 0 ? 0 : (x - b) / (CCI_SCALING * d);
        });
        const levelInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'levelsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'cci',
            title: 'CCI',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: levelInk,
            zeroLineStyle: 'dotted',
            extraLevels: [
                {
                    key: 'upper',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'upper', 100),
                    color: levelInk,
                    lineStyle: 'dashed',
                    title: 'Upper Level'
                },
                {
                    key: 'lower',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lower', -100),
                    color: levelInk,
                    lineStyle: 'dashed',
                    title: 'Lower Level'
                }
            ]
        });
    }
};
const williamsR = {
    type: 'williams-percent-r',
    title: 'Williams %R',
    shortTitle: '%R',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 5000, 'Lookback length of the highest high / lowest low range. 14 is the classic setting.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Series located within the lookback range. Close is the classic choice.'),
        ...thresholdInputs(-20, -80, -100, 0),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], '%R Line', 'color', 'Color of the %R line between the thresholds. Toward either level it blends into that level’s color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Overbought', 'overboughtColor', 'Color of the line and zone shading at and above the overbought level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Oversold', 'oversoldColor', 'Color of the line and zone shading at and below the oversold level.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const hh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), len);
        const ll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), len);
        // A flat lookback range leaves %R undefined — a gap, never a fabricated midpoint.
        const values = src.map((x, i)=>{
            const h = hh[i];
            const l = ll[i];
            return Number.isFinite(h) && Number.isFinite(l) && h > l ? -100 * (h - x) / (h - l) : Number.NaN;
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boundedOscillator"])({
            key: 'wr',
            title: '%R',
            values,
            scale: {
                top: 0,
                bottom: -100
            },
            overbought: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', -20),
            oversold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', -80),
            ink: {
                low: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'oversoldColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                mid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                high: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'overboughtColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
            },
            levelInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]
        });
    }
};
const cmoSpec = {
    type: 'chande-momentum-oscillator',
    title: 'Chande Momentum Oscillator',
    shortTitle: 'CMO',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'length', 'Length', 5000, 'Number of bars over which up moves and down moves are summed.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series used to measure bar-to-bar changes.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('overbought', 'Overbought Level', 50, 0, 100, 1, 'Level above which the oscillator is considered overbought.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('oversold', 'Oversold Level', -50, -100, 0, 1, 'Level below which the oscillator is considered oversold.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'CMO Line', 'color', 'Color of the CMO line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Line and fill color while momentum is positive, and shading of the oversold zone.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Line and fill color while momentum is negative, and shading of the overbought zone.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Levels', 'levelsColor', 'Color of the overbought, oversold, and zero lines.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 9);
        const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close')));
        const up = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(d, (x)=>Math.max(x, 0)), len);
        const down = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(d, (x)=>Math.max(-x, 0)), len);
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(up, down, (u, w)=>u + w === 0 ? 0 : 100 * (u - w) / (u + w));
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const levelInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'levelsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const overbought = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', 50);
        const oversold = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', -50);
        const out = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'cmo',
            title: 'CMO',
            values,
            ink: {
                bull,
                bear,
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: levelInk,
            zeroLineStyle: 'dotted',
            extraLevels: [
                {
                    key: 'overbought',
                    price: overbought,
                    color: levelInk,
                    lineStyle: 'dashed',
                    title: 'Overbought'
                },
                {
                    key: 'oversold',
                    price: oversold,
                    color: levelInk,
                    lineStyle: 'dashed',
                    title: 'Oversold'
                }
            ]
        });
        const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["thresholdZones"])(values.length, {
            overbought,
            oversold,
            top: 100,
            bottom: -100
        }, {
            overbought: bear,
            oversold: bull
        });
        out.plots.push(...zones.plots);
        out.bands = [
            ...out.bands ?? [],
            ...zones.bands
        ];
        return out;
    }
};
const connorsRsi = {
    type: 'connors-rsi',
    title: 'Connors RSI',
    shortTitle: 'CRSI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(3, 'rsiLength', 'RSI Length', 5000, 'Length of the Wilder RSI applied to the closing price.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(2, 'streakLength', 'Streak RSI Length', 5000, 'Length of the Wilder RSI applied to the up/down close streak.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(100, 'rankLength', 'Percent Rank Length', 5000, 'Lookback of the percent rank applied to the 1-bar rate of change of the closing price.'),
        ...thresholdInputs(90, 10),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'CRSI Line', 'color', 'Color of the Connors RSI line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Oversold', 'oversoldColor', 'Line, fill and zone color toward and below the oversold level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Overbought', 'overboughtColor', 'Line, fill and zone color toward and above the overbought level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Levels', 'levelsColor', 'Color of the overbought and oversold levels.')
    ],
    compute: (bars, inputs)=>{
        const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars);
        // Signed run length of consecutive closes in one direction.
        const streak = new Array(c.length).fill(0);
        for(let i = 1; i < c.length; i++){
            const d = c[i] - c[i - 1];
            streak[i] = d > 0 ? Math.max(streak[i - 1], 0) + 1 : d < 0 ? Math.min(streak[i - 1], 0) - 1 : 0;
        }
        const a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rsi"])(c, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'rsiLength', 3));
        const b = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rsi"])(streak, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'streakLength', 2));
        const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["percentRank"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roc"])(c, 1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'rankLength', 100));
        const values = c.map((_, i)=>{
            const x = a[i];
            const y = b[i];
            const z = r[i];
            return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z) ? (x + y + z) / 3 : Number.NaN;
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boundedOscillator"])({
            key: 'crsi',
            title: 'Connors RSI',
            values,
            scale: {
                top: 100,
                bottom: 0
            },
            overbought: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', 90),
            oversold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', 10),
            ink: {
                low: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'oversoldColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                mid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                high: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'overboughtColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
            },
            levelInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'levelsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
            midpointWash: true
        });
    }
};
const fisher = {
    type: 'fisher-transform',
    title: 'Fisher Transform',
    shortTitle: 'Fisher',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'length', 'Length', 5000, "Lookback period used to locate the median price hl2 within its highest-lowest range. Ehlers' original length is 10; 9 is the common platform default."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Fisher Line', 'color', 'Color of the Fisher line when it sits exactly on its trigger.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Trigger Line', 'triggerColor', 'Color of the trigger line, the Fisher value delayed one bar.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the Fisher line and fill while it is above the trigger.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the Fisher line and fill while it is below the trigger.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 9);
        const hl2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, 'HL2');
        const hi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])(hl2, len);
        const lo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])(hl2, len);
        const n = bars.length;
        const out = new Array(n).fill(Number.NaN);
        let position = 0;
        let value = 0;
        for(let i = 0; i < n; i++){
            const h = hi[i];
            const l = lo[i];
            if (!Number.isFinite(h) || !Number.isFinite(l)) continue;
            // A flat range contributes a 0 position term so the recursion stays defined.
            const raw = h > l ? (hl2[i] - l) / (h - l) - 0.5 : 0;
            position = 0.66 * raw + 0.67 * position;
            position = position > 0.99 ? 0.999 : position < -0.99 ? -0.999 : position;
            value = 0.5 * Math.log((1 + position) / (1 - position)) + 0.5 * value;
            out[i] = value;
        }
        const trigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(out, 1);
        const neutral = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const inkOf = (i)=>{
            const f = out[i];
            const t = trigger[i];
            if (!Number.isFinite(t)) return neutral;
            return f > t ? bull : f < t ? bear : neutral;
        };
        return {
            plots: [
                {
                    key: 'fisher',
                    title: 'Fisher',
                    values: out,
                    color: neutral,
                    width: 2,
                    colors: out.map((x, i)=>Number.isFinite(x) ? inkOf(i) : null)
                },
                {
                    key: 'trigger',
                    title: 'Trigger',
                    values: trigger,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'triggerColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
                }
            ],
            bands: [
                {
                    key: 'spread',
                    from: 'fisher',
                    to: 'trigger',
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(neutral, 80),
                    colors: out.map((x, i)=>Number.isFinite(x) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(inkOf(i), 80) : null)
                }
            ],
            levels: [
                {
                    key: 'upper',
                    price: 1.5,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
                    lineStyle: 'dashed',
                    title: 'Upper Level'
                },
                {
                    key: 'lower',
                    price: -1.5,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
                    lineStyle: 'dashed',
                    title: 'Lower Level'
                },
                {
                    key: 'zero',
                    price: 0,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
                    lineStyle: 'dotted',
                    title: 'Zero Line'
                }
            ]
        };
    }
};
const trix = {
    type: 'trix',
    title: 'TRIX',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(18, 'length', 'Length', 5000, 'Length of each of the three EMA smoothing passes applied to the close price.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'signalLength', 'Signal Length', 500, 'Length of the EMA applied to TRIX to form the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'TRIX Color', 'color', 'Color of the TRIX line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal Color', 'signalColor', 'Color of the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the TRIX line and its gradient fill while TRIX holds above zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the TRIX line and its gradient fill while TRIX holds below zero.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 18);
        const smooth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), len), len), len);
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roc"])(smooth, 1);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'trix',
            title: 'TRIX',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            extraPlots: [
                {
                    key: 'signal',
                    title: 'Signal',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 9)),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
                }
            ]
        });
    }
};
/** Double-smoothed momentum ratio — Blau's TSI core, in −1..1. */ function tsiRatio(src, long, short) {
    const mom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])(src);
    const numer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(mom, long), short);
    const denom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(mom, Math.abs), long), short);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(numer, denom, (a, b)=>b === 0 ? 0 : a / b);
}
const tsi = {
    type: 'true-strength-index',
    title: 'True Strength Index',
    shortTitle: 'TSI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(25, 'longLength', 'Long Length', 5000, 'Length of the first (long) EMA applied to the 1-bar price change.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(13, 'shortLength', 'Short Length', 5000, 'Length of the second (short) EMA applied to the long-smoothed price change.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(13, 'signalLength', 'Signal Length', 500, 'Length of the EMA of TSI used as the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'TSI', 'color', 'Color of the TSI line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal', 'signalColor', 'Color of the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the TSI line and its gradient fill while TSI holds above zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the TSI line and its gradient fill while TSI holds below zero.')
    ],
    compute: (bars, inputs)=>{
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(tsiRatio((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'longLength', 25), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'shortLength', 13)), (x)=>100 * x);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'tsi',
            title: 'TSI',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            extraPlots: [
                {
                    key: 'signal',
                    title: 'Signal',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 13)),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
                }
            ]
        });
    }
};
const SMI_INDICATOR = 'Indicator';
const SMI_OSCILLATOR = 'Oscillator';
const smiErgodic = {
    type: 'smi-ergodic',
    title: 'SMI Ergodic Oscillator',
    shortTitle: 'SMIE',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'longLength', 'Long Length', 5000, 'Length of the first EMA smoothing applied to the momentum of the closing price.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(5, 'shortLength', 'Short Length', 5000, 'Length of the second EMA smoothing applied to the momentum of the closing price.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(5, 'signalLength', 'Signal Length', 500, 'Length of the EMA of the SMI that forms the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('display', 'Display', SMI_INDICATOR, [
            SMI_INDICATOR,
            SMI_OSCILLATOR
        ], 'Indicator plots the SMI and its signal line. Oscillator plots the difference between them as a histogram.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'SMI', 'color', 'Color of the SMI line while it sits exactly on its signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal', 'signalColor', 'Color of the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Oscillator Grow', 'growColor', 'Color of the rising oscillator histogram, and of the SMI line while it leads its signal.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Oscillator Fall', 'fallColor', 'Color of the falling oscillator histogram, and of the SMI line while it lags its signal.')
    ],
    compute: (bars, inputs)=>{
        const smi = tsiRatio((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'longLength', 20), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'shortLength', 5));
        const signal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(smi, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 5));
        const grow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'growColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const fall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fallColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const zero = [
            {
                key: 'zero',
                price: 0,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 50),
                lineStyle: 'dashed',
                title: 'Zero'
            }
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'display', SMI_INDICATOR) === SMI_OSCILLATOR) {
            const osc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])(smi, signal);
            const colors = osc.map((x, i)=>{
                if (!Number.isFinite(x)) return null;
                const prev = i > 0 && Number.isFinite(osc[i - 1]) ? osc[i - 1] : x;
                return x > prev ? grow : fall;
            });
            return {
                plots: [
                    {
                        key: 'osc',
                        title: 'Oscillator',
                        values: osc,
                        kind: 'columns',
                        color: grow,
                        colors,
                        base: 0
                    }
                ],
                levels: zero
            };
        }
        const neutral = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const inkOf = (i)=>{
            const a = smi[i];
            const b = signal[i];
            if (!Number.isFinite(b)) return neutral;
            return a > b ? grow : a < b ? fall : neutral;
        };
        return {
            plots: [
                {
                    key: 'smi',
                    title: 'SMI',
                    values: smi,
                    color: neutral,
                    colors: smi.map((x, i)=>Number.isFinite(x) ? inkOf(i) : null)
                },
                {
                    key: 'signal',
                    title: 'Signal',
                    values: signal,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
                }
            ],
            bands: [
                {
                    key: 'spread',
                    from: 'smi',
                    to: 'signal',
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(neutral, 75),
                    colors: smi.map((x, i)=>Number.isFinite(x) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(inkOf(i), 75) : null)
                }
            ],
            levels: zero
        };
    }
};
const STC_MID = 50;
const TRIGGERS = 'Trigger Levels';
const stc = {
    type: 'schaff-trend-cycle',
    title: 'Schaff Trend Cycle',
    shortTitle: 'Schaff Trend Cycle',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series used to build the MACD that the trend cycle is measured on.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(23, 'fastLength', 'Fast Length', 5000, 'Fast EMA length of the underlying MACD.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(50, 'slowLength', 'Slow Length', 5000, 'Slow EMA length of the underlying MACD.'),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'cycleLength', 'Cycle Length', 5000, 'Window of the two stochastic passes. Each pass measures where its input sits inside the range of its own values over this many bars.'),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('factor', 'Smoothing Factor', 0.5, 0.01, 1, 0.05, '%D style recursive smoothing applied after each stochastic pass. 0.5 is the published default.'),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('upper', 'Upper Trigger', 75, 0, 100, 1, 'Upper trigger line. A cross down through it flags an emerging downtrend.'),
            group: TRIGGERS
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('lower', 'Lower Trigger', 25, 0, 100, 1, 'Lower trigger line. A cross up through it flags an emerging uptrend.'),
            group: TRIGGERS
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish Color', 'bullColor', 'Color of the trend cycle line and gradient while the cycle holds the upper half of its 0-100 scale.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish Color', 'bearColor', 'Color of the trend cycle line and gradient while the cycle holds the lower half of its 0-100 scale.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Levels Color', 'levelsColor', 'Color of the dashed trigger lines and the dotted midline.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Vertical gradient between the midline and the trend cycle, fading out toward the midline.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'cycleLength', 10);
        const factor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'factor', 0.5);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const macdLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'fastLength', 23)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'slowLength', 50)));
        // Position inside the window's own range; a flat window holds the previous reading.
        const stochNorm = (v)=>{
            const lo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])(v, len);
            const hi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])(v, len);
            const out = new Array(v.length).fill(Number.NaN);
            let pct = Number.NaN;
            for(let i = 0; i < v.length; i++){
                const x = v[i];
                const l = lo[i];
                const h = hi[i];
                if (!Number.isFinite(x) || !Number.isFinite(l) || !Number.isFinite(h)) continue;
                if (h > l) pct = 100 * (x - l) / (h - l);
                out[i] = pct;
            }
            return out;
        };
        const smoothStep = (v)=>{
            const out = new Array(v.length).fill(Number.NaN);
            let smoothed = Number.NaN;
            for(let i = 0; i < v.length; i++){
                const x = v[i];
                if (!Number.isFinite(x)) continue;
                smoothed = Number.isFinite(smoothed) ? smoothed + factor * (x - smoothed) : x;
                out[i] = smoothed;
            }
            return out;
        };
        const values = smoothStep(stochNorm(smoothStep(stochNorm(macdLine))));
        const levelInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'levelsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const plots = [
            {
                key: 'stc',
                title: 'Schaff Trend Cycle',
                values,
                color: bear,
                width: 2,
                colors: values.map((x)=>Number.isFinite(x) ? x > STC_MID ? bull : bear : null)
            }
        ];
        const bands = [];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true)) {
            plots.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anchorPlot"])('midAnchor', 'Midline Anchor', values.length, STC_MID));
            bands.push({
                key: 'wash',
                from: 'stc',
                to: 'midAnchor',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
                gradient: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["baselineGradient"])(values, STC_MID, (x)=>x > STC_MID ? bull : bear)
            });
        }
        return {
            plots,
            bands,
            levels: [
                {
                    key: 'upper',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'upper', 75),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(levelInk, 25),
                    lineStyle: 'dashed',
                    title: 'Upper Trigger'
                },
                {
                    key: 'lower',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lower', 25),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(levelInk, 25),
                    lineStyle: 'dashed',
                    title: 'Lower Trigger'
                },
                {
                    key: 'midline',
                    price: STC_MID,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(levelInk, 60),
                    lineStyle: 'dotted',
                    title: 'Midline'
                }
            ]
        };
    }
};
const kst = {
    type: 'know-sure-thing',
    title: 'Know Sure Thing',
    shortTitle: 'KST',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'rocLength1', 'ROC Length #1', 5000, 'Lookback of the first (shortest) rate of change.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(15, 'rocLength2', 'ROC Length #2', 5000, 'Lookback of the second rate of change.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'rocLength3', 'ROC Length #3', 5000, 'Lookback of the third rate of change.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(30, 'rocLength4', 'ROC Length #4', 5000, 'Lookback of the fourth (longest) rate of change.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'smaLength1', 'SMA Length #1', 5000, 'Smoothing length applied to the first rate of change (RCMA #1).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'smaLength2', 'SMA Length #2', 5000, 'Smoothing length applied to the second rate of change (RCMA #2).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'smaLength3', 'SMA Length #3', 5000, 'Smoothing length applied to the third rate of change (RCMA #3).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(15, 'smaLength4', 'SMA Length #4', 5000, 'Smoothing length applied to the fourth rate of change (RCMA #4).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'signalLength', 'Signal Length', 500, 'Simple moving average length of the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the KST line while above zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the KST line while below zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal', 'signalColor', 'Color of the signal line.')
    ],
    compute: (bars, inputs)=>{
        const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars);
        const rcma = (rocKey, rocDefault, smaKey, smaDefault)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roc"])(c, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, rocKey, rocDefault)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, smaKey, smaDefault));
        const values = [
            rcma('rocLength1', 10, 'smaLength1', 10),
            rcma('rocLength2', 15, 'smaLength2', 10),
            rcma('rocLength3', 20, 'smaLength3', 10),
            rcma('rocLength4', 30, 'smaLength4', 15)
        ].reduce((acc, r, i)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(acc, r, (a, b)=>a + b * (i + 1)), new Array(c.length).fill(0));
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'kst',
            title: 'KST',
            values,
            ink: {
                bull,
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: bull
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            valueTransparency: 60,
            extraPlots: [
                {
                    key: 'signal',
                    title: 'Signal',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 9)),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
                }
            ]
        });
    }
};
const coppock = {
    type: 'coppock-curve',
    title: 'Coppock Curve',
    shortTitle: 'Coppock',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'wmaLength', 'WMA Length', 5000, 'Length of the weighted moving average applied to the sum of the two rates of change.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'longRoc', 'Long RoC Length', 5000, 'Lookback of the long rate of change, in bars. The original definition uses 14 monthly closes.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(11, 'shortRoc', 'Short RoC Length', 5000, 'Lookback of the short rate of change, in bars. The original definition uses 11 monthly closes.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series used for the rate of change calculations.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Coppock Curve', 'color', 'Color of the Coppock Curve line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Line and fill color while the curve reads above zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Line and fill color while the curve reads below zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Zero Line', 'zeroColor', 'Color of the zero reference line.')
    ],
    compute: (bars, inputs)=>{
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wma"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roc"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'longRoc', 14)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roc"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'shortRoc', 11)), (a, b)=>a + b), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'wmaLength', 10));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'coppock',
            title: 'Coppock Curve',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'zeroColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
        });
    }
};
const dpo = {
    type: 'detrended-price-oscillator',
    title: 'Detrended Price Oscillator',
    shortTitle: 'DPO',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(21, 'length', 'Length', 5000, 'Lookback of the simple moving average that price is detrended against. The comparison is displaced by Length / 2 + 1 bars.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series used in the detrending calculation.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('centered', 'Centered', false, undefined, 'Shifts the oscillator back by Length / 2 + 1 bars so it is centered on the prices it detrends. The most recent bars then show no value.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'DPO', 'color', 'Color of the line when it sits exactly at zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Above Zero', 'bullColor', 'Color of the line and fill while the oscillator is above zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Below Zero', 'bearColor', 'Color of the line and fill while the oscillator is below zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Zero Line', 'zeroColor', 'Color of the zero reference line.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 21);
        const barsBack = Math.trunc(len / 2) + 1;
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const basis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(src, len);
        const centered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'centered', false);
        // Centered mode compares the displaced price with today's average, then plots the
        // result back over the bars it detrends — leaving the newest bars empty.
        const values = centered ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(src, barsBack), basis), -barsBack) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])(src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(basis, barsBack));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'dpo',
            title: 'DPO',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'zeroColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
        });
    }
};
const ROC_PERCENT = 'ROC %';
const ROC_MOMENTUM = 'Momentum';
const rocSpec = {
    type: 'rate-of-change',
    title: 'Rate of Change',
    shortTitle: 'ROC',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'length', 'Length', 5000, 'Lookback period; the source is compared with its value this many bars ago.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Series used as input for the calculation.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('mode', 'Mode', ROC_PERCENT, [
            ROC_PERCENT,
            ROC_MOMENTUM
        ], 'ROC % plots the change as a percentage of the source value from the lookback; Momentum plots the raw difference.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Line', 'color', 'Color of the line when the reading sits exactly at zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the line and fill while the reading is above zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the line and fill while the reading is below zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Fills the area between the line and zero, following the line color.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 9);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'mode', ROC_PERCENT) === ROC_MOMENTUM ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])(src, len) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roc"])(src, len);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'roc',
            title: 'ROC',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            fill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true)
        });
    }
};
const ultimate = {
    type: 'ultimate-oscillator',
    title: 'Ultimate Oscillator',
    shortTitle: 'UO',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(7, 'fastLength', 'Fast Length', 5000, 'Bars in the fastest averaging window. Weighted 4 in the final blend, so it dominates the oscillator.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'middleLength', 'Middle Length', 5000, 'Bars in the intermediate averaging window. Weighted 2 in the final blend.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(28, 'slowLength', 'Slow Length', 5000, 'Bars in the slowest averaging window. Weighted 1 in the final blend.'),
        ...thresholdInputs(70, 30, 0, 100, 'Overbought', 'Oversold'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Oscillator', 'color', 'Color of the line midway between the levels. Toward either level it blends into that level’s color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Levels', 'levelsColor', 'Color of the overbought and oversold levels.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Oversold', 'oversoldColor', 'Color of the line at the oversold level and of the oversold zone shading.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Overbought', 'overboughtColor', 'Color of the line at the overbought level and of the overbought zone shading.')
    ],
    compute: (bars, inputs)=>{
        const n = bars.length;
        const bp = new Array(n).fill(Number.NaN);
        const tr = new Array(n).fill(Number.NaN);
        for(let i = 0; i < n; i++){
            const b = bars[i];
            const pc = i > 0 ? bars[i - 1].close : b.close;
            const trueLow = Math.min(b.low, pc);
            bp[i] = b.close - trueLow;
            tr[i] = Math.max(b.high, pc) - trueLow;
        }
        const avg = (len)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(bp, len), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(tr, len), (a, b)=>b === 0 ? Number.NaN : a / b);
        const a7 = avg((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'fastLength', 7));
        const a14 = avg((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'middleLength', 14));
        const a28 = avg((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'slowLength', 28));
        const values = a7.map((x, i)=>{
            const y = a14[i];
            const z = a28[i];
            return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z) ? 100 * (4 * x + 2 * y + z) / 7 : Number.NaN;
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boundedOscillator"])({
            key: 'uo',
            title: 'UO',
            values,
            scale: {
                top: 100,
                bottom: 0
            },
            overbought: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', 70),
            oversold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', 30),
            ink: {
                low: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'oversoldColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                mid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                high: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'overboughtColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
            },
            levelInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'levelsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
            zoneTransparency: 91
        });
    }
};
const rvgi = {
    type: 'relative-vigor-index',
    title: 'Relative Vigor Index',
    shortTitle: 'RVGI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'length', 'Length', 5000, 'Number of bars summed for the smoothed numerator (close − open) and denominator (high − low).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'RVGI', 'color', 'Color of the RVGI line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Signal', 'signalColor', 'Color of the signal line.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 10);
        const co = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["swma"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["opens"])(bars)));
        const hl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["swma"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars)));
        const line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(co, len), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(hl, len), (a, b)=>b === 0 ? 0 : a / b);
        return {
            plots: [
                {
                    key: 'rvgi',
                    title: 'RVGI',
                    values: line,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"])
                },
                {
                    key: 'signal',
                    title: 'Signal',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["swma"])(line),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
                }
            ],
            levels: [
                {
                    key: 'zero',
                    price: 0,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 50),
                    lineStyle: 'dashed',
                    title: 'Zero'
                }
            ]
        };
    }
};
const RVI_EMA = 'EMA';
const RVI_RMA = 'Wilder (RMA)';
const relVolatility = {
    type: 'relative-volatility-index',
    title: 'Relative Volatility Index',
    shortTitle: 'RVI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'stdevLength', 'Stdev Length', 5000, "Number of bars used for the standard deviation of closing prices that serves as each bar's volatility reading."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'smoothLength', 'Smoothing Length', 5000, 'Number of bars used to smooth the up and down volatility streams.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('smoothType', 'Smoothing Type', RVI_EMA, [
            RVI_EMA,
            RVI_RMA
        ], "Moving average applied to the volatility streams. EMA is Dorsey's classic calculation; Wilder (RMA) matches platforms that use Wilder smoothing."),
        ...thresholdInputs(80, 20),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'RVI Line', 'color', 'Color of the RVI line at the midline. Toward either threshold it blends into that threshold’s color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Up Volatility', 'overboughtColor', 'Color of the line and zone shading at and above the overbought level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Down Volatility', 'oversoldColor', 'Color of the line and zone shading at and below the oversold level.')
    ],
    compute: (bars, inputs)=>{
        const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars);
        const sigma = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stdev"])(c, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'stdevLength', 10));
        const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])(c);
        const up = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(sigma, d, (s, x)=>x > 0 ? s : 0);
        const down = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(sigma, d, (s, x)=>x < 0 ? s : 0);
        const smoothLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'smoothLength', 14);
        const smooth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'smoothType', RVI_EMA) === RVI_RMA ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"] : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"];
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(smooth(up, smoothLen), smooth(down, smoothLen), (u, w)=>u + w === 0 ? 0 : 100 * u / (u + w));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boundedOscillator"])({
            key: 'rvi',
            title: 'RVI',
            values,
            scale: {
                top: 100,
                bottom: 0
            },
            overbought: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', 80),
            oversold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', 20),
            ink: {
                low: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'oversoldColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                mid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                high: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'overboughtColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"])
            },
            levelInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            width: 2
        });
    }
};
const bop = {
    type: 'balance-of-power',
    title: 'Balance of Power',
    shortTitle: 'BOP',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('smoothing', 'Smoothing', false, undefined, 'Smooth the raw Balance of Power with a simple moving average instead of plotting the single-bar value.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'smoothLength', 'Length', 5000, 'Simple moving average length applied when smoothing is enabled.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'BOP Color', 'color', 'Color of the line at exactly zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Line and fill color while the Balance of Power is above zero — buyers in control of the bar.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Line and fill color while the Balance of Power is below zero — sellers in control of the bar.')
    ],
    compute: (bars, inputs)=>{
        const raw = bars.map((b)=>b.high === b.low ? 0 : (b.close - b.open) / (b.high - b.low));
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'smoothing', false) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(raw, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'smoothLength', 14)) : raw;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'bop',
            title: 'BOP',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            valueTransparency: 60
        });
    }
};
const elderRay = {
    type: 'elder-ray',
    title: 'Elder Ray',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(13, 'length', 'EMA Length', 5000, "Number of bars in the exponential moving average of closing prices used as the reference level for Bull Power and Bear Power. Alexander Elder's classic setting is 13."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bull Power', 'bullColor', 'Color of the Bull Power columns.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bear Power', 'bearColor', 'Color of the Bear Power columns.')
    ],
    compute: (bars, inputs)=>{
        const basis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 13));
        return {
            plots: [
                {
                    key: 'bull',
                    title: 'Bull Power',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), basis),
                    kind: 'columns',
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                    base: 0
                },
                {
                    key: 'bear',
                    title: 'Bear Power',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), basis),
                    kind: 'columns',
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                    base: 0
                }
            ],
            levels: [
                {
                    key: 'zero',
                    price: 0,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 30),
                    lineStyle: 'dashed',
                    title: 'Zero Line'
                }
            ]
        };
    }
};
const ttmSqueeze = {
    type: 'ttm-squeeze',
    title: 'TTM Squeeze',
    overlay: false,
    inputs: [
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, "Shared lookback for the Bollinger Bands, the Keltner Channels, and the momentum regression. John Carter's original setting is 20."),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series used for the shared moving average basis, the standard deviation, and the momentum displacement.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('bbMult', 'Bollinger Bands Multiplier', 2, 0.1, 50, 0.1, 'Standard deviation multiplier for the Bollinger Bands.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('kcMult', 'Keltner Channels Multiplier', 1.5, 0.1, 50, 0.1, 'ATR multiplier for the Keltner Channels. A smaller multiplier demands a tighter compression before the squeeze turns on.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Momentum Up', 'bullColor', 'Histogram color while momentum is positive. Bars building away from zero print solid, bars fading back print dimmed.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Momentum Down', 'bearColor', 'Histogram color while momentum is negative. Bars building away from zero print solid, bars fading back print dimmed.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Squeeze On', 'squeezeOnColor', 'Zero-line dot color while both Bollinger Bands sit fully inside the Keltner Channels.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Squeeze Off', 'squeezeOffColor', 'Zero-line dot color while the Bollinger Bands trade outside the Keltner Channels.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('markFires', 'Mark Squeeze Fires', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Draws a cross on the zero line on the first bar where the bands re-emerge outside the channels, colored by the side of the momentum histogram.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const basis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(src, len);
        const dev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stdev"])(src, len), (x)=>x * (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'bbMult', 2));
        const kcRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atr"])(bars, len), (x)=>x * (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'kcMult', 1.5));
        // Momentum: regression of price against an anchor midway between the range
        // midpoint and the shared basis.
        const rangeMid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), len), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), len), (h, l)=>(h + l) / 2);
        const anchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(rangeMid, basis, (d, b)=>(d + b) / 2);
        const mom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linreg"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])(src, anchor), len, 0);
        const squeezeOn = basis.map((b, i)=>{
            const d = dev[i];
            const r = kcRange[i];
            if (!Number.isFinite(b) || !Number.isFinite(d) || !Number.isFinite(r)) return null;
            return d < r;
        });
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const onInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'squeezeOnColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"]);
        const offInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'squeezeOffColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const momColors = mom.map((x, i)=>{
            if (!Number.isFinite(x)) return null;
            const prev = i > 0 && Number.isFinite(mom[i - 1]) ? mom[i - 1] : x;
            const rising = x > prev;
            return x >= 0 ? rising ? bull : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(bull, 60) : rising ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(bear, 60) : bear;
        });
        const plots = [
            {
                key: 'mom',
                title: 'Momentum',
                values: mom,
                kind: 'columns',
                color: bull,
                colors: momColors,
                base: 0
            },
            {
                key: 'state',
                title: 'Squeeze State',
                values: squeezeOn.map((s)=>s == null ? Number.NaN : 0),
                kind: 'circles',
                color: offInk,
                width: 2,
                colors: squeezeOn.map((s)=>s == null ? null : s ? onInk : offInk)
            }
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'markFires', true)) {
            // The fire bar: the first bar the bands re-emerge outside the channels.
            const fires = squeezeOn.map((s, i)=>s === false && squeezeOn[i - 1] === true ? 0 : Number.NaN);
            plots.push({
                key: 'fire',
                title: 'Squeeze Fire',
                values: fires,
                kind: 'cross',
                color: offInk,
                width: 3,
                colors: fires.map((x, i)=>Number.isFinite(x) ? Number.isFinite(mom[i]) ? mom[i] >= 0 ? bull : bear : offInk : null)
            });
        }
        return {
            plots
        };
    }
};
const oscillatorSpecs = [
    rsiSpec,
    stochastic,
    stochasticRsi,
    macd,
    ppo,
    awesome,
    cci,
    williamsR,
    cmoSpec,
    connorsRsi,
    fisher,
    trix,
    tsi,
    smiErgodic,
    stc,
    kst,
    coppock,
    dpo,
    rocSpec,
    ultimate,
    rvgi,
    relVolatility,
    bop,
    elderRay,
    ttmSqueeze
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/overlays.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "overlaySpecs",
    ()=>overlaySpecs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)");
;
;
;
;
/** Price-anchored specials: stops, anchored averages, levels, pivots, patterns. */ const DAY_MS = 86400000;
/** UTC period key for an anchor (epoch day 0 was a Thursday; weeks start Monday). */ function periodKey(anchor, time) {
    if (anchor === 'Week') return Math.floor((Math.floor(time / DAY_MS) + 3) / 7);
    if (anchor === 'Month' || anchor === 'Quarter' || anchor === 'Year') {
        const d = new Date(time);
        if (anchor === 'Year') return d.getUTCFullYear();
        if (anchor === 'Quarter') return d.getUTCFullYear() * 4 + Math.floor(d.getUTCMonth() / 3);
        return d.getUTCFullYear() * 12 + d.getUTCMonth();
    }
    return Math.floor(time / DAY_MS);
}
/** Median spacing between bars, in ms — the classics' only handle on the chart's timeframe. */ function barInterval(bars) {
    if (bars.length < 2) return 0;
    const gaps = [];
    for(let i = 1; i < bars.length; i++)gaps.push(bars[i].time - bars[i - 1].time);
    gaps.sort((a, b)=>a - b);
    return gaps[Math.floor(gaps.length / 2)] ?? 0;
}
const parabolicSar = {
    type: 'parabolic-sar',
    title: 'Parabolic SAR',
    shortTitle: 'SAR',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('start', 'Start', 0.02, 0, 1, 0.01, 'Initial acceleration factor applied when a new trend begins.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('increment', 'Increment', 0.02, 0, 1, 0.01, 'Amount added to the acceleration factor each time the trend makes a new extreme point.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('maximum', 'Maximum', 0.2, 0.01, 1, 0.01, 'Upper cap on the acceleration factor.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the SAR crosses while they trail below price — uptrend, the stop sits under the market.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the SAR crosses while they sit above price — downtrend, the stop sits over the market.')
    ],
    compute: (bars, inputs)=>{
        const start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'start', 0.02);
        const inc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'increment', 0.02);
        const max = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'maximum', 0.2);
        const n = bars.length;
        const values = new Array(n).fill(Number.NaN);
        if (n >= 2) {
            let long = bars[1].close >= bars[0].close;
            let sar = long ? bars[0].low : bars[0].high;
            let ep = long ? bars[0].high : bars[0].low;
            let af = start;
            for(let i = 1; i < n; i++){
                const b = bars[i];
                sar += af * (ep - sar);
                // SAR may never poke inside the prior two bars' range.
                if (long) sar = Math.min(sar, bars[i - 1].low, i >= 2 ? bars[i - 2].low : bars[i - 1].low);
                else sar = Math.max(sar, bars[i - 1].high, i >= 2 ? bars[i - 2].high : bars[i - 1].high);
                const reversed = long ? b.low < sar : b.high > sar;
                if (reversed) {
                    long = !long;
                    sar = ep;
                    ep = long ? b.high : b.low;
                    af = start;
                } else if (long && b.high > ep) {
                    ep = b.high;
                    af = Math.min(max, af + inc);
                } else if (!long && b.low < ep) {
                    ep = b.low;
                    af = Math.min(max, af + inc);
                }
                values[i] = sar;
            }
        }
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const colors = values.map((x, i)=>Number.isFinite(x) ? x < bars[i].close ? bull : bear : null);
        return {
            plots: [
                {
                    key: 'sar',
                    title: 'SAR',
                    values,
                    kind: 'cross',
                    color: bull,
                    colors
                }
            ]
        };
    }
};
const VWAP_ANCHORS = [
    'Session',
    'Week',
    'Month',
    'Quarter',
    'Year'
];
const BANDS_STDEV = 'Standard Deviation';
const BANDS_PERCENT = 'Percentage';
const VWAP_BANDS = [
    {
        show: 'band1',
        mult: 'band1Mult',
        defMult: 1,
        defOn: true
    },
    {
        show: 'band2',
        mult: 'band2Mult',
        defMult: 2,
        defOn: false
    },
    {
        show: 'band3',
        mult: 'band3Mult',
        defMult: 3,
        defOn: false
    }
];
const vwap = {
    type: 'vwap',
    title: 'Volume Weighted Average Price',
    shortTitle: 'VWAP',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('anchor', 'Anchor Period', 'Session', VWAP_ANCHORS, 'Period anchoring the average. VWAP and its bands reset on the first bar of each new session, week, month, quarter or year (UTC).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('HLC3', 'source', 'Source', 'Price used in the volume weighted average. Typical price (HLC3) is the classic choice.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('bandsMode', 'Bands Mode', BANDS_STDEV, [
            BANDS_STDEV,
            BANDS_PERCENT
        ], 'Bands offset method: multiples of the volume weighted standard deviation of price around VWAP, or a percentage of the VWAP value.'),
        ...VWAP_BANDS.flatMap((b, i)=>[
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])(b.show, `Band #${i + 1}`, b.defOn, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], `Show the ${[
                    'first',
                    'second',
                    'third'
                ][i]} band pair.`),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])(b.mult, `Band #${i + 1} Multiplier`, b.defMult, 0, 50, 0.5, 'Multiplier for this band pair, in standard deviations or percent depending on the bands mode.')
            ]),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('hideDwm', 'Hide VWAP on 1D or Above', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], 'Hide the VWAP and its bands on daily and higher timeframes, where an intraday anchored VWAP is not meaningful.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'VWAP line color while price closes above it, and the color of the lower (support) bands.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'VWAP line color while price closes below it, and the color of the upper (resistance) bands.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Bands', 'bandsColor', 'Deviation bands fill color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('fill', 'Bands Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Fill the area between each visible band pair.')
    ],
    compute: (bars, inputs)=>{
        const anchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'anchor', 'Session');
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'HLC3'));
        const n = bars.length;
        const hidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'hideDwm', true) && barInterval(bars) >= DAY_MS;
        const values = new Array(n).fill(Number.NaN);
        const bands = VWAP_BANDS.filter((b)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, b.show, b.defOn)).map((b)=>({
                mult: Math.max(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, b.mult, b.defMult)),
                up: new Array(n).fill(Number.NaN),
                down: new Array(n).fill(Number.NaN)
            }));
        const percentMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bandsMode', BANDS_STDEV) === BANDS_PERCENT;
        let period = Number.NaN;
        let cumPV = 0;
        let cumPV2 = 0;
        let cumV = 0;
        for(let i = 0; i < n && !hidden; i++){
            const b = bars[i];
            const key = periodKey(anchor, b.time);
            if (key !== period) {
                period = key;
                cumPV = 0;
                cumPV2 = 0;
                cumV = 0;
            }
            const v = b.volume;
            if (v != null && Number.isFinite(v) && v > 0) {
                const tp = src[i];
                cumPV += tp * v;
                cumPV2 += tp * tp * v;
                cumV += v;
            }
            if (cumV <= 0) continue;
            const mean = cumPV / cumV;
            // Variance clamped at 0 — IEEE drift can dip `E[x²] − mean²` a hair under.
            const offset = percentMode ? mean / 100 : Math.sqrt(Math.max(0, cumPV2 / cumV - mean * mean));
            values[i] = mean;
            for (const band of bands){
                band.up[i] = mean + band.mult * offset;
                band.down[i] = mean - band.mult * offset;
            }
        }
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const fillColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bandsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]), 95);
        const plots = [
            {
                key: 'vwap',
                title: 'VWAP',
                values,
                color: bull,
                colors: values.map((x, i)=>Number.isFinite(x) ? bars[i].close >= x ? bull : bear : null)
            }
        ];
        const fills = [];
        bands.forEach((band, i)=>{
            plots.push({
                key: `up${i}`,
                title: `Upper Band #${i + 1}`,
                values: band.up,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(bear, 40)
            }, {
                key: `down${i}`,
                title: `Lower Band #${i + 1}`,
                values: band.down,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(bull, 40)
            });
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'fill', true)) fills.push({
                key: `band${i}`,
                from: `up${i}`,
                to: `down${i}`,
                color: fillColor
            });
        });
        return {
            plots,
            bands: fills
        };
    }
};
const PIVOT_TRADITIONAL = 'Traditional';
const PIVOT_FIBONACCI = 'Fibonacci';
const PIVOT_CAMARILLA = 'Camarilla';
const PIVOT_WOODIE = 'Woodie';
const PIVOT_AUTO = 'Auto';
const pivotPoints = {
    type: 'pivot-points',
    title: 'Pivot Points Standard',
    shortTitle: 'Pivots',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('kind', 'Type', PIVOT_TRADITIONAL, [
            PIVOT_TRADITIONAL,
            PIVOT_FIBONACCI,
            PIVOT_CAMARILLA,
            PIVOT_WOODIE
        ], 'Formula used to calculate the levels. Traditional is the classic floor-trader method; Fibonacci projects 38.2/61.8/100% of the prior range around the pivot; Camarilla scales the prior range around the prior close; Woodie gives extra weight to the period open.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('anchor', 'Pivots Timeframe', PIVOT_AUTO, [
            PIVOT_AUTO,
            'Daily',
            'Weekly',
            'Monthly',
            'Yearly'
        ], "Period the pivots are anchored to. 'Auto' follows the chart's bar spacing: daily pivots up to 15-minute bars, weekly on other intraday bars, monthly on daily bars, yearly above."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Pivot', 'pivotColor', 'Color of the central pivot (P) level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Resistances', 'resistanceColor', 'Color of the resistance (R) levels.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Supports', 'supportColor', 'Color of the support (S) levels.')
    ],
    compute: (bars, inputs)=>{
        const interval = barInterval(bars);
        const requested = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'anchor', PIVOT_AUTO);
        const auto = interval <= 15 * 60000 ? 'Session' : interval < DAY_MS ? 'Week' : interval <= DAY_MS ? 'Month' : 'Year';
        const anchor = requested === 'Daily' ? 'Session' : requested === 'Weekly' ? 'Week' : requested === 'Monthly' ? 'Month' : requested === 'Yearly' ? 'Year' : auto;
        const kind = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'kind', PIVOT_TRADITIONAL);
        const aggs = new Map();
        for (const b of bars){
            const key = periodKey(anchor, b.time);
            const a = aggs.get(key);
            if (!a) aggs.set(key, {
                open: b.open,
                high: b.high,
                low: b.low,
                close: b.close
            });
            else {
                a.high = Math.max(a.high, b.high);
                a.low = Math.min(a.low, b.low);
                a.close = b.close;
            }
        }
        const n = bars.length;
        const mk = ()=>new Array(n).fill(Number.NaN);
        const levels = {
            p: mk(),
            r1: mk(),
            s1: mk(),
            r2: mk(),
            s2: mk(),
            r3: mk(),
            s3: mk(),
            r4: mk(),
            s4: mk()
        };
        let lastKey = Number.NaN;
        for(let i = 0; i < n; i++){
            const key = periodKey(anchor, bars[i].time);
            const fresh = key !== lastKey;
            lastKey = key;
            // A break on the period's first bar keeps each period's ladder a separate segment.
            if (fresh) continue;
            const prev = aggs.get(key - 1);
            const curr = aggs.get(key);
            if (!prev || !curr) continue;
            const range = prev.high - prev.low;
            const traditional = (prev.high + prev.low + prev.close) / 3;
            const p = kind === PIVOT_WOODIE ? (prev.high + prev.low + 2 * curr.open) / 4 : traditional;
            levels.p[i] = p;
            if (kind === PIVOT_FIBONACCI) {
                levels.r1[i] = traditional + 0.382 * range;
                levels.s1[i] = traditional - 0.382 * range;
                levels.r2[i] = traditional + 0.618 * range;
                levels.s2[i] = traditional - 0.618 * range;
                levels.r3[i] = traditional + range;
                levels.s3[i] = traditional - range;
            } else if (kind === PIVOT_CAMARILLA) {
                const cam = 1.1 * range;
                levels.r1[i] = prev.close + cam / 12;
                levels.s1[i] = prev.close - cam / 12;
                levels.r2[i] = prev.close + cam / 6;
                levels.s2[i] = prev.close - cam / 6;
                levels.r3[i] = prev.close + cam / 4;
                levels.s3[i] = prev.close - cam / 4;
                levels.r4[i] = prev.close + cam / 2;
                levels.s4[i] = prev.close - cam / 2;
            } else {
                // Traditional and Woodie share the R1/S1/R2/S2 shape around their own pivot.
                levels.r1[i] = 2 * p - prev.low;
                levels.s1[i] = 2 * p - prev.high;
                levels.r2[i] = p + range;
                levels.s2[i] = p - range;
                if (kind !== PIVOT_WOODIE) {
                    levels.r3[i] = prev.high + 2 * (p - prev.low);
                    levels.s3[i] = prev.low - 2 * (prev.high - p);
                }
            }
        }
        const resistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'resistanceColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const support = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'supportColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const plot = (key, title, color)=>({
                key,
                title,
                values: levels[key],
                color
            });
        const plots = [
            plot('p', 'P', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'pivotColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])),
            plot('r1', 'R1', resistance),
            plot('s1', 'S1', support),
            plot('r2', 'R2', resistance),
            plot('s2', 'S2', support)
        ];
        if (kind !== PIVOT_WOODIE) plots.push(plot('r3', 'R3', resistance), plot('s3', 'S3', support));
        if (kind === PIVOT_CAMARILLA) plots.push(plot('r4', 'R4', resistance), plot('s4', 'S4', support));
        return {
            plots
        };
    }
};
const fiftyTwoWeek = {
    type: '52-week-high-low',
    title: '52 Week High/Low',
    shortTitle: '52W H/L',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('weeks', 'Weeks', 52, 1, 520, 'Length of the rolling window, in weeks.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showAllTime', 'Show All-Time High/Low', false, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], "Additionally display the all-time high and low, tracked over the symbol's full loaded history."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], '52 Week High', 'highColor', 'Color of the 52 week high level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], '52 Week Low', 'lowColor', 'Color of the 52 week low level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'All-Time High/Low', 'allTimeColor', 'Color of the all-time high and all-time low levels.')
    ],
    compute: (bars, inputs)=>{
        const span = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'weeks', 52) * 7 * DAY_MS;
        const n = bars.length;
        const hi = new Array(n).fill(Number.NaN);
        const lo = new Array(n).fill(Number.NaN);
        const ath = new Array(n).fill(Number.NaN);
        const atl = new Array(n).fill(Number.NaN);
        // Two-pointer sliding window over the time span, monotonic deques for the extremes.
        const maxIdx = [];
        const minIdx = [];
        let from = 0;
        let runHigh = -Infinity;
        let runLow = Infinity;
        for(let i = 0; i < n; i++){
            const b = bars[i];
            while(maxIdx.length > 0 && bars[maxIdx[maxIdx.length - 1]].high <= b.high)maxIdx.pop();
            maxIdx.push(i);
            while(minIdx.length > 0 && bars[minIdx[minIdx.length - 1]].low >= b.low)minIdx.pop();
            minIdx.push(i);
            while(bars[from].time < b.time - span)from += 1;
            while(maxIdx[0] < from)maxIdx.shift();
            while(minIdx[0] < from)minIdx.shift();
            hi[i] = bars[maxIdx[0]].high;
            lo[i] = bars[minIdx[0]].low;
            runHigh = Math.max(runHigh, b.high);
            runLow = Math.min(runLow, b.low);
            ath[i] = runHigh;
            atl[i] = runLow;
        }
        const plots = [
            {
                key: 'high',
                title: '52 Week High',
                values: hi,
                kind: 'step',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'highColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                width: 2
            },
            {
                key: 'low',
                title: '52 Week Low',
                values: lo,
                kind: 'step',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'lowColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                width: 2
            }
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showAllTime', false)) {
            const ink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'allTimeColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
            plots.push({
                key: 'ath',
                title: 'All-Time High',
                values: ath,
                kind: 'step',
                color: ink
            }, {
                key: 'atl',
                title: 'All-Time Low',
                values: atl,
                kind: 'step',
                color: ink
            });
        }
        return {
            plots
        };
    }
};
const zigzag = {
    type: 'zigzag',
    title: 'ZigZag',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('deviation', 'Deviation (%)', 5, 0.01, 100, 0.1, 'Minimum reversal from the leg extreme, as a percentage of that extreme, required to confirm a new pivot.'),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('depth', 'Depth', 10, 2, 500, 'Minimum number of bars required between two consecutive pivots.')
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Up Leg', 'bullColor', 'Color of rising zigzag segments.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Down Leg', 'bearColor', 'Color of falling zigzag segments.'),
        {
            key: 'lineWidth',
            title: 'Width',
            type: 'int',
            defval: 2,
            min: 1,
            max: 10,
            step: 1,
            group: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"],
            tooltip: 'Width of the zigzag segments.'
        }
    ],
    compute: (bars, inputs)=>{
        const dev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'deviation', 5) / 100;
        const depth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'depth', 10);
        const pivots = [];
        if (bars.length > 1) {
            // Walk the bars tracking the running extreme; a retrace beyond the deviation
            // (and at least `depth` bars past the last pivot) confirms the extreme as a pivot.
            let up = bars[1].close >= bars[0].close;
            let ext = up ? {
                i: 0,
                price: bars[0].high
            } : {
                i: 0,
                price: bars[0].low
            };
            for(let i = 1; i < bars.length; i++){
                const b = bars[i];
                if (up) {
                    if (b.high >= ext.price) ext = {
                        i,
                        price: b.high
                    };
                    else if (b.low <= ext.price * (1 - dev) && ext.i - (pivots[pivots.length - 1]?.i ?? -depth) >= depth) {
                        pivots.push(ext);
                        up = false;
                        ext = {
                            i,
                            price: b.low
                        };
                    }
                } else if (b.low <= ext.price) {
                    ext = {
                        i,
                        price: b.low
                    };
                } else if (b.high >= ext.price * (1 + dev) && ext.i - (pivots[pivots.length - 1]?.i ?? -depth) >= depth) {
                    pivots.push(ext);
                    up = true;
                    ext = {
                        i,
                        price: b.high
                    };
                }
            }
            pivots.push(ext); // the provisional last leg
        }
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lineWidth', 2);
        // One polyline per leg, so each segment can carry its own direction ink.
        const polylines = [];
        for(let k = 1; k < pivots.length; k++){
            const a = pivots[k - 1];
            const b = pivots[k];
            polylines.push({
                key: `leg${k}`,
                points: [
                    {
                        xloc: 'bar_time',
                        x: bars[a.i].time,
                        price: a.price
                    },
                    {
                        xloc: 'bar_time',
                        x: bars[b.i].time,
                        price: b.price
                    }
                ],
                curved: false,
                closed: false,
                lineColor: b.price >= a.price ? bull : bear,
                lineWidth: width,
                lineStyle: 'solid',
                arrowLeft: false,
                arrowRight: false
            });
        }
        return {
            plots: [],
            polylines
        };
    }
};
const williamsFractal = {
    type: 'williams-fractal',
    title: 'Williams Fractal',
    shortTitle: 'Fractals',
    overlay: true,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('periods', 'Periods', 2, 2, 50, "Bars required on each side of the candidate bar. 2 is Bill Williams' classic 5-bar fractal; a fractal is confirmed only once this many later bars have closed."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Up Fractal', 'upColor', 'Color of the up fractal marker (swing high), drawn above the fractal bar.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Down Fractal', 'downColor', 'Color of the down fractal marker (swing low), drawn below the fractal bar.')
    ],
    compute: (bars, inputs)=>{
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'periods', 2);
        const markers = [];
        const up = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'upColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const down = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'downColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        // The candidate must STRICTLY exceed every neighbour, so a tie never prints a fractal.
        const isExtreme = (i, pick, better)=>{
            const v = pick(bars[i]);
            for(let k = i - p; k <= i + p; k++){
                if (k === i) continue;
                if (!better(v, pick(bars[k]))) return false;
            }
            return true;
        };
        for(let i = p; i < bars.length - p; i++){
            if (isExtreme(i, (b)=>b.high, (a, b)=>a > b)) markers.push({
                time: bars[i].time,
                position: 'aboveBar',
                shape: 'triangleup',
                color: up
            });
            if (isExtreme(i, (b)=>b.low, (a, b)=>a < b)) markers.push({
                time: bars[i].time,
                position: 'belowBar',
                shape: 'triangledown',
                color: down
            });
        }
        return {
            plots: [],
            markers
        };
    }
};
const overlaySpecs = [
    parabolicSar,
    vwap,
    pivotPoints,
    fiftyTwoWeek,
    zigzag,
    williamsFractal
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/shared.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SETTINGS",
    ()=>SETTINGS,
    "STYLE",
    ()=>STYLE,
    "anchorPlot",
    ()=>anchorPlot,
    "baselineGradient",
    ()=>baselineGradient,
    "boolInput",
    ()=>boolInput,
    "boundedOscillator",
    ()=>boundedOscillator,
    "centeredOscillator",
    ()=>centeredOscillator,
    "channelStyleInputs",
    ()=>channelStyleInputs,
    "colorInput",
    ()=>colorInput,
    "directionalChannel",
    ()=>directionalChannel,
    "floatInput",
    ()=>floatInput,
    "gradient",
    ()=>gradient,
    "intInput",
    ()=>intInput,
    "lengthInput",
    ()=>lengthInput,
    "momentumColumnColors",
    ()=>momentumColumnColors,
    "optionInput",
    ()=>optionInput,
    "rampColors",
    ()=>rampColors,
    "sourceInput",
    ()=>sourceInput,
    "thresholdZones",
    ()=>thresholdZones,
    "transp",
    ()=>transp,
    "widthInput",
    ()=>widthInput,
    "withAlpha",
    ()=>withAlpha
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)");
;
;
const SETTINGS = 'Settings';
const STYLE = 'Style';
function lengthInput(defval, key = 'length', title = 'Length', max = 5000, tooltip) {
    return {
        key,
        title,
        type: 'int',
        defval,
        min: 1,
        max,
        step: 1,
        group: SETTINGS,
        ...tooltip != null ? {
            tooltip
        } : {}
    };
}
function intInput(key, title, defval, min = 1, max = 5000, tooltip) {
    return {
        key,
        title,
        type: 'int',
        defval,
        min,
        max,
        step: 1,
        group: SETTINGS,
        ...tooltip != null ? {
            tooltip
        } : {}
    };
}
function floatInput(key, title, defval, min = 0, max = 1000, step = 0.1, tooltip) {
    return {
        key,
        title,
        type: 'float',
        defval,
        min,
        max,
        step,
        group: SETTINGS,
        ...tooltip != null ? {
            tooltip
        } : {}
    };
}
function boolInput(key, title, defval, group = SETTINGS, tooltip) {
    return {
        key,
        title,
        type: 'bool',
        defval,
        group,
        ...tooltip != null ? {
            tooltip
        } : {}
    };
}
function optionInput(key, title, defval, options, tooltip) {
    return {
        key,
        title,
        type: 'string',
        defval,
        options,
        group: SETTINGS,
        ...tooltip != null ? {
            tooltip
        } : {}
    };
}
function sourceInput(defval = 'Close', key = 'source', title = 'Source', tooltip) {
    return {
        key,
        title,
        type: 'string',
        defval,
        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOURCES"],
        group: SETTINGS,
        ...tooltip != null ? {
            tooltip
        } : {}
    };
}
function colorInput(defval = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], title = 'Color', key = 'color', tooltip) {
    return {
        key,
        title,
        type: 'color',
        defval,
        group: STYLE,
        ...tooltip != null ? {
            tooltip
        } : {}
    };
}
function widthInput(defval = 2, key = 'lineWidth', title = 'Line Width') {
    return {
        key,
        title,
        type: 'int',
        defval,
        min: 1,
        max: 5,
        step: 1,
        group: STYLE,
        tooltip: 'Width of the plotted line, in pixels.'
    };
}
function transp(hex, transparency) {
    return withAlpha(hex, (100 - transparency) / 100);
}
function withAlpha(hex, alpha = 0.08) {
    const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) return hex;
    const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0');
    return `#${m[1]}${a}`;
}
function channelStyleInputs(basisTitle = 'Basis') {
    return [
        colorInput(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the lower band and of the basis while price holds above it.'),
        colorInput(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the upper band and of the basis while price sits below it.'),
        colorInput(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], basisTitle, 'basisColor', 'Color of the basis line while price sits exactly on it.')
    ];
}
function directionalChannel(bars, basis, upper, lower, ink, key) {
    const basisColors = basis.map((b, i)=>{
        if (!Number.isFinite(b)) return null;
        const c = bars[i].close;
        return c > b ? ink.bull : c < b ? ink.bear : ink.neutral;
    });
    const wash = upper.map((u, i)=>{
        const l = lower[i];
        if (!Number.isFinite(u) || !Number.isFinite(l)) return null;
        return {
            topValue: u,
            bottomValue: l,
            topColor: transp(ink.bear, 90),
            bottomColor: transp(ink.bull, 90)
        };
    });
    return {
        plots: [
            {
                key: 'basis',
                title: 'Basis',
                values: [
                    ...basis
                ],
                color: ink.neutral,
                colors: basisColors
            },
            {
                key: 'upper',
                title: 'Upper',
                values: [
                    ...upper
                ],
                color: transp(ink.bear, 30)
            },
            {
                key: 'lower',
                title: 'Lower',
                values: [
                    ...lower
                ],
                color: transp(ink.bull, 30)
            }
        ],
        bands: [
            {
                key,
                from: 'upper',
                to: 'lower',
                color: transp(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90),
                gradient: wash
            }
        ]
    };
}
function anchorPlot(key, title, length, level) {
    return {
        key,
        title,
        values: new Array(length).fill(level),
        color: transp(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
        display: {
            pane: false,
            legend: false,
            dataWindow: false
        }
    };
}
function thresholdZones(length, levels, ink, transparency = 92) {
    return {
        plots: [
            anchorPlot('obAnchor', 'Overbought Anchor', length, levels.overbought),
            anchorPlot('osAnchor', 'Oversold Anchor', length, levels.oversold),
            anchorPlot('topAnchor', 'Top Anchor', length, levels.top),
            anchorPlot('bottomAnchor', 'Bottom Anchor', length, levels.bottom)
        ],
        bands: [
            {
                key: 'obZone',
                from: 'obAnchor',
                to: 'topAnchor',
                color: transp(ink.overbought, transparency)
            },
            {
                key: 'osZone',
                from: 'osAnchor',
                to: 'bottomAnchor',
                color: transp(ink.oversold, transparency)
            }
        ]
    };
}
function rampColors(values, levels, ink) {
    return values.map((x)=>{
        if (!Number.isFinite(x)) return null;
        return x <= levels.mid ? gradient(x, levels.low, levels.mid, ink.low, ink.mid) : gradient(x, levels.mid, levels.high, ink.mid, ink.high);
    });
}
function baselineGradient(values, baseline, inkOf, valueTransparency = 50, baseTransparency = 100) {
    return values.map((x, i)=>{
        if (!Number.isFinite(x)) return null;
        const ink = inkOf(x, i);
        const above = x > baseline;
        return {
            topValue: Math.max(x, baseline),
            bottomValue: Math.min(x, baseline),
            topColor: transp(ink, above ? valueTransparency : baseTransparency),
            bottomColor: transp(ink, above ? baseTransparency : valueTransparency)
        };
    });
}
function momentumColumnColors(values, ink) {
    return values.map((x, i)=>{
        if (!Number.isFinite(x)) return null;
        const prev = i > 0 && Number.isFinite(values[i - 1]) ? values[i - 1] : x;
        const rising = x > prev;
        if (x >= 0) return rising ? ink.growAbove : ink.fallAbove;
        return rising ? ink.growBelow : ink.fallBelow;
    });
}
function boundedOscillator(opts) {
    const mid = (opts.overbought + opts.oversold) / 2;
    const ramp = rampColors(opts.values, {
        low: opts.oversold,
        mid,
        high: opts.overbought
    }, opts.ink);
    const zones = thresholdZones(opts.values.length, {
        overbought: opts.overbought,
        oversold: opts.oversold,
        top: opts.scale.top,
        bottom: opts.scale.bottom
    }, {
        overbought: opts.ink.high,
        oversold: opts.ink.low
    }, opts.zoneTransparency);
    const plots = [
        {
            key: opts.key,
            title: opts.title,
            values: opts.values,
            color: opts.ink.mid,
            width: opts.width ?? 1,
            colors: ramp
        },
        ...zones.plots
    ];
    const bands = [
        ...zones.bands
    ];
    if (opts.bandFill != null) bands.push({
        key: 'band',
        from: 'obAnchor',
        to: 'osAnchor',
        color: opts.bandFill
    });
    if (opts.midpointWash) {
        plots.push(anchorPlot('midAnchor', 'Midpoint Anchor', opts.values.length, mid));
        bands.push({
            key: 'wash',
            from: opts.key,
            to: 'midAnchor',
            color: transp(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
            gradient: baselineGradient(opts.values, mid, (_x, i)=>ramp[i] ?? opts.ink.mid)
        });
    }
    const levels = [
        {
            key: 'overbought',
            price: opts.overbought,
            color: opts.levelInk,
            lineStyle: 'dashed',
            title: opts.levelTitles?.overbought ?? 'Overbought'
        },
        {
            key: 'oversold',
            price: opts.oversold,
            color: opts.levelInk,
            lineStyle: 'dashed',
            title: opts.levelTitles?.oversold ?? 'Oversold'
        }
    ];
    if (opts.midline != null) levels.splice(1, 0, {
        key: 'midline',
        price: opts.midline,
        color: opts.levelInk,
        lineStyle: 'dotted',
        title: 'Midline'
    });
    return {
        plots,
        bands,
        levels
    };
}
function centeredOscillator(opts) {
    const baseline = opts.baseline ?? 0;
    const inkOf = (x)=>x > baseline ? opts.ink.bull : x < baseline ? opts.ink.bear : opts.ink.neutral;
    const plots = [
        {
            key: opts.key,
            title: opts.title,
            values: opts.values,
            color: opts.ink.neutral,
            width: opts.width ?? 1,
            colors: opts.values.map((x)=>Number.isFinite(x) ? inkOf(x) : null)
        },
        ...opts.extraPlots ?? []
    ];
    const bands = [];
    if (opts.fill !== false) {
        plots.push(anchorPlot('baseline', 'Baseline Anchor', opts.values.length, baseline));
        bands.push({
            key: 'wash',
            from: opts.key,
            to: 'baseline',
            color: transp(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
            gradient: baselineGradient(opts.values, baseline, inkOf, opts.valueTransparency)
        });
    }
    return {
        plots,
        bands,
        levels: [
            {
                key: 'zero',
                price: baseline,
                color: opts.zeroInk,
                lineStyle: opts.zeroLineStyle ?? 'dashed',
                title: opts.zeroTitle ?? 'Zero Line'
            },
            ...opts.extraLevels ?? []
        ]
    };
}
function channels(hex) {
    const m = /^#([0-9a-f]{6})/i.exec(hex.trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return [
        n >> 16 & 255,
        n >> 8 & 255,
        n & 255
    ];
}
function gradient(value, low, high, from, to) {
    const a = channels(from);
    const b = channels(to);
    if (!a || !b || !Number.isFinite(value)) return from;
    const span = high - low;
    const t = span === 0 ? 0 : Math.max(0, Math.min(1, (value - low) / span));
    const mix = (i)=>Math.round(a[i] + (b[i] - a[i]) * t).toString(16).padStart(2, '0');
    return `#${mix(0)}${mix(1)}${mix(2)}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/trend.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "trendSpecs",
    ()=>trendSpecs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)");
;
;
;
;
/** Directional/trend-strength studies. */ const aroon = {
    type: 'aroon',
    title: 'Aroon',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 5000, 'Lookback length used to locate the highest high and lowest low.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Aroon Up', 'upColor', 'Color of the Aroon Up line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Aroon Down', 'downColor', 'Color of the Aroon Down line.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14);
        const up = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["barsSinceHighest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), len), (x)=>100 * (len - x) / len);
        const down = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["barsSinceLowest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), len), (x)=>100 * (len - x) / len);
        return {
            plots: [
                {
                    key: 'up',
                    title: 'Aroon Up',
                    values: up,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'upColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"])
                },
                {
                    key: 'down',
                    title: 'Aroon Down',
                    values: down,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'downColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
                }
            ]
        };
    }
};
const adx = {
    type: 'average-directional-index',
    title: 'Average Directional Index',
    shortTitle: 'ADX',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'diLength', 'DI Length', 5000, 'Wilder RMA smoothing length applied to directional movement and true range when computing +DI and −DI.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'adxLength', 'ADX Smoothing', 5000, 'Wilder RMA smoothing length applied to DX to obtain the ADX line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('keyLevel', 'Key Level', 25, 0, 100, 1, 'Trend strength reference level; ADX above it is commonly read as a trending market.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], '+DI Color', 'plusDiColor', 'Color of the plus directional indicator, and of the ADX line above the key level while +DI leads.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], '-DI Color', 'minusDiColor', 'Color of the minus directional indicator, and of the ADX line above the key level while −DI leads.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'ADX Color', 'adxColor', 'Color of the ADX line while it sits below the key level — no trend strong enough to trade.')
    ],
    compute: (bars, inputs)=>{
        const diLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'diLength', 14);
        const n = bars.length;
        const plusDm = new Array(n).fill(Number.NaN);
        const minusDm = new Array(n).fill(Number.NaN);
        for(let i = 1; i < n; i++){
            const up = bars[i].high - bars[i - 1].high;
            const dn = bars[i - 1].low - bars[i].low;
            plusDm[i] = up > dn && up > 0 ? up : 0;
            minusDm[i] = dn > up && dn > 0 ? dn : 0;
        }
        const atrLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trueRange"])(bars), diLen);
        const plusDi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(plusDm, diLen), atrLine, (d, a)=>a === 0 ? 0 : 100 * d / a);
        const minusDi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(minusDm, diLen), atrLine, (d, a)=>a === 0 ? 0 : 100 * d / a);
        const dx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(plusDi, minusDi, (p, m)=>p + m === 0 ? 0 : 100 * Math.abs(p - m) / (p + m));
        const adxLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(dx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'adxLength', 14));
        const plusInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'plusDiColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const minusInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'minusDiColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const neutralInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'adxColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const keyLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'keyLevel', 25);
        // The ADX borrows the dominant DI's color once it clears the key level.
        const adxColors = adxLine.map((x, i)=>{
            if (!Number.isFinite(x)) return null;
            if (x <= keyLevel) return neutralInk;
            return (plusDi[i] ?? 0) > (minusDi[i] ?? 0) ? plusInk : minusInk;
        });
        return {
            plots: [
                {
                    key: 'plusDi',
                    title: '+DI',
                    values: plusDi,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(plusInk, 30)
                },
                {
                    key: 'minusDi',
                    title: '-DI',
                    values: minusDi,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(minusInk, 30)
                },
                {
                    key: 'adx',
                    title: 'ADX',
                    values: adxLine,
                    color: neutralInk,
                    width: 2,
                    colors: adxColors
                }
            ],
            levels: [
                {
                    key: 'keyLevel',
                    price: keyLevel,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
                    lineStyle: 'dashed',
                    title: 'Key Level'
                }
            ]
        };
    }
};
const vortex = {
    type: 'vortex-indicator',
    title: 'Vortex Indicator',
    shortTitle: 'VI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 5000, 'Number of bars used to sum the vortex movements (VM+ and VM−) and the true range.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'VI+', 'plusColor', 'Color of the positive vortex line (VI+).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'VI-', 'minusColor', 'Color of the negative vortex line (VI−).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Baseline', 'baselineColor', 'Color of the dotted baseline drawn at 1.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14);
        const n = bars.length;
        const vmPlus = new Array(n).fill(Number.NaN);
        const vmMinus = new Array(n).fill(Number.NaN);
        for(let i = 1; i < n; i++){
            vmPlus[i] = Math.abs(bars[i].high - bars[i - 1].low);
            vmMinus[i] = Math.abs(bars[i].low - bars[i - 1].high);
        }
        const trSum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trueRange"])(bars), len);
        return {
            plots: [
                {
                    key: 'viPlus',
                    title: 'VI+',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(vmPlus, len), trSum, (v, t)=>t === 0 ? Number.NaN : v / t),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'plusColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"])
                },
                {
                    key: 'viMinus',
                    title: 'VI-',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(vmMinus, len), trSum, (v, t)=>t === 0 ? Number.NaN : v / t),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'minusColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
                }
            ],
            levels: [
                {
                    key: 'baseline',
                    price: 1,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'baselineColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                    lineStyle: 'dotted',
                    title: 'Baseline'
                }
            ]
        };
    }
};
const trendSpecs = [
    aroon,
    adx,
    vortex
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/volatility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "volatilitySpecs",
    ()=>volatilitySpecs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)");
;
;
;
;
/** Volatility studies — how much price moves, regardless of direction. */ /** Rising readings take the accent; contracting or flat volatility stays structural grey. */ function expansionColors(values, calm, expanding) {
    return values.map((x, i)=>{
        if (!Number.isFinite(x)) return null;
        const prev = i > 0 && Number.isFinite(values[i - 1]) ? values[i - 1] : x;
        return x > prev ? expanding : calm;
    });
}
/** Line plus a wash down to zero — the shared look of the one-sided volatility metrics. */ function washedToZero(key, title, values, colors, fallback, valueTransparency, width = 1) {
    return {
        plots: [
            {
                key,
                title,
                values,
                color: fallback,
                width,
                colors
            },
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anchorPlot"])('zeroAnchor', 'Zero Anchor', values.length, 0)
        ],
        bands: [
            {
                key: 'wash',
                from: key,
                to: 'zeroAnchor',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
                gradient: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["baselineGradient"])(values, 0, (_x, i)=>colors[i] ?? fallback, valueTransparency)
            }
        ]
    };
}
const atrSpec = {
    type: 'average-true-range',
    title: 'Average True Range',
    shortTitle: 'ATR',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 5000, 'Number of bars used to average the true range.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('smoothing', 'Smoothing', 'RMA', [
            'RMA',
            'SMA',
            'EMA',
            'WMA'
        ], "Moving average applied to the true range. RMA is Wilder's original smoothing used by the classic ATR."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'ATR Line', 'color', 'Color of the ATR line while volatility contracts or holds flat.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Expanding', 'expandColor', 'Color of the ATR line while it rises — volatility expanding bar to bar.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14);
        const tr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trueRange"])(bars);
        const kind = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'smoothing', 'RMA');
        const values = kind === 'SMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(tr, len) : kind === 'EMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(tr, len) : kind === 'WMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wma"])(tr, len) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(tr, len);
        const calm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        return washedToZero('atr', 'ATR', values, expansionColors(values, calm, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'expandColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])), calm, 75);
    }
};
const historicalVolatility = {
    type: 'historical-volatility',
    title: 'Historical Volatility',
    shortTitle: 'HV',
    overlay: false,
    inputs: [
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'length', 'Length', 5000, 'Lookback window in bars for the standard deviation of close-to-close log returns.'),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('annualize', 'Annualize', true, undefined, 'Scale the per-bar volatility to an annual figure by multiplying by the square root of the periods per year.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('periodsPerYear', 'Periods Per Year', 252, 1, 100000, 'Number of periods in a year used for annualization: 252 for daily bars, 52 for weekly, 12 for monthly.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Volatility Line', 'color', 'Color of the line at its recent highs; it fades toward grey as volatility contracts.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 10);
        const logReturns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), Math.log), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), Math.log), 1));
        // Sample (n − 1) standard deviation about the window mean.
        const meanReturn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(logReturns, len), (s)=>s / len);
        const squaredSum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(logReturns, (r)=>r * r), len);
        const factor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'annualize', true) ? Math.sqrt((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'periodsPerYear', 252)) : 1;
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(squaredSum, meanReturn, (sq, m)=>Math.sqrt(Math.max(sq - len * m * m, 0) / (len - 1)) * factor * 100);
        // Intensity tracks where the reading sits in its own recent range.
        const low = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])(values, 100);
        const high = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])(values, 100);
        const accent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"]);
        const colors = values.map((x, i)=>Number.isFinite(x) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gradient"])(x, low[i] ?? 0, high[i] ?? 0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], accent) : null);
        return washedToZero('hv', 'Historical Volatility', values, colors, accent, 75, 2);
    }
};
const chaikinVolatility = {
    type: 'chaikin-volatility',
    title: 'Chaikin Volatility',
    shortTitle: 'CHV',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'emaLength', 'EMA Length', 5000, 'Length of the exponential moving average applied to the bar high-low range.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'rocLength', 'ROC Length', 5000, 'Number of bars used for the rate of change of the smoothed high-low range.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'CHV Color', 'color', 'Color of the Chaikin Volatility line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Expansion', 'expansionColor', 'Line and fill color while the reading is above zero — the smoothed range is wider than it was ROC Length bars ago.')
    ],
    compute: (bars, inputs)=>{
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'emaLength', 10));
        const prior = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])(range, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'rocLength', 10));
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(range, prior, (r, p)=>p === 0 ? Number.NaN : 100 * (r - p) / p);
        const calm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const expansion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'expansionColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'chv',
            title: 'Chaikin Volatility',
            values,
            // Only expansion is a state worth accenting; contraction stays structural grey.
            ink: {
                bull: expansion,
                bear: calm,
                neutral: calm
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]
        });
    }
};
const massIndex = {
    type: 'mass-index',
    title: 'Mass Index',
    shortTitle: 'MI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(25, 'length', 'Sum Length', 5000, 'Number of bars over which the single/double EMA ratio is summed.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'emaLength', 'EMA Length', 5000, 'Length of the single EMA of the high-low range and of its double smoothing.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('setupLevel', 'Setup Level', 27, 0, 1000, 0.1, 'Reversal bulge set-up level; a rise above it arms the pattern.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('triggerLevel', 'Trigger Level', 26.5, 0, 1000, 0.1, 'Reversal bulge trigger level; a decline below it after a set-up completes the pattern.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Mass Index', 'color', 'Line color while no reversal bulge is armed.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Armed', 'armedColor', 'Line color from the rise above the setup level until the decline below the trigger level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Levels', 'levelsColor', 'Reversal bulge levels color.')
    ],
    compute: (bars, inputs)=>{
        const emaLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'emaLength', 9);
        const single = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars)), emaLen);
        // A flat market yields the neutral ratio 1 rather than a gap.
        const ratio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(single, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(single, emaLen), (a, b)=>b === 0 ? 1 : a / b);
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(ratio, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 25));
        const setup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'setupLevel', 27);
        const trigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'triggerLevel', 26.5);
        const calm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const armedInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'armedColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"]);
        const levelInk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'levelsColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        // Armed by the rise above the setup level, cleared by the decline below the trigger.
        let armed = false;
        const colors = values.map((x)=>{
            if (!Number.isFinite(x)) return null;
            armed = x > setup ? true : x < trigger ? false : armed;
            return armed ? armedInk : calm;
        });
        return {
            plots: [
                {
                    key: 'mi',
                    title: 'Mass Index',
                    values,
                    color: calm,
                    colors
                },
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anchorPlot"])('setupAnchor', 'Setup Anchor', values.length, setup),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anchorPlot"])('triggerAnchor', 'Trigger Anchor', values.length, trigger)
            ],
            bands: [
                {
                    key: 'bulge',
                    from: 'setupAnchor',
                    to: 'triggerAnchor',
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(armedInk, 90)
                }
            ],
            levels: [
                {
                    key: 'setup',
                    price: setup,
                    color: levelInk,
                    lineStyle: 'dashed',
                    title: 'Setup Level'
                },
                {
                    key: 'trigger',
                    price: trigger,
                    color: levelInk,
                    lineStyle: 'dashed',
                    title: 'Trigger Level'
                }
            ]
        };
    }
};
const standardDeviation = {
    type: 'standard-deviation',
    title: 'Standard Deviation',
    shortTitle: 'StdDev',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, 'Number of bars used to compute the standard deviation.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the standard deviation is calculated on.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Standard Deviation', 'color', 'Line color while volatility contracts or holds flat.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Expanding', 'expandColor', 'Line and fill color while volatility expands bar to bar.')
    ],
    compute: (bars, inputs)=>{
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stdev"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close')), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20));
        const calm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        return washedToZero('stdev', 'Standard Deviation', values, expansionColors(values, calm, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'expandColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])), calm, 80);
    }
};
const ulcerIndex = {
    type: 'ulcer-index',
    title: 'Ulcer Index',
    overlay: false,
    inputs: [
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 500, "Lookback window. At each bar the percentage drawdown from the window's running maximum is squared; the squares are averaged and the root taken."),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series the Ulcer Index is computed on. Close is the standard choice.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('threshold', 'Alert Threshold', 5, 0, 1000, 0.25, "Reference level drawn as a dashed line. The index scales with the instrument's volatility and the window length, so set it relative to its own history."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Ulcer Index', 'color', 'Color of the index near zero; it blends toward the stress color as the reading approaches the threshold.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Stress', 'stressColor', 'Color of the index at and beyond the alert threshold.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Vertical gradient between zero and the Ulcer Index, fully transparent at zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showDrawdown', 'Drawdown %', false, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Plot the current percentage drawdown from the window high as columns below zero — the raw ingredient the index averages.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 50), 'Drawdown Color', 'drawdownColor', 'Color of the drawdown columns.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Threshold', 'thresholdColor', 'Color of the alert threshold line.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14);
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const n = src.length;
        const values = new Array(n).fill(Number.NaN);
        const drawdown = new Array(n).fill(Number.NaN);
        for(let i = len - 1; i < n; i++){
            // The running maximum walks forward from the start of the window, so an early
            // peak keeps scoring every later bar as underwater.
            let runMax = Number.NaN;
            let sumSq = 0;
            let valid = true;
            let last = Number.NaN;
            for(let k = i - len + 1; k <= i; k++){
                const price = src[k];
                if (!Number.isFinite(price)) {
                    valid = false;
                    break;
                }
                runMax = Number.isFinite(runMax) ? Math.max(runMax, price) : price;
                if (runMax <= 0) {
                    valid = false;
                    break;
                }
                last = 100 * (price - runMax) / runMax;
                sumSq += last * last;
            }
            if (!valid) continue;
            values[i] = Math.sqrt(sumSq / len);
            drawdown[i] = last;
        }
        const calm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const stress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'stressColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const threshold = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'threshold', 5);
        const colors = values.map((x)=>Number.isFinite(x) ? threshold > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gradient"])(x, 0, threshold, calm, stress) : stress : null);
        const plots = [
            {
                key: 'ui',
                title: 'Ulcer Index',
                values,
                color: calm,
                colors
            }
        ];
        const bands = [];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true)) {
            plots.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anchorPlot"])('zeroAnchor', 'Zero Base', n, 0));
            bands.push({
                key: 'wash',
                from: 'ui',
                to: 'zeroAnchor',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
                gradient: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["baselineGradient"])(values, 0, (_x, i)=>colors[i] ?? calm)
            });
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showDrawdown', false)) {
            plots.push({
                key: 'dd',
                title: 'Drawdown %',
                values: drawdown,
                kind: 'columns',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'drawdownColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 50)),
                base: 0
            });
        }
        return {
            plots,
            bands,
            levels: [
                {
                    key: 'zero',
                    price: 0,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 50),
                    lineStyle: 'dotted',
                    title: 'Zero Level'
                },
                {
                    key: 'threshold',
                    price: threshold,
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'thresholdColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                    lineStyle: 'dashed',
                    title: 'Alert Threshold'
                }
            ]
        };
    }
};
const choppiness = {
    type: 'choppiness-index',
    title: 'Choppiness Index',
    shortTitle: 'CHOP',
    overlay: false,
    inputs: [
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 5000, 'Number of bars used to sum true ranges and to measure the highest high − lowest low range.'),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('upperBand', 'Upper Band', 61.8, 0, 100, 0.1, 'Readings above this level indicate a choppy, range-bound market.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('lowerBand', 'Lower Band', 38.2, 0, 100, 0.1, 'Readings below this level indicate a strong trend.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'CHOP Line', 'color', 'Color of the Choppiness Index line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Trending', 'trendingColor', 'Line, fill and zone color toward and below the lower band — a trending market.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Choppy', 'choppyColor', 'Line, fill and zone color toward and above the upper band — a choppy, range-bound market.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90), 'Band Fill', 'fillColor', 'Fill color of the zone between the upper and lower bands.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14);
        const trSum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trueRange"])(bars), len);
        const span = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["highs"])(bars), len), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowest"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lows"])(bars), len), (h, l)=>h - l);
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(trSum, span, (t, s)=>s > 0 && t > 0 ? 100 * Math.log10(t / s) / Math.log10(len) : Number.NaN);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boundedOscillator"])({
            key: 'chop',
            title: 'CHOP',
            values,
            scale: {
                top: 100,
                bottom: 0
            },
            overbought: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'upperBand', 61.8),
            oversold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'lowerBand', 38.2),
            ink: {
                low: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'trendingColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                mid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                high: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'choppyColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
            },
            levelInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            bandFill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fillColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90)),
            midpointWash: true,
            levelTitles: {
                overbought: 'Upper Band',
                oversold: 'Lower Band'
            }
        });
    }
};
const volatilitySpecs = [
    atrSpec,
    historicalVolatility,
    chaikinVolatility,
    massIndex,
    standardDeviation,
    ulcerIndex,
    choppiness
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/classics/volume.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "volumeSpecs",
    ()=>volumeSpecs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/define.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/math.ts [app-client] (ecmascript)");
;
;
;
;
/**
 * Volume studies. All of them read the bars' own volume; bars without a volume
 * report become gaps (never fake zeros), which the math module's NaN handling
 * carries through every derived line.
 */ /** Close-location value × volume (the accumulation/distribution money-flow term). */ function moneyFlowVolume(bars) {
    return bars.map((b)=>{
        if (b.volume == null || !Number.isFinite(b.volume)) return Number.NaN;
        if (b.high === b.low) return 0;
        return (2 * b.close - b.high - b.low) / (b.high - b.low) * b.volume;
    });
}
/** Per-bar ink from the line's own slope, holding the last color through a flat bar. */ function slopeColors(values, bull, bear, flat) {
    return values.map((x, i)=>{
        if (!Number.isFinite(x)) return null;
        const prev = i > 0 ? values[i - 1] : Number.NaN;
        if (!Number.isFinite(prev)) return flat;
        return x > prev ? bull : x < prev ? bear : flat;
    });
}
/** A cumulative index seeded at `base` that compounds only on the sessions `when` accepts. */ function volumeIndex(bars, src, base, when) {
    const out = new Array(bars.length).fill(Number.NaN);
    let index = base;
    for(let i = 0; i < bars.length; i++){
        const v = bars[i].volume;
        const pv = i > 0 ? bars[i - 1].volume : null;
        const prev = i > 0 ? src[i - 1] : Number.NaN;
        const active = v != null && pv != null && Number.isFinite(v) && Number.isFinite(pv) && when(v, pv);
        if (active && Number.isFinite(prev) && prev !== 0) index *= 1 + (src[i] - prev) / prev;
        out[i] = index;
    }
    return out;
}
/**
 * The NVI/PVI look: a cumulative line colored by its side of a long signal average,
 * washed toward that average. Both indices differ only in which sessions move them.
 */ function regimeIndex(key, title, values, signal, ink, showSignal, gradientFill, singleColor = false) {
    const inkOf = (i)=>{
        const s = signal[i];
        const x = values[i];
        if (singleColor || !Number.isFinite(s)) return ink.neutral;
        return x > s ? ink.bull : x < s ? ink.bear : ink.neutral;
    };
    const plots = [
        {
            key: 'signal',
            title: 'Signal EMA',
            values: signal,
            color: ink.signal,
            ...showSignal ? {} : {
                display: {
                    pane: false
                }
            }
        },
        {
            key,
            title,
            values,
            color: ink.neutral,
            width: 2,
            colors: values.map((x, i)=>Number.isFinite(x) ? inkOf(i) : null)
        }
    ];
    const bands = gradientFill ? [
        {
            key: 'regime',
            from: key,
            to: 'signal',
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 100),
            gradient: values.map((x, i)=>{
                const s = signal[i];
                if (!Number.isFinite(x) || !Number.isFinite(s)) return null;
                const above = x > s;
                const c = above ? ink.bull : ink.bear;
                return {
                    topValue: Math.max(x, s),
                    bottomValue: Math.min(x, s),
                    topColor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(c, above ? 50 : 100),
                    bottomColor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(c, above ? 100 : 50)
                };
            })
        }
    ] : [];
    return {
        plots,
        bands
    };
}
const obv = {
    type: 'on-balance-volume',
    title: 'On Balance Volume',
    shortTitle: 'OBV',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('smoothing', 'Smoothing MA', false, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], 'Display a moving average of OBV to act as a smoothing/signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('maType', 'MA Type', 'SMA', [
            'SMA',
            'EMA',
            'WMA',
            'RMA (SMMA)'
        ], 'Moving average type used for the smoothing MA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'maLength', 'MA Length', 5000, 'Number of bars used for the smoothing MA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"], 'OBV', 'color', 'Color of the OBV line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Smoothing MA', 'maColor', 'Color of the smoothing MA line.')
    ],
    compute: (bars, inputs)=>{
        const vol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars);
        const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars));
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cumSum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(vol, d, (v, x)=>x > 0 ? v : x < 0 ? -v : 0));
        const plots = [
            {
                key: 'obv',
                title: 'OBV',
                values,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"])
            }
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'smoothing', false)) {
            const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'maLength', 20);
            const kind = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'maType', 'SMA');
            const ma = kind === 'EMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(values, len) : kind === 'WMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wma"])(values, len) : kind === 'RMA (SMMA)' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rma"])(values, len) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(values, len);
            plots.push({
                key: 'ma',
                title: 'Smoothing MA',
                values: ma,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'maColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
            });
        }
        return {
            plots
        };
    }
};
const accDist = {
    type: 'accumulation-distribution',
    title: 'Accumulation / Distribution',
    shortTitle: 'A/D',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('slopeColoring', 'Slope Coloring', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Color the line by its slope — bullish while rising (accumulation), bearish while falling (distribution).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'A/D Line', 'color', 'Color of the line when slope coloring is disabled or the line is flat.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Rising', 'bullColor', 'Line color while the A/D Line rises.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Falling', 'bearColor', 'Line color while the A/D Line falls.')
    ],
    compute: (bars, inputs)=>{
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cumSum"])(moneyFlowVolume(bars));
        const flat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        return {
            plots: [
                {
                    key: 'ad',
                    title: 'A/D',
                    values,
                    color: flat,
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'slopeColoring', true) ? {
                        colors: slopeColors(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]), flat)
                    } : {}
                }
            ]
        };
    }
};
const cmf = {
    type: 'chaikin-money-flow',
    title: 'Chaikin Money Flow',
    shortTitle: 'CMF',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(20, 'length', 'Length', 5000, 'Lookback length over which money flow volume and volume are summed.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'CMF Line', 'color', 'Color of the Chaikin Money Flow line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Line and fill color while the CMF reads above zero (net money flowing in).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Line and fill color while the CMF reads below zero (net money flowing out).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Zero Line', 'zeroColor', 'Color of the zero reference line.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 20);
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(moneyFlowVolume(bars), len), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars), len), (m, v)=>v === 0 ? 0 : m / v);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'cmf',
            title: 'CMF',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'zeroColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
        });
    }
};
const chaikinOscillator = {
    type: 'chaikin-oscillator',
    title: 'Chaikin Oscillator',
    shortTitle: 'Chaikin Osc',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(3, 'fastLength', 'Fast Length', 5000, 'Length of the fast EMA applied to the accumulation/distribution line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'slowLength', 'Slow Length', 5000, 'Length of the slow EMA applied to the accumulation/distribution line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Oscillator', 'color', 'Color of the Chaikin Oscillator line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Line and fill color while the oscillator reads above zero (accumulation).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Line and fill color while the oscillator reads below zero (distribution).')
    ],
    compute: (bars, inputs)=>{
        const ad = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cumSum"])(moneyFlowVolume(bars));
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(ad, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'fastLength', 3)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(ad, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'slowLength', 10)));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'co',
            title: 'Chaikin Oscillator',
            values,
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]
        });
    }
};
const eom = {
    type: 'ease-of-movement',
    title: 'Ease of Movement',
    shortTitle: 'EOM',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 5000, 'Number of bars in the simple moving average smoothing the 1-bar Ease of Movement values.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intInput"])('divisor', 'Divisor', 10000, 1, 1000000000, 'Volume scaling constant of the box ratio; larger values scale the oscillator up. 10000 is the conventional default.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'EOM Line', 'color', 'Color of the line when it sits exactly at zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Above Zero', 'bullColor', 'Color of the line and fill while Ease of Movement is positive.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Below Zero', 'bearColor', 'Color of the line and fill while Ease of Movement is negative.')
    ],
    compute: (bars, inputs)=>{
        const div = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'divisor', 10000);
        const move = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, 'HL2'));
        const raw = bars.map((b, i)=>{
            const m = move[i];
            if (b.volume == null || !Number.isFinite(b.volume) || !Number.isFinite(m)) return Number.NaN;
            return b.volume === 0 ? 0 : div * m * (b.high - b.low) / b.volume;
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'eom',
            title: 'EOM',
            values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(raw, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14)),
            ink: {
                bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]
        });
    }
};
const forceIndex = {
    type: 'force-index',
    title: 'Force Index',
    shortTitle: 'FI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(13, 'length', 'Length', 5000, 'EMA length applied to the raw 1-bar force index, (close − close[1]) × volume. Elder used 13 for the intermediate trend and 2 for short-term timing.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Force Index', 'color', 'Color of the line while above zero (buying pressure).'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the line while below zero (selling pressure).')
    ],
    compute: (bars, inputs)=>{
        const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars), (d, v)=>d * v);
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'force',
            title: 'Force Index',
            values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(raw, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 13)),
            // The reference reads an exact zero as buying pressure, so neutral shares the bull ink.
            ink: {
                bull,
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: bull
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            width: 2,
            valueTransparency: 60
        });
    }
};
const klinger = {
    type: 'klinger-oscillator',
    title: 'Klinger Oscillator',
    shortTitle: 'KVO',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(34, 'fastLength', 'Fast Length', 5000, 'Length of the fast EMA applied to the volume force.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(55, 'slowLength', 'Slow Length', 5000, 'Length of the slow EMA applied to the volume force.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(13, 'signalLength', 'Signal Length', 500, 'Length of the EMA applied to the oscillator to obtain the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'color', 'Color of the Klinger oscillator while above zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the Klinger oscillator while below zero.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal', 'signalColor', 'Color of the signal line.')
    ],
    compute: (bars, inputs)=>{
        const n = bars.length;
        const force = new Array(n).fill(Number.NaN);
        let trend = 1;
        let prevTrend = 1;
        let cm = 0;
        let prevDm = 0;
        for(let i = 0; i < n; i++){
            const b = bars[i];
            const hlc = b.high + b.low + b.close;
            const prevHlc = i > 0 ? bars[i - 1].high + bars[i - 1].low + bars[i - 1].close : hlc;
            trend = hlc > prevHlc ? 1 : -1;
            const dm = b.high - b.low;
            // The cumulative measurement resets to the previous bar's range whenever the trend flips.
            cm = i > 0 && trend === prevTrend ? cm + dm : prevDm + dm;
            const v = b.volume;
            force[i] = v == null || !Number.isFinite(v) ? Number.NaN : cm === 0 ? 0 : v * Math.abs(2 * (dm / cm) - 1) * trend * 100;
            prevTrend = trend;
            prevDm = dm;
        }
        const line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(force, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'fastLength', 34)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(force, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'slowLength', 55)));
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'kvo',
            title: 'KVO',
            values: line,
            ink: {
                bull,
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: bull
            },
            zeroInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 50),
            valueTransparency: 60,
            extraPlots: [
                {
                    key: 'signal',
                    title: 'Signal',
                    values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(line, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 13)),
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
                }
            ]
        });
    }
};
const mfi = {
    type: 'money-flow-index',
    title: 'Money Flow Index',
    shortTitle: 'MFI',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(14, 'length', 'Length', 5000, 'Number of bars used to sum positive and negative money flow.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('overbought', 'Overbought Level', 80, 0, 100, 1, 'Level above which the MFI is considered overbought.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('oversold', 'Oversold Level', 20, 0, 100, 1, 'Level below which the MFI is considered oversold.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'MFI', 'color', 'Color of the MFI line between the levels. Toward either level it blends into that level’s color.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Overbought', 'overboughtColor', 'Color of the line and zone shading at and above the overbought level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Oversold', 'oversoldColor', 'Color of the line and zone shading at and below the oversold level.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 94), 'OB/OS Zone Fill', 'fillColor', 'Fill color of the area between the overbought and oversold levels.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 14);
        const tp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, 'HLC3');
        const rawFlow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(tp, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars), (p, v)=>p * v);
        const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])(tp);
        const pos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(rawFlow, d, (f, x)=>x > 0 ? f : 0), len);
        const neg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(rawFlow, d, (f, x)=>x < 0 ? f : 0), len);
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(pos, neg, (p, w)=>p + w > 0 ? 100 * p / (p + w) : Number.NaN);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boundedOscillator"])({
            key: 'mfi',
            title: 'MFI',
            values,
            scale: {
                top: 100,
                bottom: 0
            },
            overbought: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'overbought', 80),
            oversold: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'oversold', 20),
            ink: {
                low: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'oversoldColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
                mid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
                high: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'overboughtColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
            },
            levelInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            zoneTransparency: 91,
            bandFill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'fillColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 94))
        });
    }
};
/** The style inputs NVI and PVI share. */ function regimeStyleInputs(signalTitle) {
    return [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'bullColor', 'Color of the line and gradient fill while it holds above its signal EMA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the line and gradient fill while it holds below its signal EMA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'Neutral', 'neutralColor', 'Color used while the signal EMA is still forming, or the line sits exactly on it.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], signalTitle, 'signalColor', 'Color of the signal EMA overlay.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Fills the gap between the line and its signal EMA with a vertical gradient — transparent at the average, strongest at the line.')
    ];
}
const NVI_POSITION = 'Position vs Average';
const NVI_SINGLE = 'Single Color';
const nvi = {
    type: 'negative-volume-index',
    title: 'Negative Volume Index',
    shortTitle: 'Negative Volume Index',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('base', 'Base Level', 1000, 0.01, 1000000, 1, 'Arbitrary seed of the cumulative line, conventionally 1000. The absolute level carries no information — the line is read by slope and by position against the signal EMA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showSignal', 'Signal EMA', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], 'Displays the conventional signal overlay. Hiding it only removes the plotted average; the regime coloring and fill still use it.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(255, 'signalLength', 'Signal Length', 5000, 'Length of the signal EMA. The convention is one trading year — 255 sessions on daily charts.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('colorMode', 'Line Coloring', NVI_POSITION, [
            NVI_POSITION,
            NVI_SINGLE
        ], "'Position vs Average' colors the line by the classic regime read; 'Single Color' draws the whole line in the neutral color."),
        ...regimeStyleInputs('Signal EMA')
    ],
    compute: (bars, inputs)=>{
        const values = volumeIndex(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'base', 1000), (v, pv)=>v < pv);
        const signal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 255));
        return regimeIndex('nvi', 'NVI', values, signal, {
            bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
            bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
            neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'neutralColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
            signal: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
        }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showSignal', true), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'colorMode', NVI_POSITION) === NVI_SINGLE);
    }
};
const pvi = {
    type: 'positive-volume-index',
    title: 'Positive Volume Index',
    shortTitle: 'Positive Volume Index',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceInput"])('Close', 'source', 'Source', 'Price series whose one-bar percentage change moves PVI on its active sessions.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('base', 'Starting Value', 1000, 1, 1000000, 1, 'Seed of the cumulative line. The absolute level carries no information, so the reads are the slope and the position against the signal EMA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showSignal', 'Signal EMA', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], 'Plots the long EMA of PVI that anchors the classic regime read. Hiding it keeps the regime coloring and fill, which are always measured against it.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(255, 'signalLength', 'Signal Length', 5000, 'Length of the signal EMA. The classic reference is a one-year average — 255 trading days on daily charts.'),
        ...regimeStyleInputs('Signal Line')
    ],
    compute: (bars, inputs)=>{
        const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'source', 'Close'));
        const values = volumeIndex(bars, src, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'base', 1000), (v, pv)=>v > pv);
        const signal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 255));
        return regimeIndex('pvi', 'PVI', values, signal, {
            bull: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]),
            bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
            neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'neutralColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]),
            signal: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"])
        }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showSignal', true), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true));
    }
};
const pvt = {
    type: 'price-volume-trend',
    title: 'Price Volume Trend',
    shortTitle: 'PVT',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showSignal', 'Signal Line', false, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], 'Display a moving average of PVT acting as a signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('signalType', 'Signal Type', 'SMA', [
            'SMA',
            'EMA'
        ], 'Moving average type used for the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(21, 'signalLength', 'Signal Length', 5000, 'Number of bars used to compute the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 'PVT Color', 'color', 'Color of the PVT line while it is flat.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Rising', 'bullColor', 'Color of the PVT line while it rises bar to bar.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Falling', 'bearColor', 'Color of the PVT line while it falls bar to bar.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal Color', 'signalColor', 'Color of the signal line.')
    ],
    compute: (bars, inputs)=>{
        const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closes"])(bars);
        const raw = bars.map((b, i)=>{
            if (i === 0 || b.volume == null || !Number.isFinite(b.volume)) return Number.NaN;
            const pc = c[i - 1];
            return pc === 0 ? 0 : (c[i] - pc) / pc * b.volume;
        });
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cumSum"])(raw);
        const flat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]);
        const plots = [
            {
                key: 'pvt',
                title: 'PVT',
                values,
                color: flat,
                width: 2,
                colors: slopeColors(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bullColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]), flat)
            }
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showSignal', false)) {
            const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 21);
            const signal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalType', 'SMA') === 'EMA' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(values, len) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(values, len);
            plots.push({
                key: 'signal',
                title: 'Signal',
                values: signal,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
            });
        }
        return {
            plots
        };
    }
};
const volumeOscillator = {
    type: 'volume-oscillator',
    title: 'Volume Oscillator',
    shortTitle: 'Vol Osc',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(5, 'fastLength', 'Fast Length', 5000, 'Length of the fast EMA of volume.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(10, 'slowLength', 'Slow Length', 5000, 'Length of the slow EMA of volume.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Above Zero', 'color', 'Color of the line and fill while it holds above zero — volume expanding.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Below Zero', 'bearColor', 'Color of the line and fill while it holds below zero — volume contracting.')
    ],
    compute: (bars, inputs)=>{
        const vol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars);
        const fast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(vol, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'fastLength', 5));
        const slow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(vol, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'slowLength', 10));
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(fast, slow, (f, s)=>s === 0 ? 0 : 100 * (f - s) / s);
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'vo',
            title: 'Volume Oscillator',
            values,
            ink: {
                bull,
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: bull
            },
            zeroInk: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
            valueTransparency: 60
        });
    }
};
const OSCILLATOR = 'Oscillator';
const pvo = {
    type: 'pvo',
    title: 'Percentage Volume Oscillator',
    shortTitle: 'PVO',
    overlay: false,
    inputs: [
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(12, 'fastLength', 'Fast Length', 5000, 'Period of the fast EMA of volume. The conventional setting is 12.'),
            group: OSCILLATOR
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(26, 'slowLength', 'Slow Length', 5000, 'Period of the slow EMA of volume. The PVO expresses the fast/slow spread as a percentage of this slow average.'),
            group: OSCILLATOR
        },
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(9, 'signalLength', 'Signal Length', 500, 'Period of the EMA applied to the PVO to form the signal line.'),
            group: OSCILLATOR
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Expansion Color', 'color', 'Color of the oscillator and fill while participation expands.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Contraction Color', 'bearColor', 'Color of the oscillator and fill while participation contracts.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal Line', 'signalColor', 'Color of the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 50), 'Zero Line', 'zeroColor', 'Color of the zero reference line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showSignal', 'Show Signal Line', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Plot the signal line, an EMA of the PVO.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showHistogram', 'Show Histogram', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Plot the difference between the PVO and its signal line as columns behind the oscillator.')
    ],
    compute: (bars, inputs)=>{
        const vol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars);
        const fast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(vol, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'fastLength', 12));
        const slow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(vol, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'slowLength', 26));
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])(fast, slow, (f, s)=>s > 0 ? 100 * (f - s) / s : Number.NaN);
        const signal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 9));
        const expansion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const contraction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        const extraPlots = [];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showHistogram', true)) {
            const hist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])(values, signal);
            extraPlots.push({
                key: 'hist',
                title: 'Histogram',
                values: hist,
                kind: 'columns',
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(expansion, 60),
                colors: hist.map((x)=>Number.isFinite(x) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(x > 0 ? expansion : contraction, 60) : null),
                base: 0
            });
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showSignal', true)) extraPlots.push({
            key: 'signal',
            title: 'Signal',
            values: signal,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'pvo',
            title: 'PVO',
            values,
            ink: {
                bull: expansion,
                bear: contraction,
                neutral: contraction
            },
            zeroInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'zeroColor', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 50)),
            extraPlots
        });
    }
};
const vfi = {
    type: 'volume-flow-indicator',
    title: 'Volume Flow Indicator',
    shortTitle: 'Volume Flow Indicator',
    overlay: false,
    inputs: [
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(130, 'length', 'Length', 5000, 'Rolling summation window, also used for the average volume that scales the result. The published default of 130 bars targets position-horizon work on daily charts.'),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('coef', 'Cutoff Coefficient', 0.2, 0, 10, 0.05, "Scales the volatility-based minimum change in typical price. Moves smaller than the cutoff count as noise and contribute no volume."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatInput"])('volCoef', 'Volume Cap Multiplier', 2.5, 0.1, 50, 0.1, "Caps each bar's volume contribution at this multiple of the average volume, so a single climactic print stays bounded."),
        {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(30, 'volLength', 'Volatility Length', 5000, 'Window of the standard deviation of the log change in typical price used to build the adaptive cutoff.'),
            min: 2
        },
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('smooth', 'Smooth VFI', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], 'Applies the published light smoothing — an EMA of the summed line — before plotting.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(3, 'smoothLength', 'Smoothing Length', 500, 'Length of the smoothing EMA. The published version uses 3 bars.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('showSignal', 'Signal Line', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS"], 'Plots an EMA of VFI as a signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(5, 'signalLength', 'Signal Length', 500, 'Length of the signal-line EMA.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'color', 'Color of the VFI line and gradient fill above the zero line — the net accumulation regime.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of the VFI line and gradient fill below the zero line — the net distribution regime.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"], 'Signal Line', 'signalColor', 'Color of the signal line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Fills the area between the zero line and the VFI line with a vertical gradient.')
    ],
    compute: (bars, inputs)=>{
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 130);
        const typical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceValues"])(bars, 'HLC3');
        const logChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sub"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(typical, Math.log), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(typical, Math.log), 1));
        const volatility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stdev"])(logChange, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'volLength', 30));
        const coef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'coef', 0.2);
        const volCoef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'volCoef', 2.5);
        const vol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars);
        // The cap reads the PREVIOUS bar's average, so the current bar never scales itself.
        const avgVolume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sma"])(vol, len), 1);
        const typicalChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["change"])(typical);
        const signed = bars.map((b, i)=>{
            const sd = volatility[i];
            const m = typicalChange[i];
            const v = vol[i];
            if (!Number.isFinite(sd) || !Number.isFinite(m) || !Number.isFinite(v)) return Number.NaN;
            const cutoff = coef * sd * b.close;
            const avg = avgVolume[i];
            const capped = Number.isFinite(avg) ? Math.min(v, avg * volCoef) : v;
            return m > cutoff ? capped : m < -cutoff ? -capped : 0;
        });
        const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(signed, len), avgVolume, (f, a)=>a > 0 ? f / a : Number.NaN);
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'smooth', true) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(raw, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'smoothLength', 3)) : raw;
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const extraPlots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'showSignal', true) ? [
            {
                key: 'signal',
                title: 'Signal Line',
                values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(values, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'signalLength', 5)),
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'signalColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"])
            }
        ] : [];
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'vfi',
            title: 'VFI',
            values,
            ink: {
                bull,
                bear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]),
                neutral: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"])
            },
            zeroInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90),
            fill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true),
            extraPlots
        });
    }
};
const II_OSCILLATOR = 'Normalized Oscillator (II%)';
const II_CUMULATIVE = 'Cumulative Line';
const intradayIntensity = {
    type: 'intraday-intensity',
    title: 'Intraday Intensity',
    shortTitle: 'Intraday Intensity',
    overlay: false,
    inputs: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optionInput"])('mode', 'Display', II_OSCILLATOR, [
            II_OSCILLATOR,
            II_CUMULATIVE
        ], "The two published forms. The cumulative line is open-ended and read by slope against price; the normalized oscillator divides a rolling sum of intensity by the rolling sum of volume and oscillates around zero."),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lengthInput"])(21, 'length', 'Oscillator Length', 5000, 'Window of the rolling sums in the normalized form. The common setting is 21 bars. It has no effect on the cumulative line.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"], 'Bullish', 'color', 'Color of positive readings, the rising cumulative line and the fill above zero — the accumulation side.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorInput"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"], 'Bearish', 'bearColor', 'Color of negative readings, the falling cumulative line and the fill below zero — the distribution side.'),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolInput"])('gradientFill', 'Gradient Fill', true, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE"], 'Fills the area between the zero line and the oscillator with a vertical gradient. Applies to the normalized oscillator only.')
    ],
    compute: (bars, inputs)=>{
        const intensity = moneyFlowVolume(bars);
        const bull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'color', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]);
        const bear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'bearColor', __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"])(inputs, 'mode', II_OSCILLATOR) === II_CUMULATIVE) {
            // The open-ended line is read by slope, so it carries no zero line and no wash.
            const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cumSum"])(intensity);
            return {
                plots: [
                    {
                        key: 'ii',
                        title: 'Intraday Intensity',
                        values,
                        color: bull,
                        colors: slopeColors(values, bull, bear, bull)
                    }
                ]
            };
        }
        const len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["num"])(inputs, 'length', 21);
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zip"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])(intensity, len), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sum"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$math$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["volumes"])(bars), len), (m, v)=>v > 0 ? 100 * m / v : Number.NaN);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["centeredOscillator"])({
            key: 'ii',
            title: 'Intraday Intensity',
            values,
            ink: {
                bull,
                bear,
                neutral: bear
            },
            zeroInk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transp"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"], 90),
            fill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$define$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"])(inputs, 'gradientFill', true)
        });
    }
};
const volumeSpecs = [
    obv,
    accDist,
    cmf,
    chaikinOscillator,
    eom,
    forceIndex,
    klinger,
    mfi,
    nvi,
    pvi,
    pvt,
    volumeOscillator,
    pvo,
    vfi,
    intradayIntensity
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/NativeIndicator.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/volume/VolumeIndicator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerVolume",
    ()=>registerVolume,
    "volumeDescriptor",
    ()=>volumeDescriptor,
    "volumeLayerData",
    ()=>volumeLayerData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/NativeIndicator.ts [app-client] (ecmascript)");
;
const DEFAULT_UP = '#3a403c'; // volume-up: quiet muted surface
const DEFAULT_DOWN = '#3d2f34'; // volume-down: quiet muted surface
const DEFAULT_HEIGHT_PCT = 20;
function num(v, fallback) {
    return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
function str(v, fallback) {
    return typeof v === 'string' && v !== '' ? v : fallback;
}
function volumeLayerData(inputs) {
    return {
        upColor: str(inputs.upColor, DEFAULT_UP),
        downColor: str(inputs.downColor, DEFAULT_DOWN),
        heightFrac: Math.min(0.5, Math.max(0.05, num(inputs.heightPct, DEFAULT_HEIGHT_PCT) / 100))
    };
}
/**
 * The built-in VOLUME indicator: per-bar volume columns anchored to the BOTTOM of the
 * price pane, colored by bar direction. The columns use their OWN scale (the tallest
 * visible bar spans `heightPct` of the pane) so volume units never touch the price
 * autoscale — which is why this is a bespoke renderer layer, not a model series. All
 * geometry lives in the renderer's volume layer (it reads the chart's bars each frame);
 * this instance only carries lifecycle + settings.
 */ class VolumeIndicator {
    /** Null until start() — pre-start setInputs/resume must record without pushing. */ ctx = null;
    inputs = {};
    start(ctx, inputs) {
        this.ctx = ctx;
        this.inputs = inputs;
        ctx.emit({}); // mount the legend row (the layer draws outside the model)
        ctx.pushData(volumeLayerData(inputs));
    }
    /** The layer reads the live bar array directly — nothing to recompute here. */ onBars() {}
    /** Visible-range normalization happens per frame in the layer. */ onViewport() {}
    setInputs(inputs) {
        this.inputs = inputs;
        // Pre-start edits (a workspace restore applies stored inputs the moment the
        // handle exists) just record: start() pushes the orchestrator's replayed values.
        this.ctx?.pushData(volumeLayerData(inputs));
    }
    /** Hiding is a renderer-layer flag (set via `setIndicatorVisible`); no resources to free. */ suspend() {}
    resume() {
        // Pre-start resume (a restore un-hiding an indicator that never started) is a
        // no-op — start() pushes when the context lands.
        this.ctx?.pushData(volumeLayerData(this.inputs));
    }
    stop() {}
}
const volumeDescriptor = {
    type: 'volume',
    title: 'Volume',
    paneHint: 'price',
    overlay: true,
    inputsSchema: ()=>[
            {
                key: 'upColor',
                title: 'Up color',
                type: 'color',
                defval: DEFAULT_UP
            },
            {
                key: 'downColor',
                title: 'Down color',
                type: 'color',
                defval: DEFAULT_DOWN
            },
            {
                key: 'heightPct',
                title: 'Height %',
                type: 'int',
                defval: DEFAULT_HEIGHT_PCT,
                min: 5,
                max: 50,
                step: 1,
                tooltip: 'Pane height the tallest visible bar occupies'
            }
        ],
    defaultInputs: ()=>({
            upColor: DEFAULT_UP,
            downColor: DEFAULT_DOWN,
            heightPct: DEFAULT_HEIGHT_PCT
        }),
    create: ()=>new VolumeIndicator()
};
function registerVolume() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerNativeIndicator"])(volumeDescriptor);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/volume/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$volume$2f$VolumeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/volume/VolumeIndicator.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/vpvr/VpvrIndicator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerVpvr",
    ()=>registerVpvr,
    "vpvrDescriptor",
    ()=>vpvrDescriptor,
    "vpvrLayerData",
    ()=>vpvrLayerData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/NativeIndicator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
;
const DEFAULT_ROWS = 24;
const DEFAULT_WIDTH_PCT = 30;
const DEFAULT_UP = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT"];
const DEFAULT_DOWN = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"];
const DEFAULT_VALUE_AREA_PCT = 70;
function num(v, fallback) {
    return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
function str(v, fallback) {
    return typeof v === 'string' && v !== '' ? v : fallback;
}
function vpvrLayerData(inputs) {
    return {
        rows: Math.round(Math.min(400, Math.max(2, num(inputs.rows, DEFAULT_ROWS)))),
        widthFrac: Math.min(0.9, Math.max(0.05, num(inputs.widthPct, DEFAULT_WIDTH_PCT) / 100)),
        upColor: str(inputs.upColor, DEFAULT_UP),
        downColor: str(inputs.downColor, DEFAULT_DOWN),
        showPoc: inputs.showPoc !== false,
        valueAreaFrac: Math.min(1, Math.max(0, num(inputs.valueAreaPct, DEFAULT_VALUE_AREA_PCT) / 100))
    };
}
/**
 * The built-in VPVR (visible-range volume profile) indicator: horizontal volume-by-price
 * rows anchored to the RIGHT edge of the price pane, aggregating every visible bar. Row
 * y-positions are real prices (the shared price scale); row WIDTHS are screen fractions
 * (the profile's own horizontal scale) — so the profile never touches the price
 * autoscale, which is why it's a bespoke renderer layer rather than model series. The
 * layer re-buckets per frame from the chart's bars (memoized on the visible range), so
 * the profile tracks pan/zoom without any orchestrator round-trip; this instance only
 * carries lifecycle + settings.
 */ class VpvrIndicator {
    /** Null until start() — pre-start setInputs/resume must record without pushing. */ ctx = null;
    inputs = {};
    start(ctx, inputs) {
        this.ctx = ctx;
        this.inputs = inputs;
        ctx.emit({}); // mount the legend row (the layer draws outside the model)
        ctx.pushData(vpvrLayerData(inputs));
    }
    /** The layer reads the live bar array directly — nothing to recompute here. */ onBars() {}
    /** The layer re-buckets from the visible range per frame — no poke needed. */ onViewport() {}
    setInputs(inputs) {
        this.inputs = inputs;
        // Pre-start edits (a workspace restore applies stored inputs the moment the
        // handle exists) just record: start() pushes the orchestrator's replayed values.
        this.ctx?.pushData(vpvrLayerData(inputs));
    }
    /** Hiding is a renderer-layer flag (set via `setIndicatorVisible`); no resources to free. */ suspend() {}
    resume() {
        // Pre-start resume (a restore un-hiding an indicator that never started) is a
        // no-op — start() pushes when the context lands.
        this.ctx?.pushData(vpvrLayerData(this.inputs));
    }
    stop() {}
}
const vpvrDescriptor = {
    type: 'vpvr',
    title: 'Visible Range Volume Profile',
    shortTitle: 'VRVP',
    paneHint: 'price',
    overlay: true,
    inputsSchema: ()=>[
            {
                key: 'rows',
                title: 'Rows',
                type: 'int',
                defval: DEFAULT_ROWS,
                min: 2,
                max: 400,
                step: 1
            },
            {
                key: 'widthPct',
                title: 'Width %',
                type: 'int',
                defval: DEFAULT_WIDTH_PCT,
                min: 5,
                max: 90,
                step: 1,
                tooltip: 'Pane width the largest row occupies'
            },
            {
                key: 'upColor',
                title: 'Up color',
                type: 'color',
                defval: DEFAULT_UP
            },
            {
                key: 'downColor',
                title: 'Down color',
                type: 'color',
                defval: DEFAULT_DOWN
            },
            {
                key: 'showPoc',
                title: 'Point of control',
                type: 'bool',
                defval: true
            },
            {
                key: 'valueAreaPct',
                title: 'Value area %',
                type: 'int',
                defval: DEFAULT_VALUE_AREA_PCT,
                min: 0,
                max: 100,
                step: 1
            }
        ],
    defaultInputs: ()=>({
            rows: DEFAULT_ROWS,
            widthPct: DEFAULT_WIDTH_PCT,
            upColor: DEFAULT_UP,
            downColor: DEFAULT_DOWN,
            showPoc: true,
            valueAreaPct: DEFAULT_VALUE_AREA_PCT
        }),
    create: ()=>new VpvrIndicator()
};
function registerVpvr() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerNativeIndicator"])(vpvrDescriptor);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/native-indicators/vpvr/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$vpvr$2f$VpvrIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/vpvr/VpvrIndicator.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_charting_core_native-indicators_1idlwt6._.js.map