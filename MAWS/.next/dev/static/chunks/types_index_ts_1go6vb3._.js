(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/types/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_CHART_SETTINGS",
    ()=>DEFAULT_CHART_SETTINGS,
    "DEFAULT_INDICATOR_SETTINGS",
    ()=>DEFAULT_INDICATOR_SETTINGS,
    "DEFAULT_LAYOUT_SYNC",
    ()=>DEFAULT_LAYOUT_SYNC,
    "DEFAULT_OBJECT_VISIBILITY",
    ()=>DEFAULT_OBJECT_VISIBILITY,
    "DEFAULT_PAPER_ACCOUNT",
    ()=>DEFAULT_PAPER_ACCOUNT,
    "DEFAULT_SYMBOL_TRADING",
    ()=>DEFAULT_SYMBOL_TRADING,
    "normalizeBbSettings",
    ()=>normalizeBbSettings,
    "normalizeEmaSettings",
    ()=>normalizeEmaSettings,
    "normalizeStochSettings",
    ()=>normalizeStochSettings,
    "normalizeVwapSettings",
    ()=>normalizeVwapSettings
]);
const DEFAULT_OBJECT_VISIBILITY = {
    ticks: true,
    seconds: {
        enabled: true,
        min: 1,
        max: 59
    },
    minutes: {
        enabled: true,
        min: 1,
        max: 59
    },
    hours: {
        enabled: true,
        min: 1,
        max: 24
    },
    days: {
        enabled: true,
        min: 1,
        max: 366
    },
    weeks: {
        enabled: true,
        min: 1,
        max: 52
    },
    months: {
        enabled: true,
        min: 1,
        max: 12
    },
    ranges: true
};
const DEFAULT_CHART_SETTINGS = {
    candleStyle: "solid",
    colorBasedOnPrevClose: false,
    bodyVisible: true,
    borderVisible: true,
    wickVisible: true,
    bodyUpColor: "#b2b5be",
    bodyDownColor: "#787b86",
    borderUpColor: "#b2b5be",
    borderDownColor: "#787b86",
    wickUpColor: "#b2b5be",
    wickDownColor: "#787b86",
    pricePrecision: "default",
    timezone: "Africa/Casablanca",
    showLogo: true,
    showTitle: false,
    titleMode: "symbol",
    showMarketStatus: true,
    showChartValues: true,
    showBarChange: true,
    showVolume: true,
    showLastDayChange: false,
    showIndicatorLegend: true,
    showIndicatorInputs: false,
    showIndicatorValues: false,
    showIndicatorBackground: true,
    indicatorBackgroundOpacity: 100,
    currencyUnit: "never",
    scaleModes: "always",
    lockPriceRatio: false,
    invertScale: false,
    priceScaleMode: "normal",
    scalesPlacement: "right",
    noOverlappingLabels: true,
    showPlusButton: true,
    countdownToBarClose: false,
    lastPriceDisplay: "value_line",
    prevDayClose: "hidden",
    highLowDisplay: "hidden",
    bidAskDisplay: "hidden",
    dayOfWeekOnLabels: false,
    dateFormat: "MMM dd, yyyy",
    timeHoursFormat: "12",
    backgroundColor: "#000000",
    grid: true,
    vertGrid: false,
    horzGridColor: "#141414",
    vertGridColor: "#141414",
    paneSeparatorColor: "#222222",
    crosshairColor: "#758696",
    crosshairStyle: "dashed",
    watermark: true,
    watermarkColor: "rgba(209, 212, 220, 0.07)",
    scaleTextColor: "#d1d4dc",
    scaleFontSize: 12,
    scaleLineColor: "#222222",
    navigationButtons: "hover",
    paneButtons: "never",
    marginTop: 6,
    marginBottom: 16,
    marginRightBars: 6,
    logScale: false,
    showBuySell: true,
    oneClickTrading: false,
    executionSound: false,
    executionSoundVolume: 70,
    executionSoundName: "alarm",
    showOnlyRejectionNotifications: false,
    showLegend: true,
    showAlertLines: true,
    showOrderLines: true,
    showPositionLines: true,
    showTpSlLines: true,
    showLiqLines: true,
    reversePositionButton: true,
    projectMarketOrders: true,
    showPnlValue: true,
    pnlPositionsFormat: "pct",
    pnlBracketsFormat: "pct",
    executionMarks: true,
    executionLabels: false,
    extendedPriceLines: true,
    orderAlignment: "right",
    includeTradesInSnapshots: true,
    alertLineColor: "#ff9800",
    buyLineColor: "#089981",
    sellLineColor: "#f23645",
    tpLineColor: "#26a69a",
    slLineColor: "#ef5350",
    liqLineColor: "#ff6d00",
    defaultQty: 0.01,
    defaultLeverage: 10,
    showIdeas: false,
    ideasFilter: "all",
    sessionBreaks: true,
    sessionBreakColor: "#787b86",
    sessionBreakLineStyle: "dashed",
    sessionBreakLineWidth: 1,
    economicEvents: true,
    onlyFutureEvents: true,
    eventsBreaks: false,
    eventsBreakColor: "#f23645",
    latestNews: true,
    newsNotification: true
};
const DEFAULT_LINE = (color, extras = {})=>({
        color,
        opacity: 100,
        lineWidth: 1,
        lineStyle: "solid",
        ...extras
    });
_c = DEFAULT_LINE;
const DEFAULT_INDICATOR_SETTINGS = {
    vwap: {
        hideOn1DOrAbove: false,
        anchorPeriod: "session",
        source: "hlc3",
        offset: 0,
        visible: true,
        color: "#2962ff",
        opacity: 100,
        lineWidth: 1,
        lineStyle: "solid",
        precision: "default",
        showScaleValues: true,
        showStatusValues: true,
        showStatusInputs: true,
        timeframe: "chart",
        waitForTimeframeCloses: true,
        visibility: {
            ...DEFAULT_OBJECT_VISIBILITY
        }
    },
    ema: {
        period: 9,
        source: "close",
        offset: 0,
        smoothingType: "none",
        smoothingLength: 14,
        bbStdDev: 2,
        visible: true,
        color: "#2962ff",
        opacity: 100,
        lineWidth: 1,
        lineStyle: "solid",
        precision: "default",
        showScaleValues: true,
        showStatusValues: true,
        showStatusInputs: true,
        timeframe: "chart",
        waitForTimeframeCloses: true,
        visibility: {
            ...DEFAULT_OBJECT_VISIBILITY
        }
    },
    bb: {
        period: 20,
        maType: "sma",
        source: "close",
        mult: 2,
        offset: 0,
        basis: DEFAULT_LINE("#2962ff"),
        upper: DEFAULT_LINE("#f23645"),
        lower: DEFAULT_LINE("#089981"),
        basisVisible: true,
        upperVisible: true,
        lowerVisible: true,
        backgroundVisible: false,
        backgroundColor: "#2962ff",
        backgroundOpacity: 10,
        precision: "default",
        showScaleValues: true,
        showStatusValues: true,
        showStatusInputs: true,
        timeframe: "chart",
        waitForTimeframeCloses: true,
        visibility: {
            ...DEFAULT_OBJECT_VISIBILITY
        }
    },
    rsi: {
        period: 14,
        color: "#ab47bc",
        opacity: 100,
        lineWidth: 1,
        lineStyle: "solid",
        upperLevel: 70,
        lowerLevel: 30,
        visibility: {
            ...DEFAULT_OBJECT_VISIBILITY
        }
    },
    stoch: {
        length: 14,
        kSmoothing: 1,
        dSmoothing: 3,
        k: DEFAULT_LINE("#2962ff"),
        d: DEFAULT_LINE("#ff9800"),
        kVisible: true,
        dVisible: true,
        upper: {
            visible: true,
            level: 80,
            ...DEFAULT_LINE("#787b86", {
                lineStyle: "dashed"
            })
        },
        middle: {
            visible: true,
            level: 50,
            ...DEFAULT_LINE("#4c525e", {
                opacity: 70,
                lineStyle: "dashed"
            })
        },
        lower: {
            visible: true,
            level: 20,
            ...DEFAULT_LINE("#787b86", {
                lineStyle: "dashed"
            })
        },
        backgroundVisible: true,
        backgroundColor: "#787b86",
        backgroundOpacity: 10,
        precision: "default",
        showScaleValues: true,
        showStatusValues: true,
        showStatusInputs: true,
        visibility: {
            ...DEFAULT_OBJECT_VISIBILITY
        }
    },
    atr: {
        period: 14,
        color: "#ffa726",
        opacity: 100,
        lineWidth: 1,
        lineStyle: "solid",
        visibility: {
            ...DEFAULT_OBJECT_VISIBILITY
        }
    },
    adx: {
        period: 14,
        color: "#26a69a",
        opacity: 100,
        lineWidth: 1,
        lineStyle: "solid",
        showScaleValues: true,
        visibility: {
            ...DEFAULT_OBJECT_VISIBILITY
        }
    }
};
function normalizeVwapSettings(raw) {
    const base = DEFAULT_INDICATOR_SETTINGS.vwap;
    return {
        ...base,
        ...raw,
        hideOn1DOrAbove: raw?.hideOn1DOrAbove ?? base.hideOn1DOrAbove,
        anchorPeriod: raw?.anchorPeriod ?? base.anchorPeriod,
        source: raw?.source ?? base.source,
        offset: raw?.offset ?? base.offset,
        visible: raw?.visible ?? base.visible,
        color: raw?.color ?? base.color,
        opacity: raw?.opacity ?? base.opacity,
        lineWidth: raw?.lineWidth ?? base.lineWidth,
        lineStyle: raw?.lineStyle ?? base.lineStyle,
        precision: raw?.precision ?? base.precision,
        showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
        showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
        showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
        timeframe: "chart",
        waitForTimeframeCloses: raw?.waitForTimeframeCloses ?? base.waitForTimeframeCloses,
        visibility: {
            ...base.visibility,
            ...raw?.visibility
        }
    };
}
function normalizeEmaSettings(raw) {
    const base = DEFAULT_INDICATOR_SETTINGS.ema;
    const legacy = raw?.lines?.[0];
    const rest = {
        ...raw ?? {}
    };
    delete rest.lines;
    return {
        ...base,
        ...rest,
        period: raw?.period ?? legacy?.period ?? base.period,
        source: raw?.source ?? base.source,
        offset: raw?.offset ?? base.offset,
        smoothingType: raw?.smoothingType ?? base.smoothingType,
        smoothingLength: raw?.smoothingLength ?? base.smoothingLength,
        bbStdDev: raw?.bbStdDev ?? base.bbStdDev,
        visible: raw?.visible ?? true,
        color: raw?.color ?? legacy?.color ?? base.color,
        opacity: raw?.opacity ?? legacy?.opacity ?? base.opacity,
        lineWidth: raw?.lineWidth ?? legacy?.lineWidth ?? base.lineWidth,
        lineStyle: raw?.lineStyle ?? legacy?.lineStyle ?? base.lineStyle,
        precision: raw?.precision ?? base.precision,
        showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
        showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
        showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
        timeframe: "chart",
        waitForTimeframeCloses: raw?.waitForTimeframeCloses ?? base.waitForTimeframeCloses,
        visibility: {
            ...base.visibility,
            ...raw?.visibility
        }
    };
}
function normalizeBbSettings(raw) {
    const base = DEFAULT_INDICATOR_SETTINGS.bb;
    return {
        ...base,
        ...raw,
        period: raw?.period ?? base.period,
        maType: raw?.maType ?? base.maType,
        source: raw?.source ?? base.source,
        mult: raw?.mult ?? base.mult,
        offset: raw?.offset ?? base.offset,
        basis: {
            ...base.basis,
            ...raw?.basis
        },
        upper: {
            ...base.upper,
            ...raw?.upper
        },
        lower: {
            ...base.lower,
            ...raw?.lower
        },
        basisVisible: raw?.basisVisible ?? base.basisVisible,
        upperVisible: raw?.upperVisible ?? base.upperVisible,
        lowerVisible: raw?.lowerVisible ?? base.lowerVisible,
        backgroundVisible: raw?.backgroundVisible ?? base.backgroundVisible,
        backgroundColor: raw?.backgroundColor ?? base.backgroundColor,
        backgroundOpacity: raw?.backgroundOpacity ?? base.backgroundOpacity,
        precision: raw?.precision ?? base.precision,
        showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
        showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
        showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
        timeframe: "chart",
        waitForTimeframeCloses: raw?.waitForTimeframeCloses ?? base.waitForTimeframeCloses,
        visibility: {
            ...base.visibility,
            ...raw?.visibility
        }
    };
}
function normalizeStochSettings(raw) {
    const base = DEFAULT_INDICATOR_SETTINGS.stoch;
    const legacy = raw?.oscillators?.[0];
    const legacyUpper = raw?.upperLevel;
    const legacyLower = raw?.lowerLevel;
    const rest = {
        ...raw ?? {}
    };
    delete rest.oscillators;
    delete rest.upperLevel;
    delete rest.lowerLevel;
    const mergeBand = (fallback, band, legacyLevel)=>({
            ...fallback,
            ...band,
            level: band?.level ?? legacyLevel ?? fallback.level,
            visible: band?.visible ?? fallback.visible,
            color: band?.color ?? fallback.color,
            opacity: band?.opacity ?? fallback.opacity,
            lineWidth: band?.lineWidth ?? fallback.lineWidth,
            lineStyle: band?.lineStyle ?? fallback.lineStyle
        });
    return {
        ...base,
        ...rest,
        length: raw?.length ?? legacy?.length ?? base.length,
        kSmoothing: raw?.kSmoothing ?? legacy?.kSmoothing ?? base.kSmoothing,
        dSmoothing: raw?.dSmoothing ?? legacy?.dSmoothing ?? base.dSmoothing,
        k: {
            ...base.k,
            ...legacy?.k,
            ...raw?.k
        },
        d: {
            ...base.d,
            ...legacy?.d,
            ...raw?.d
        },
        kVisible: raw?.kVisible ?? true,
        dVisible: raw?.dVisible ?? true,
        upper: mergeBand(base.upper, raw?.upper, legacyUpper),
        middle: mergeBand(base.middle, raw?.middle),
        lower: mergeBand(base.lower, raw?.lower, legacyLower),
        backgroundVisible: raw?.backgroundVisible ?? base.backgroundVisible,
        backgroundColor: raw?.backgroundColor ?? base.backgroundColor,
        backgroundOpacity: raw?.backgroundOpacity ?? base.backgroundOpacity,
        precision: raw?.precision ?? base.precision,
        showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
        showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
        showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
        visibility: {
            ...base.visibility,
            ...raw?.visibility
        }
    };
}
const DEFAULT_LAYOUT_SYNC = {
    symbol: false,
    interval: false,
    crosshair: true,
    time: false,
    dateRange: false
};
const DEFAULT_PAPER_ACCOUNT = {
    marginControl: true,
    leverage: {
        stocks: 2,
        futures: 20,
        crypto: 25,
        others: 25
    },
    futuresCommissionOn: false,
    commissionPerContract: 0.01,
    othersCommissionOn: false,
    othersCommission: 0.0001,
    othersCommissionType: "fixed"
};
const DEFAULT_SYMBOL_TRADING = {
    margin: 100,
    leverage: 10,
    sizingMode: "fixed",
    marginPercent: 1,
    defaultOrderType: "market",
    attachBrackets: true,
    tpPercent: 2,
    slPercent: 1,
    confirmOrders: false
};
var _c;
__turbopack_context__.k.register(_c, "DEFAULT_LINE");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=types_index_ts_1go6vb3._.js.map