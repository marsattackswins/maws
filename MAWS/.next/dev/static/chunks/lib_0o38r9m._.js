(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/app-theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_APP_SETTINGS",
    ()=>DEFAULT_APP_SETTINGS,
    "appSettingsFromVelaTheme",
    ()=>appSettingsFromVelaTheme,
    "applyAppTheme",
    ()=>applyAppTheme,
    "applyVelaThemeEverywhere",
    ()=>applyVelaThemeEverywhere,
    "migrateLegacyAppSettings",
    ()=>migrateLegacyAppSettings,
    "normalizeAppSettings",
    ()=>normalizeAppSettings,
    "velaThemeNameFromAppSettings",
    ()=>velaThemeNameFromAppSettings
]);
/** Chrome colors for shell UI (everything except the chart canvas). */ var __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$CHKUH7RH$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vela/dist/chunk-CHKUH7RH.js [app-client] (ecmascript)");
;
const DEFAULT_APP_SETTINGS = {
    backgroundColor: "#000000",
    panelColor: "#111111",
    elevatedColor: "#1a1a1a",
    borderColor: "#222222",
    barColor: "#171b26",
    hoverColor: "#1a1a1a",
    textColor: "#d1d4dc",
    mutedColor: "#787b86"
};
const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
function colorOr(fallback, value) {
    if (typeof value === "string" && HEX.test(value.trim())) return value.trim();
    return fallback;
}
function normalizeAppSettings(raw) {
    const base = DEFAULT_APP_SETTINGS;
    return {
        backgroundColor: colorOr(base.backgroundColor, raw?.backgroundColor),
        panelColor: colorOr(base.panelColor, raw?.panelColor),
        elevatedColor: colorOr(base.elevatedColor, raw?.elevatedColor),
        borderColor: colorOr(base.borderColor, raw?.borderColor),
        barColor: colorOr(base.barColor, raw?.barColor),
        hoverColor: colorOr(base.hoverColor, raw?.hoverColor),
        textColor: colorOr(base.textColor, raw?.textColor),
        mutedColor: colorOr(base.mutedColor, raw?.mutedColor)
    };
}
function applyAppTheme(settings) {
    if (typeof document === "undefined") return;
    const s = normalizeAppSettings(settings);
    const root = document.documentElement;
    root.style.setProperty("--app-bg", s.backgroundColor);
    root.style.setProperty("--app-panel", s.panelColor);
    root.style.setProperty("--app-elevated", s.elevatedColor);
    root.style.setProperty("--app-border", s.borderColor);
    root.style.setProperty("--app-bar", s.barColor);
    root.style.setProperty("--app-hover", s.hoverColor);
    root.style.setProperty("--app-text", s.textColor);
    root.style.setProperty("--app-muted", s.mutedColor);
    // Alias used by some shell widgets
    root.style.setProperty("--maws-bg", s.backgroundColor);
    root.style.setProperty("--maws-panel", s.panelColor);
    root.style.setProperty("--maws-elevated", s.elevatedColor);
    root.style.setProperty("--maws-border", s.borderColor);
    root.style.setProperty("--maws-bar", s.barColor);
    root.style.setProperty("--maws-hover", s.hoverColor);
    root.style.setProperty("--maws-text", s.textColor);
    root.style.setProperty("--maws-muted", s.mutedColor);
    // Keep legacy TV tokens in sync for anything still referencing them.
    root.style.setProperty("--color-tv-bg", s.backgroundColor);
    root.style.setProperty("--color-tv-panel", s.panelColor);
    root.style.setProperty("--color-tv-settings", s.elevatedColor);
    root.style.setProperty("--color-tv-settings-input", s.elevatedColor);
    root.style.setProperty("--color-tv-border", s.borderColor);
    root.style.setProperty("--color-tv-text", s.textColor);
    root.style.setProperty("--color-tv-muted", s.mutedColor);
}
function appSettingsFromVelaTheme(themeName) {
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$CHKUH7RH$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveTheme"])(themeName);
    return {
        backgroundColor: t.background,
        panelColor: t.bgPanel ?? t.background,
        elevatedColor: t.bgCard ?? t.background,
        borderColor: t.border ?? t.borderColor,
        barColor: t.bgBar ?? t.bgPanel ?? t.background,
        hoverColor: t.bgHover ?? t.bgChip ?? t.border ?? t.borderColor,
        textColor: t.textPrimary ?? t.textColor,
        mutedColor: t.textSecondary ?? t.textColor
    };
}
function velaThemeNameFromAppSettings(settings) {
    const bg = settings.backgroundColor.trim().toLowerCase();
    if (bg === __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$CHKUH7RH$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIGHT_THEME"].background.toLowerCase()) return "light";
    if (bg === (0, __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$CHKUH7RH$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveTheme"])("classic").background.toLowerCase()) return "classic";
    return "dark";
}
function migrateLegacyAppSettings(settings) {
    const legacy = DEFAULT_APP_SETTINGS;
    const isLegacy = Object.keys(legacy).every((k)=>settings[k]?.toLowerCase() === legacy[k].toLowerCase());
    return isLegacy ? appSettingsFromVelaTheme("dark") : settings;
}
function applyVelaThemeEverywhere(themeName) {
    const next = appSettingsFromVelaTheme(themeName);
    applyAppTheme(next); // shell chrome (all panels, modals, top bar)
    return next;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/brokers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BROKERS",
    ()=>BROKERS,
    "MOCK_START_BALANCE",
    ()=>MOCK_START_BALANCE,
    "brokerById",
    ()=>brokerById,
    "connectBroker",
    ()=>connectBroker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$brand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/brand.ts [app-client] (ecmascript)");
;
const BROKERS = [
    {
        id: "mock",
        name: "Paper Trading",
        tagline: `Brokerage simulator by ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$brand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAWS"]}`,
        rating: null,
        badge: null,
        enabled: true
    },
    {
        id: "binance",
        name: "Binance",
        tagline: "USDT-M futures via the MAWS server",
        rating: 4.2,
        badge: null,
        enabled: true
    },
    {
        id: "okx",
        name: "OKX",
        tagline: "Spot and perpetual swaps",
        rating: 4.6,
        badge: null,
        enabled: false
    }
];
const MOCK_START_BALANCE = 100_000;
function brokerById(id) {
    return BROKERS.find((b)=>b.id === id) ?? null;
}
async function connectBroker(id) {
    const broker = brokerById(id);
    if (!broker?.enabled) return;
    const { useAppStore } = await __turbopack_context__.A("[project]/lib/store.ts [app-client] (ecmascript, async loader)");
    const current = useAppStore.getState().connectedBroker;
    if (id === "mock") {
        // Switching away from live first tears down the browser attachment. The
        // server may continue monitoring, but this UI can only show paper state.
        if (current === "binance") {
            const { disconnectLiveBroker } = await __turbopack_context__.A("[project]/lib/live/bridge.ts [app-client] (ecmascript, async loader)");
            await disconnectLiveBroker();
        }
        const m = await __turbopack_context__.A("[project]/lib/trading/mock.ts [app-client] (ecmascript, async loader)");
        m.connectMock();
        return;
    }
    if (id === "binance") {
        const { connectLiveBroker } = await __turbopack_context__.A("[project]/lib/live/bridge.ts [app-client] (ecmascript, async loader)");
        // connectLiveBroker owns the fail-closed store transition and only marks
        // Binance after confirmed manager and stream health.
        await connectLiveBroker();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/calendar-event-guide.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEventGuide",
    ()=>getEventGuide
]);
/**
 * Expand copy for common economic releases.
 * Matched by title pattern — calendar feeds often have no detail payload.
 */ const RULES = [
    {
        match: /non-?farm|nfp|employment situation|payrolls/i,
        guide: {
            description: "Change in the number of employed people during the previous month, excluding the farming industry. It is one of the most closely watched US labor-market prints.",
            usualEffect: "Actual greater than forecast is typically good for the currency (hawkish growth/jobs).",
            whyTradersCare: "Strong jobs can lift rate expectations and the USD; weak jobs can support risk assets and weigh on the dollar.",
            source: "Bureau of Labor Statistics (BLS)",
            frequency: "Monthly"
        }
    },
    {
        match: /unemployment claims|jobless claims|initial claims/i,
        guide: {
            description: "Number of individuals who filed for unemployment insurance for the first time during the past week. A timely weekly read on labor-market stress.",
            usualEffect: "Actual greater than forecast is typically bad for the currency (softer labor market).",
            whyTradersCare: "Rising claims can cool rate-hike bets; falling claims support a resilient economy narrative.",
            source: "Department of Labor",
            frequency: "Weekly"
        }
    },
    {
        match: /unemployment rate/i,
        guide: {
            description: "Percentage of the labor force that is unemployed and actively seeking work.",
            usualEffect: "Actual greater than forecast is typically bad for the currency.",
            whyTradersCare: "A rising jobless rate can signal cooling demand and lower the odds of tighter policy.",
            source: "National statistics office",
            frequency: "Monthly"
        }
    },
    {
        match: /core pce|pce price/i,
        guide: {
            description: "Change in personal consumption prices excluding food and energy — the Fed’s preferred inflation gauge.",
            usualEffect: "Actual greater than forecast is typically good for the currency (hotter inflation).",
            whyTradersCare: "Feeds directly into Fed reaction functions and front-end rate pricing.",
            source: "Bureau of Economic Analysis (BEA)",
            frequency: "Monthly"
        }
    },
    {
        match: /\bcpi\b|consumer price/i,
        guide: {
            description: "Change in the price of a basket of goods and services purchased by consumers. The headline inflation print most markets react to first.",
            usualEffect: "Actual greater than forecast is typically good for the currency (higher inflation / tighter policy odds).",
            whyTradersCare: "Shapes real yields, rate-cut pricing, and risk appetite across FX, bonds, and equities.",
            source: "National statistics office / BLS",
            frequency: "Monthly"
        }
    },
    {
        match: /\bgdp\b|gross domestic/i,
        guide: {
            description: "Change in the inflation-adjusted value of all goods and services produced by the economy. The broadest growth scorecard.",
            usualEffect: "Actual greater than forecast is typically good for the currency.",
            whyTradersCare: "Strong growth supports hawkish policy and the currency; weak growth can boost rate-cut odds.",
            source: "National statistics office / BEA",
            frequency: "Quarterly (with revisions)"
        }
    },
    {
        match: /fomc|federal funds|rate decision|interest rate|cash rate|bank rate/i,
        guide: {
            description: "Announcement of the central bank’s policy rate decision and often an accompanying statement on the outlook.",
            usualEffect: "A higher-than-expected rate (or hawkish tone) is typically good for the currency.",
            whyTradersCare: "Sets the short-term interest-rate path — the primary driver of FX and front-end yields.",
            source: "Central bank",
            frequency: "Scheduled meeting cycle"
        }
    },
    {
        match: /retail sales/i,
        guide: {
            description: "Change in the total value of sales at the retail level. A key proxy for consumer spending.",
            usualEffect: "Actual greater than forecast is typically good for the currency.",
            whyTradersCare: "Consumer spending is a large share of GDP — surprises move growth and inflation expectations.",
            source: "Census Bureau / national stats",
            frequency: "Monthly"
        }
    },
    {
        match: /durable goods/i,
        guide: {
            description: "Change in the total value of new orders placed with manufacturers for durable goods lasting three years or more.",
            usualEffect: "Actual greater than forecast is typically good for the currency.",
            whyTradersCare: "Signals business investment and manufacturing momentum ahead of broader growth data.",
            source: "Census Bureau",
            frequency: "Monthly"
        }
    },
    {
        match: /personal (income|spending)/i,
        guide: {
            description: "Change in personal income or consumer spending. Spending feeds GDP; income supports future demand.",
            usualEffect: "Stronger-than-expected spending/income is typically good for the currency.",
            whyTradersCare: "Helps confirm whether consumers can keep driving growth without stoking inflation.",
            source: "Bureau of Economic Analysis (BEA)",
            frequency: "Monthly"
        }
    },
    {
        match: /consumer (confidence|sentiment)|ifo business|pmi|ism /i,
        guide: {
            description: "Survey-based measure of business or consumer optimism about current and future conditions.",
            usualEffect: "Actual greater than forecast is typically good for the currency.",
            whyTradersCare: "Soft data often leads hard data — swings can reprice growth expectations quickly.",
            source: "Survey provider (Conference Board, S&P, etc.)",
            frequency: "Monthly"
        }
    },
    {
        match: /crude oil|oil inventori|eia |api weekly|natural gas storage/i,
        guide: {
            description: "Weekly change in energy inventories. A supply/demand pulse for oil or natural gas markets.",
            usualEffect: "Larger-than-expected builds (more supply) typically weigh on energy prices.",
            whyTradersCare: "Moves oil, related FX (CAD, NOK), and inflation expectations at the margin.",
            source: "EIA / API",
            frequency: "Weekly"
        }
    },
    {
        match: /jackson hole|speaks|speech|testimony|symposium/i,
        guide: {
            description: "Scheduled remarks from a policymaker or a major policy conference. Tone can matter more than any single data print.",
            usualEffect: "Hawkish comments typically support the currency; dovish comments typically weigh on it.",
            whyTradersCare: "Can reprice the entire rate path in minutes when guidance shifts.",
            source: "Central bank / conference host",
            frequency: "As scheduled"
        }
    },
    {
        match: /trade balance|current account/i,
        guide: {
            description: "Difference between a country’s exports and imports of goods (and sometimes services), or the broader current-account balance.",
            usualEffect: "A larger surplus (or smaller deficit) than forecast is typically good for the currency.",
            whyTradersCare: "Affects FX flows and perceptions of external balance resilience.",
            source: "National statistics office",
            frequency: "Monthly / quarterly"
        }
    },
    {
        match: /building permits|housing starts|home sales|hpi\b|house price/i,
        guide: {
            description: "Measure of housing activity or residential price inflation — permits, starts, sales, or price indexes.",
            usualEffect: "Stronger housing data is typically good for the currency and risk appetite.",
            whyTradersCare: "Housing is rate-sensitive; prints influence views on the consumer and the policy path.",
            source: "Census / national housing agency",
            frequency: "Monthly"
        }
    }
];
const FALLBACK = {
    description: "Scheduled economic or policy release. Compare the actual print with the forecast and previous reading for the surprise.",
    usualEffect: "A stronger-than-expected print is often supportive for the related currency; a miss can weigh on it. Direction depends on whether the market prices growth or inflation risk.",
    whyTradersCare: "High- and medium-impact events can reprice rates, FX, and risk assets around the release.",
    frequency: "As scheduled"
};
function getEventGuide(title) {
    for (const rule of RULES){
        if (rule.match.test(title)) return rule.guide;
    }
    return FALLBACK;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/calendar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CALENDAR_FORWARD_DAYS",
    ()=>CALENDAR_FORWARD_DAYS,
    "fetchCalendarEvents",
    ()=>fetchCalendarEvents,
    "getCalendarEvents",
    ()=>getCalendarEvents,
    "getMockCalendarEvents",
    ()=>getMockCalendarEvents,
    "mapXoomarRows",
    ()=>mapXoomarRows
]);
function dayStart(offset) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    return d.getTime();
}
function mapImpact(raw) {
    const v = String(raw ?? "").toLowerCase();
    if (v.includes("high") || v === "3") return "high";
    if (v.includes("medium") || v.includes("med") || v === "2") return "medium";
    return "low";
}
function fmtValue(v) {
    if (v == null || v === "") return undefined;
    return String(v);
}
function categorize(title, country) {
    const t = title.toLowerCase();
    if (/eia|opec|crude|oil inventory|natural gas|baker hughes|api crude|petroleum/.test(t)) {
        return "commodity";
    }
    if (/bitcoin|crypto|ethereum|token unlock/.test(t) || country === "CR") {
        return "crypto";
    }
    return "macro";
}
function mapXoomarRows(rows) {
    const out = [];
    for(let i = 0; i < rows.length; i++){
        const row = rows[i];
        if (!row?.eventName || !row.scheduledAt) continue;
        const at = Date.parse(row.scheduledAt);
        if (!Number.isFinite(at)) continue;
        const impact = mapImpact(row.importance);
        const title = row.eventName.trim();
        const period = row.periodLabel ? ` · ${row.periodLabel}` : "";
        out.push({
            id: `xo-${at}-${i}`,
            at,
            title: `${title}${period}`,
            country: "US",
            impact,
            category: categorize(title, "US"),
            actual: fmtValue(row.actual),
            forecast: fmtValue(row.forecast),
            previous: fmtValue(row.previous),
            source: "xoomar"
        });
    }
    out.sort((a, b)=>a.at - b.at);
    return out;
}
function getMockCalendarEvents() {
    const rows = [
        {
            day: 0,
            hour: 8,
            title: "Core PCE Price Index m/m",
            country: "US",
            impact: "high",
            category: "macro",
            forecast: "0.2%",
            previous: "0.1%"
        },
        {
            day: 0,
            hour: 8,
            title: "Prelim GDP Price Index q/q",
            country: "US",
            impact: "medium",
            category: "macro",
            forecast: "2.0%"
        },
        {
            day: 1,
            hour: 12,
            title: "Unemployment Claims",
            country: "US",
            impact: "medium",
            category: "macro",
            forecast: "220K",
            previous: "218K"
        },
        {
            day: 1,
            hour: 14,
            title: "Jackson Hole Symposium",
            country: "US",
            impact: "medium",
            category: "macro"
        },
        {
            day: 2,
            hour: 12,
            title: "GDP m/m",
            country: "CA",
            impact: "high",
            category: "macro",
            forecast: "0.2%"
        },
        {
            day: 2,
            hour: 14,
            title: "EIA Crude Oil Inventories",
            country: "US",
            impact: "high",
            category: "commodity"
        },
        {
            day: 3,
            hour: 9,
            title: "BoE rate decision",
            country: "GB",
            impact: "high",
            category: "macro",
            forecast: "4.00%"
        },
        {
            day: 3,
            hour: 13,
            title: "CB Consumer Confidence",
            country: "US",
            impact: "medium",
            category: "macro",
            forecast: "96.0"
        },
        {
            day: 4,
            hour: 8,
            title: "Tokyo Core CPI y/y",
            country: "JP",
            impact: "medium",
            category: "macro",
            forecast: "1.8%"
        },
        {
            day: 5,
            hour: 12,
            title: "Fed Chair speech",
            country: "US",
            impact: "medium",
            category: "macro"
        },
        {
            day: 6,
            hour: 10,
            title: "Eurozone CPI flash",
            country: "EU",
            impact: "high",
            category: "macro",
            forecast: "2.1%"
        }
    ];
    return rows.map((row, i)=>({
            id: `mock-${i}`,
            at: dayStart(row.day) + row.hour * 3600_000,
            title: row.title,
            country: row.country,
            impact: row.impact,
            category: row.category,
            actual: row.actual,
            forecast: row.forecast,
            previous: row.previous,
            source: "mock"
        }));
}
function getCalendarEvents() {
    return getMockCalendarEvents();
}
const DAY_MS = 86_400_000;
const CALENDAR_FORWARD_DAYS = 7;
function windowBounds(fromDayMs) {
    const windowStart = fromDayMs;
    const windowEnd = fromDayMs + CALENDAR_FORWARD_DAYS * DAY_MS;
    return {
        windowStart,
        windowEnd
    };
}
function inWindow(at, windowStart, windowEnd) {
    return at >= windowStart && at < windowEnd;
}
function ymdLocal(ms) {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function rowsFromResponse(raw) {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "object" && raw !== null && "data" in raw && Array.isArray(raw.data)) {
        return raw.data;
    }
    return null;
}
async function tryXoomar(windowStart, windowEnd) {
    const from = ymdLocal(windowStart);
    const to = ymdLocal(windowEnd - 1);
    const res = await fetch(`/api/calendar/xoomar?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
        cache: "no-store"
    });
    if (!res.ok) return null;
    const raw = await res.json();
    const rows = rowsFromResponse(raw);
    if (!rows) return null;
    return mapXoomarRows(rows).filter((e)=>inWindow(e.at, windowStart, windowEnd));
}
async function fetchCalendarEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { windowStart, windowEnd } = windowBounds(today.getTime());
    try {
        const live = await tryXoomar(windowStart, windowEnd);
        if (live) {
            return {
                events: live,
                source: "xoomar",
                windowStart,
                windowEnd
            };
        }
    } catch  {
    /* fall through to the demo fallback */ }
    const mock = getMockCalendarEvents().filter((e)=>inWindow(e.at, windowStart, windowEnd));
    return {
        events: mock,
        source: "mock",
        windowStart,
        windowEnd,
        error: "Live calendar unavailable — showing demo events"
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/chart-registry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "forEachChart",
    ()=>forEachChart,
    "getChart",
    ()=>getChart,
    "getLastCrosshair",
    ()=>getLastCrosshair,
    "getVela",
    ()=>getVela,
    "registerChart",
    ()=>registerChart,
    "setLastCrosshair",
    ()=>setLastCrosshair,
    "syncCrosshairToOthers",
    ()=>syncCrosshairToOthers,
    "syncVisibleRangeToOthers",
    ()=>syncVisibleRangeToOthers,
    "unregisterChart",
    ()=>unregisterChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const handles = new Map();
// Dev-only debugging aid: `__mawsCharts.get('<paneId>').vela` in the console.
if ("TURBOPACK compile-time truthy", 1) {
    window.__mawsCharts = handles;
}
let syncing = false;
function withChartSync(fn) {
    if (syncing) return;
    syncing = true;
    try {
        fn();
    } finally{
        syncing = false;
    }
}
function registerChart(paneId, handle) {
    handles.set(paneId, handle);
}
function unregisterChart(paneId) {
    handles.delete(paneId);
}
function getChart(paneId) {
    return handles.get(paneId);
}
function getVela(paneId) {
    return handles.get(paneId)?.vela ?? null;
}
function forEachChart(fn) {
    handles.forEach((handle, paneId)=>fn(paneId, handle));
}
function syncCrosshairToOthers(sourcePaneId, time, price) {
    withChartSync(()=>{
        forEachChart((paneId, handle)=>{
            if (paneId === sourcePaneId) return;
            try {
                handle.vela.renderer.setExternalCrosshair(time, price);
            } catch  {
            /* renderer may not support the seam */ }
        });
    });
}
function syncVisibleRangeToOthers(sourcePaneId, range) {
    withChartSync(()=>{
        forEachChart((paneId, handle)=>{
            if (paneId === sourcePaneId) return;
            try {
                handle.vela.setVisibleRange(range);
            } catch  {
            /* ignore */ }
        });
    });
}
let lastCrosshair = null;
function setLastCrosshair(value) {
    lastCrosshair = value;
}
function getLastCrosshair() {
    return lastCrosshair;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/chart-style.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CHART_STYLES",
    ()=>CHART_STYLES,
    "heikinAshi",
    ()=>heikinAshi,
    "isLineStyle",
    ()=>isLineStyle,
    "styleCandles",
    ()=>styleCandles
]);
const CHART_STYLES = [
    {
        id: "hollow",
        label: "Hollow candles"
    },
    {
        id: "solid",
        label: "Solid candles"
    },
    {
        id: "heikinashi",
        label: "Heikin Ashi"
    },
    {
        id: "bars",
        label: "OHLC bars"
    },
    {
        id: "line",
        label: "Line"
    },
    {
        id: "area",
        label: "Area"
    },
    {
        id: "baseline",
        label: "Baseline"
    }
];
function heikinAshi(candles) {
    const out = [];
    for(let i = 0; i < candles.length; i++){
        const c = candles[i];
        const prev = out[i - 1];
        const close = (c.open + c.high + c.low + c.close) / 4;
        const open = prev ? (prev.open + prev.close) / 2 : (c.open + c.close) / 2;
        out.push({
            time: c.time,
            open,
            close,
            high: Math.max(c.high, open, close),
            low: Math.min(c.low, open, close),
            volume: c.volume
        });
    }
    return out;
}
function styleCandles(candles, style) {
    return style === "heikinashi" ? heikinAshi(candles) : candles;
}
function isLineStyle(style) {
    return style === "line" || style === "area" || style === "baseline";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/drawings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALL_POSITION_STATS",
    ()=>ALL_POSITION_STATS,
    "CHART_TIME_AXIS_H",
    ()=>CHART_TIME_AXIS_H,
    "DEFAULT_CIRCLE_BORDER_COLOR",
    ()=>DEFAULT_CIRCLE_BORDER_COLOR,
    "DEFAULT_CIRCLE_FILL_COLOR",
    ()=>DEFAULT_CIRCLE_FILL_COLOR,
    "DEFAULT_FIB_LEVELS",
    ()=>DEFAULT_FIB_LEVELS,
    "DEFAULT_FIB_ONE_COLOR",
    ()=>DEFAULT_FIB_ONE_COLOR,
    "DEFAULT_FIB_TREND_COLOR",
    ()=>DEFAULT_FIB_TREND_COLOR,
    "DEFAULT_POSITION_LINE_COLOR",
    ()=>DEFAULT_POSITION_LINE_COLOR,
    "DEFAULT_POSITION_STOP_COLOR",
    ()=>DEFAULT_POSITION_STOP_COLOR,
    "DEFAULT_POSITION_TARGET_COLOR",
    ()=>DEFAULT_POSITION_TARGET_COLOR,
    "DEFAULT_RECT_BORDER_COLOR",
    ()=>DEFAULT_RECT_BORDER_COLOR,
    "DEFAULT_RECT_FILL_COLOR",
    ()=>DEFAULT_RECT_FILL_COLOR,
    "DEFAULT_RECT_MIDDLE_LINE_COLOR",
    ()=>DEFAULT_RECT_MIDDLE_LINE_COLOR,
    "DRAW_LABEL",
    ()=>DRAW_LABEL,
    "DRAW_TOOLS",
    ()=>DRAW_TOOLS,
    "FIBS",
    ()=>FIBS,
    "POSITION_HANDLE_CURSOR",
    ()=>POSITION_HANDLE_CURSOR,
    "POSITION_STAT_LABELS",
    ()=>POSITION_STAT_LABELS,
    "RECT_HANDLE_CURSOR",
    ()=>RECT_HANDLE_CURSOR,
    "clampToPlot",
    ()=>clampToPlot,
    "cloneFibLevels",
    ()=>cloneFibLevels,
    "coordinateToUnixTime",
    ()=>coordinateToUnixTime,
    "cubicControls",
    ()=>cubicControls,
    "dist",
    ()=>dist,
    "distToSeg",
    ()=>distToSeg,
    "escapeXml",
    ()=>escapeXml,
    "fibLevelPrice",
    ()=>fibLevelPrice,
    "findPositionExitInsideTool",
    ()=>findPositionExitInsideTool,
    "findPositionTargetHitTime",
    ()=>findPositionTargetHitTime,
    "isPersistTool",
    ()=>isPersistTool,
    "isPositionTool",
    ()=>isPositionTool,
    "isValidDrawing",
    ()=>isValidDrawing,
    "neededPoints",
    ()=>neededPoints,
    "normalizePositionPoints",
    ()=>normalizePositionPoints,
    "plotBoundsFromScales",
    ()=>plotBoundsFromScales,
    "pointInPlot",
    ()=>pointInPlot,
    "positionAnchors",
    ()=>positionAnchors,
    "positionHandles",
    ()=>positionHandles,
    "positionPointsFromDrag",
    ()=>positionPointsFromDrag,
    "positionPricesFromTicks",
    ()=>positionPricesFromTicks,
    "positionRightEdgeMarkPrice",
    ()=>positionRightEdgeMarkPrice,
    "positionTickSize",
    ()=>positionTickSize,
    "priceHitsPositionTarget",
    ()=>priceHitsPositionTarget,
    "rectBounds",
    ()=>rectBounds,
    "rectHandles",
    ()=>rectHandles,
    "resizePosition",
    ()=>resizePosition,
    "resizeRect",
    ()=>resizeRect,
    "resolveFibLevels",
    ()=>resolveFibLevels,
    "resolvePositionPnlTip",
    ()=>resolvePositionPnlTip,
    "sampleCubic",
    ()=>sampleCubic,
    "snapPoint",
    ()=>snapPoint,
    "unixTimeToCoordinate",
    ()=>unixTimeToCoordinate,
    "withPositionPrices",
    ()=>withPositionPrices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timeframes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/timeframes.ts [app-client] (ecmascript)");
;
;
const CHART_TIME_AXIS_H = 28;
function plotBoundsFromScales(size, scales) {
    const left = Math.max(0, scales.left);
    const rightW = Math.max(0, scales.right);
    const timeH = scales.timeAxis ?? CHART_TIME_AXIS_H;
    const top = 0;
    const right = Math.max(left, size.width - rightW);
    const bottom = Math.max(top, size.height - timeH);
    return {
        left,
        top,
        right,
        bottom,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top)
    };
}
function pointInPlot(x, y, plot) {
    return x >= plot.left && x <= plot.right && y >= plot.top && y <= plot.bottom;
}
function clampToPlot(x, y, plot) {
    return {
        x: Math.min(Math.max(x, plot.left), Math.max(plot.left, plot.right - 0.5)),
        y: Math.min(Math.max(y, plot.top), Math.max(plot.top, plot.bottom - 0.5))
    };
}
const DRAW_TOOLS = [
    "trend",
    "hray",
    "fib",
    "path",
    "dcurve",
    "long",
    "short",
    "rect",
    "circle",
    "arrowUp",
    "arrowDown",
    "text"
];
const DRAW_LABEL = {
    trend: "Trend line",
    hray: "Horizontal ray",
    fib: "Fib retracement",
    path: "Path",
    dcurve: "Double curve",
    long: "Long position",
    short: "Short position",
    rect: "Rectangle",
    circle: "Circle",
    arrowUp: "Arrow mark up",
    arrowDown: "Arrow mark down",
    text: "Text"
};
const DEFAULT_POSITION_LINE_COLOR = "#d1d4dc";
const DEFAULT_POSITION_STOP_COLOR = "rgba(242,54,69,0.22)";
const DEFAULT_POSITION_TARGET_COLOR = "rgba(8,153,129,0.22)";
const DEFAULT_RECT_BORDER_COLOR = "#2962ff";
const DEFAULT_RECT_FILL_COLOR = "rgba(41,98,255,0.2)";
const DEFAULT_RECT_MIDDLE_LINE_COLOR = "#9c27b0";
const DEFAULT_CIRCLE_BORDER_COLOR = "#2962ff";
const DEFAULT_CIRCLE_FILL_COLOR = "rgba(41,98,255,0.2)";
const ALL_POSITION_STATS = [
    "tpOffset",
    "tpPercent",
    "tpTicks",
    "tpPnl",
    "slOffset",
    "slPercent",
    "slTicks",
    "slPnl",
    "qty",
    "risk",
    "rr"
];
const POSITION_STAT_LABELS = {
    tpOffset: "TP price offset",
    tpPercent: "TP percent",
    tpTicks: "TP ticks",
    tpPnl: "TP P&L",
    slOffset: "SL price offset",
    slPercent: "SL percent",
    slTicks: "SL ticks",
    slPnl: "SL P&L",
    qty: "Quantity",
    risk: "Risk",
    rr: "Risk/reward"
};
function isPositionTool(tool) {
    return tool === "long" || tool === "short";
}
function positionTickSize(precision) {
    return 10 ** -Math.max(0, precision);
}
function positionPricesFromTicks(tool, entry, tpTicks, slTicks, tick) {
    const t = Math.max(0, tick);
    if (tool === "long") {
        return {
            target: entry + tpTicks * t,
            stop: entry - slTicks * t
        };
    }
    return {
        target: entry - tpTicks * t,
        stop: entry + slTicks * t
    };
}
function withPositionPrices(points, entry, target, stop) {
    const a = positionAnchors(points);
    if (!a) {
        return [
            {
                time: points[0]?.time ?? 0,
                price: entry
            },
            {
                time: points[1]?.time ?? points[0]?.time ?? 0,
                price: target
            },
            {
                time: points[2]?.time ?? points[1]?.time ?? points[0]?.time ?? 0,
                price: stop
            }
        ];
    }
    return [
        {
            time: a.entry.time,
            price: entry
        },
        {
            time: a.target.time,
            price: target
        },
        {
            time: a.stop.time,
            price: stop
        }
    ];
}
const FIBS = [
    {
        level: 0,
        color: "#787b86"
    },
    {
        level: 0.236,
        color: "#f23645"
    },
    {
        level: 0.382,
        color: "#ff9800"
    },
    {
        level: 0.5,
        color: "#2962ff"
    },
    {
        level: 0.618,
        color: "#089981"
    },
    {
        level: 0.786,
        color: "#ab47bc"
    },
    {
        level: 1,
        color: "#d1d4dc"
    },
    {
        level: 1.272,
        color: "#26a69a"
    },
    {
        level: 1.618,
        color: "#2962ff"
    }
];
const DEFAULT_FIB_LEVELS = [
    {
        level: 0,
        color: "#d1d4dc",
        visible: true
    },
    {
        level: 0.236,
        color: "#4dd0e1",
        visible: true
    },
    {
        level: 0.382,
        color: "#4caf50",
        visible: true
    },
    {
        level: 0.5,
        color: "#ff9800",
        visible: true
    },
    {
        level: 0.618,
        color: "#ffeb3b",
        visible: true
    },
    {
        level: 0.786,
        color: "#f23645",
        visible: true
    },
    {
        level: 1,
        color: "#d1d4dc",
        visible: true
    },
    {
        level: 1.272,
        color: "#81d4fa",
        visible: false
    },
    {
        level: 1.414,
        color: "#81d4fa",
        visible: false
    },
    {
        level: 1.618,
        color: "#2979ff",
        visible: false
    },
    {
        level: 2,
        color: "#2979ff",
        visible: false
    },
    {
        level: 2.272,
        color: "#9c27b0",
        visible: false
    },
    {
        level: 2.414,
        color: "#9c27b0",
        visible: false
    },
    {
        level: 2.618,
        color: "#e91e63",
        visible: false
    },
    {
        level: 3,
        color: "#e91e63",
        visible: false
    },
    {
        level: 3.272,
        color: "#ff5722",
        visible: false
    },
    {
        level: 3.414,
        color: "#ff5722",
        visible: false
    },
    {
        level: 3.618,
        color: "#ff9800",
        visible: false
    },
    {
        level: 4,
        color: "#ffc107",
        visible: false
    },
    {
        level: 4.236,
        color: "#cddc39",
        visible: false
    },
    {
        level: 4.272,
        color: "#8bc34a",
        visible: false
    },
    {
        level: 4.414,
        color: "#009688",
        visible: false
    },
    {
        level: 4.618,
        color: "#00bcd4",
        visible: false
    },
    {
        level: 4.764,
        color: "#03a9f4",
        visible: false
    }
];
const DEFAULT_FIB_TREND_COLOR = "#787b86";
const DEFAULT_FIB_ONE_COLOR = "#2962ff";
function cloneFibLevels(levels) {
    const src = levels && levels.length > 0 ? levels : DEFAULT_FIB_LEVELS;
    return src.map((l)=>({
            ...l
        }));
}
function resolveFibLevels(drawing) {
    const levels = cloneFibLevels(drawing.fibLevels);
    if (!drawing.fibUseOneColor) return levels;
    const c = drawing.fibOneColor || DEFAULT_FIB_ONE_COLOR;
    return levels.map((l)=>({
            ...l,
            color: c
        }));
}
function fibLevelPrice(a, b, level, reverse = false, logScale = false) {
    const p0 = reverse ? b : a;
    const p1 = reverse ? a : b;
    if (logScale && p0 > 0 && p1 > 0) {
        const l0 = Math.log(p0);
        const l1 = Math.log(p1);
        return Math.exp(l0 + (l1 - l0) * level);
    }
    return p0 + (p1 - p0) * level;
}
function isPersistTool(tool) {
    return DRAW_TOOLS.includes(tool);
}
function neededPoints(tool) {
    if (tool === "path") return Number.POSITIVE_INFINITY;
    if (tool === "arrowUp" || tool === "arrowDown" || tool === "text" || tool === "hray") return 1;
    if (tool === "dcurve") return 3;
    if (tool === "trend" || tool === "rect" || tool === "circle" || tool === "fib" || tool === "long" || tool === "short") return 2;
    return 0;
}
function snapPoint(symbol, timeframe, point, magnet) {
    if (!magnet) return point;
    const candles = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getCandles(symbol, timeframe);
    if (!candles.length) return point;
    const first = candles[0];
    const last = candles[candles.length - 1];
    // Past / future of the series — keep free time so tools can extend beyond candles
    if (point.time > last.time || point.time < first.time) return point;
    let best = candles[0];
    let bestDt = Math.abs(best.time - point.time);
    for (const c of candles){
        const dt = Math.abs(c.time - point.time);
        if (dt < bestDt) {
            bestDt = dt;
            best = c;
        }
    }
    const levels = [
        best.open,
        best.high,
        best.low,
        best.close
    ];
    let price = levels[0];
    let bestDp = Math.abs(price - point.price);
    for (const v of levels){
        const dp = Math.abs(v - point.price);
        if (dp < bestDp) {
            bestDp = dp;
            price = v;
        }
    }
    return {
        time: best.time,
        price
    };
}
function coordinateToUnixTime(timeScale, x, candles, timeframe) {
    const raw = timeScale.coordinateToTime(x);
    if (raw != null) {
        const t = typeof raw === "number" ? raw : Number(raw);
        if (Number.isFinite(t)) return t;
    }
    if (!candles.length) return null;
    const logical = timeScale.coordinateToLogical(x);
    if (logical == null || !Number.isFinite(logical)) return null;
    const barSec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timeframes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeSeconds"])(timeframe);
    const lastIdx = candles.length - 1;
    return candles[lastIdx].time + (logical - lastIdx) * barSec;
}
function unixTimeToCoordinate(// Lightweight Charts brands Logical/Time; keep this structural and loose.
timeScale, time, candles, timeframe) {
    const t = candles.length ? normalizeEntryTime(time, candles) : time;
    const direct = timeScale.timeToCoordinate(t);
    if (direct != null) return direct;
    if (!candles.length) return null;
    const barSec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timeframes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeSeconds"])(timeframe);
    if (barSec <= 0) return null;
    const lastIdx = candles.length - 1;
    const logical = lastIdx + (t - candles[lastIdx].time) / barSec;
    return timeScale.logicalToCoordinate(logical);
}
function escapeXml(value) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
function distToSeg(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = dx * dx + dy * dy;
    if (len === 0) return dist(p, a);
    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len;
    t = Math.max(0, Math.min(1, t));
    return dist(p, {
        x: a.x + t * dx,
        y: a.y + t * dy
    });
}
function sampleCubic(a, c1, c2, b, steps = 24) {
    const pts = [];
    for(let i = 0; i <= steps; i++){
        const t = i / steps;
        const u = 1 - t;
        pts.push({
            x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
            y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y
        });
    }
    return pts;
}
function cubicControls(a, m, b) {
    return {
        c1: {
            x: a.x + (m.x - a.x) * 0.85,
            y: a.y + (m.y - a.y) * 0.85
        },
        c2: {
            x: b.x + (m.x - b.x) * 0.85,
            y: b.y + (m.y - b.y) * 0.85
        }
    };
}
function isValidDrawing(d) {
    return isPersistTool(d.tool) && Array.isArray(d.points) && d.points.length > 0;
}
function positionAnchors(points) {
    if (!points[0] || !points[1]) return null;
    const entry = points[0];
    const target = points[1];
    const right = target.time;
    const stopPrice = points[2]?.price ?? entry.price - (target.price - entry.price);
    return {
        entry: {
            time: entry.time,
            price: entry.price
        },
        target: {
            time: right,
            price: target.price
        },
        stop: {
            time: right,
            price: stopPrice
        }
    };
}
function positionPointsFromDrag(entry, cursor, tool, barSeconds = 60) {
    const bar = Math.max(1, barSeconds);
    // Same unix second still maps to one candle — force at least one bar of width.
    const right = Math.abs(cursor.time - entry.time) >= bar * 0.5 ? cursor.time : entry.time + bar;
    const mag = Math.abs(cursor.price - entry.price) || Math.abs(entry.price) * 0.002 || 1;
    if (tool === "long") {
        return [
            {
                time: entry.time,
                price: entry.price
            },
            {
                time: right,
                price: entry.price + mag
            },
            {
                time: right,
                price: entry.price - mag
            }
        ];
    }
    return [
        {
            time: entry.time,
            price: entry.price
        },
        {
            time: right,
            price: entry.price - mag
        },
        {
            time: right,
            price: entry.price + mag
        }
    ];
}
function normalizePositionPoints(points, tool) {
    if (tool && points[0] && points[1]) {
        return positionPointsFromDrag(points[0], points[1], tool);
    }
    const a = positionAnchors(points);
    if (!a) return points;
    return [
        a.entry,
        a.target,
        a.stop
    ];
}
function priceHitsPositionTarget(tool, price, targetPrice) {
    return tool === "long" ? price >= targetPrice : price <= targetPrice;
}
function normalizeEntryTime(entryTime, candles) {
    if (!candles.length) return entryTime;
    const sample = candles[0].time;
    if (entryTime > 1e12 && sample < 1e12) return Math.floor(entryTime / 1000);
    if (entryTime < 1e12 && sample > 1e12) return entryTime * 1000;
    return entryTime;
}
function findPositionExitInsideTool(tool, entryTime, rightTime, targetPrice, stopPrice, candles) {
    if (!candles.length) return null;
    const entry = normalizeEntryTime(entryTime, candles);
    const right = normalizeEntryTime(rightTime, candles);
    const left = Math.min(entry, right);
    const rightBound = Math.max(entry, right);
    let start = -1;
    for(let i = 0; i < candles.length; i++){
        if (candles[i].time <= left) start = i;
        else break;
    }
    const from = start < 0 ? 0 : start + 1;
    for(let j = from; j < candles.length; j++){
        const c = candles[j];
        if (c.time > rightBound) break;
        if (!(c.high > 0) || !(c.low > 0)) continue;
        const hitSl = tool === "long" ? c.low <= stopPrice : c.high >= stopPrice;
        const hitTp = tool === "long" ? c.high >= targetPrice : c.low <= targetPrice;
        if (hitSl) return {
            exit: "sl",
            time: c.time
        };
        if (hitTp) return {
            exit: "tp",
            time: c.time
        };
    }
    return null;
}
function positionRightEdgeMarkPrice(rightTime, candles, livePrice) {
    if (!candles.length) {
        return livePrice != null && livePrice > 0 ? livePrice : null;
    }
    const right = normalizeEntryTime(rightTime, candles);
    const last = candles[candles.length - 1];
    if (right > last.time) {
        return livePrice != null && Number.isFinite(livePrice) && livePrice > 0 ? livePrice : last.close;
    }
    let atEdge = candles[0];
    for (const c of candles){
        if (c.time <= right) atEdge = c;
        else break;
    }
    return atEdge.close;
}
function resolvePositionPnlTip(tool, entryTime, rightTime, targetPrice, stopPrice, candles, livePrice) {
    const filled = findPositionExitInsideTool(tool, entryTime, rightTime, targetPrice, stopPrice, candles);
    if (filled) {
        return {
            price: filled.exit === "tp" ? targetPrice : stopPrice,
            exit: filled.exit,
            time: filled.time
        };
    }
    if (!candles.length) return null;
    const entry = normalizeEntryTime(entryTime, candles);
    const right = normalizeEntryTime(rightTime, candles);
    const last = candles[candles.length - 1];
    // Prefer the live candle; never draw past the tool's right edge once that edge is historical.
    const tipTime = Math.min(last.time, Math.max(entry, right));
    let mark;
    if (right > last.time) {
        mark = livePrice != null && Number.isFinite(livePrice) && livePrice > 0 ? livePrice : last.close;
    } else {
        mark = positionRightEdgeMarkPrice(rightTime, candles, livePrice);
    }
    if (mark == null || !(mark > 0)) return null;
    return {
        price: mark,
        exit: null,
        time: tipTime
    };
}
function findPositionTargetHitTime(tool, entryTime, targetPrice, candles) {
    if (!candles.length) return null;
    const entry = normalizeEntryTime(entryTime, candles);
    let start = -1;
    for(let i = 0; i < candles.length; i++){
        if (candles[i].time <= entry) start = i;
        else break;
    }
    const from = start < 0 ? 0 : start + 1;
    for(let j = from; j < candles.length; j++){
        const c = candles[j];
        if (!(c.high > 0) || !(c.low > 0)) continue;
        if (tool === "long" ? c.high >= targetPrice : c.low <= targetPrice) return c.time;
    }
    return null;
}
function positionHandles(points) {
    const a = positionAnchors(points);
    if (!a) return null;
    const left = a.entry.time;
    const right = a.target.time;
    return [
        {
            time: left,
            price: a.target.price
        },
        {
            time: left,
            price: a.entry.price
        },
        {
            time: right,
            price: a.entry.price
        },
        {
            time: left,
            price: a.stop.price
        }
    ];
}
const POSITION_HANDLE_CURSOR = [
    "ns-resize",
    "move",
    "ew-resize",
    "ns-resize"
];
function resizePosition(origin, index, np) {
    const a = positionAnchors(origin);
    if (!a) return origin.map((pt, i)=>i === index ? np : pt);
    let left = a.entry.time;
    let right = a.target.time;
    let entry = a.entry.price;
    let target = a.target.price;
    let stop = a.stop.price;
    switch(index){
        case 0:
            target = np.price;
            break;
        case 1:
            left = np.time;
            entry = np.price;
            break;
        case 2:
            right = np.time;
            break;
        case 3:
            stop = np.price;
            break;
        default:
            return origin;
    }
    // Prevent edges from crossing
    if (left > right) left = right;
    if (right < left) right = left;
    return [
        {
            time: left,
            price: entry
        },
        {
            time: right,
            price: target
        },
        {
            time: right,
            price: stop
        }
    ];
}
function rectBounds(points) {
    const a = points[0];
    const b = points[1];
    if (!a || !b) return null;
    return {
        t0: Math.min(a.time, b.time),
        t1: Math.max(a.time, b.time),
        p0: Math.min(a.price, b.price),
        p1: Math.max(a.price, b.price)
    };
}
function rectHandles(points) {
    const b = rectBounds(points);
    if (!b) return null;
    const tm = (b.t0 + b.t1) / 2;
    const pm = (b.p0 + b.p1) / 2;
    return [
        {
            time: b.t0,
            price: b.p1
        },
        {
            time: tm,
            price: b.p1
        },
        {
            time: b.t1,
            price: b.p1
        },
        {
            time: b.t1,
            price: pm
        },
        {
            time: b.t1,
            price: b.p0
        },
        {
            time: tm,
            price: b.p0
        },
        {
            time: b.t0,
            price: b.p0
        },
        {
            time: b.t0,
            price: pm
        }
    ];
}
const RECT_HANDLE_CURSOR = [
    "nwse-resize",
    "ns-resize",
    "nesw-resize",
    "ew-resize",
    "nwse-resize",
    "ns-resize",
    "nesw-resize",
    "ew-resize"
];
function resizeRect(origin, handle, np) {
    const b = rectBounds(origin);
    if (!b) return origin;
    let { t0, t1, p0, p1 } = b;
    switch(handle){
        case 0:
            t0 = np.time;
            p1 = np.price;
            break;
        case 1:
            p1 = np.price;
            break;
        case 2:
            t1 = np.time;
            p1 = np.price;
            break;
        case 3:
            t1 = np.time;
            break;
        case 4:
            t1 = np.time;
            p0 = np.price;
            break;
        case 5:
            p0 = np.price;
            break;
        case 6:
            t0 = np.time;
            p0 = np.price;
            break;
        case 7:
            t0 = np.time;
            break;
        default:
            return origin;
    }
    return [
        {
            time: Math.min(t0, t1),
            price: Math.min(p0, p1)
        },
        {
            time: Math.max(t0, t1),
            price: Math.max(p0, p1)
        }
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/indicators.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INDICATOR_ORDER",
    ()=>INDICATOR_ORDER,
    "OVERLAY_INDICATORS",
    ()=>OVERLAY_INDICATORS,
    "PANE_INDICATORS",
    ()=>PANE_INDICATORS,
    "applyColorOpacity",
    ()=>applyColorOpacity,
    "candleSource",
    ()=>candleSource,
    "computeAdx",
    ()=>computeAdx,
    "computeAtr",
    ()=>computeAtr,
    "computeBbPlot",
    ()=>computeBbPlot,
    "computeBollinger",
    ()=>computeBollinger,
    "computeEma",
    ()=>computeEma,
    "computeEmaPlot",
    ()=>computeEmaPlot,
    "computePmo",
    ()=>computePmo,
    "computeRsi",
    ()=>computeRsi,
    "computeStochastic",
    ()=>computeStochastic,
    "computeVwap",
    ()=>computeVwap,
    "computeVwapPlot",
    ()=>computeVwapPlot,
    "indicatorTitle",
    ()=>indicatorTitle,
    "lastDefined",
    ()=>lastDefined,
    "lineAppearance",
    ()=>lineAppearance,
    "toChartLineStyle",
    ()=>toChartLineStyle,
    "toLineData",
    ()=>toLineData
]);
const INDICATOR_ORDER = [
    "vwap",
    "ema",
    "bb",
    "rsi",
    "stoch",
    "atr",
    "adx"
];
const OVERLAY_INDICATORS = [
    "vwap",
    "ema",
    "bb"
];
const PANE_INDICATORS = [
    "rsi",
    "stoch",
    "atr",
    "adx"
];
function indicatorTitle(id, symbol) {
    const base = symbol.replace(/USDT$|USD$|USDC$/, "");
    if (id === "vwap") return "VWAP";
    if (id === "ema") return "EMA";
    if (id === "bb") return "Bollinger Bands";
    if (id === "rsi") return "RSI";
    if (id === "stoch") return "Stochastic";
    if (id === "atr") return "ATR";
    return "ADX";
}
function applyColorOpacity(color, opacityPct) {
    const a = Math.min(1, Math.max(0, opacityPct / 100));
    const c = color.trim();
    if (c.startsWith("#")) {
        const hex = c.length === 4 ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}` : c.length >= 7 ? c.slice(0, 7) : c;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        if ([
            r,
            g,
            b
        ].every((n)=>Number.isFinite(n))) return `rgba(${r},${g},${b},${a})`;
    }
    const rgba = c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if (rgba) {
        return `rgba(${rgba[1]},${rgba[2]},${rgba[3]},${a})`;
    }
    return c;
}
function toChartLineStyle(style) {
    if (style === "dashed") return "dashed";
    if (style === "dotted") return "dotted";
    return "solid";
}
function lineAppearance(s) {
    return {
        color: applyColorOpacity(s.color, s.opacity ?? 100),
        lineWidth: s.lineWidth,
        lineStyle: toChartLineStyle(s.lineStyle)
    };
}
function candleSource(c, source) {
    if (source === "open") return c.open;
    if (source === "high") return c.high;
    if (source === "low") return c.low;
    if (source === "hl2") return (c.high + c.low) / 2;
    if (source === "hlc3") return (c.high + c.low + c.close) / 3;
    if (source === "ohlc4") return (c.open + c.high + c.low + c.close) / 4;
    return c.close;
}
function computeEma(candles, period, source = "close") {
    const values = candles.map((c)=>candleSource(c, source));
    return emaOfValues(values, period);
}
function emaOfValues(values, period) {
    const out = Array(values.length).fill(null);
    if (period < 1 || values.length < period) return out;
    const k = 2 / (period + 1);
    let sum = 0;
    for(let i = 0; i < period; i++)sum += values[i];
    let ema = sum / period;
    out[period - 1] = ema;
    for(let i = period; i < values.length; i++){
        ema = values[i] * k + ema * (1 - k);
        out[i] = ema;
    }
    return out;
}
function smaOfNullable(values, period) {
    return smaSeries(values, period);
}
function emaOfNullable(values, period) {
    const out = Array(values.length).fill(null);
    if (period < 1) return out;
    const k = 2 / (period + 1);
    let ema = null;
    let seed = 0;
    let count = 0;
    for(let i = 0; i < values.length; i++){
        const v = values[i];
        if (v == null) continue;
        if (ema == null) {
            seed += v;
            count += 1;
            if (count === period) {
                ema = seed / period;
                out[i] = ema;
            }
            continue;
        }
        ema = v * k + ema * (1 - k);
        out[i] = ema;
    }
    return out;
}
function rmaOfNullable(values, period) {
    const out = Array(values.length).fill(null);
    if (period < 1) return out;
    let rma = null;
    let seed = 0;
    let count = 0;
    for(let i = 0; i < values.length; i++){
        const v = values[i];
        if (v == null) continue;
        if (rma == null) {
            seed += v;
            count += 1;
            if (count === period) {
                rma = seed / period;
                out[i] = rma;
            }
            continue;
        }
        rma = (rma * (period - 1) + v) / period;
        out[i] = rma;
    }
    return out;
}
function wmaOfNullable(values, period) {
    const out = Array(values.length).fill(null);
    if (period < 1) return out;
    const denom = period * (period + 1) / 2;
    for(let i = 0; i < values.length; i++){
        if (i < period - 1) continue;
        let sum = 0;
        let ok = true;
        for(let j = 0; j < period; j++){
            const v = values[i - period + 1 + j];
            if (v == null) {
                ok = false;
                break;
            }
            sum += v * (j + 1);
        }
        if (ok) out[i] = sum / denom;
    }
    return out;
}
function applySmoothing(values, type, length) {
    if (type === "none" || length < 1) return values;
    if (type === "sma") return smaOfNullable(values, length);
    if (type === "ema") return emaOfNullable(values, length);
    if (type === "smma") return rmaOfNullable(values, length);
    return wmaOfNullable(values, length);
}
function applyOffset(values, offset) {
    if (!offset) return values;
    const out = Array(values.length).fill(null);
    for(let i = 0; i < values.length; i++){
        const src = i - offset;
        if (src >= 0 && src < values.length) out[i] = values[src];
    }
    return out;
}
function rollingStdev(values, period) {
    const out = Array(values.length).fill(null);
    if (period < 1) return out;
    for(let i = period - 1; i < values.length; i++){
        let sum = 0;
        let ok = true;
        for(let j = i - period + 1; j <= i; j++){
            const v = values[j];
            if (v == null) {
                ok = false;
                break;
            }
            sum += v;
        }
        if (!ok) continue;
        const mean = sum / period;
        let variance = 0;
        for(let j = i - period + 1; j <= i; j++){
            const d = values[j] - mean;
            variance += d * d;
        }
        out[i] = Math.sqrt(variance / period);
    }
    return out;
}
function computeEmaPlot(candles, settings) {
    let line = computeEma(candles, settings.period, settings.source);
    line = applySmoothing(line, settings.smoothingType, settings.smoothingLength);
    line = applyOffset(line, settings.offset);
    let upper = null;
    let lower = null;
    if (settings.smoothingType !== "none" && settings.bbStdDev > 0) {
        const std = rollingStdev(line, settings.smoothingLength);
        upper = line.map((v, i)=>v == null || std[i] == null ? null : v + settings.bbStdDev * std[i]);
        lower = line.map((v, i)=>v == null || std[i] == null ? null : v - settings.bbStdDev * std[i]);
    }
    return {
        line,
        upper,
        lower
    };
}
function computeBollinger(candles, period = 20, mult = 2, source = "close", maType = "sma") {
    const basis = Array(candles.length).fill(null);
    const upper = Array(candles.length).fill(null);
    const lower = Array(candles.length).fill(null);
    if (period < 1 || candles.length < period) return {
        basis,
        upper,
        lower
    };
    const src = candles.map((c)=>candleSource(c, source));
    let mid;
    if (maType === "ema") mid = emaOfValues(src, period);
    else if (maType === "smma") mid = rmaOfNullable(src.map((v)=>v), period);
    else if (maType === "wma") mid = wmaOfNullable(src.map((v)=>v), period);
    else mid = smaSeries(src.map((v)=>v), period);
    const std = rollingStdev(src.map((v)=>v), period);
    for(let i = 0; i < candles.length; i++){
        if (mid[i] == null || std[i] == null) continue;
        basis[i] = mid[i];
        upper[i] = mid[i] + mult * std[i];
        lower[i] = mid[i] - mult * std[i];
    }
    return {
        basis,
        upper,
        lower
    };
}
function computeBbPlot(candles, settings) {
    const bands = computeBollinger(candles, settings.period, settings.mult, settings.source, settings.maType);
    return {
        basis: applyOffset(bands.basis, settings.offset),
        upper: applyOffset(bands.upper, settings.offset),
        lower: applyOffset(bands.lower, settings.offset)
    };
}
function computeRsi(candles, period = 14) {
    const out = Array(candles.length).fill(null);
    if (candles.length <= period) return out;
    let gain = 0;
    let loss = 0;
    for(let i = 1; i <= period; i++){
        const delta = candles[i].close - candles[i - 1].close;
        if (delta >= 0) gain += delta;
        else loss -= delta;
    }
    let avgGain = gain / period;
    let avgLoss = loss / period;
    out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    for(let i = period + 1; i < candles.length; i++){
        const delta = candles[i].close - candles[i - 1].close;
        avgGain = (avgGain * (period - 1) + Math.max(delta, 0)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.max(-delta, 0)) / period;
        out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
    return out;
}
function smaSeries(values, period) {
    const out = Array(values.length).fill(null);
    if (period < 1) return out;
    for(let i = 0; i < values.length; i++){
        if (i < period - 1) continue;
        let sum = 0;
        let ok = true;
        for(let j = i - period + 1; j <= i; j++){
            const v = values[j];
            if (v == null) {
                ok = false;
                break;
            }
            sum += v;
        }
        if (ok) out[i] = sum / period;
    }
    return out;
}
function computeStochastic(candles, length = 14, kSmoothing = 3, dSmoothing = 3) {
    const rawK = Array(candles.length).fill(null);
    for(let i = length - 1; i < candles.length; i++){
        let hi = candles[i - length + 1].high;
        let lo = candles[i - length + 1].low;
        for(let j = i - length + 2; j <= i; j++){
            if (candles[j].high > hi) hi = candles[j].high;
            if (candles[j].low < lo) lo = candles[j].low;
        }
        const range = hi - lo;
        rawK[i] = range === 0 ? 50 : (candles[i].close - lo) / range * 100;
    }
    const k = smaSeries(rawK, Math.max(1, kSmoothing));
    const d = smaSeries(k, Math.max(1, dSmoothing));
    return {
        k,
        d
    };
}
function trueRange(candle, prev) {
    return Math.max(candle.high - candle.low, Math.abs(candle.high - prev.close), Math.abs(candle.low - prev.close));
}
function computeAtr(candles, period = 14) {
    const out = Array(candles.length).fill(null);
    if (candles.length <= period) return out;
    let atr = 0;
    for(let i = 1; i <= period; i++){
        atr += trueRange(candles[i], candles[i - 1]);
    }
    atr /= period;
    out[period] = atr;
    for(let i = period + 1; i < candles.length; i++){
        atr = (atr * (period - 1) + trueRange(candles[i], candles[i - 1])) / period;
        out[i] = atr;
    }
    return out;
}
function computeAdx(candles, period = 14) {
    const out = Array(candles.length).fill(null);
    if (candles.length <= period * 2) return out;
    const tr = Array(candles.length).fill(0);
    const plusDM = Array(candles.length).fill(0);
    const minusDM = Array(candles.length).fill(0);
    for(let i = 1; i < candles.length; i++){
        const up = candles[i].high - candles[i - 1].high;
        const down = candles[i - 1].low - candles[i].low;
        plusDM[i] = up > down && up > 0 ? up : 0;
        minusDM[i] = down > up && down > 0 ? down : 0;
        tr[i] = trueRange(candles[i], candles[i - 1]);
    }
    let atr = 0;
    let plus = 0;
    let minus = 0;
    for(let i = 1; i <= period; i++){
        atr += tr[i];
        plus += plusDM[i];
        minus += minusDM[i];
    }
    const dx = Array(candles.length).fill(null);
    const smooth = (prev, value)=>prev - prev / period + value;
    for(let i = period; i < candles.length; i++){
        if (i > period) {
            atr = smooth(atr, tr[i]);
            plus = smooth(plus, plusDM[i]);
            minus = smooth(minus, minusDM[i]);
        }
        const plusDI = atr === 0 ? 0 : 100 * plus / atr;
        const minusDI = atr === 0 ? 0 : 100 * minus / atr;
        const sum = plusDI + minusDI;
        dx[i] = sum === 0 ? 0 : 100 * Math.abs(plusDI - minusDI) / sum;
    }
    // First ADX = SMA of first `period` DX values starting at index `period`.
    let adxSum = 0;
    let count = 0;
    const start = period;
    const firstAdxIdx = start + period - 1;
    for(let i = start; i <= firstAdxIdx && i < candles.length; i++){
        if (dx[i] != null) {
            adxSum += dx[i];
            count += 1;
        }
    }
    if (count === 0 || firstAdxIdx >= candles.length) return out;
    let adx = adxSum / count;
    out[firstAdxIdx] = adx;
    for(let i = firstAdxIdx + 1; i < candles.length; i++){
        adx = (adx * (period - 1) + (dx[i] ?? 0)) / period;
        out[i] = adx;
    }
    return out;
}
function vwapAnchorKey(time, anchor) {
    const d = new Date(time * 1000);
    if (anchor === "month") return d.getUTCFullYear() * 100 + (d.getUTCMonth() + 1);
    if (anchor === "week") {
        // ISO-ish week bucket: year*100 + week-of-year from Thursday-based week
        const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
        day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
        const week = Math.ceil(((day.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
        return day.getUTCFullYear() * 100 + week;
    }
    return Math.floor(time / 86400);
}
function computeVwap(candles, source = "hlc3", anchorPeriod = "session") {
    let pv = 0;
    let vol = 0;
    let key = Number.NaN;
    return candles.map((c)=>{
        const nextKey = vwapAnchorKey(c.time, anchorPeriod);
        if (nextKey !== key) {
            pv = 0;
            vol = 0;
            key = nextKey;
        }
        const typical = candleSource(c, source);
        // Forex / zero-volume bars: fall back to equal weight (TWAP) so the line still plots.
        const weight = c.volume > 0 ? c.volume : 1;
        pv += typical * weight;
        vol += weight;
        return vol === 0 ? null : pv / vol;
    });
}
function computeVwapPlot(candles, settings, chartTf) {
    if (settings.hideOn1DOrAbove && chartTf && (chartTf === "1D" || chartTf === "1W" || chartTf === "1M")) {
        return Array(candles.length).fill(null);
    }
    const values = computeVwap(candles, settings.source, settings.anchorPeriod);
    return applyOffset(values, settings.offset);
}
function lastDefined(values) {
    for(let i = values.length - 1; i >= 0; i--){
        if (values[i] != null) return values[i];
    }
    return null;
}
function toLineData(candles, values) {
    const out = [];
    for(let i = 0; i < candles.length; i++){
        const v = values[i];
        if (v == null) continue;
        out.push({
            time: candles[i].time,
            value: v
        });
    }
    return out;
}
function computePmo(candles, period1 = 35, period2 = 20, signalPeriod = 10, source = "close") {
    const out = Array(candles.length).fill(null);
    if (candles.length < 2) {
        return {
            pmo: out,
            signal: Array(candles.length).fill(null)
        };
    }
    const src = candles.map((c)=>candleSource(c, source));
    const k1 = 2 / period1;
    const k2 = 2 / period2;
    // Calculate 1-period rate of change
    const roc = Array(candles.length).fill(null);
    for(let i = 1; i < candles.length; i++){
        if (src[i - 1] === 0) {
            roc[i] = null;
        } else {
            roc[i] = src[i] / src[i - 1] * 100 - 100;
        }
    }
    // First smoothing
    const smooth1 = Array(candles.length).fill(null);
    let s1 = null;
    for(let i = 1; i < candles.length; i++){
        if (roc[i] == null) continue;
        if (s1 == null) {
            s1 = roc[i];
            smooth1[i] = s1;
        } else {
            s1 = s1 + k1 * (roc[i] - s1);
            smooth1[i] = s1;
        }
    }
    // Second smoothing (PMO line) - multiply by 10 for scale
    let pmo = null;
    for(let i = 1; i < candles.length; i++){
        if (smooth1[i] == null) continue;
        if (pmo == null) {
            pmo = 10 * smooth1[i];
            out[i] = pmo;
        } else {
            pmo = pmo + k2 * (10 * smooth1[i] - pmo);
            out[i] = pmo;
        }
    }
    // Signal line (EMA of PMO)
    const signal = emaOfNullable(out, signalPeriod);
    return {
        pmo: out,
        signal
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/layouts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LAYOUT_COUNTS",
    ()=>LAYOUT_COUNTS,
    "frToTemplate",
    ()=>frToTemplate,
    "layoutKey",
    ()=>layoutKey,
    "layoutTemplate",
    ()=>layoutTemplate
]);
function frToTemplate(tracks) {
    return tracks.map((t)=>`${Math.max(0.08, t)}fr`).join(" ");
}
function layoutKey(count, orientation) {
    return `${count}-${orientation}`;
}
function layoutTemplate(count, orientation) {
    if (count === 1) {
        return {
            columns: "1fr",
            rows: "1fr",
            areas: [
                "1 / 1"
            ],
            colFr: [
                1
            ],
            rowFr: [
                1
            ]
        };
    }
    if (count === 2) {
        return orientation === "v" ? {
            columns: "1fr",
            rows: "1fr 1fr",
            areas: [
                "1 / 1",
                "2 / 1"
            ],
            colFr: [
                1
            ],
            rowFr: [
                1,
                1
            ]
        } : {
            columns: "1fr 1fr",
            rows: "1fr",
            areas: [
                "1 / 1",
                "1 / 2"
            ],
            colFr: [
                1,
                1
            ],
            rowFr: [
                1
            ]
        };
    }
    if (count === 3) {
        return {
            columns: "1.35fr 1fr",
            rows: "1fr 1fr",
            areas: [
                "1 / 1 / 3 / 2",
                "1 / 2",
                "2 / 2"
            ],
            colFr: [
                1.35,
                1
            ],
            rowFr: [
                1,
                1
            ]
        };
    }
    if (count === 4) {
        return {
            columns: "1fr 1fr",
            rows: "1fr 1fr",
            areas: [
                "1 / 1",
                "1 / 2",
                "2 / 1",
                "2 / 2"
            ],
            colFr: [
                1,
                1
            ],
            rowFr: [
                1,
                1
            ]
        };
    }
    if (count === 5) {
        return {
            columns: "1fr 1fr 1fr",
            rows: "1fr 1fr",
            areas: [
                "1 / 1 / 2 / 3",
                "1 / 3",
                "2 / 1",
                "2 / 2",
                "2 / 3"
            ],
            colFr: [
                1,
                1,
                1
            ],
            rowFr: [
                1,
                1
            ]
        };
    }
    if (count === 6) {
        return orientation === "v" ? {
            columns: "1fr 1fr",
            rows: "1fr 1fr 1fr",
            areas: [
                "1 / 1",
                "1 / 2",
                "2 / 1",
                "2 / 2",
                "3 / 1",
                "3 / 2"
            ],
            colFr: [
                1,
                1
            ],
            rowFr: [
                1,
                1,
                1
            ]
        } : {
            columns: "1fr 1fr 1fr",
            rows: "1fr 1fr",
            areas: [
                "1 / 1",
                "1 / 2",
                "1 / 3",
                "2 / 1",
                "2 / 2",
                "2 / 3"
            ],
            colFr: [
                1,
                1,
                1
            ],
            rowFr: [
                1,
                1
            ]
        };
    }
    if (count === 7) {
        return {
            columns: "1.35fr 1fr 1fr",
            rows: "1fr 1fr 1fr",
            areas: [
                "1 / 1 / 4 / 2",
                "1 / 2",
                "1 / 3",
                "2 / 2",
                "2 / 3",
                "3 / 2",
                "3 / 3"
            ],
            colFr: [
                1.35,
                1,
                1
            ],
            rowFr: [
                1,
                1,
                1
            ]
        };
    }
    if (count === 8) {
        return {
            columns: "1fr 1fr 1fr 1fr",
            rows: "1fr 1fr",
            areas: [
                "1 / 1",
                "1 / 2",
                "1 / 3",
                "1 / 4",
                "2 / 1",
                "2 / 2",
                "2 / 3",
                "2 / 4"
            ],
            colFr: [
                1,
                1,
                1,
                1
            ],
            rowFr: [
                1,
                1
            ]
        };
    }
    if (count === 9) {
        return {
            columns: "1fr 1fr 1fr",
            rows: "1fr 1fr 1fr",
            areas: [
                "1 / 1",
                "1 / 2",
                "1 / 3",
                "2 / 1",
                "2 / 2",
                "2 / 3",
                "3 / 1",
                "3 / 2",
                "3 / 3"
            ],
            colFr: [
                1,
                1,
                1
            ],
            rowFr: [
                1,
                1,
                1
            ]
        };
    }
    if (count === 10) {
        return {
            columns: "1fr 1fr 1fr 1fr 1fr",
            rows: "1fr 1fr",
            areas: [
                "1 / 1",
                "1 / 2",
                "1 / 3",
                "1 / 4",
                "1 / 5",
                "2 / 1",
                "2 / 2",
                "2 / 3",
                "2 / 4",
                "2 / 5"
            ],
            colFr: [
                1,
                1,
                1,
                1,
                1
            ],
            rowFr: [
                1,
                1
            ]
        };
    }
    if (count === 11) {
        return {
            columns: "repeat(12, 1fr)",
            rows: "1fr 1fr 1fr",
            areas: [
                "1 / 1 / 2 / 5",
                "1 / 5 / 2 / 9",
                "1 / 9 / 2 / 13",
                "2 / 1 / 3 / 4",
                "2 / 4 / 3 / 7",
                "2 / 7 / 3 / 10",
                "2 / 10 / 3 / 13",
                "3 / 1 / 4 / 4",
                "3 / 4 / 4 / 7",
                "3 / 7 / 4 / 10",
                "3 / 10 / 4 / 13"
            ],
            colFr: Array.from({
                length: 12
            }, ()=>1),
            rowFr: [
                1,
                1,
                1
            ]
        };
    }
    return {
        columns: "1fr 1fr 1fr 1fr",
        rows: "1fr 1fr 1fr",
        areas: [
            "1 / 1",
            "1 / 2",
            "1 / 3",
            "1 / 4",
            "2 / 1",
            "2 / 2",
            "2 / 3",
            "2 / 4",
            "3 / 1",
            "3 / 2",
            "3 / 3",
            "3 / 4"
        ],
        colFr: [
            1,
            1,
            1,
            1
        ],
        rowFr: [
            1,
            1,
            1
        ]
    };
}
const LAYOUT_COUNTS = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/live/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LiveApiError",
    ()=>LiveApiError,
    "LiveAuthError",
    ()=>LiveAuthError,
    "liveApi",
    ()=>liveApi,
    "setCsrf",
    ()=>setCsrf
]);
let csrfToken = null;
function setCsrf(token) {
    csrfToken = token;
}
class LiveAuthError extends Error {
    constructor(){
        super("Live session expired");
        this.name = "LiveAuthError";
    }
}
class LiveApiError extends Error {
    code;
    status;
    constructor(code, message, status){
        super(message), this.code = code, this.status = status;
        this.name = "LiveApiError";
    }
}
async function call(path, init = {}) {
    const headers = {};
    if (init.body !== undefined) headers["content-type"] = "application/json";
    if (init.method && init.method !== "GET" && csrfToken) headers["x-maws-csrf"] = csrfToken;
    const res = await fetch(path, {
        method: init.method ?? "GET",
        headers,
        credentials: "same-origin",
        body: init.body !== undefined ? JSON.stringify(init.body) : undefined
    });
    if (res.status === 401) throw new LiveAuthError();
    const data = await res.json().catch(()=>null);
    if (!res.ok) {
        const errorBody = data && typeof data === "object" ? data.error : undefined;
        const errorObject = errorBody && typeof errorBody === "object" ? errorBody : null;
        const code = typeof errorObject?.code === "string" ? errorObject.code : "http_error";
        const message = typeof errorBody === "string" ? errorBody : typeof errorObject?.message === "string" ? errorObject.message : `Request failed (${res.status})`;
        throw new LiveApiError(code, message, res.status);
    }
    return data;
}
const liveApi = {
    session () {
        return call("/api/auth/session");
    },
    login (password) {
        return call("/api/auth/login", {
            method: "POST",
            body: {
                password
            }
        });
    },
    logout () {
        return call("/api/auth/logout", {
            method: "POST",
            body: {}
        });
    },
    connect () {
        return call("/api/live/connect", {
            method: "POST",
            body: {}
        });
    },
    disconnect () {
        return call("/api/live/disconnect", {
            method: "POST",
            body: {}
        });
    },
    meta () {
        return call("/api/live/meta");
    },
    profiles () {
        return call("/api/live/profiles");
    },
    profile () {
        return call("/api/live/profile");
    },
    switchProfile (input) {
        return call("/api/live/profile/switch", {
            method: "POST",
            body: input
        });
    },
    state () {
        return call("/api/live/state");
    },
    submitOrder (input) {
        return call("/api/live/orders", {
            method: "POST",
            body: input
        });
    },
    cancelOrder (clientOrderId, symbol) {
        return call("/api/live/orders/cancel", {
            method: "POST",
            body: {
                clientOrderId,
                symbol
            }
        });
    },
    closePosition (symbol) {
        return call("/api/live/positions/close", {
            method: "POST",
            body: {
                symbol
            }
        });
    },
    protect (input) {
        return call("/api/live/protect", {
            method: "POST",
            body: input
        });
    },
    setGates (input) {
        return call("/api/live/gates", {
            method: "POST",
            body: input
        });
    },
    reconcile () {
        return call("/api/live/reconcile", {
            method: "POST",
            body: {}
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/live/bridge.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectLiveBroker",
    ()=>connectLiveBroker,
    "disconnectLiveBroker",
    ()=>disconnectLiveBroker,
    "profileErrorMessage",
    ()=>profileErrorMessage,
    "profileLabel",
    ()=>profileLabel,
    "profilePhaseLabel",
    ()=>profilePhaseLabel,
    "redirectToLogin",
    ()=>redirectToLogin,
    "restoreLiveSessionIfAttached",
    ()=>restoreLiveSessionIfAttached,
    "restoreServerProfile",
    ()=>restoreServerProfile,
    "stopLiveBridgeForTests",
    ()=>stopLiveBridgeForTests,
    "switchLiveProfile",
    ()=>switchLiveProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/trading/mock.ts [app-client] (ecmascript) <locals>");
;
;
;
;
let es = null;
let refreshTimer = null;
let started = false;
let attachmentEpoch = 0;
const PROFILE_LABELS = {
    paper: "Paper Trading",
    "binance-testnet": "Binance Testnet",
    "binance-production": "Binance Production"
};
const PROFILE_ERROR_TEXT = {
    invalid_profile: "That profile is not available.",
    production_confirmation_required: "Production confirmation is required.",
    profile_switch_in_progress: "Another profile switch is already in progress.",
    exposure_present: "Switching is blocked because open positions or orders exist.",
    exposure_unknown: "Switching is blocked because exposure could not be confirmed.",
    in_flight_mutation: "Switching is blocked while order work is still in flight.",
    reconciliation_drift: "Switching is blocked because reconciliation drift must be resolved.",
    target_start_failed: "The requested profile could not be started.",
    rollback_failed: "The profile could not be restored; trading is fail-closed.",
    configuration_unavailable: "That profile is not configured on the server.",
    stale_profile: "The profile changed while this action was running. Retry."
};
function profileIdForEnvironment(environment) {
    if (environment === "local") return null;
    if (environment === "testnet") return "binance-testnet";
    if (environment === "production") return "binance-production";
    return null;
}
function fallbackStatus(meta) {
    const profileId = profileIdForEnvironment(meta.env);
    const ready = meta.managerStatus === "ready" && meta.health.streamHealthy;
    return {
        profileId,
        environment: profileId === "paper" ? "paper" : profileId === "binance-testnet" ? "testnet" : profileId === "binance-production" ? "production" : null,
        phase: ready ? "ready" : "degraded",
        ready,
        managerStatus: meta.managerStatus,
        streamHealthy: meta.health.streamHealthy,
        executionAllowed: meta.health.execution?.canSubmit ?? ready,
        generation: 0,
        reasonCode: ready ? null : "target_start_failed"
    };
}
function isReady(status) {
    return status.profileId !== null && status.phase === "ready" && status.ready === true;
}
function statusMatches(left, right) {
    return left.profileId === right.profileId && left.generation === right.generation;
}
function safeErrorText(error, fallback = "The live profile operation could not be completed.") {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"]) return PROFILE_ERROR_TEXT[error.code] ?? fallback;
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]) return "Your operator session expired. Sign in again.";
    return fallback;
}
function requestId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
function applyProfileStatus(status) {
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().setProfileRuntime(status);
}
async function enableAuthenticatedExecution(profileId) {
    if (profileId === null || profileId === "paper") return;
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].setGates({
            executionEnabled: true
        });
        return;
    } catch  {
    // Refresh the session once so a rotated CSRF token does not leave a newly
    // authenticated profile waiting for a manual execution action.
    }
    try {
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].session();
        if (!session.authenticated) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCsrf"])(session.csrf ?? null);
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].setGates({
            executionEnabled: true
        });
    } catch  {
    // Keep the profile attached; health and the admin page surface any
    // remaining readiness block without hiding the cause.
    }
}
function detachClient(clearRuntime = true) {
    stopSse();
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
    const live = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState();
    live.setAttached(false);
    live.clearState();
    if (clearRuntime) live.clearProfileRuntime();
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setConnectedBroker(null);
}
function isCurrentAttachment(status, epoch) {
    const live = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState();
    return epoch === attachmentEpoch && live.ready && statusMatches(live, status);
}
function isCurrentSubscription(status, epoch) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().attached && isCurrentAttachment(status, epoch);
}
async function refreshState(expected) {
    try {
        const state = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].state();
        if (expected && !isCurrentAttachment(expected.status, expected.epoch)) return false;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().applyState(state);
        return true;
    } catch (err) {
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]) redirectToLogin();
        return false;
    }
}
/** Coalesces bursts of stream events into one refetch. */ function scheduleRefresh(expected) {
    if (refreshTimer) return;
    refreshTimer = setTimeout(()=>{
        refreshTimer = null;
        if (isCurrentSubscription(expected.status, expected.epoch)) void refreshState(expected);
    }, 250);
}
function redirectToLogin() {
    if (("TURBOPACK compile-time value", "object") !== "undefined" && window.location.pathname !== "/login") {
        // Hard navigation on purpose: the session is dead, so a full page load
        // tears down the SSE bridge and all live client state before sign-in.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
    }
}
function onSseEvent(name, raw, expected) {
    if (!isCurrentSubscription(expected.status, expected.epoch)) return;
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState();
    try {
        const data = JSON.parse(raw);
        switch(name){
            case "state":
                store.applyState(data);
                break;
            case "health":
                store.setHealth(data);
                break;
            case "mark-price":
                {
                    const mp = data;
                    store.setMarkPrice({
                        connected: mp.connected === true,
                        stale: mp.stale === true,
                        symbols: Number(mp.symbols ?? 0),
                        lastEventAt: typeof mp.lastEventAt === "number" ? mp.lastEventAt : null,
                        reconnects: Number(mp.reconnects ?? 0)
                    });
                    break;
                }
            case "stream-status":
                store.setStream({
                    connected: data.connected === true,
                    leaseOwned: data.leaseOwned === true,
                    phase: String(data.phase ?? ""),
                    reconnects: Number(data.reconnects ?? 0)
                });
                break;
            case "order-update":
            case "account-update":
            case "snapshot":
            case "uncertainty-cleared":
                scheduleRefresh(expected);
                break;
            case "fills":
                {
                    const fills = data;
                    if (Array.isArray(fills) && fills.length > 0) {
                        const total = fills.reduce((sum, fill)=>sum + (fill.realizedPnl || 0), 0);
                        store.notify("info", `Fill: ${fills[0].symbol} ${fills[0].side} ${fills[0].qty} @ ${fills[0].price}${total !== 0 ? ` (P&L ${total >= 0 ? "+" : ""}${total.toFixed(2)})` : ""}`);
                    }
                    scheduleRefresh(expected);
                    break;
                }
            default:
                break;
        }
    } catch  {
    // Malformed SSE payload: ignore; the next refresh heals state.
    }
}
function startSse(status, epoch) {
    if (es) return;
    es = new EventSource("/api/live/events");
    const names = [
        "state",
        "health",
        "stream-status",
        "order-update",
        "account-update",
        "snapshot",
        "fills",
        "uncertainty-cleared",
        "mark-price"
    ];
    for (const name of names){
        es.addEventListener(name, (event)=>onSseEvent(name, event.data, {
                status,
                epoch
            }));
    }
    es.onerror = ()=>{
    // EventSource reconnects on its own; surface staleness via health polls.
    };
}
function stopSse() {
    attachmentEpoch += 1;
    es?.close();
    es = null;
}
async function attachConfirmedProfile(status, verifyAfterState) {
    if (!isReady(status) || status.profileId === "paper") return false;
    applyProfileStatus(status);
    const epoch = attachmentEpoch;
    const loaded = await refreshState({
        status,
        epoch
    });
    if (!loaded || epoch !== attachmentEpoch) return false;
    let confirmed = status;
    if (verifyAfterState) {
        confirmed = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].profile();
        if (!isReady(confirmed) || !statusMatches(confirmed, status) || epoch !== attachmentEpoch) return false;
        applyProfileStatus(confirmed);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().setAttached(true);
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setConnectedBroker("binance");
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setBottomOpen(false);
    await enableAuthenticatedExecution(confirmed.profileId);
    startSse(confirmed, epoch);
    return true;
}
async function waitForReady(initial, target) {
    if (isReady(initial) && initial.profileId === target) return initial;
    let status = initial;
    for(let attempt = 0; attempt < 120; attempt += 1){
        if (status.profileId === target && (status.phase === "failed" || status.phase === "detached")) return status;
        await new Promise((resolve)=>setTimeout(resolve, 250));
        status = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].profile();
        if (isReady(status) && status.profileId === target) return status;
    }
    return status;
}
async function restoreServerProfile() {
    try {
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].session();
        if (!session.authenticated) {
            const paperAttached = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().connectedBroker === "mock";
            detachClient();
            if (session.env === "local" && paperAttached) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["connectMock"])();
            return;
        }
        if (session.env === "local") {
            // Local mode is chart-only. Do not probe protected live APIs or restore
            // an exchange attachment from a browser claim. A persisted Paper
            // attachment remains a browser-local choice.
            const paperAttached = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().connectedBroker === "mock";
            detachClient();
            if (paperAttached) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["connectMock"])();
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCsrf"])(session.csrf ?? null);
        let status;
        try {
            status = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].profile();
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"] && error.code === "env_local") return;
            throw error;
        }
        applyProfileStatus(status);
        if (!isReady(status)) {
            if (status.profileId && status.phase === "degraded") {
                detachClient(false);
                applyProfileStatus(status);
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setConnectedBroker("binance");
            } else {
                // A persisted paper attachment is not authoritative. A non-ready or
                // empty server status leaves the workspace in chart-only mode while
                // preserving the paper books themselves.
                detachClient(false);
                applyProfileStatus(status);
            }
            return;
        }
        if (status.profileId === "paper") {
            detachClient(false);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["connectMock"])();
            applyProfileStatus(status);
            return;
        }
        stopSse();
        if (!await attachConfirmedProfile(status, true)) {
            detachClient(false);
            applyProfileStatus(status);
        }
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]) {
            detachClient();
            redirectToLogin();
            return;
        }
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"] && error.code === "env_local") return;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().connectedBroker === "binance") detachClient();
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().notify("error", safeErrorText(error, "Live profile status is unavailable."));
    }
}
async function connectLiveBroker() {
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState();
    try {
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].session();
        if (!session.authenticated) {
            detachClient();
            redirectToLogin();
            return "unauthenticated";
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCsrf"])(session.csrf ?? null);
        store.setEnv(session.env, session.envLabel ?? null);
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].connect();
        const meta = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].meta();
        store.setManager(meta.managerStatus, meta.managerError);
        const status = fallbackStatus(meta);
        applyProfileStatus(status);
        store.setHealth(meta.health);
        if (!isReady(status) || !await attachConfirmedProfile(status, false)) {
            detachClient(false);
            store.setManager("error", "Live profile is not ready");
            store.notify("error", "Live profile is not ready.");
            return "error";
        }
        return "connected";
    } catch (error) {
        detachClient();
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]) {
            redirectToLogin();
            return "unauthenticated";
        }
        store.setManager("error", safeErrorText(error, "Live broker unavailable."));
        store.notify("error", safeErrorText(error, "Live broker unavailable."));
        return "error";
    }
}
async function switchLiveProfile(target, confirmProduction = false) {
    const previous = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState();
    try {
        const hasServerProfile = previous.profileId !== null || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().connectedBroker === "binance";
        if (target === "paper" && !hasServerProfile) {
            // Paper is a browser-local attachment when no server profile is active.
            detachClient();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["connectMock"])();
            return "paper";
        }
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].session();
        if (!session.authenticated) {
            detachClient();
            redirectToLogin();
            return "unauthenticated";
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCsrf"])(session.csrf ?? null);
        stopSse();
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().beginProfileSwitch();
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].switchProfile({
            profileId: target,
            confirmProduction,
            requestId: requestId()
        });
        const status = target === "paper" ? response : await waitForReady(response, target);
        if (target === "paper") {
            if (status.profileId !== null || status.phase === "failed" || status.phase === "detached") {
                applyProfileStatus(status);
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"](status.reasonCode ?? "target_start_failed", PROFILE_ERROR_TEXT[status.reasonCode ?? ""] ?? "Paper Trading could not be selected.", 409);
            }
            detachClient(false);
            applyProfileStatus(status);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["connectMock"])();
            return "paper";
        }
        if (!isReady(status) || status.profileId !== target) {
            applyProfileStatus(status);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"](status.reasonCode ?? "target_start_failed", PROFILE_ERROR_TEXT[status.reasonCode ?? ""] ?? "The requested profile is not ready.", 409);
        }
        if (!await attachConfirmedProfile(status, true)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"]("target_start_failed", "The requested profile could not be attached.", 502);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().notify("success", `${PROFILE_LABELS[target]} is ready.`);
        return "ready";
    } catch (error) {
        let observed = null;
        try {
            observed = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].profile();
        } catch  {
        // The original stable error category is more useful than a second failure.
        }
        if (observed) {
            if (target !== "paper" && observed.phase === "switching") {
                try {
                    observed = await waitForReady(observed, target);
                } catch  {
                // Keep the original error if the status endpoint is unavailable.
                }
            }
            applyProfileStatus(observed);
            if (isReady(observed) && observed.profileId !== "paper") {
                stopSse();
                if (await attachConfirmedProfile(observed, false)) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().notify("error", `${safeErrorText(error)} Previous profile restored.`);
                    return "error";
                }
            } else if (isReady(observed) && observed.profileId === "paper") {
                detachClient(false);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["connectMock"])();
                applyProfileStatus(observed);
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().notify("error", `${safeErrorText(error)} Paper Trading remains active.`);
                return "error";
            }
            detachClient(false);
            applyProfileStatus(observed);
        } else {
            // Do not claim the previous profile is restored without a fresh server status.
            detachClient(false);
            applyProfileStatus({
                profileId: null,
                environment: null,
                phase: "failed",
                ready: false,
                managerStatus: "idle",
                streamHealthy: null,
                executionAllowed: false,
                generation: previous.generation,
                reasonCode: error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"] ? error.code : "target_start_failed"
            });
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().notify("error", safeErrorText(error));
        return "error";
    }
}
async function disconnectLiveBroker() {
    detachClient();
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].disconnect().catch(()=>undefined);
}
async function restoreLiveSessionIfAttached(attachedBroker) {
    if (started || attachedBroker !== "binance") return;
    started = true;
    try {
        await restoreServerProfile();
    } finally{
        started = false;
    }
}
function stopLiveBridgeForTests() {
    stopSse();
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
}
function profileLabel(profileId) {
    return profileId ? PROFILE_LABELS[profileId] : "No active profile";
}
function profilePhaseLabel(phase) {
    if (phase === "switching") return "Switching profile…";
    if (phase === "degraded") return "Degraded";
    if (phase === "detached") return "Detached / fail-closed";
    if (phase === "failed") return "Unavailable";
    if (phase === "ready") return "Ready";
    return "Chart only";
}
function profileErrorMessage(code) {
    return code ? PROFILE_ERROR_TEXT[code] ?? "The live profile operation could not be completed." : "The live profile operation could not be completed.";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/live/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLiveStore",
    ()=>useLiveStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
let noticeSeq = 1;
const useLiveStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set)=>({
        attached: false,
        profileId: null,
        environment: null,
        phase: "idle",
        ready: false,
        executionAllowed: false,
        generation: 0,
        reasonCode: null,
        env: null,
        envLabel: null,
        managerStatus: "idle",
        managerError: null,
        account: null,
        accountMetrics: null,
        positions: [],
        orders: [],
        fills: [],
        health: null,
        stream: null,
        markPrice: null,
        notices: [],
        setAttached: (v)=>set({
                attached: v
            }),
        setProfileRuntime: (status)=>set((state)=>({
                    profileId: status.profileId,
                    environment: status.environment,
                    phase: status.phase,
                    ready: status.ready,
                    executionAllowed: status.executionAllowed,
                    generation: status.generation,
                    reasonCode: status.reasonCode,
                    managerStatus: status.managerStatus,
                    managerError: status.managerError ?? null,
                    env: status.environment,
                    envLabel: status.environment === "paper" ? "Paper Trading" : status.environment === "testnet" ? "Binance Testnet" : status.environment === "production" ? "Binance Production" : null,
                    health: status.phase === "ready" && state.profileId === status.profileId && state.generation === status.generation ? state.health : null,
                    stream: status.streamHealthy == null ? null : {
                        connected: status.streamHealthy,
                        leaseOwned: status.streamHealthy,
                        phase: status.streamHealthy ? "live" : "degraded",
                        reconnects: 0
                    }
                })),
        beginProfileSwitch: ()=>set((state)=>({
                    phase: "switching",
                    ready: false,
                    executionAllowed: false,
                    reasonCode: "profile_switch_in_progress",
                    managerStatus: state.managerStatus || "switching"
                })),
        clearProfileRuntime: ()=>set({
                profileId: null,
                environment: null,
                phase: "idle",
                ready: false,
                executionAllowed: false,
                generation: 0,
                reasonCode: null,
                env: null,
                envLabel: null,
                managerStatus: "idle",
                managerError: null,
                health: null,
                stream: null,
                markPrice: null
            }),
        setEnv: (env, label)=>set({
                env,
                envLabel: label
            }),
        setManager: (status, error)=>set({
                managerStatus: status,
                managerError: error
            }),
        applyState: (s)=>set({
                account: s.account,
                accountMetrics: s.accountMetrics ?? null,
                positions: s.positions,
                orders: s.orders,
                fills: s.fills
            }),
        clearState: ()=>set({
                account: null,
                accountMetrics: null,
                positions: [],
                orders: [],
                fills: []
            }),
        setHealth: (h)=>set({
                health: h,
                markPrice: h.signals?.markPrice ?? null
            }),
        setStream: (s)=>set({
                stream: s
            }),
        setMarkPrice: (s)=>set({
                markPrice: s
            }),
        notify: (tone, text)=>set((st)=>({
                    notices: [
                        ...st.notices.slice(-4),
                        {
                            id: noticeSeq++,
                            tone,
                            text
                        }
                    ]
                })),
        dismissNotice: (id)=>set((st)=>({
                    notices: st.notices.filter((n)=>n.id !== id)
                }))
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/binance-feed.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "binanceFuturesFeed",
    ()=>binanceFuturesFeed,
    "binanceSpotFeed",
    ()=>binanceSpotFeed,
    "resetFeedLifecycleForTests",
    ()=>resetFeedLifecycleForTests
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/indicators.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/binance-intervals.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$feed$2d$normalize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/feed-normalize.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/candle-reconcile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/candle-diagnostics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/visibility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$invariants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/candle-invariants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
const ALL_TFS = [
    "1m",
    "3m",
    "5m",
    "15m",
    "30m",
    "1h",
    "2h",
    "4h",
    "1D",
    "1W",
    "1M"
];
/**
 * Monotonic ms clock for kline freshness stamps. Wall-clock Date.now() steps
 * (NTP resyncs — the same events that show "clock degraded" on /status)
 * distort elapsed-time checks: a forward step spuriously trips the 5s
 * delayed / 15s recovery thresholds and forces a mid-bar REST resync + socket
 * recycle; a backward step suppresses them. performance.now() is immune.
 * Stamps are only ever compared against each other (now - stamp), never
 * against epoch time, so the different origin is safe.
 */ function monotonicMs() {
    return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}
function emptyQuote(symbol) {
    return {
        symbol,
        last: 0,
        open: 0,
        high: 0,
        low: 0,
        volume: 0,
        change: 0,
        changePct: 0,
        rsi: null,
        atr: null
    };
}
function appSymbolFromBinance(binanceSym) {
    const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromBinanceSymbol"])(binanceSym);
    // Accept any USDT contract even before universe finishes loading.
    if (/^[A-Z0-9]+USDT$/i.test(app)) return app.toUpperCase();
    return null;
}
function cloneCandles(candles) {
    return candles.map((c)=>({
            ...c
        }));
}
function historyLimit(tf) {
    // Intraday: one Binance page (1500). Daily+ keep a lighter history window.
    if (tf === "1D" || tf === "1W" || tf === "1M") return 500;
    return 1500;
}
const BINANCE_KLINE_PAGE = 1500;
/**
 * Kline freshness policy. Frames arrive on every trade of the forming bar, so
 * a subscribed series without a valid live frame is:
 *   - "delayed" after KLINE_DELAYED_MS (warning status, exposed to the UI),
 *   - recovered after KLINE_RECOVERY_MS (REST resync + one coordinated
 *     socket recycle handed to the existing exponential-backoff reconnect).
 */ const KLINE_DELAYED_MS = 5_000;
const KLINE_RECOVERY_MS = 15_000;
/**
 * A recovery stays in flight (blocking further forced recoveries for that
 * series) until a fresh valid frame arrives, or until a reconnect has
 * completed and this long has passed without a frame — then it is released
 * for the next backoff-controlled retry.
 */ const KLINE_RECOVERY_RELEASE_MS = 15_000;
/** Health checker period — well under both thresholds. */ const KLINE_HEALTH_CHECK_MS = 1_000;
/** Debounce for the one-shot visible-return reconciliation (no stampede). */ const VISIBLE_RECONCILE_DEBOUNCE_MS = 500;
/**
 * Consecutive visible-tab stale watchdog passes before a forced socket
 * recycle. A single stale pass only starts a passive (merge-only) REST
 * resync; the socket — and the chart state it feeds — stays untouched until
 * staleness is confirmed across multiple passes.
 */ const WATCHDOG_VISIBLE_FAILS_TO_RECOVER = 2;
/**
 * Visible-return reconciliation threshold: a series whose newest bar is this
 * much older than wall-clock time is genuinely stale (bars closed while the
 * tab was hidden) and gets one merge-only REST resync. Unlike the watchdog
 * stamps (which exclude deferred/unknown time), bar age is wall-clock truth.
 */ const VISIBLE_RECONCILE_STALE_FACTOR = 1.5;
/** Approximate bar interval length in seconds (reconcile staleness only). */ function tfSeconds(tf) {
    switch(tf){
        case "1m":
            return 60;
        case "3m":
            return 180;
        case "5m":
            return 300;
        case "15m":
            return 900;
        case "30m":
            return 1_800;
        case "1h":
            return 3_600;
        case "2h":
            return 7_200;
        case "4h":
            return 14_400;
        case "1D":
            return 86_400;
        case "1W":
            return 604_800;
        case "1M":
            return 2_592_000;
    }
}
/**
 * Binance USDT-M Last Price candles for MAWS.
 * REST once for history; live = direct kline socket only.
 * Quotes only for "hot" symbols (watchlist + open panes + orders/positions).
 */ class BinanceFuturesFeed {
    series = new Map();
    listeners = new Map();
    quotes = new Map();
    quoteListeners = new Set();
    /**
   * Immediate (non-debounced) quote listeners for the paper-trading engine.
   * Fired synchronously on every ACCEPTED quote mutation, before the ~150ms
   * UI batching of quoteListeners. UI/chart/watchlist consumers keep using
   * subscribeQuotes and its batching.
   */ tradeQuoteListeners = new Set();
    loaders = new Map();
    /** Per-series next-allowed history retry after a failed fetch (backoff). */ historyRetryNotBefore = new Map();
    /** Consecutive history failures per series (drives retry backoff). */ historyRetryAttempt = new Map();
    liveKeys = new Set();
    historyReady = new Set();
    /** Symbols that should keep live quotes (and cached series while hot). */ hotSymbols = new Set();
    quoteStreamKey = "";
    /** Freshness state per subscribed symbol:tf series. */ klineHealth = new Map();
    /** Latest accepted miniTicker provider event time (E) per symbol. */ lastTickerEventAt = new Map();
    /** Combined kline socket (all subscribed symbol/tf streams on one connection). */ klineRefs = new Map();
    klineWs = null;
    klineWsGeneration = 0;
    klineStreamKey = "";
    klineReconnectAttempt = 0;
    klineHostIndex = 0;
    klineSyncTimer = null;
    quoteWs = null;
    quoteWsGeneration = 0;
    quoteReconnectAttempt = 0;
    started = false;
    tickerPoll = null;
    klineHealthWatch = null;
    quoteEmitTimer = null;
    /** Page-visibility awareness (Chrome background-tab timer throttling). */ lastWatchdogTickAt = 0;
    visibleWatchdogFails = 0;
    visibilityUnsub = null;
    pendingVisibleReconcileTimer = null;
    /** Dev diagnostics counters (NEXT_PUBLIC_DEBUG_CANDLES). */ recoveryCount = 0;
    passiveResyncCount = 0;
    reconnectCount = 0;
    key(symbol, tf) {
        return `${symbol}:${tf}`;
    }
    klineStream(symbol, tf) {
        return `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBinanceSymbol"])(symbol).toLowerCase()}@kline_${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBinanceInterval"])(tf)}`;
    }
    hasLiveChart(symbol) {
        return ALL_TFS.some((tf)=>this.liveKeys.has(this.key(symbol, tf)));
    }
    hasChartListeners(symbol) {
        return ALL_TFS.some((tf)=>(this.listeners.get(this.key(symbol, tf))?.size ?? 0) > 0);
    }
    /**
   * Restrict quote polling / miniTicker streams to these symbols.
   * Cold symbols (not hot, no open chart) drop candle + quote cache.
   */ setHotSymbols(symbols) {
        const next = new Set();
        for (const raw of symbols){
            const sym = String(raw ?? "").toUpperCase().replace(/\.P$/i, "");
            if (sym) next.add(sym);
        }
        const prev = this.hotSymbols;
        this.hotSymbols = next;
        for (const sym of prev){
            if (!next.has(sym) && !this.hasChartListeners(sym)) {
                this.forgetSymbol(sym);
            }
        }
        if (this.started) {
            this.syncQuoteStreams();
            void this.refreshHotTickers();
            // Daily history only for newly hot symbols (avoid REST stampede on every pane click).
            for (const sym of next){
                if (!prev.has(sym)) void this.ensureHistory(sym, "1D");
            }
        }
    }
    getHotSymbols() {
        return [
            ...this.hotSymbols
        ];
    }
    forgetSymbol(symbol) {
        for (const tf of ALL_TFS){
            const key = this.key(symbol, tf);
            this.series.delete(key);
            this.historyReady.delete(key);
            this.liveKeys.delete(key);
            this.loaders.delete(key);
            this.listeners.delete(key);
            this.klineHealth.delete(key);
            this.historyRetryNotBefore.delete(key);
            this.historyRetryAttempt.delete(key);
        }
        this.quotes.delete(symbol);
        this.lastTickerEventAt.delete(symbol);
    }
    getCandles(symbol, tf) {
        const key = this.key(symbol, tf);
        let candles = this.series.get(key);
        if (!candles) {
            candles = [];
            this.series.set(key, candles);
        }
        // Pull history for hot / chart-subscribed symbols (incl. 1D for performance).
        const target = historyLimit(tf);
        const incomplete = !this.historyReady.has(key) || candles.length < Math.min(target, target > BINANCE_KLINE_PAGE ? target - 50 : 10);
        if ((this.hotSymbols.has(symbol) || this.hasChartListeners(symbol)) && incomplete) {
            void this.ensureHistory(symbol, tf);
        }
        return candles;
    }
    getQuote(symbol) {
        const existing = this.quotes.get(symbol);
        if (existing) return existing;
        const q = emptyQuote(symbol);
        if (this.hotSymbols.has(symbol) || this.hasChartListeners(symbol)) {
            this.quotes.set(symbol, q);
        }
        return q;
    }
    getQuotes() {
        return [
            ...this.hotSymbols
        ].map((s)=>this.quotes.get(s) ?? emptyQuote(s));
    }
    subscribe(symbol, tf, listener) {
        const key = this.key(symbol, tf);
        if (!this.listeners.has(key)) this.listeners.set(key, new Set());
        this.listeners.get(key).add(listener);
        // Freshness tracking starts at subscribe. The series reports 'connecting'
        // — never 'live' — until the first valid live kline frame arrives.
        if (!this.klineHealth.has(key)) {
            this.klineHealth.set(key, {
                stamp: monotonicMs(),
                live: false,
                recovering: false,
                recoverySince: 0,
                recoveryGeneration: 0
            });
        }
        const stream = this.klineStream(symbol, tf);
        this.acquireKlineSocket(stream);
        const cached = this.series.get(key);
        void this.ensureHistory(symbol, tf, false).then(()=>{
            if (!this.listeners.get(key)?.has(listener)) return;
            const candles = this.series.get(key) ?? [];
            if (candles.length === 0) return;
            listener(cloneCandles(candles), this.getQuote(symbol), {
                tick: false
            });
        });
        if (cached && cached.length > 0) {
            listener(cloneCandles(cached), this.getQuote(symbol), {
                tick: false
            });
        }
        // Chart open → quote stream can drop this symbol (kline owns last).
        this.syncQuoteStreams();
        return ()=>{
            this.listeners.get(key)?.delete(listener);
            if ((this.listeners.get(key)?.size ?? 0) === 0) {
                this.listeners.delete(key);
                this.liveKeys.delete(key);
                this.klineHealth.delete(key);
            }
            this.releaseKlineSocket(stream);
            this.syncQuoteStreams();
            if (!this.hotSymbols.has(symbol) && !this.hasChartListeners(symbol)) {
                this.forgetSymbol(symbol);
                this.emitQuotesNow();
            }
        };
    }
    subscribeQuotes(listener) {
        this.quoteListeners.add(listener);
        listener(this.quotes);
        return ()=>{
            this.quoteListeners.delete(listener);
        };
    }
    /**
   * Immediate quote channel for the paper-trading engine. Unlike
   * subscribeQuotes (batched ~150ms for UI/render performance), these
   * listeners run synchronously on every ACCEPTED quote mutation, so a TP/SL
   * breach that reverses inside the UI batch window is still evaluated.
   */ subscribeTradeQuotes(listener) {
        this.tradeQuoteListeners.add(listener);
        listener(this.quotes);
        return ()=>{
            this.tradeQuoteListeners.delete(listener);
        };
    }
    /** Synchronous engine evaluation of the current quote state. */ emitTradeQuotes() {
        if (this.tradeQuoteListeners.size === 0) return;
        this.tradeQuoteListeners.forEach((fn)=>fn(this.quotes));
    }
    start() {
        if (this.started) return;
        this.started = true;
        this.lastWatchdogTickAt = monotonicMs();
        this.visibleWatchdogFails = 0;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibilityTracker"].install();
        this.visibilityUnsub = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibilityTracker"].onChange((state)=>this.onVisibilityChange(state));
        if (this.pendingVisibleReconcileTimer != null) {
            window.clearTimeout(this.pendingVisibleReconcileTimer);
            this.pendingVisibleReconcileTimer = null;
        }
        void this.refreshHotTickers();
        this.syncQuoteStreams();
        for (const sym of this.hotSymbols){
            void this.ensureHistory(sym, "1D");
        }
        this.tickerPoll = setInterval(()=>{
            if (this.started) void this.refreshHotTickers();
        }, 15_000);
        this.klineHealthWatch = setInterval(()=>{
            if (this.started) this.checkKlineHealth();
        }, KLINE_HEALTH_CHECK_MS);
        this.syncKlineStreams();
    }
    /**
   * Page Visibility transitions. Hidden: defer the stale-watchdog entirely —
   * no mark-stale, no socket recycle, no REST resync, no candle clears just
   * because Chrome delayed the timers. Visible: schedule ONE debounced,
   * generation-gated, non-destructive reconcile. Never opens a second socket.
   */ onVisibilityChange(state) {
        if (!this.started) return;
        if (state === "hidden") {
            if (this.pendingVisibleReconcileTimer != null) {
                window.clearTimeout(this.pendingVisibleReconcileTimer);
                this.pendingVisibleReconcileTimer = null;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logLifecycleDecision("visibility_hidden_watchdog_deferred", {
                socketsKept: true,
                klineStreams: this.klineRefs.size
            });
            return;
        }
        // Visible again. Snapshot the socket generation now: if a symbol/stream
        // swap happens during the debounce window, the scheduled reconcile is
        // stale and must not act on a series the chart no longer shows.
        const generationAtVisibility = this.klineWsGeneration;
        if (this.pendingVisibleReconcileTimer != null) return;
        this.pendingVisibleReconcileTimer = window.setTimeout(()=>{
            this.pendingVisibleReconcileTimer = null;
            if (generationAtVisibility !== this.klineWsGeneration) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logLifecycleDecision("visible_reconcile_skipped_stale_generation", {
                    scheduledGeneration: generationAtVisibility,
                    currentGeneration: this.klineWsGeneration
                });
                return;
            }
            this.reconcileAfterVisible();
        }, VISIBLE_RECONCILE_DEBOUNCE_MS);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logLifecycleDecision("visibility_visible_reconcile_scheduled", {
            generation: generationAtVisibility
        });
    }
    /**
   * One non-destructive reconciliation after returning to visible: merge-only
   * REST resync for series whose newest bar is genuinely old (bars closed
   * while hidden). Candles are never cleared; the socket is never recycled;
   * no new subscription is created.
   */ reconcileAfterVisible() {
        if (!this.started || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibilityTracker"].isHidden()) return;
        const now = monotonicMs();
        this.lastWatchdogTickAt = now;
        this.visibleWatchdogFails = 0;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibilityTracker"].noteReconcile();
        const nowSec = Date.now() / 1000;
        let resynced = 0;
        for (const key of this.listeners.keys()){
            if ((this.listeners.get(key)?.size ?? 0) === 0) continue;
            const h = this.klineHealth.get(key);
            if (!h?.live) continue; // connecting series: history fetch already in flight
            const sep = key.indexOf(":");
            if (sep <= 0) continue;
            const symbol = key.slice(0, sep);
            const tf = key.slice(sep + 1);
            const tip = this.series.get(key)?.at(-1);
            const tfSec = tfSeconds(tf);
            const stale = tip != null && tfSec != null && nowSec - tip.time >= VISIBLE_RECONCILE_STALE_FACTOR * tfSec;
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logLifecycleDecision("visible_reconcile_series", {
                key,
                stale,
                tipAgeSec: tip ? Math.round(nowSec - tip.time) : null,
                generation: this.klineWsGeneration
            });
            if (stale) {
                resynced += 1;
                this.passiveResyncCount += 1;
                void this.ensureHistory(symbol, tf, true);
            }
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logLifecycleDecision("visibility_visible_reconcile", {
            resynced,
            generation: this.klineWsGeneration,
            socketState: this.klineWs ? String(this.klineWs.readyState) : "none"
        });
    }
    /** Dev diagnostics (NEXT_PUBLIC_DEBUG_CANDLES=true consumers). */ getFeedDiagnostics() {
        return {
            started: this.started,
            visibility: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibilityTracker"].getDiagnostics(),
            klineGeneration: this.klineWsGeneration,
            quoteGeneration: this.quoteWsGeneration,
            klineSocketState: this.klineWs ? this.klineWs.readyState : -1,
            quoteSocketState: this.quoteWs ? this.quoteWs.readyState : -1,
            klineStreamCount: this.klineRefs.size,
            chartListenerKeys: this.listeners.size,
            chartListenerCount: [
                ...this.listeners.values()
            ].reduce((n, s)=>n + s.size, 0),
            quoteListenerCount: this.quoteListeners.size + this.tradeQuoteListeners.size,
            visibleWatchdogFails: this.visibleWatchdogFails,
            reconnectAttempt: this.klineReconnectAttempt,
            recoveryCount: this.recoveryCount,
            passiveResyncCount: this.passiveResyncCount,
            reconnectCount: this.reconnectCount
        };
    }
    /** Re-pull REST tickers for the current hot set. */ refreshQuotes() {
        if (!this.started) return;
        void this.refreshHotTickers();
    }
    /**
   * Freshness status for a charted series:
   *   - "idle":       not subscribed
   *   - "connecting": subscribed, still waiting for the FIRST valid live frame
   *   - "live":       a valid live frame arrived within KLINE_DELAYED_MS
   *   - "delayed":    no valid live frame for >= KLINE_DELAYED_MS
   * Subscribing alone never makes a series "live". Delayed/recovery state
   * clears ONLY when a fresh valid frame arrives (applyKline).
   */ getKlineStatus(symbol, tf) {
        const key = this.key(symbol, tf);
        if ((this.listeners.get(key)?.size ?? 0) === 0) return "idle";
        const h = this.klineHealth.get(key);
        if (!h) return "connecting";
        if (monotonicMs() - h.stamp >= KLINE_DELAYED_MS) return "delayed";
        return h.live ? "live" : "connecting";
    }
    isKlineDelayed(symbol, tf) {
        return this.getKlineStatus(symbol, tf) === "delayed";
    }
    /** True while a stale-recovery attempt is in flight for this series. */ isKlineRecovering(symbol, tf) {
        const key = this.key(symbol, tf);
        if ((this.listeners.get(key)?.size ?? 0) === 0) return false;
        return this.klineHealth.get(key)?.recovering === true;
    }
    /**
   * Health checker (every KLINE_HEALTH_CHECK_MS). Browser scheduling-aware:
   *
   *  - Event-loop gaps (hidden-tab timer throttling, long tasks) are treated
   *    as deferred/unknown time and attributed to freshness stamps — never as
   *    confirmed stream failure.
   *  - While the tab is hidden the checker only releases finished recoveries;
   *    it never marks a series stale, REST-resyncs, or recycles the socket.
   *  - On a visible tab, the FIRST stale pass starts a passive merge-only
   *    REST resync (socket untouched); a forced recovery (resync + ONE socket
   *    recycle handed to the exponential-backoff reconnect) requires
   *    WATCHDOG_VISIBLE_FAILS_TO_RECOVER consecutive visible stale passes.
   *    Chart state is preserved throughout — merges are append/upsert only.
   */ checkKlineHealth() {
        const now = monotonicMs();
        // Event-loop gap / hidden-tab scheduling: time the watchdog cannot see.
        const deferredGap = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibilityTracker"].reportTickGap(this.lastWatchdogTickAt, now);
        if (deferredGap > 0) {
            this.shiftAllHealthStamps(deferredGap);
        }
        this.lastWatchdogTickAt = now;
        // Hidden: defer staleness evaluation entirely (Chrome background-tab
        // throttling would otherwise read as dead stream + forced recovery).
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibilityTracker"].isHidden()) {
            this.releaseFinishedRecoveries(now);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logLifecycleDecision("watchdog_deferred_hidden", {
                generation: this.klineWsGeneration
            });
            return;
        }
        let passiveResync = false;
        let forcedRecovery = false;
        for (const key of this.listeners.keys()){
            if ((this.listeners.get(key)?.size ?? 0) === 0) continue;
            const h = this.klineHealth.get(key);
            if (!h) continue;
            if (now - h.stamp < KLINE_RECOVERY_MS) continue;
            if (h.recovering) {
                this.maybeReleaseRecovery(h, now);
                continue;
            }
            // Visible + stale. Escalate: passive merge-only resync first; forced
            // recovery only after consecutive visible stale passes.
            this.visibleWatchdogFails += 1;
            const sep = key.indexOf(":");
            if (this.visibleWatchdogFails < WATCHDOG_VISIBLE_FAILS_TO_RECOVER) {
                passiveResync = true;
                this.passiveResyncCount += 1;
                if (sep > 0) {
                    void this.ensureHistory(key.slice(0, sep), key.slice(sep + 1), true);
                }
                continue;
            }
            h.recovering = true;
            h.recoverySince = now;
            h.recoveryGeneration = this.klineWsGeneration;
            if (sep > 0) {
                void this.ensureHistory(key.slice(0, sep), key.slice(sep + 1), true);
            }
            forcedRecovery = true;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logLifecycleDecision("watchdog_pass", {
            passiveResync,
            forcedRecovery,
            fails: this.visibleWatchdogFails,
            generation: this.klineWsGeneration
        });
        // At most ONE socket recycle per checker pass, no matter how many series
        // turned stale together.
        if (forcedRecovery) this.recycleKlineSocketForRecovery();
    }
    /**
   * Attribute a scheduling hole to every series' freshness stamp so parked-
   * tab / blocked-loop time is never read as stream staleness. Also extends
   * in-flight recovery ages so a recovery is not released by time it could
   * not have observed.
   */ shiftAllHealthStamps(byMs) {
        for (const h of this.klineHealth.values()){
            h.stamp += byMs;
            h.recoverySince += byMs;
        }
    }
    releaseFinishedRecoveries(now) {
        for (const h of this.klineHealth.values()){
            if (h.recovering) this.maybeReleaseRecovery(h, now);
        }
    }
    maybeReleaseRecovery(h, now) {
        const reconnected = this.klineWsGeneration !== h.recoveryGeneration;
        if (reconnected && now - h.recoverySince >= KLINE_RECOVERY_RELEASE_MS) {
            h.recovering = false; // released for the next backoff-controlled retry
        }
    }
    /**
   * Recycle the combined kline socket for a stale recovery while preserving
   * the existing exponential backoff: handlers are detached and the socket's
   * own onclose logic is driven exactly once, so the reconnect delay, attempt
   * counter and host failover behave exactly like an ordinary drop. When no
   * socket is live, the backoff chain already owns the retry — nothing to do.
   */ recycleKlineSocketForRecovery() {
        const ws = this.klineWs;
        if (!ws) return;
        const onclose = ws.onclose;
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
        this.klineWs = null;
        this.recoveryCount += 1;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logLifecycleDecision("recovery_socket_recycle", {
            generation: this.klineWsGeneration
        });
        try {
            ws.close();
        } catch  {
        /* ignore */ }
        if (typeof onclose === "function") onclose();
    }
    stop() {
        this.started = false;
        this.quoteWsGeneration += 1;
        this.quoteStreamKey = "";
        if (this.visibilityUnsub) {
            this.visibilityUnsub();
            this.visibilityUnsub = null;
        }
        if (this.pendingVisibleReconcileTimer != null) {
            window.clearTimeout(this.pendingVisibleReconcileTimer);
            this.pendingVisibleReconcileTimer = null;
        }
        if (this.tickerPoll) {
            clearInterval(this.tickerPoll);
            this.tickerPoll = null;
        }
        if (this.klineHealthWatch) {
            clearInterval(this.klineHealthWatch);
            this.klineHealthWatch = null;
        }
        if (this.quoteEmitTimer != null) {
            window.clearTimeout(this.quoteEmitTimer);
            this.quoteEmitTimer = null;
        }
        if (this.klineSyncTimer != null) {
            window.clearTimeout(this.klineSyncTimer);
            this.klineSyncTimer = null;
        }
        this.closeQuoteWs();
        this.klineWsGeneration += 1;
        this.klineStreamKey = "";
        this.closeKlineWs();
    }
    closeSocket(ws) {
        if (!ws) return;
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        ws.onopen = null;
        try {
            ws.close();
        } catch  {
        /* ignore */ }
    }
    closeQuoteWs() {
        const old = this.quoteWs;
        this.quoteWs = null;
        this.closeSocket(old);
    }
    setLastPrice(symbol, last, partial) {
        if (!Number.isFinite(last) || last <= 0) return false;
        if (!this.hotSymbols.has(symbol) && !this.hasChartListeners(symbol)) return false;
        const prev = this.quotes.get(symbol) ?? emptyQuote(symbol);
        const open = partial?.open && partial.open > 0 ? partial.open : prev.open > 0 ? prev.open : 0;
        const priceChanged = !(prev.last > 0 && Math.abs(prev.last - last) / last < 1e-12);
        const openChanged = open > 0 && Math.abs((prev.open || 0) - open) > 1e-12;
        if (!priceChanged && !openChanged && !partial?.high && !partial?.low && partial?.volume == null) {
            return false;
        }
        const change = open > 0 ? last - open : 0;
        this.quotes.set(symbol, {
            ...prev,
            ...partial,
            symbol,
            last,
            open,
            high: partial?.high && partial.high > 0 ? Math.max(prev.high || last, partial.high, last) : Math.max(prev.high || last, last),
            low: partial?.low && partial.low > 0 ? Math.min(prev.low || last, partial.low, last) : prev.low > 0 ? Math.min(prev.low, last) : last,
            change,
            changePct: open > 0 ? change / open * 100 : 0
        });
        this.emitTradeQuotes();
        return true;
    }
    /** Apply Binance 24h stats. When `updateLast` is false, keep chart-owned last price. */ apply24hTicker(symbol, ticker, opts) {
        const updateLast = opts?.updateLast !== false;
        const lastPx = Number(ticker.lastPrice ?? ticker.price);
        const openPx = Number(ticker.openPrice);
        const highPx = Number(ticker.highPrice);
        const lowPx = Number(ticker.lowPrice);
        const vol = Number(ticker.volume);
        const prev = this.quotes.get(symbol) ?? emptyQuote(symbol);
        const last = updateLast && Number.isFinite(lastPx) && lastPx > 0 ? lastPx : prev.last > 0 ? prev.last : Number.isFinite(lastPx) && lastPx > 0 ? lastPx : 0;
        if (last <= 0) return false;
        const open = Number.isFinite(openPx) && openPx > 0 ? openPx : prev.open;
        return this.setLastPrice(symbol, last, {
            open: open > 0 ? open : undefined,
            high: Number.isFinite(highPx) && highPx > 0 ? highPx : undefined,
            low: Number.isFinite(lowPx) && lowPx > 0 ? lowPx : undefined,
            volume: Number.isFinite(vol) && vol > 0 ? vol : undefined
        });
    }
    async refreshHotTickers() {
        const symbols = [
            ...this.hotSymbols
        ];
        if (symbols.length === 0) return;
        let any = false;
        const fetchOne = async (symbol)=>{
            try {
                const binanceSym = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBinanceSymbol"])(symbol);
                const res = await fetch(`/api/binance/ticker?symbol=${encodeURIComponent(binanceSym)}`, {
                    cache: "no-store"
                });
                if (!res.ok) return;
                const row = await res.json();
                const ticker = Array.isArray(row) ? row[0] : row;
                if (!ticker) return;
                // Live chart owns last price; still refresh 24h open for Binance-matching %.
                if (this.apply24hTicker(symbol, ticker, {
                    updateLast: !this.hasLiveChart(symbol)
                })) {
                    any = true;
                }
            } catch  {
            /* ignore */ }
        };
        // Bound concurrency for larger watchlists.
        const queue = [
            ...symbols
        ];
        const workers = Array.from({
            length: Math.min(6, queue.length)
        }, async ()=>{
            while(queue.length){
                const sym = queue.shift();
                if (sym) await fetchOne(sym);
            }
        });
        await Promise.all(workers);
        if (any) this.emitQuotesNow();
    }
    /**
   * REST history under live tip — merges REST historical data with socket-owned tip.
   * Uses timestamp-based reconciliation to prevent duplicates and maintain consistency.
   */ mergeRestHistory(key, rest) {
        const live = this.series.get(key);
        // If no live data or not actively live, just use REST
        if (!live || live.length === 0 || !this.liveKeys.has(key) || rest.length === 0) {
            return rest;
        }
        // Use canonical timestamp-based reconciliation
        // This handles all edge cases: newer REST, matching timestamps, live tip ahead, etc.
        const target = historyLimit(key.split(":")[1]);
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reconcileCandleSeries"])(rest, live, target);
        // Dev-only: crash at the offending merge instead of rendering corruption.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$invariants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertSeriesInvariants"])(result, {
            op: "mergeRestHistory",
            label: key
        });
        // Diagnostics
        const [symbol, tf] = key.split(":");
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logReconciliation(symbol, tf, rest.length, live.length, result.length, result);
        return result;
    }
    /**
   * Fetch up to `totalLimit` klines. Binance caps each call at 1500, so we walk
   * `endTime` backward. `onPage` fires after each page (newest first) so the chart
   * can paint quickly, then deepen history in the background.
   */ async fetchKlinePages(binanceSym, interval, totalLimit, onPage) {
        let endTimeMs;
        let merged = [];
        let guard = 0;
        const maxPages = Math.max(1, Math.ceil(totalLimit / BINANCE_KLINE_PAGE) + 1);
        while(merged.length < totalLimit && guard < maxPages){
            guard += 1;
            const limit = Math.min(BINANCE_KLINE_PAGE, totalLimit - merged.length);
            const qs = new URLSearchParams({
                symbol: binanceSym,
                interval,
                limit: String(limit)
            });
            if (endTimeMs != null) qs.set("endTime", String(endTimeMs));
            const res = await fetch(`/api/binance/klines?${qs.toString()}`, {
                cache: "no-store"
            });
            if (!res.ok) break;
            const rows = await res.json();
            if (!Array.isArray(rows) || rows.length === 0) break;
            const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$feed$2d$normalize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseKlines"])(rows);
            if (parsed.length === 0) break;
            if (merged.length === 0) {
                merged = parsed;
            } else {
                const older = parsed.filter((c)=>c.time < merged[0].time);
                if (older.length === 0) break;
                merged = [
                    ...older,
                    ...merged
                ];
            }
            onPage?.(merged);
            if (parsed.length < limit) break;
            endTimeMs = parsed[0].time * 1000 - 1;
        }
        if (merged.length > totalLimit) {
            merged = merged.slice(merged.length - totalLimit);
        }
        return merged;
    }
    async ensureHistory(symbol, tf, force = false) {
        const key = this.key(symbol, tf);
        const target = historyLimit(tf);
        if (!force) {
            const existing = this.loaders.get(key);
            if (existing) return existing;
            const cached = this.series.get(key);
            // Skip only with a full (or near-full) window — not after the first 1500 page.
            if (cached && cached.length >= Math.min(target, target > BINANCE_KLINE_PAGE ? target - 50 : 10)) {
                this.historyReady.add(key);
                return;
            }
            // Failed-fetch backoff: never re-enter the fetch while cooling down.
            // Without this, a failed history fetch re-fires on every getCandles()
            // call (renders, crosshair moves, overlays) — a hot REST retry loop.
            const notBefore = this.historyRetryNotBefore.get(key);
            if (notBefore != null && Date.now() < notBefore) return;
        } else {
            this.loaders.delete(key);
            this.historyReady.delete(key);
        }
        const task = Promise.resolve().then(async ()=>{
            try {
                const binanceSym = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBinanceSymbol"])(symbol);
                const interval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBinanceInterval"])(tf);
                let paintedFirst = false;
                const apply = (parsed)=>{
                    if (!this.hotSymbols.has(symbol) && !this.hasChartListeners(symbol)) return false;
                    let candles = this.mergeRestHistory(key, parsed);
                    if (candles.length > target) candles = candles.slice(candles.length - target);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$invariants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertSeriesInvariants"])(candles, {
                        op: "ensureHistory.apply",
                        label: key
                    });
                    this.series.set(key, candles);
                    this.refreshQuoteFromCandles(symbol, candles);
                    this.emitSeries(symbol, tf, false);
                    this.emitQuotesNow();
                    return true;
                };
                const final = await this.fetchKlinePages(binanceSym, interval, target, (partial)=>{
                    // First page only — paint fast; skip mid-backfill redraws (those felt laggy).
                    if (paintedFirst) return;
                    if (!apply(partial)) return;
                    paintedFirst = true;
                });
                if (final.length === 0) {
                    // Fetch produced nothing (network failure, 429/503, upstream error).
                    // Arm exponential backoff so getCandles() does not hot-retry.
                    const attempt = (this.historyRetryAttempt.get(key) ?? 0) + 1;
                    this.historyRetryAttempt.set(key, attempt);
                    this.historyRetryNotBefore.set(key, Date.now() + Math.min(30_000, 500 * 2 ** Math.min(6, attempt)));
                    return;
                }
                if (!apply(final)) return;
                this.historyRetryAttempt.delete(key);
                this.historyRetryNotBefore.delete(key);
                this.historyReady.add(key);
            } catch  {
                // Thrown fetch (network exception): same backoff path.
                const attempt = (this.historyRetryAttempt.get(key) ?? 0) + 1;
                this.historyRetryAttempt.set(key, attempt);
                this.historyRetryNotBefore.set(key, Date.now() + Math.min(30_000, 500 * 2 ** Math.min(6, attempt)));
            } finally{
                if (this.loaders.get(key) === task) this.loaders.delete(key);
            }
        });
        this.loaders.set(key, task);
        return task;
    }
    refreshQuoteFromCandles(symbol, candles, tipOnly = false) {
        if (candles.length === 0) return;
        const last = candles[candles.length - 1];
        const prev = this.quotes.get(symbol) ?? emptyQuote(symbol);
        // Tip ticks: update price only. RSI/ATR are O(n) and not needed every ms.
        const rsi = tipOnly ? prev.rsi : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lastDefined"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeRsi"])(candles));
        const atr = tipOnly ? prev.atr : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lastDefined"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeAtr"])(candles));
        const lastPx = last.close;
        // 24h open comes from miniTicker / ticker/24hr — never use the chart bar open
        // (that made % look like the current candle move instead of Binance 24h Chg).
        const open = prev.open > 0 ? prev.open : 0;
        const change = open > 0 ? lastPx - open : 0;
        this.quotes.set(symbol, {
            ...prev,
            symbol,
            last: lastPx,
            open,
            high: Math.max(prev.high || lastPx, last.high),
            low: prev.low > 0 ? Math.min(prev.low, last.low) : last.low,
            volume: last.volume,
            change,
            changePct: open > 0 ? change / open * 100 : prev.changePct,
            rsi,
            atr
        });
        this.emitTradeQuotes();
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbol"])(symbol);
    }
    applyMiniTicker(t) {
        const appSymbol = appSymbolFromBinance(t.s);
        if (!appSymbol) return;
        if (!this.hotSymbols.has(appSymbol)) return;
        // Provider event-time ordering: drop strictly-older redeliveries. Equal
        // timestamps are accepted (last arrival wins) — see isNewerTickerEvent.
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$feed$2d$normalize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNewerTickerEvent"])(this.lastTickerEventAt.get(appSymbol), t.E)) return;
        const nums = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$feed$2d$normalize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["miniTickerNumbers"])(t);
        if (!nums) return;
        const last = nums.last;
        const open = nums.open;
        const high = nums.high;
        const low = nums.low;
        const vol = nums.volume;
        // Live chart owns last; still take Binance 24h open so change% matches Futures UI.
        if (this.hasLiveChart(appSymbol)) {
            const prev = this.quotes.get(appSymbol) ?? emptyQuote(appSymbol);
            if (!(Number.isFinite(open) && open > 0) || prev.last <= 0) return;
            const change = prev.last - open;
            const nextHigh = Number.isFinite(high) && high > 0 ? Math.max(prev.high || prev.last, high, prev.last) : Math.max(prev.high || prev.last, prev.last);
            const nextLow = Number.isFinite(low) && low > 0 ? Math.min(prev.low || prev.last, low, prev.last) : prev.low > 0 ? Math.min(prev.low, prev.last) : prev.last;
            const next = {
                ...prev,
                open,
                high: nextHigh,
                low: nextLow,
                volume: Number.isFinite(vol) && vol > 0 ? vol : prev.volume,
                change,
                changePct: change / open * 100
            };
            const same = Math.abs(prev.open - open) < 1e-12 && Math.abs(prev.changePct - next.changePct) < 1e-6 && prev.high === next.high && prev.low === next.low;
            if (same) return;
            this.quotes.set(appSymbol, next);
            this.advanceTickerWatermark(appSymbol, t.E);
            this.emitTradeQuotes();
            this.emitQuotesSoon();
            return;
        }
        if (!Number.isFinite(last) || last <= 0) return;
        if (!this.setLastPrice(appSymbol, last, {
            open: Number.isFinite(open) && open > 0 ? open : undefined,
            high: Number.isFinite(high) && high > 0 ? high : undefined,
            low: Number.isFinite(low) && low > 0 ? low : undefined,
            volume: Number.isFinite(vol) && vol > 0 ? vol : undefined
        })) {
            return;
        }
        // Applied — advance the ordering watermark (setLastPrice already fired
        // the immediate trade channel).
        this.advanceTickerWatermark(appSymbol, t.E);
        this.emitQuotesSoon();
    }
    /** Record the provider event time of an ACCEPTED miniTicker frame. */ advanceTickerWatermark(symbol, eventTime) {
        if (eventTime == null || !Number.isFinite(eventTime)) return;
        this.lastTickerEventAt.set(symbol, eventTime);
    }
    /** Upsert one Binance kline bar — exact o/h/l/c/v, never rewrite. */ applyKline(msg) {
        // Validation 1: Symbol must be recognized
        const appSymbol = appSymbolFromBinance(msg.s);
        if (!appSymbol) return;
        // Validation 2: Interval must match a known timeframe
        const interval = msg.k.i;
        const tfs = ALL_TFS.filter((tf)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBinanceInterval"])(tf) === interval);
        if (tfs.length === 0) return;
        const candle = {
            time: Math.floor(msg.k.t / 1000),
            open: Number(msg.k.o),
            high: Number(msg.k.h),
            low: Number(msg.k.l),
            close: Number(msg.k.c),
            volume: Number(msg.k.v)
        };
        // Validation 3: OHLCV must be valid
        if (!Number.isFinite(candle.time) || !Number.isFinite(candle.open) || !Number.isFinite(candle.high) || !Number.isFinite(candle.low) || !Number.isFinite(candle.close) || !Number.isFinite(candle.volume) || candle.open <= 0 || candle.close <= 0 || candle.high < Math.max(candle.open, candle.close, candle.low) || candle.low > Math.min(candle.open, candle.close, candle.high) || candle.volume < 0) {
            return;
        }
        // Validation 4: Only process for subscribed symbol/timeframe pairs
        for (const tf of tfs){
            const key = this.key(appSymbol, tf);
            if ((this.listeners.get(key)?.size ?? 0) === 0) continue;
            this.liveKeys.add(key);
            // Valid live frame: establishes 'live', refreshes the stamp, and is the
            // ONLY thing that clears delayed/recovery state.
            const health = this.klineHealth.get(key);
            if (health) {
                health.stamp = monotonicMs();
                health.live = true;
                health.recovering = false;
            }
            let candles = this.series.get(key);
            if (!candles) {
                candles = [];
                this.series.set(key, candles);
            }
            const merged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeLiveCandle"])(candles, candle, msg.k.x, historyLimit(tf), tfSeconds(tf));
            if (merged === "invalid" || merged === "duplicate") {
                // Diagnostics for rejected/duplicate candles
                if (merged === "invalid") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logValidationError(appSymbol, tf, "WebSocket", "invalid OHLCV", msg.k.t);
                }
                continue;
            }
            // Dev-only tail check: catches an unsorted/duplicate series at the exact
            // frame that produced it (hot path — O(1)).
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$invariants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertTailInvariant"])(candles, {
                op: `applyKline(${merged})`,
                label: key,
                incoming: candle
            });
            // Diagnostics for successful updates
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logWebSocketUpdate(appSymbol, tf, msg.k.t, candle.time, merged, candles.length, candles);
            const tipOnly = merged === "tip";
            this.refreshQuoteFromCandles(appSymbol, candles, tipOnly);
            this.emitSeries(appSymbol, tf, tipOnly);
        }
        this.emitQuotesSoon();
    }
    emitSeries(symbol, tf, tick) {
        const key = this.key(symbol, tf);
        const candles = this.series.get(key);
        if (!candles || candles.length === 0) return;
        const quote = this.getQuote(symbol);
        const listeners = this.listeners.get(key);
        if (!listeners || listeners.size === 0) return;
        // Tip ticks share the live series (listeners must not mutate). Full
        // history / new-bar events still clone so consumers can keep a snapshot.
        const snapshot = tick ? candles : cloneCandles(candles);
        // Isolate listeners: one throwing consumer (e.g. an overlay painting
        // mid-swap) must not starve later listeners — including the chart's own
        // onFeed — leaving the chart rendering stale data while the store moves on.
        for (const fn of [
            ...listeners
        ]){
            try {
                fn(snapshot, quote, {
                    tick
                });
            } catch (err) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$invariants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["areCandleAssertsEnabled"])()) {
                    // Dev builds surface this loudly; prod keeps the feed alive.
                    console.error(`[feed] listener for ${key} threw`, err);
                }
            }
        }
    }
    emitQuotesNow() {
        if (this.quoteEmitTimer != null) {
            window.clearTimeout(this.quoteEmitTimer);
            this.quoteEmitTimer = null;
        }
        this.quoteListeners.forEach((fn)=>fn(this.quotes));
    }
    emitQuotesSoon() {
        if (this.quoteEmitTimer != null) return;
        this.quoteEmitTimer = window.setTimeout(()=>{
            this.quoteEmitTimer = null;
            this.quoteListeners.forEach((fn)=>fn(this.quotes));
        }, 150);
    }
    acquireKlineSocket(stream) {
        this.klineRefs.set(stream, (this.klineRefs.get(stream) ?? 0) + 1);
        this.scheduleKlineStreamSync();
    }
    releaseKlineSocket(stream) {
        const next = (this.klineRefs.get(stream) ?? 0) - 1;
        if (next <= 0) this.klineRefs.delete(stream);
        else this.klineRefs.set(stream, next);
        this.scheduleKlineStreamSync();
    }
    scheduleKlineStreamSync() {
        if (this.klineSyncTimer != null) return;
        this.klineSyncTimer = window.setTimeout(()=>{
            this.klineSyncTimer = null;
            this.syncKlineStreams();
        }, 16);
    }
    closeKlineWs() {
        const old = this.klineWs;
        this.klineWs = null;
        this.closeSocket(old);
    }
    klineWsUrl(streams, hostIndex) {
        // Binance routes klines on the /market tier. Plain /ws often stays silent.
        const host = hostIndex === 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BINANCE_FAPI_WS"] : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BINANCE_FAPI_WS_FALLBACK"];
        if (streams.length <= 1) {
            return `${host}/market/ws/${streams[0] ?? ""}`;
        }
        return `${host}/market/stream?streams=${streams.join("/")}`;
    }
    syncKlineStreams() {
        if (!this.started) {
            this.closeKlineWs();
            return;
        }
        const streams = [
            ...this.klineRefs.keys()
        ].sort();
        const key = streams.join("/");
        if (key === this.klineStreamKey) {
            if (streams.length === 0) this.closeKlineWs();
            return;
        }
        this.klineStreamKey = key;
        this.klineReconnectAttempt = 0;
        this.connectKlineCombined();
    }
    connectKlineCombined() {
        if (!this.started) return;
        const generation = ++this.klineWsGeneration;
        this.closeKlineWs();
        const streams = this.klineStreamKey ? this.klineStreamKey.split("/").filter(Boolean) : [];
        if (streams.length === 0) return;
        const url = this.klineWsUrl(streams, this.klineHostIndex);
        const ws = new WebSocket(url);
        this.klineWs = ws;
        let gotFrame = false;
        // Silent-open watchdog: a socket that never delivers a frame while the
        // tab is VISIBLE is failed over to the other host. While hidden the check
        // only re-arms — timer throttling starves frame delivery, so silence
        // proves nothing and failover churn in a parked tab is pure waste. The
        // staleness watchdog owns recovery once the tab is visible again.
        const armSilentOpenCheck = ()=>{
            window.setTimeout(()=>{
                if (generation !== this.klineWsGeneration || this.klineRefs.size === 0 || gotFrame) return;
                if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visibilityTracker"].isHidden()) {
                    armSilentOpenCheck();
                    return;
                }
                this.klineHostIndex = this.klineHostIndex === 0 ? 1 : 0;
                this.connectKlineCombined();
            }, 2500);
        };
        ws.onopen = ()=>{
            if (generation !== this.klineWsGeneration) return;
            armSilentOpenCheck();
        };
        ws.onmessage = (ev)=>{
            if (generation !== this.klineWsGeneration) return;
            gotFrame = true;
            this.klineReconnectAttempt = 0;
            try {
                const raw = JSON.parse(String(ev.data));
                const msg = raw && typeof raw === "object" && "data" in raw && raw.data ? raw.data : raw;
                if (msg && msg.e === "kline") this.applyKline(msg);
            } catch  {
            /* ignore */ }
        };
        ws.onclose = ()=>{
            if (!this.started || generation !== this.klineWsGeneration || this.klineRefs.size === 0) return;
            // A real socket close ALWAYS reconnects (exponential backoff) — the
            // hidden-tab deferral only gates the staleness watchdog, never genuine
            // transport-level failure.
            this.reconnectCount += 1;
            const delay = Math.min(8_000, 300 * 2 ** this.klineReconnectAttempt);
            this.klineReconnectAttempt += 1;
            if (this.klineReconnectAttempt >= 2) {
                this.klineHostIndex = this.klineHostIndex === 0 ? 1 : 0;
            }
            window.setTimeout(()=>{
                if (this.started && generation === this.klineWsGeneration && this.klineRefs.size > 0) {
                    this.connectKlineCombined();
                }
            }, delay);
        };
        ws.onerror = ()=>{
            try {
                ws.close();
            } catch  {
            /* ignore */ }
        };
    }
    /** Subscribe miniTickers for the full hot set (24h open even when a chart owns last). */ syncQuoteStreams() {
        if (!this.started) return;
        const streams = [
            ...this.hotSymbols
        ].map((s)=>`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBinanceSymbol"])(s).toLowerCase()}@miniTicker`).sort();
        const key = streams.join("/");
        if (key === this.quoteStreamKey) {
            if (streams.length === 0) {
                this.closeQuoteWs();
            }
            return;
        }
        this.quoteStreamKey = key;
        this.quoteReconnectAttempt = 0;
        this.connectQuoteWs();
    }
    connectQuoteWs() {
        if (!this.started) return;
        const generation = ++this.quoteWsGeneration;
        this.closeQuoteWs();
        const streams = this.quoteStreamKey ? this.quoteStreamKey.split("/").filter(Boolean) : [];
        if (streams.length === 0) return;
        const hosts = [
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BINANCE_FAPI_WS"],
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BINANCE_FAPI_WS_FALLBACK"]
        ];
        const host = hosts[this.quoteReconnectAttempt % hosts.length] ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BINANCE_FAPI_WS"];
        // Combined stream for the hot set only (not !miniTicker@arr for the whole market).
        const url = streams.length === 1 ? `${host}/market/ws/${streams[0]}` : `${host}/market/stream?streams=${streams.join("/")}`;
        const ws = new WebSocket(url);
        this.quoteWs = ws;
        let gotFrame = false;
        ws.onopen = ()=>{
            if (generation !== this.quoteWsGeneration) return;
            window.setTimeout(()=>{
                if (generation !== this.quoteWsGeneration || gotFrame) return;
                this.quoteReconnectAttempt += 1;
                this.connectQuoteWs();
            }, 2500);
        };
        ws.onmessage = (ev)=>{
            if (generation !== this.quoteWsGeneration) return;
            gotFrame = true;
            this.quoteReconnectAttempt = 0;
            try {
                const raw = JSON.parse(String(ev.data));
                if (Array.isArray(raw)) {
                    for (const t of raw)this.applyMiniTicker(t);
                } else if (raw && typeof raw === "object" && "data" in raw && raw.data) {
                    const data = raw.data;
                    if (Array.isArray(data)) for (const t of data)this.applyMiniTicker(t);
                    else this.applyMiniTicker(data);
                } else if (raw && typeof raw === "object" && raw.e === "24hrMiniTicker") {
                    this.applyMiniTicker(raw);
                }
                this.emitQuotesSoon();
            } catch  {
            /* ignore */ }
        };
        ws.onclose = ()=>{
            if (!this.started || generation !== this.quoteWsGeneration) return;
            if (!this.quoteStreamKey) return;
            const delay = Math.min(8_000, 400 * 2 ** Math.min(6, this.quoteReconnectAttempt));
            this.quoteReconnectAttempt += 1;
            window.setTimeout(()=>{
                if (this.started && generation === this.quoteWsGeneration && this.quoteStreamKey) {
                    this.connectQuoteWs();
                }
            }, delay);
        };
        ws.onerror = ()=>{
            try {
                ws.close();
            } catch  {
            /* ignore */ }
        };
    }
}
function resetFeedLifecycleForTests() {
    const feed = binanceFuturesFeed;
    feed.started = false;
    feed.visibleWatchdogFails = 0;
    feed.lastWatchdogTickAt = 0;
}
const binanceFuturesFeed = new BinanceFuturesFeed();
const binanceSpotFeed = binanceFuturesFeed;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/binance-intervals.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BINANCE_FAPI_REST",
    ()=>BINANCE_FAPI_REST,
    "BINANCE_FAPI_WS",
    ()=>BINANCE_FAPI_WS,
    "BINANCE_FAPI_WS_FALLBACK",
    ()=>BINANCE_FAPI_WS_FALLBACK,
    "BINANCE_SPOT_REST",
    ()=>BINANCE_SPOT_REST,
    "BINANCE_SPOT_WS",
    ()=>BINANCE_SPOT_WS,
    "fromBinanceSymbol",
    ()=>fromBinanceSymbol,
    "toBinanceInterval",
    ()=>toBinanceInterval,
    "toBinanceSymbol",
    ()=>toBinanceSymbol
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function toBinanceInterval(tf) {
    const map = {
        "1m": "1m",
        "3m": "3m",
        "5m": "5m",
        "15m": "15m",
        "30m": "30m",
        "1h": "1h",
        "2h": "2h",
        "4h": "4h",
        "1D": "1d",
        "1W": "1w",
        "1M": "1M"
    };
    return map[tf] ?? "15m";
}
/**
 * Map app symbols → Binance USDT-M perpetual symbols.
 * Some alts only list as 1000× contracts on futures.
 */ const BINANCE_SYMBOL_ALIASES = {
    MATICUSDT: "POLUSDT",
    PEPEUSDT: "1000PEPEUSDT"
};
function toBinanceSymbol(symbol) {
    return BINANCE_SYMBOL_ALIASES[symbol] ?? symbol;
}
function fromBinanceSymbol(binanceSymbol) {
    const upper = binanceSymbol.toUpperCase();
    for (const [app, bin] of Object.entries(BINANCE_SYMBOL_ALIASES)){
        if (bin === upper) return app;
    }
    return upper;
}
const BINANCE_FAPI_REST = "https://fapi.binance.com";
const BINANCE_FAPI_WS = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BINANCE_FAPI_WS ?? "wss://fstream.binance.com";
const BINANCE_FAPI_WS_FALLBACK = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BINANCE_FAPI_WS_FALLBACK ?? "wss://fstream.binancefuture.com";
const BINANCE_SPOT_REST = BINANCE_FAPI_REST;
const BINANCE_SPOT_WS = BINANCE_FAPI_WS;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/candle-diagnostics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Diagnostic logging for candle synchronization debugging.
 * All logging is disabled by default and controlled by environment variable.
 *
 * To enable: set NEXT_PUBLIC_DEBUG_CANDLES=true in .env.local
 */ __turbopack_context__.s([
    "candleDiagnostics",
    ()=>candleDiagnostics,
    "inspectCandleSeries",
    ()=>inspectCandleSeries,
    "isDiagnosticsEnabled",
    ()=>isDiagnosticsEnabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/candle-reconcile.ts [app-client] (ecmascript)");
;
const ENABLED = typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DEBUG_CANDLES === "true";
/**
 * Low-noise console logger that groups related events.
 */ class CandleDiagnostics {
    eventBuffer = [];
    flushTimer = null;
    FLUSH_INTERVAL = 5000;
    logEvent(event) {
        if (!ENABLED) return;
        this.eventBuffer.push(event);
        if (this.flushTimer === null) {
            this.flushTimer = setTimeout(()=>{
                this.flush();
            }, this.FLUSH_INTERVAL);
        }
    }
    /**
   * Log a REST history fetch result.
   */ logRestHistory(symbol, timeframe, fetchedCount, mergedCount, duplicates) {
        if (!ENABLED) return;
        this.logEvent({
            symbol,
            timeframe,
            source: "REST",
            eventType: "inserted",
            rawTimestamp: Date.now(),
            normalizedTimestamp: Date.now(),
            candleCount: mergedCount,
            duplicateCount: duplicates,
            isSorted: true,
            metadata: {
                fetchedCount,
                mergedCount
            }
        });
    }
    /**
   * Log a WebSocket kline update.
   */ logWebSocketUpdate(symbol, timeframe, rawTimestamp, normalizedTimestamp, mergeResult, finalCandleCount, candles) {
        if (!ENABLED) return;
        const eventType = mergeResult === "tip" ? "updated" : mergeResult === "append" ? "inserted" : mergeResult === "invalid" ? "rejected" : mergeResult === "duplicate" ? "duplicate" : "replaced";
        this.logEvent({
            symbol,
            timeframe,
            source: "WebSocket",
            eventType,
            rawTimestamp,
            normalizedTimestamp,
            candleCount: finalCandleCount,
            duplicateCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["countDuplicateTimestamps"])(candles),
            isSorted: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSortedByTime"])(candles),
            mergeResult
        });
    }
    /**
   * Log a reconciliation operation.
   */ logReconciliation(symbol, timeframe, restCount, liveCount, resultCount, candles) {
        if (!ENABLED) return;
        this.logEvent({
            symbol,
            timeframe,
            source: "Reconcile",
            eventType: "inserted",
            rawTimestamp: Date.now(),
            normalizedTimestamp: Date.now(),
            candleCount: resultCount,
            duplicateCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["countDuplicateTimestamps"])(candles),
            isSorted: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSortedByTime"])(candles),
            metadata: {
                restCount,
                liveCount,
                resultCount
            }
        });
    }
    /**
   * Log a validation error.
   */ logValidationError(symbol, timeframe, source, error, rawTimestamp) {
        if (!ENABLED) return;
        this.logEvent({
            symbol,
            timeframe,
            source,
            eventType: "rejected",
            rawTimestamp,
            normalizedTimestamp: rawTimestamp,
            candleCount: 0,
            duplicateCount: 0,
            isSorted: true,
            validationError: error
        });
    }
    /**
   * Log a Page Visibility transition and the feed's response decision.
   * Emitted from lib/market/visibility.ts.
   */ logVisibilityChange(state, transitions) {
        if (!ENABLED) return;
        this.logEvent({
            symbol: "*",
            timeframe: "1m",
            source: "Visibility",
            eventType: "info",
            rawTimestamp: Date.now(),
            normalizedTimestamp: Date.now(),
            candleCount: 0,
            duplicateCount: 0,
            isSorted: true,
            metadata: {
                state,
                transitions
            }
        });
    }
    /**
   * Log a feed-lifecycle decision: watchdog deferral while hidden, the
   * debounced visible-return reconcile, recovery releases, and socket
   * recycles. `details` carries decision-specific fields.
   */ logLifecycleDecision(event, details) {
        if (!ENABLED) return;
        this.logEvent({
            symbol: "*",
            timeframe: "1m",
            source: "Lifecycle",
            eventType: "info",
            rawTimestamp: Date.now(),
            normalizedTimestamp: Date.now(),
            candleCount: 0,
            duplicateCount: 0,
            isSorted: true,
            metadata: {
                event,
                ...details
            }
        });
    }
    /**
   * Immediately flush and log all buffered events.
   */ flush() {
        if (!ENABLED || this.eventBuffer.length === 0) {
            this.eventBuffer = [];
            if (this.flushTimer) {
                clearTimeout(this.flushTimer);
                this.flushTimer = null;
            }
            return;
        }
        // Group events by symbol:timeframe
        const grouped = new Map();
        for (const event of this.eventBuffer){
            const key = `${event.symbol}:${event.timeframe}`;
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key).push(event);
        }
        // Log each group
        for (const [key, events] of grouped.entries()){
            const [symbol, timeframe] = key.split(":");
            const summary = this.summarizeEvents(events);
            console.group(`%c[Candle Diagnostics] ${symbol} ${timeframe}`, "color: #00bcd4; font-weight: bold;");
            console.log(`%cSummary: ${summary.total} events (${summary.inserted} inserted, ${summary.updated} updated, ${summary.rejected} rejected, ${summary.duplicates} duplicates)`, "color: #888;");
            // Log any anomalies
            const anomalies = [];
            if (summary.unsorted > 0) {
                anomalies.push(`⚠️ ${summary.unsorted} unsorted series detected`);
            }
            if (summary.duplicateTimestamps > 0) {
                anomalies.push(`⚠️ ${summary.duplicateTimestamps} duplicate timestamps`);
            }
            if (summary.validationErrors > 0) {
                anomalies.push(`⚠️ ${summary.validationErrors} validation errors`);
            }
            if (anomalies.length > 0) {
                console.warn(anomalies.join("\n"));
            }
            // Show recent events (last 10)
            const recent = events.slice(-10);
            console.table(recent.map((e)=>({
                    Time: new Date(e.rawTimestamp).toLocaleTimeString(),
                    Source: e.source,
                    Event: e.eventType,
                    "Merge Result": e.mergeResult ?? "-",
                    "Candle Count": e.candleCount,
                    "Dupe Count": e.duplicateCount,
                    Sorted: e.isSorted ? "✓" : "✗",
                    Error: e.validationError ?? "-"
                })));
            console.groupEnd();
        }
        // Clear buffer
        this.eventBuffer = [];
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            this.flushTimer = null;
        }
    }
    summarizeEvents(events) {
        return {
            total: events.length,
            inserted: events.filter((e)=>e.eventType === "inserted").length,
            updated: events.filter((e)=>e.eventType === "updated").length,
            rejected: events.filter((e)=>e.eventType === "rejected").length,
            duplicates: events.filter((e)=>e.eventType === "duplicate").length,
            unsorted: events.filter((e)=>!e.isSorted).length,
            duplicateTimestamps: events.reduce((sum, e)=>sum + e.duplicateCount, 0),
            validationErrors: events.filter((e)=>e.validationError != null).length
        };
    }
    /**
   * Force immediate flush (useful for debugging or before page unload).
   */ forceFlush() {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            this.flushTimer = null;
        }
        this.flush();
    }
}
const candleDiagnostics = new CandleDiagnostics();
function isDiagnosticsEnabled() {
    return ENABLED;
}
function inspectCandleSeries(symbol, timeframe, candles, label = "Candle Series") {
    if (!ENABLED) return;
    console.group(`%c[Candle Inspect] ${label} - ${symbol} ${timeframe}`, "color: #ff9800; font-weight: bold;");
    console.log(`Count: ${candles.length}`);
    console.log(`Sorted: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSortedByTime"])(candles) ? "✓" : "✗"}`);
    console.log(`Duplicates: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$reconcile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["countDuplicateTimestamps"])(candles)}`);
    if (candles.length > 0) {
        const first = candles[0];
        const last = candles[candles.length - 1];
        console.log(`Time range: ${new Date(first.time * 1000).toISOString()} to ${new Date(last.time * 1000).toISOString()}`);
        // Show last 5 candles
        console.table(candles.slice(-5).map((c)=>({
                Time: new Date(c.time * 1000).toLocaleTimeString(),
                Open: c.open.toFixed(2),
                High: c.high.toFixed(2),
                Low: c.low.toFixed(2),
                Close: c.close.toFixed(2),
                Volume: c.volume.toFixed(0)
            })));
    }
    console.groupEnd();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/candle-invariants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CandleInvariantError",
    ()=>CandleInvariantError,
    "areCandleAssertsEnabled",
    ()=>areCandleAssertsEnabled,
    "assertSeriesInvariants",
    ()=>assertSeriesInvariants,
    "assertTailInvariant",
    ()=>assertTailInvariant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Development-only invariant asserts for the candle store.
 *
 * These run in dev builds (and under any explicit debug flag) to surface a
 * regression at the EXACT offending frame instead of as "corrupted candles"
 * in the rendered chart minutes later. In production they are no-ops.
 *
 * The asserts deliberately THROW: a silent console.warn is how the last
 * corruption shipped unnoticed. Dev builds should crash loudly on a violated
 * invariant; the error message carries everything needed to identify the
 * source (which operation, which symbol/timeframe, the offending candle).
 */ const DEV = typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && ("TURBOPACK compile-time value", "development") !== "production";
/** Extra opt-in switch so diagnostics tooling can enable asserts in a prod build. */ const DEBUG_FLAG = typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DEBUG_CANDLES === "true";
function areCandleAssertsEnabled() {
    return DEV || DEBUG_FLAG;
}
class CandleInvariantError extends Error {
    context;
    constructor(message, context){
        super(`[candle-invariant] ${message} (op=${context.op}, series=${context.label})`), this.context = context;
        this.name = "CandleInvariantError";
    }
}
function fmt(c) {
    if (!c) return "(none)";
    return `time=${c.time} o=${c.open} h=${c.high} l=${c.low} c=${c.close} v=${c.volume}`;
}
function assertSeriesInvariants(candles, ctx) {
    if (!areCandleAssertsEnabled()) return;
    for(let i = 0; i < candles.length; i++){
        const c = candles[i];
        // Sort order + duplicate timestamps.
        if (i > 0 && c.time <= candles[i - 1].time) {
            throw new CandleInvariantError(`unsorted/duplicate at index ${i}: ${fmt(c)} follows ${fmt(candles[i - 1])}`, ctx);
        }
        // OHLCV sanity (mirror of validateCandle, but throwing with the index).
        if (!Number.isFinite(c.time) || !Number.isFinite(c.open) || !Number.isFinite(c.high) || !Number.isFinite(c.low) || !Number.isFinite(c.close) || !Number.isFinite(c.volume)) {
            throw new CandleInvariantError(`non-finite OHLCV at index ${i}: ${fmt(c)}`, ctx);
        }
        if (c.open <= 0 || c.close <= 0) {
            throw new CandleInvariantError(`non-positive price at index ${i}: ${fmt(c)}`, ctx);
        }
        if (c.high < Math.max(c.open, c.close, c.low)) {
            throw new CandleInvariantError(`high < max(o,c,l) at index ${i}: ${fmt(c)}`, ctx);
        }
        if (c.low > Math.min(c.open, c.close, c.high)) {
            throw new CandleInvariantError(`low > min(o,c,h) at index ${i}: ${fmt(c)}`, ctx);
        }
        if (c.volume < 0) {
            throw new CandleInvariantError(`negative volume at index ${i}: ${fmt(c)}`, ctx);
        }
    }
}
function assertTailInvariant(candles, ctx) {
    if (!areCandleAssertsEnabled()) return;
    const n = candles.length;
    if (n < 2) return;
    const tip = candles[n - 1];
    const prev = candles[n - 2];
    if (tip.time < prev.time) {
        throw new CandleInvariantError(`tail out of order: tip ${fmt(tip)} is older than prev ${fmt(prev)}`, ctx);
    }
    if (tip.time === prev.time) {
        throw new CandleInvariantError(`duplicate tail timestamp: ${fmt(tip)} duplicates ${fmt(prev)}`, ctx);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/candle-reconcile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildCandleMap",
    ()=>buildCandleMap,
    "countDuplicateTimestamps",
    ()=>countDuplicateTimestamps,
    "countInvalidCandles",
    ()=>countInvalidCandles,
    "hasMixedTimeUnits",
    ()=>hasMixedTimeUnits,
    "isSortedByTime",
    ()=>isSortedByTime,
    "mapToSortedCandles",
    ()=>mapToSortedCandles,
    "mergeLiveCandle",
    ()=>mergeLiveCandle,
    "normalizeCandleTime",
    ()=>normalizeCandleTime,
    "reconcileCandleSeries",
    ()=>reconcileCandleSeries,
    "upsertCandle",
    ()=>upsertCandle,
    "upsertCandles",
    ()=>upsertCandles,
    "validateCandle",
    ()=>validateCandle
]);
function validateCandle(c) {
    // Time must be finite
    if (!Number.isFinite(c.time)) {
        return "non-finite-time";
    }
    // All OHLC values must be finite
    if (!Number.isFinite(c.open) || !Number.isFinite(c.high) || !Number.isFinite(c.low) || !Number.isFinite(c.close)) {
        return "non-finite-ohlcv";
    }
    // Prices must be positive
    if (c.open <= 0 || c.close <= 0) {
        return "negative-price";
    }
    // High must be >= max(open, close, low)
    // Low must be <= min(open, close, high)
    if (c.high < Math.max(c.open, c.close, c.low)) {
        return "invalid-high-low";
    }
    if (c.low > Math.min(c.open, c.close, c.high)) {
        return "invalid-high-low";
    }
    // Volume must be non-negative and finite
    if (!Number.isFinite(c.volume) || c.volume < 0) {
        return "negative-volume";
    }
    return null;
}
function buildCandleMap(candles) {
    const map = new Map();
    for (const c of candles){
        if (validateCandle(c) !== null) continue;
        map.set(c.time, {
            ...c
        });
    }
    return map;
}
function mapToSortedCandles(map) {
    const arr = Array.from(map.values());
    arr.sort((a, b)=>a.time - b.time);
    return arr;
}
function normalizeCandleTime(c) {
    if (!Number.isFinite(c.time)) return c;
    return c.time > 1e12 ? {
        ...c,
        time: Math.floor(c.time / 1000)
    } : c;
}
function upsertCandle(map, incoming) {
    const c = normalizeCandleTime(incoming);
    if (validateCandle(c) !== null) return false;
    map.set(c.time, {
        ...c
    });
    return true;
}
function upsertCandles(map, incoming) {
    let count = 0;
    for (const c of incoming){
        if (upsertCandle(map, c)) count++;
    }
    return count;
}
function reconcileCandleSeries(restHistory, liveCandles, maxLength) {
    const map = new Map();
    // Add REST history first
    upsertCandles(map, restHistory);
    // Add live candles (overwrites any conflicting timestamps from REST)
    upsertCandles(map, liveCandles);
    // Convert to sorted array
    let result = mapToSortedCandles(map);
    // Cap to maxLength, keeping the most recent candles
    if (result.length > maxLength) {
        result = result.slice(result.length - maxLength);
    }
    return result;
}
function mergeLiveCandle(series, rawIncoming, isFinal, cap, intervalSec) {
    // Normalize ms → s first: a ms-unit tip colliding with a s-unit series is
    // the exact corruption that compresses candles into the right edge.
    const incoming = normalizeCandleTime(rawIncoming);
    // Validate first
    if (validateCandle(incoming) !== null) {
        return "invalid";
    }
    const last = series[series.length - 1];
    // Case 0: Interval-aware merge (when the caller knows the bar spacing).
    // A frame opening at/after the next interval boundary always appends a new
    // bar; a frame inside the current bar's window updates the tip in place
    // (keeping the on-grid open time); anything at or before the tip falls
    // through to the exact-match / final-patch logic below so a late FINAL
    // frame for the just-closed bar can still patch history.
    if (intervalSec != null && intervalSec > 0 && last) {
        const diff = incoming.time - last.time;
        if (diff >= intervalSec) {
            series.push({
                ...incoming
            });
            if (series.length > cap) {
                series.shift();
            }
            return "append";
        }
        if (diff > 0) {
            // Mid-interval frame for the forming bar — same bar, keep grid time.
            series[series.length - 1] = {
                ...incoming,
                time: last.time
            };
            return "tip";
        }
    }
    // Case 1: Update to the current forming candle (most common)
    if (last && last.time === incoming.time) {
        // Check if it's actually different to avoid unnecessary mutations
        if (last.open === incoming.open && last.high === incoming.high && last.low === incoming.low && last.close === incoming.close && last.volume === incoming.volume) {
            return "duplicate";
        }
        series[series.length - 1] = {
            ...incoming
        };
        return "tip";
    }
    // Case 2: New candle (newer timestamp)
    if (!last || last.time < incoming.time) {
        series.push({
            ...incoming
        });
        if (series.length > cap) {
            series.shift();
        }
        return "append";
    }
    // Case 3: Update to an older candle (only if isFinal)
    if (isFinal) {
        // Find and replace the matching timestamp
        for(let i = series.length - 2; i >= 0; i--){
            if (series[i].time === incoming.time) {
                series[i] = {
                    ...incoming
                };
                return "replaced";
            }
            // Stop searching if we've gone past the target timestamp
            if (series[i].time < incoming.time) {
                break;
            }
        }
    }
    // Case 4: Stale non-final update for an older timestamp - ignore
    return "duplicate";
}
function countDuplicateTimestamps(candles) {
    const seen = new Set();
    let duplicates = 0;
    for (const c of candles){
        if (seen.has(c.time)) {
            duplicates++;
        } else {
            seen.add(c.time);
        }
    }
    return duplicates;
}
function hasMixedTimeUnits(candles) {
    if (candles.length < 2) return false;
    const ms = candles.filter((c)=>c.time > 1e12).length;
    return ms > 0 && ms < candles.length;
}
function isSortedByTime(candles) {
    for(let i = 1; i < candles.length; i++){
        if (candles[i].time <= candles[i - 1].time) {
            return false;
        }
    }
    return true;
}
function countInvalidCandles(candles) {
    let count = 0;
    for (const c of candles){
        if (validateCandle(c) !== null) count++;
    }
    return count;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/composite-feed.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compositeMarketFeed",
    ()=>compositeMarketFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/binance-feed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/resolve-provider.ts [app-client] (ecmascript)");
;
;
/**
 * App market-data entry point — Binance USDT-M futures only
 * (crypto / commodities / TradFi perps).
 */ class CompositeMarketFeed {
    hotSymbols = new Set();
    setHotSymbols(symbols) {
        const next = new Set();
        const binance = [];
        for (const raw of symbols){
            const sym = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSymbol"])(raw);
            if (!sym) continue;
            next.add(sym);
            binance.push(sym);
        }
        this.hotSymbols = next;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].setHotSymbols(binance);
    }
    getHotSymbols() {
        return [
            ...this.hotSymbols
        ];
    }
    getCandles(symbol, tf) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].getCandles((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSymbol"])(symbol), tf);
    }
    getQuote(symbol) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].getQuote((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSymbol"])(symbol));
    }
    getQuotes() {
        return [
            ...this.hotSymbols
        ].map((s)=>this.getQuote(s));
    }
    subscribe(symbol, tf, listener) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].subscribe((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSymbol"])(symbol), tf, listener);
    }
    subscribeQuotes(listener) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].subscribeQuotes(listener);
    }
    subscribeTradeQuotes(listener) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].subscribeTradeQuotes(listener);
    }
    getKlineStatus(symbol, tf) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].getKlineStatus((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSymbol"])(symbol), tf);
    }
    isKlineDelayed(symbol, tf) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].isKlineDelayed((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSymbol"])(symbol), tf);
    }
    isKlineRecovering(symbol, tf) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].isKlineRecovering((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSymbol"])(symbol), tf);
    }
    start() {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].start();
    }
    stop() {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].stop();
    }
    refreshQuotes() {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["binanceFuturesFeed"].refreshQuotes();
    }
}
const compositeMarketFeed = new CompositeMarketFeed();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mawsFeed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compositeMarketFeed"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript)");
}),
"[project]/lib/market/feed-normalize.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isNewerTickerEvent",
    ()=>isNewerTickerEvent,
    "mergeLiveKline",
    ()=>mergeLiveKline,
    "miniTickerNumbers",
    ()=>miniTickerNumbers,
    "parseKlines",
    ()=>parseKlines
]);
function parseKlines(rows) {
    const out = [];
    let prevTime = -1;
    for (const r of rows){
        const time = Math.floor(Number(r[0]) / 1000);
        const open = Number(r[1]);
        const high = Number(r[2]);
        const low = Number(r[3]);
        const close = Number(r[4]);
        const volume = Number(r[5]);
        if (!Number.isFinite(time) || !Number.isFinite(open) || !Number.isFinite(high) || !Number.isFinite(low) || !Number.isFinite(close) || close <= 0) {
            continue;
        }
        if (time <= prevTime) continue;
        prevTime = time;
        out.push({
            time,
            open,
            high,
            low,
            close,
            volume: Number.isFinite(volume) ? volume : 0
        });
    }
    return out;
}
function mergeLiveKline(candles, frame, isFinal, cap) {
    const last = candles[candles.length - 1];
    if (last && last.time === frame.time) {
        candles[candles.length - 1] = {
            ...frame
        };
        return "tip";
    }
    if (!last || last.time < frame.time) {
        candles.push({
            ...frame
        });
        if (candles.length > cap) candles.shift();
        return "append";
    }
    if (isFinal) {
        // Final closed frame for an older bar only.
        for(let i = candles.length - 2; i >= 0; i--){
            if (candles[i].time === frame.time) {
                candles[i] = {
                    ...frame
                };
                break;
            }
            if (candles[i].time < frame.time) break;
        }
        return "patched";
    }
    return "skipped";
}
function isNewerTickerEvent(latestAcceptedEventTime, frameEventTime) {
    if (frameEventTime == null || !Number.isFinite(frameEventTime)) return true;
    if (latestAcceptedEventTime == null || !Number.isFinite(latestAcceptedEventTime)) return true;
    return frameEventTime >= latestAcceptedEventTime;
}
function miniTickerNumbers(t) {
    if (t.st != null && t.st !== 1) return null;
    return {
        last: Number(t.c),
        open: Number(t.o),
        high: Number(t.h),
        low: Number(t.l),
        volume: Number(t.v)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/resolve-provider.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Normalize app ticker (strip .P, slashes). */ __turbopack_context__.s([
    "normalizeAppSymbol",
    ()=>normalizeAppSymbol
]);
function normalizeAppSymbol(symbol) {
    return String(symbol ?? "").toUpperCase().replace(/\.P$/i, "").replace(/\//g, "");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/market/visibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EVENT_LOOP_GAP_MS",
    ()=>EVENT_LOOP_GAP_MS,
    "visibilityTracker",
    ()=>visibilityTracker
]);
/**
 * Page Visibility lifecycle for the market-data feed.
 *
 * Chrome aggressively throttles timers in background tabs (setInterval may
 * fire as rarely as once per minute, and long idle stretches batch timer
 * wakeups). The candle feed's 1s kline-health watchdog previously evaluated
 * stale thresholds across those delayed wakeups, so a hidden tab looked like
 * a dead stream: mid-bar REST resyncs + socket recycles raced incoming WS
 * frames and intermittently corrupted the chart (Firefox behaves differently,
 * which is why only Chrome corrupted). Refresh repainted cleanly because the
 * chart rebuilt from clean REST history.
 *
 * Contract enforced here:
 *   - hidden:  the watchdog is DEFERRED (never force a recovery because
 *              timers were delayed); sockets stay connected; candles stay.
 *   - visible: ONE debounced, generation-gated, non-destructive reconcile —
 *              candles are never cleared; a re-check may then resync only if
 *              the data is genuinely stale.
 *   - No additional WebSocket subscription is ever created for a visibility
 *     transition; stream keys are unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/candle-diagnostics.ts [app-client] (ecmascript)");
;
/** Monotonic ms — immune to wall-clock steps and safe across tab sleeps. */ function monotonicMs() {
    return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}
const EVENT_LOOP_GAP_MS = 30_000;
class VisibilityTracker {
    state = "visible";
    lastTransitionAt = monotonicMs();
    transitions = 0;
    listeners = new Set();
    installed = false;
    onVis = null;
    /** Install the document listener once (idempotent; test-safe via reset). */ install() {
        if (this.installed) return;
        if (typeof document === "undefined" || typeof document.addEventListener !== "function") return;
        this.installed = true;
        this.state = document.visibilityState === "hidden" ? "hidden" : "visible";
        this.onVis = ()=>{
            const next = document.visibilityState === "hidden" ? "hidden" : "visible";
            if (next === this.state) return;
            this.state = next;
            this.lastTransitionAt = monotonicMs();
            this.transitions += 1;
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$candle$2d$diagnostics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["candleDiagnostics"].logVisibilityChange(next, this.transitions);
            for (const fn of [
                ...this.listeners
            ]){
                try {
                    fn(next);
                } catch  {
                /* listener isolation: one bad consumer must not break the rest */ }
            }
        };
        document.addEventListener("visibilitychange", this.onVis);
    }
    uninstall() {
        if (this.installed && this.onVis) {
            document.removeEventListener("visibilitychange", this.onVis);
        }
        this.installed = false;
        this.onVis = null;
    }
    /** Test hook: full state reset (document listener included). */ reset() {
        this.uninstall();
        this.state = "visible";
        this.lastTransitionAt = monotonicMs();
        this.transitions = 0;
        this.listeners.clear();
        this.hiddenTotalMs = 0;
        this.hiddenSegmentStart = null;
        this.deferredWatchdogTicks = 0;
        this.reconcilesTriggered = 0;
    }
    getState() {
        return this.state;
    }
    isHidden() {
        return this.state === "hidden";
    }
    getLastTransitionAt() {
        return this.lastTransitionAt;
    }
    getTransitionCount() {
        return this.transitions;
    }
    onChange(fn) {
        this.listeners.add(fn);
        return ()=>{
            this.listeners.delete(fn);
        };
    }
    /**
   * Report a scheduling hole between consecutive watchdog ticks. Returns the
   * deferred ("unknown") interval when the gap indicates the tab was parked
   * (or the event loop was blocked) — time the watchdog must NOT attribute to
   * stream staleness.
   */ reportTickGap(previousTickAt, now) {
        const gap = now - previousTickAt;
        if (gap > EVENT_LOOP_GAP_MS) {
            this.deferredWatchdogTicks += 1;
            return gap;
        }
        return 0;
    }
    // -- hidden-time accounting (diagnostics) ---------------------------------
    hiddenTotalMs = 0;
    hiddenSegmentStart = null;
    deferredWatchdogTicks = 0;
    reconcilesTriggered = 0;
    noteHiddenInterval(startMs, endMs) {
        if (endMs > startMs) this.hiddenTotalMs += endMs - startMs;
    }
    noteDeferredWatchdogTick() {
        this.deferredWatchdogTicks += 1;
    }
    noteReconcile() {
        this.reconcilesTriggered += 1;
    }
    getHiddenTotalMs() {
        return this.hiddenTotalMs;
    }
    getDeferredWatchdogTicks() {
        return this.deferredWatchdogTicks;
    }
    getReconcilesTriggered() {
        return this.reconcilesTriggered;
    }
    getDiagnostics() {
        return {
            visibility: this.state,
            transitions: this.transitions,
            lastTransitionAt: this.lastTransitionAt,
            hiddenTotalMs: this.hiddenTotalMs,
            deferredWatchdogTicks: this.deferredWatchdogTicks,
            reconcilesTriggered: this.reconcilesTriggered
        };
    }
}
const visibilityTracker = new VisibilityTracker();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/maws/asset-logo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assetLogoLetter",
    ()=>assetLogoLetter,
    "assetLogoSrc",
    ()=>assetLogoSrc,
    "logoBase",
    ()=>logoBase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/resolve-provider.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
;
;
function logoBase(symbol) {
    let base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickerBase"])(symbol).toUpperCase();
    if (base.startsWith("1000000")) base = base.slice(7);
    else if (base.startsWith("1000")) base = base.slice(4);
    return base;
}
function assetLogoSrc(symbol) {
    const bare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSymbol"])(symbol);
    return `/api/logo?symbol=${encodeURIComponent(bare)}&v=8`;
}
function assetLogoLetter(symbol) {
    return logoBase(symbol).slice(0, 1) || "?";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/maws/brand.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Product identity — use these everywhere instead of hardcoding the name. */ __turbopack_context__.s([
    "MAWS",
    ()=>MAWS,
    "MAWS_FULL_NAME",
    ()=>MAWS_FULL_NAME,
    "MAWS_ICON_SRC",
    ()=>MAWS_ICON_SRC,
    "MAWS_MARK_SRC",
    ()=>MAWS_MARK_SRC,
    "MAWS_TAGLINE",
    ()=>MAWS_TAGLINE,
    "MAWS_WORDMARK_SRC",
    ()=>MAWS_WORDMARK_SRC,
    "MAWS_WORKSPACE_KEY",
    ()=>MAWS_WORKSPACE_KEY
]);
const MAWS = "MAWS";
const MAWS_FULL_NAME = "Market Analysis & Workflow System";
const MAWS_TAGLINE = "Market Analysis & Workflow System";
const MAWS_WORKSPACE_KEY = "maws.workspace.v6";
const MAWS_MARK_SRC = "/brand/maws-mark.png";
const MAWS_WORDMARK_SRC = "/brand/maws-wordmark.png";
const MAWS_ICON_SRC = "/brand/maws-icon.svg";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatPrice",
    ()=>formatPrice,
    "formatVolume",
    ()=>formatVolume
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
/** Binance Futures market data (crypto / commodities / TradFi perps). */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/binance-feed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$resolve$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/resolve-provider.ts [app-client] (ecmascript)");
;
;
;
;
function formatPrice(symbol, value) {
    const { precision } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbol"])(symbol);
    return value.toLocaleString("en-US", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
    });
}
function formatVolume(value) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return String(Math.round(value));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/maws/universe.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SYMBOLS",
    ()=>DEFAULT_SYMBOLS,
    "DEFAULT_WATCHLIST",
    ()=>DEFAULT_WATCHLIST,
    "DEFAULT_WATCHLIST_GROUPS",
    ()=>DEFAULT_WATCHLIST_GROUPS,
    "SEED_UNIVERSE",
    ()=>SEED_UNIVERSE,
    "UNIVERSE",
    ()=>UNIVERSE,
    "formatTicker",
    ()=>formatTicker,
    "getSymbol",
    ()=>getSymbol,
    "getUniverseVersion",
    ()=>getUniverseVersion,
    "loadUniverseFromBinance",
    ()=>loadUniverseFromBinance,
    "marketLabel",
    ()=>marketLabel,
    "replaceUniverse",
    ()=>replaceUniverse,
    "resolveSymbolName",
    ()=>resolveSymbolName,
    "subscribeUniverse",
    ()=>subscribeUniverse,
    "symbolColor",
    ()=>symbolColor,
    "tickerBase",
    ()=>tickerBase
]);
const SEED_UNIVERSE = [
    {
        symbol: "BTCUSDT",
        base: "BTC",
        quote: "USDT",
        name: "Bitcoin",
        precision: 1,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "ETHUSDT",
        base: "ETH",
        quote: "USDT",
        name: "Ethereum",
        precision: 2,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "SOLUSDT",
        base: "SOL",
        quote: "USDT",
        name: "Solana",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "BNBUSDT",
        base: "BNB",
        quote: "USDT",
        name: "BNB",
        precision: 2,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "XRPUSDT",
        base: "XRP",
        quote: "USDT",
        name: "XRP",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "ADAUSDT",
        base: "ADA",
        quote: "USDT",
        name: "Cardano",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "DOGEUSDT",
        base: "DOGE",
        quote: "USDT",
        name: "Dogecoin",
        precision: 5,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "AVAXUSDT",
        base: "AVAX",
        quote: "USDT",
        name: "Avalanche",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "DOTUSDT",
        base: "DOT",
        quote: "USDT",
        name: "Polkadot",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "LINKUSDT",
        base: "LINK",
        quote: "USDT",
        name: "Chainlink",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "ATOMUSDT",
        base: "ATOM",
        quote: "USDT",
        name: "Cosmos",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "NEARUSDT",
        base: "NEAR",
        quote: "USDT",
        name: "NEAR",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "LTCUSDT",
        base: "LTC",
        quote: "USDT",
        name: "Litecoin",
        precision: 2,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "APTUSDT",
        base: "APT",
        quote: "USDT",
        name: "Aptos",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "ARBUSDT",
        base: "ARB",
        quote: "USDT",
        name: "Arbitrum",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "OPUSDT",
        base: "OP",
        quote: "USDT",
        name: "Optimism",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "SUIUSDT",
        base: "SUI",
        quote: "USDT",
        name: "Sui",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "PEPEUSDT",
        base: "PEPE",
        quote: "USDT",
        name: "Pepe",
        precision: 7,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "TONUSDT",
        base: "TON",
        quote: "USDT",
        name: "Toncoin",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "TRXUSDT",
        base: "TRX",
        quote: "USDT",
        name: "TRON",
        precision: 5,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "POLUSDT",
        base: "POL",
        quote: "USDT",
        name: "Polygon",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "UNIUSDT",
        base: "UNI",
        quote: "USDT",
        name: "Uniswap",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "AAVEUSDT",
        base: "AAVE",
        quote: "USDT",
        name: "Aave",
        precision: 2,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "FILUSDT",
        base: "FIL",
        quote: "USDT",
        name: "Filecoin",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "INJUSDT",
        base: "INJ",
        quote: "USDT",
        name: "Injective",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "SEIUSDT",
        base: "SEI",
        quote: "USDT",
        name: "Sei",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "TIAUSDT",
        base: "TIA",
        quote: "USDT",
        name: "Celestia",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "WLDUSDT",
        base: "WLD",
        quote: "USDT",
        name: "Worldcoin",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "RENDERUSDT",
        base: "RENDER",
        quote: "USDT",
        name: "Render",
        precision: 3,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    },
    {
        symbol: "FETUSDT",
        base: "FET",
        quote: "USDT",
        name: "Fetch.ai",
        precision: 4,
        contractType: "PERPETUAL",
        underlyingType: "COIN"
    }
];
/** Friendly display names for common bases (crypto + TradFi). */ const NAME_BY_BASE = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    SOL: "Solana",
    BNB: "BNB",
    XRP: "XRP",
    ADA: "Cardano",
    DOGE: "Dogecoin",
    AVAX: "Avalanche",
    DOT: "Polkadot",
    LINK: "Chainlink",
    ATOM: "Cosmos",
    NEAR: "NEAR",
    LTC: "Litecoin",
    APT: "Aptos",
    ARB: "Arbitrum",
    OP: "Optimism",
    SUI: "Sui",
    PEPE: "Pepe",
    "1000PEPE": "Pepe",
    TON: "Toncoin",
    TRX: "TRON",
    POL: "Polygon",
    UNI: "Uniswap",
    AAVE: "Aave",
    FIL: "Filecoin",
    INJ: "Injective",
    SEI: "Sei",
    TIA: "Celestia",
    WLD: "Worldcoin",
    RENDER: "Render",
    FET: "Fetch.ai",
    XAU: "Gold",
    XAG: "Silver",
    XPT: "Platinum",
    XPD: "Palladium",
    TSLA: "Tesla",
    AAPL: "Apple",
    NVDA: "NVIDIA",
    AMZN: "Amazon",
    META: "Meta",
    MSFT: "Microsoft",
    GOOGL: "Alphabet",
    COIN: "Coinbase",
    MSTR: "MicroStrategy",
    MU: "Micron",
    AMD: "AMD",
    INTC: "Intel",
    TSM: "TSMC",
    QCOM: "Qualcomm",
    JPM: "JPMorgan",
    ARM: "Arm",
    IBM: "IBM",
    CRM: "Salesforce",
    IWM: "iShares Russell 2000",
    HOOD: "Robinhood",
    PLTR: "Palantir"
};
const UNDERLYING_RANK = {
    COIN: 0,
    INDEX: 1,
    COMMODITY: 2,
    EQUITY: 3,
    PREMARKET: 4,
    KR_EQUITY: 5,
    HK_EQUITY: 6,
    CN_EQUITY: 7
};
const UNIVERSE = SEED_UNIVERSE.map(_c = (s)=>({
        ...s
    }));
_c1 = UNIVERSE;
const BY_SYMBOL = new Map(UNIVERSE.map((s)=>[
        s.symbol,
        s
    ]));
let universeVersion = 0;
const universeListeners = new Set();
function rebuildIndex() {
    BY_SYMBOL.clear();
    for (const s of UNIVERSE)BY_SYMBOL.set(s.symbol, s);
}
function notifyUniverse() {
    universeVersion += 1;
    for (const cb of universeListeners)cb();
}
function getUniverseVersion() {
    return universeVersion;
}
function subscribeUniverse(listener) {
    universeListeners.add(listener);
    return ()=>universeListeners.delete(listener);
}
function resolveSymbolName(base, fallback) {
    return NAME_BY_BASE[base] ?? fallback ?? base;
}
function marketLabel(info) {
    if (info.contractType === "TRADIFI_PERPETUAL") {
        if (info.underlyingType === "COMMODITY") return "TradFi Commodity Perpetual";
        if (info.underlyingType?.includes("EQUITY") || info.underlyingType === "PREMARKET") {
            return "TradFi Equity Perpetual";
        }
        return "TradFi Perpetual";
    }
    return "USDT-M Perpetual";
}
/** Hard-coded precision overrides — take priority over API and seed values. */ const PRECISION_OVERRIDES = {
    BTCUSDT: 1
};
function replaceUniverse(next) {
    const seedBySymbol = new Map(SEED_UNIVERSE.map((s)=>[
            s.symbol,
            s
        ]));
    const enriched = next.map((row)=>{
        const seed = seedBySymbol.get(row.symbol);
        return {
            ...row,
            name: seed?.name ?? resolveSymbolName(row.base, row.name),
            precision: PRECISION_OVERRIDES[row.symbol] ?? row.precision ?? seed?.precision ?? 4
        };
    });
    // Keep aliased seed symbols that Binance lists under a different contract id.
    for (const seed of SEED_UNIVERSE){
        if (!enriched.some((s)=>s.symbol === seed.symbol)) {
            enriched.push({
                ...seed
            });
        }
    }
    enriched.sort((a, b)=>{
        const ra = UNDERLYING_RANK[a.underlyingType ?? "COIN"] ?? 99;
        const rb = UNDERLYING_RANK[b.underlyingType ?? "COIN"] ?? 99;
        if (ra !== rb) return ra - rb;
        return a.symbol.localeCompare(b.symbol);
    });
    UNIVERSE.length = 0;
    UNIVERSE.push(...enriched);
    rebuildIndex();
    notifyUniverse();
}
let loadPromise = null;
async function loadUniverseFromBinance() {
    if (loadPromise) return loadPromise;
    loadPromise = (async ()=>{
        try {
            const res = await fetch("/api/binance/symbols", {
                cache: "no-store"
            });
            if (!res.ok) return;
            const rows = await res.json();
            if (!Array.isArray(rows) || rows.length === 0) return;
            replaceUniverse(rows);
        } catch  {
        /* keep seed */ }
    })();
    return loadPromise;
}
function getSymbol(symbol) {
    const bare = symbol.replace(/\.P$/i, "").toUpperCase();
    const entry = BY_SYMBOL.get(bare);
    if (entry) {
        const ov = PRECISION_OVERRIDES[bare];
        return ov !== undefined ? {
            ...entry,
            precision: ov
        } : entry;
    }
    return {
        symbol: bare,
        base: bare.replace(/USDT$/i, ""),
        quote: "USDT",
        name: resolveSymbolName(bare.replace(/USDT$/i, ""), bare),
        precision: PRECISION_OVERRIDES[bare] ?? 4
    };
}
function formatTicker(symbol) {
    const bare = symbol.replace(/\.P$/i, "").toUpperCase();
    return `${bare}.P`;
}
function tickerBase(symbol) {
    return symbol.replace(/\.P$/i, "").replace(/USDT$/i, "");
}
const DEFAULT_SYMBOLS = SEED_UNIVERSE.slice(0, 12).map(_c2 = (s)=>s.symbol);
_c3 = DEFAULT_SYMBOLS;
const DEFAULT_WATCHLIST_GROUPS = [
    {
        id: "line-up",
        name: "LINE UP",
        collapsed: false,
        symbols: [
            "BTCUSDT.P",
            "XAUUSDT.P",
            "MUUSDT.P",
            "SOLUSDT.P",
            "SKHYNIXUSDT.P",
            "BNBUSDT.P"
        ]
    },
    {
        id: "bench",
        name: "BENCH",
        collapsed: false,
        symbols: []
    },
    {
        id: "coach",
        name: "COACH",
        collapsed: false,
        symbols: []
    }
];
const DEFAULT_WATCHLIST = DEFAULT_WATCHLIST_GROUPS.flatMap(_c4 = (g)=>g.symbols);
_c5 = DEFAULT_WATCHLIST;
const SYMBOL_COLORS = {
    BTCUSDT: "#f7931a",
    ETHUSDT: "#627eea",
    SOLUSDT: "#14f195",
    BNBUSDT: "#f3ba2f",
    XRPUSDT: "#346aa9",
    ADAUSDT: "#0033ad",
    DOGEUSDT: "#c2a633",
    AVAXUSDT: "#e84142",
    DOTUSDT: "#e6007a",
    LINKUSDT: "#2a5ada",
    XAUUSDT: "#d4af37",
    XAGUSDT: "#c0c0c0",
    MUUSDT: "#0d47a1",
    TSLAUSDT: "#cc0000",
    NVDAUSDT: "#76b900"
};
function symbolColor(symbol) {
    return SYMBOL_COLORS[symbol] ?? "#2962ff";
}
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "UNIVERSE$SEED_UNIVERSE.map");
__turbopack_context__.k.register(_c1, "UNIVERSE");
__turbopack_context__.k.register(_c2, "DEFAULT_SYMBOLS$SEED_UNIVERSE.slice(0, 12).map");
__turbopack_context__.k.register(_c3, "DEFAULT_SYMBOLS");
__turbopack_context__.k.register(_c4, "DEFAULT_WATCHLIST$DEFAULT_WATCHLIST_GROUPS.flatMap");
__turbopack_context__.k.register(_c5, "DEFAULT_WATCHLIST");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/news.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NEWS_MAX_AGE_MS",
    ()=>NEWS_MAX_AGE_MS,
    "fetchNews",
    ()=>fetchNews,
    "filterNewsByKeywords",
    ()=>filterNewsByKeywords,
    "filterNewsByMaxAge",
    ()=>filterNewsByMaxAge,
    "filterNewsByToken",
    ()=>filterNewsByToken,
    "formatNewsAge",
    ()=>formatNewsAge,
    "mapFinnhubRows",
    ()=>mapFinnhubRows,
    "newsQueryForSymbol",
    ()=>newsQueryForSymbol,
    "resolveNewsTarget",
    ()=>resolveNewsTarget,
    "ymdUTC",
    ()=>ymdUTC
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
;
/** Explicit Binance TradFi base → Finnhub equity ticker. */ const EQUITY_FINNHUB = {
    MU: "MU",
    TSLA: "TSLA",
    NVDA: "NVDA",
    AAPL: "AAPL",
    AMZN: "AMZN",
    META: "META",
    GOOGL: "GOOGL",
    GOOG: "GOOG",
    MSFT: "MSFT",
    COIN: "COIN",
    MSTR: "MSTR",
    AMD: "AMD",
    INTC: "INTC",
    NFLX: "NFLX",
    BABA: "BABA",
    // SK hynix (KRX)
    SKHYNIX: "000660.KS",
    // Common HK / CN listings on Binance TradFi (best-effort)
    Tencent: "0700.HK",
    TENCENT: "0700.HK"
};
/** Commodity / metal bases → keyword search on general market news. */ const COMMODITY_KEYWORDS = {
    XAU: [
        "gold",
        "xau",
        "bullion",
        "yellow metal"
    ],
    XAG: [
        "silver",
        "xag"
    ],
    XPT: [
        "platinum"
    ],
    XPD: [
        "palladium"
    ],
    WTI: [
        "wti",
        "crude oil",
        "crude",
        "oil price"
    ],
    BZ: [
        "brent",
        "crude oil",
        "oil price"
    ],
    BRENT: [
        "brent",
        "crude oil"
    ],
    CL: [
        "crude oil",
        "wti",
        "oil price"
    ],
    NG: [
        "natural gas",
        "natgas"
    ],
    COPPER: [
        "copper"
    ]
};
const CRYPTO_ALIASES = {
    btc: [
        "btc",
        "bitcoin"
    ],
    eth: [
        "eth",
        "ethereum",
        "ether"
    ],
    sol: [
        "sol",
        "solana"
    ],
    xrp: [
        "xrp",
        "ripple"
    ],
    bnb: [
        "bnb",
        "binance coin"
    ],
    doge: [
        "doge",
        "dogecoin"
    ],
    link: [
        "link",
        "chainlink"
    ]
};
function bareSymbol(symbol) {
    return symbol.replace(/\.P$/i, "").toUpperCase();
}
function resolveNewsTarget(symbol) {
    const bare = bareSymbol(symbol);
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbol"])(bare);
    const base = (info.base || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickerBase"])(bare) || bare.replace(/USDT$/i, "")).toUpperCase();
    const underlying = (info.underlyingType ?? "").toUpperCase();
    const name = info.name || base;
    // Commodities (gold, silver, oil, …)
    if (underlying === "COMMODITY" || COMMODITY_KEYWORDS[base]) {
        const keywords = COMMODITY_KEYWORDS[base] ?? [
            name.toLowerCase(),
            base.toLowerCase()
        ];
        return {
            kind: "market",
            category: "general",
            keywords,
            label: name || base
        };
    }
    // Equities / stock perps (Micron, SK hynix, Tesla, …)
    if (underlying.includes("EQUITY") || underlying === "PREMARKET" || EQUITY_FINNHUB[base]) {
        const finnhubSymbol = EQUITY_FINNHUB[base] ?? base;
        return {
            kind: "company",
            finnhubSymbol,
            label: name && name !== base ? `${name} (${finnhubSymbol})` : finnhubSymbol
        };
    }
    // Default: crypto perp
    return {
        kind: "market",
        category: "crypto",
        filter: base,
        keywords: CRYPTO_ALIASES[base.toLowerCase()] ?? [
            base.toLowerCase()
        ],
        label: name || base
    };
}
function newsQueryForSymbol(symbol) {
    const t = resolveNewsTarget(symbol);
    if (t.kind === "company") return {
        category: "general",
        filter: t.finnhubSymbol
    };
    return {
        category: t.category === "crypto" ? "crypto" : "general",
        filter: t.filter
    };
}
const NEWS_MAX_AGE_MS = 24 * 60 * 60 * 1000;
/** Publishers we never show (matched case-insensitively against Finnhub `source`). */ const BLOCKED_NEWS_SOURCES = new Set([
    "cointelegraph"
]);
function isBlockedNewsSource(source) {
    const s = source?.trim().toLowerCase();
    return Boolean(s && BLOCKED_NEWS_SOURCES.has(s));
}
/** Finnhub summaries sometimes include raw HTML tags — strip to plain text. */ function stripHtml(input) {
    return input.replace(/<br\s*\/?>/gi, " ").replace(/<\/p>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}
function filterNewsByMaxAge(items, maxAgeMs = NEWS_MAX_AGE_MS, now = Date.now()) {
    const cutoff = now - maxAgeMs;
    return items.filter((item)=>item.at >= cutoff);
}
function mapFinnhubRows(rows, opts) {
    const maxAgeMs = opts?.maxAgeMs ?? NEWS_MAX_AGE_MS;
    const now = opts?.now ?? Date.now();
    const cutoff = now - maxAgeMs;
    const out = [];
    for (const row of rows){
        if (!row?.headline || !row.datetime) continue;
        if (isBlockedNewsSource(row.source)) continue;
        const at = row.datetime * 1000;
        if (!Number.isFinite(at) || at < cutoff) continue;
        const summary = row.summary ? stripHtml(row.summary) : "";
        out.push({
            id: `fh-${row.id ?? `${row.datetime}-${row.headline.slice(0, 24)}`}`,
            at,
            headline: stripHtml(row.headline),
            summary: summary || undefined,
            source: row.source?.trim() || "Finnhub",
            url: row.url?.trim() || "",
            image: row.image?.trim() || undefined,
            related: row.related?.trim() || undefined,
            category: row.category?.trim() || undefined
        });
    }
    out.sort((a, b)=>b.at - a.at);
    return out;
}
function filterNewsByKeywords(items, keywords) {
    if (!keywords?.length) return items;
    const needles = keywords.map((k)=>k.toLowerCase());
    return items.filter((item)=>{
        const hay = `${item.headline} ${item.summary ?? ""} ${item.related ?? ""}`.toLowerCase();
        return needles.some((n)=>hay.includes(n));
    });
}
function filterNewsByToken(items, token) {
    if (!token) return items;
    const t = token.toLowerCase();
    const needles = CRYPTO_ALIASES[t] ?? [
        t
    ];
    return filterNewsByKeywords(items, needles);
}
const NEWS_CACHE_TTL = 2 * 60 * 1000;
const newsCache = new Map();
const inflightNews = new Map();
async function fetchNews(opts, signal) {
    const params = new URLSearchParams();
    if (opts?.symbol) params.set("symbol", opts.symbol);
    if (opts?.category) params.set("category", opts.category);
    const qs = params.toString();
    const key = qs || "__all__";
    const cached = newsCache.get(key);
    if (cached && Date.now() - cached.ts < NEWS_CACHE_TTL) {
        return {
            items: cached.items,
            error: cached.error
        };
    }
    const existing = inflightNews.get(key);
    if (existing) return existing;
    const promise = (async ()=>{
        try {
            const res = await fetch(`/api/news/finnhub${qs ? `?${qs}` : ""}`, {
                cache: "default",
                signal
            });
            const raw = await res.json();
            if (!res.ok) {
                const err = !Array.isArray(raw) && raw.error ? raw.error : `News unavailable (${res.status})`;
                const result = {
                    items: [],
                    error: err
                };
                newsCache.set(key, {
                    ...result,
                    ts: Date.now()
                });
                return result;
            }
            const items = Array.isArray(raw) ? raw : raw.items ?? [];
            const error = Array.isArray(raw) ? undefined : raw.error;
            const result = {
                items,
                error
            };
            newsCache.set(key, {
                ...result,
                ts: Date.now()
            });
            return result;
        } catch (e) {
            if (e.name === "AbortError") return {
                items: []
            };
            return {
                items: [],
                error: "Network error"
            };
        } finally{
            inflightNews.delete(key);
        }
    })();
    inflightNews.set(key, promise);
    return promise;
}
function formatNewsAge(at, now = Date.now()) {
    const mins = Math.max(0, Math.round((now - at) / 60_000));
    if (mins < 1) return "just now";
    if (mins === 1) return "1 minute ago";
    if (mins < 60) return `${mins} minutes ago`;
    const hours = Math.round(mins / 60);
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
}
function ymdUTC(d = new Date()) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/order-blocks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneObState",
    ()=>cloneObState,
    "computeOrderBlocks",
    ()=>computeOrderBlocks,
    "computeOrderBlocksLive",
    ()=>computeOrderBlocksLive,
    "createObState",
    ()=>createObState,
    "selectDisplayed",
    ()=>selectDisplayed,
    "stepObBar",
    ()=>stepObBar
]);
const MAX_LABELS = 500;
function createObState() {
    return {
        os: 0,
        top: {
            y: null,
            x: -1,
            crossed: false
        },
        btm: {
            y: null,
            x: -1,
            crossed: false
        },
        bull: [],
        bear: [],
        prevBullConf: 0,
        prevBearConf: 0,
        labels: []
    };
}
function cloneObState(s) {
    return {
        os: s.os,
        top: {
            ...s.top
        },
        btm: {
            ...s.btm
        },
        bull: s.bull.map((b)=>({
                ...b
            })),
        bear: s.bear.map((b)=>({
                ...b
            })),
        prevBullConf: s.prevBullConf,
        prevBearConf: s.prevBearConf,
        labels: s.labels.slice()
    };
}
function effHigh(c, useBody) {
    return useBody ? Math.max(c.close, c.open) : c.high;
}
function effLow(c, useBody) {
    return useBody ? Math.min(c.close, c.open) : c.low;
}
function pushLabel(state, side, swing) {
    if (swing.y === null) return;
    state.labels.push({
        side,
        barIndex: swing.x,
        price: swing.y
    });
    if (state.labels.length > MAX_LABELS) {
        state.labels.splice(0, state.labels.length - MAX_LABELS);
    }
}
function stepObBar(state, candles, n, cfg) {
    const len = cfg.swingLookback;
    const c = candles[n];
    // swings(len): ta.highest/lowest span [n-len+1 .. n], inclusive of the current bar, so
    // candles[n-len] sits outside the window — a one-sided (right-confirmed) pivot test.
    let upper = -Infinity;
    let lower = Infinity;
    for(let i = Math.max(0, n - len + 1); i <= n; i++){
        if (candles[i].high > upper) upper = candles[i].high;
        if (candles[i].low < lower) lower = candles[i].low;
    }
    // Before bar `len`, high[n-len]/low[n-len] are na in Pine and comparisons are falsy, so os holds.
    if (n - len >= 0) {
        const prevOs = state.os;
        const pivotHigh = candles[n - len].high;
        const pivotLow = candles[n - len].low;
        if (pivotHigh > upper) state.os = 0;
        else if (pivotLow < lower) state.os = 1;
        // Swings only record on a state *transition*, so recorded swings strictly alternate and
        // each yields at most one order block (a fresh swing resets `crossed`).
        if (state.os === 0 && prevOs !== 0) {
            state.top = {
                y: pivotHigh,
                x: n - len,
                crossed: false
            };
        }
        if (state.os === 1 && prevOs !== 1) {
            state.btm = {
                y: pivotLow,
                x: n - len,
                crossed: false
            };
        }
    }
    // --- Bullish OB ---
    const top = state.top;
    let bullConf = 0;
    if (top.y !== null && c.close > top.y && !top.crossed) {
        top.crossed = true;
        // Pine initialises these swapped (minima = max[1], maxima = min[1]); since effLow <= effHigh
        // the first loop iteration self-corrects, so the swap is harmless.
        let minima = effHigh(candles[n - 1], cfg.useBody);
        let maxima = effLow(candles[n - 1], cfg.useBody);
        let loc = candles[n - 1].time;
        // i ascends, so this walks bars n-1 (newest) back to top.x+1 (oldest), excluding both the
        // breakout bar n and the swing bar top.x.
        for(let i = 1; i <= n - top.x - 1; i++){
            const bar = n - i;
            const lo = effLow(candles[bar], cfg.useBody);
            minima = Math.min(lo, minima);
            // Tested *after* the min assignment, so a tie satisfies it and the oldest tied bar wins.
            if (minima === lo) {
                maxima = effHigh(candles[bar], cfg.useBody);
                loc = candles[bar].time;
            }
        }
        state.bull.unshift({
            side: "bull",
            top: maxima,
            btm: minima,
            loc,
            breaker: false,
            breakLoc: null
        });
    }
    if (state.bull.length > 0) {
        for(let i = state.bull.length - 1; i >= 0; i--){
            const el = state.bull[i];
            if (!el.breaker) {
                // Mitigation deliberately ignores useBody: it always uses the candle body.
                if (Math.min(c.close, c.open) < el.btm) {
                    el.breaker = true;
                    el.breakLoc = c.time;
                }
            } else if (c.close > el.top) {
                state.bull.splice(i, 1);
            } else if (i < cfg.showLastBull && top.y !== null && top.y < el.top && top.y > el.btm) {
                bullConf = 1;
            }
        }
    }
    // Labels fire on the rising edge of the per-bar confirmation flag only.
    if (bullConf > state.prevBullConf && cfg.showLabels) pushLabel(state, "bull", top);
    state.prevBullConf = bullConf;
    // --- Bearish OB ---
    const btm = state.btm;
    let bearConf = 0;
    if (btm.y !== null && c.close < btm.y && !btm.crossed) {
        btm.crossed = true;
        let minima = effLow(candles[n - 1], cfg.useBody);
        let maxima = effHigh(candles[n - 1], cfg.useBody);
        let loc = candles[n - 1].time;
        for(let i = 1; i <= n - btm.x - 1; i++){
            const bar = n - i;
            const hi = effHigh(candles[bar], cfg.useBody);
            maxima = Math.max(hi, maxima);
            if (maxima === hi) {
                minima = effLow(candles[bar], cfg.useBody);
                loc = candles[bar].time;
            }
        }
        state.bear.unshift({
            side: "bear",
            top: maxima,
            btm: minima,
            loc,
            breaker: false,
            breakLoc: null
        });
    }
    if (state.bear.length > 0) {
        for(let i = state.bear.length - 1; i >= 0; i--){
            const el = state.bear[i];
            if (!el.breaker) {
                if (Math.max(c.close, c.open) > el.top) {
                    el.breaker = true;
                    el.breakLoc = c.time;
                }
            } else if (c.close < el.btm) {
                state.bear.splice(i, 1);
            } else if (i < cfg.showLastBear && btm.y !== null && btm.y > el.btm && btm.y < el.top) {
                bearConf = 1;
            }
        }
    }
    if (bearConf > state.prevBearConf && cfg.showLabels) pushLabel(state, "bear", btm);
    state.prevBearConf = bearConf;
}
function selectDisplayed(state, cfg) {
    const out = [];
    if (cfg.showLastBull > 0) {
        const last = Math.min(cfg.showLastBull - 1, state.bull.length - 1);
        for(let i = 0; i <= last; i++)out.push(state.bull[i]);
    }
    if (cfg.showLastBear > 0) {
        const last = Math.min(cfg.showLastBear - 1, state.bear.length - 1);
        for(let i = 0; i <= last; i++)out.push(state.bear[i]);
    }
    return out;
}
function computeOrderBlocks(candles, cfg) {
    const state = createObState();
    for(let n = 0; n < candles.length; n++)stepObBar(state, candles, n, cfg);
    return {
        bull: state.bull,
        bear: state.bear,
        labels: state.labels,
        displayed: selectDisplayed(state, cfg)
    };
}
function computeOrderBlocksLive(candles, cfg, cache) {
    const n = candles.length;
    const cfgSig = `${cfg.swingLookback}|${cfg.useBody ? 1 : 0}|${cfg.showLastBull}|${cfg.showLastBear}|${cfg.showLabels ? 1 : 0}`;
    const histEnd = Math.max(0, n - 1);
    const anchor = histEnd > 0 ? candles[histEnd - 1].time : -1;
    const key = `${n}|${anchor}|${cfgSig}`;
    let state;
    if (cache && cache.key === key) {
        state = cloneObState(cache.state);
    } else {
        state = createObState();
        for(let i = 0; i < histEnd; i++)stepObBar(state, candles, i, cfg);
        cache = {
            key,
            state: cloneObState(state)
        };
    }
    if (n > 0) stepObBar(state, candles, n - 1, cfg);
    return {
        result: {
            bull: state.bull,
            bear: state.bear,
            labels: state.labels,
            displayed: selectDisplayed(state, cfg)
        },
        cache
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/selectors/broker.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBrokerBook",
    ()=>getBrokerBook,
    "useBrokerBook",
    ()=>useBrokerBook
]);
/**
 * Broker book selection: one source of truth for which orders/positions the
 * UI renders. `connectedBroker === "binance"` shows the live book; anything
 * else (mock/paper, or nothing connected) shows the paper book. The two books
 * are never merged — the chart and panels always render exactly one.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function getBrokerBook(app, live) {
    if (app.connectedBroker === "binance") {
        return {
            orders: live.orders,
            positions: live.positions
        };
    }
    return {
        orders: app.orders,
        positions: app.positions
    };
}
function useBrokerBook() {
    _s();
    const connectedBroker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useBrokerBook.useAppStore[connectedBroker]": (s)=>s.connectedBroker
    }["useBrokerBook.useAppStore[connectedBroker]"]);
    const orders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useBrokerBook.useAppStore[orders]": (s)=>s.orders
    }["useBrokerBook.useAppStore[orders]"]);
    const positions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useBrokerBook.useAppStore[positions]": (s)=>s.positions
    }["useBrokerBook.useAppStore[positions]"]);
    const liveOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "useBrokerBook.useLiveStore[liveOrders]": (s)=>s.orders
    }["useBrokerBook.useLiveStore[liveOrders]"]);
    const livePositions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "useBrokerBook.useLiveStore[livePositions]": (s)=>s.positions
    }["useBrokerBook.useLiveStore[livePositions]"]);
    return getBrokerBook({
        connectedBroker,
        orders,
        positions
    }, {
        orders: liveOrders,
        positions: livePositions
    });
}
_s(useBrokerBook, "qFGWgqCOXXh9wQqDdzH/F/YP2jg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/shortcuts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Editable keyboard shortcuts for MAWS. */ __turbopack_context__.s([
    "DEFAULT_SHORTCUTS",
    ()=>DEFAULT_SHORTCUTS,
    "SHORTCUT_DEFS",
    ()=>SHORTCUT_DEFS,
    "chordFromEvent",
    ()=>chordFromEvent,
    "chordsEqual",
    ()=>chordsEqual,
    "eventMatchesShortcut",
    ()=>eventMatchesShortcut,
    "findShortcutConflict",
    ()=>findShortcutConflict,
    "formatShortcut",
    ()=>formatShortcut,
    "mergeShortcuts",
    ()=>mergeShortcuts,
    "normalizeKey",
    ()=>normalizeKey
]);
const SHORTCUT_DEFS = [
    {
        id: "openSearch",
        label: "Symbol search",
        group: "Navigation"
    },
    {
        id: "fitChart",
        label: "Fit chart / reset scale",
        group: "Chart"
    },
    {
        id: "openChartSettings",
        label: "Chart settings",
        group: "Chart"
    },
    {
        id: "cursorTool",
        label: "Select cursor tool",
        group: "Drawings"
    },
    {
        id: "toggleMagnet",
        label: "Toggle magnet",
        group: "Drawings"
    },
    {
        id: "drawHorizontalRay",
        label: "Draw horizontal ray at crosshair",
        group: "Drawings"
    },
    {
        id: "pastePriceRay",
        label: "Paste price as horizontal ray",
        group: "Drawings"
    },
    {
        id: "addAlert",
        label: "Add alert at crosshair",
        group: "Trading"
    },
    {
        id: "buyLimit",
        label: "Buy limit at crosshair",
        group: "Trading"
    },
    {
        id: "buyLimitAtCross",
        label: "Buy limit (Alt)",
        group: "Trading"
    },
    {
        id: "sellStopAtCross",
        label: "Sell stop at crosshair",
        group: "Trading"
    }
];
const DEFAULT_SHORTCUTS = {
    openSearch: {
        key: "/",
        ctrl: false,
        alt: false,
        shift: false
    },
    fitChart: {
        key: "r",
        ctrl: false,
        alt: true,
        shift: false
    },
    addAlert: {
        key: "a",
        ctrl: false,
        alt: true,
        shift: false
    },
    buyLimit: {
        key: "t",
        ctrl: false,
        alt: false,
        shift: true
    },
    buyLimitAtCross: {
        key: "b",
        ctrl: false,
        alt: true,
        shift: true
    },
    sellStopAtCross: {
        key: "s",
        ctrl: false,
        alt: true,
        shift: true
    },
    drawHorizontalRay: {
        key: "h",
        ctrl: false,
        alt: true,
        shift: false
    },
    pastePriceRay: {
        key: "v",
        ctrl: true,
        alt: false,
        shift: false
    },
    openChartSettings: {
        key: ",",
        ctrl: true,
        alt: false,
        shift: false
    },
    cursorTool: {
        key: "escape",
        ctrl: false,
        alt: false,
        shift: false
    },
    toggleMagnet: {
        key: "m",
        ctrl: false,
        alt: true,
        shift: false
    }
};
const MOD_KEYS = new Set([
    "Control",
    "Shift",
    "Alt",
    "Meta"
]);
function normalizeKey(key) {
    if (key === " ") return "space";
    if (key.length === 1) return key.toLowerCase();
    return key.toLowerCase();
}
function chordFromEvent(e) {
    if (MOD_KEYS.has(e.key)) return null;
    return {
        key: normalizeKey(e.key),
        ctrl: e.ctrlKey || e.metaKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: false
    };
}
function chordsEqual(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.key === b.key && Boolean(a.ctrl) === Boolean(b.ctrl) && Boolean(a.alt) === Boolean(b.alt) && Boolean(a.shift) === Boolean(b.shift);
}
function eventMatchesShortcut(e, chord) {
    if (!chord) return false;
    const key = normalizeKey(e.key);
    // Allow openSearch default "/" also via Ctrl/Cmd+K legacy
    if (chord.key === "/" && !chord.ctrl && !chord.alt && !chord.shift && e.ctrlKey && !e.altKey && key === "k") {
        return true;
    }
    const wantCtrl = Boolean(chord.ctrl);
    const haveCtrl = e.ctrlKey || e.metaKey;
    return key === chord.key && haveCtrl === wantCtrl && e.altKey === Boolean(chord.alt) && e.shiftKey === Boolean(chord.shift);
}
function formatShortcut(chord) {
    if (!chord) return "None";
    const parts = [];
    if (chord.ctrl) parts.push("Ctrl");
    if (chord.alt) parts.push("Alt");
    if (chord.shift) parts.push("Shift");
    const keyLabel = chord.key === "escape" ? "Esc" : chord.key === " " ? "Space" : chord.key === "/" ? "/" : chord.key.length === 1 ? chord.key.toUpperCase() : chord.key.charAt(0).toUpperCase() + chord.key.slice(1);
    parts.push(keyLabel);
    return parts.join(" + ");
}
function mergeShortcuts(partial) {
    const next = {
        ...DEFAULT_SHORTCUTS
    };
    if (!partial) return next;
    for (const id of Object.keys(DEFAULT_SHORTCUTS)){
        if (id in partial) next[id] = partial[id] ?? null;
    }
    return next;
}
function findShortcutConflict(map, chord, except) {
    for (const id of Object.keys(map)){
        if (id === except) continue;
        if (chordsEqual(map[id], chord)) return id;
    }
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slices/chart-slice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAIN_PRICE_PANE_ID",
    ()=>MAIN_PRICE_PANE_ID,
    "createChartSlice",
    ()=>createChartSlice,
    "normalizeChartRehydrate",
    ()=>normalizeChartRehydrate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$layouts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/layouts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/studies.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/drawings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visibility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trade-marks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/timezone.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
const MAIN_PRICE_PANE_ID = "main";
/**
 * Keep the last applied/saved/matched template sticky when studies diverge,
 * so the toolbar can keep showing its name + a Save action.
 * Only fall back to signature matching when there is no preferred id.
 */ function resolveActiveTemplateId(templates, studies, preferredId) {
    if (preferredId && templates.some((t)=>t.id === preferredId)) {
        return preferredId;
    }
    const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["studiesSignature"])(studies);
    return templates.find((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["studiesSignature"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["templateToStudies"])(t)) === sig)?.id ?? null;
}
/**
 * Pin the template that matches studies *before* an edit, then keep it sticky
 * after the edit (even though it no longer matches).
 */ function pinTemplateThroughEdit(templates, studiesBefore, preferredId) {
    return resolveActiveTemplateId(templates, studiesBefore, preferredId);
}
function createPane(index) {
    return {
        id: `pane-${index}`,
        symbol: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOLS"][index % __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOLS"].length],
        timeframe: "1D",
        studies: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultStudies"])(),
        drawings: []
    };
}
const defaultPanes = Array.from({
    length: 12
}, (_, i)=>createPane(i));
function createChartSlice(set, get) {
    return {
        layoutCount: 1,
        orientation: "h",
        layoutTracks: {},
        layoutSync: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_LAYOUT_SYNC"]
        },
        activePaneId: "pane-0",
        panes: defaultPanes,
        range: "All",
        indicatorSettingsId: null,
        indicatorsHidden: false,
        indicatorSettings: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"]
        },
        chartSettings: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
        alerts: [],
        maximizedPaneId: null,
        focusedPane: null,
        autoScaleByPane: {},
        paneStretchFactors: {},
        replay: null,
        clipboardPrice: null,
        vertCursorLocked: false,
        lockedCursorTime: null,
        chartTemplates: [
            {
                id: "hollow",
                name: "Hollow candles",
                settings: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
                    candleStyle: "hollow"
                }
            },
            {
                id: "solid",
                name: "Solid candles",
                settings: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
                    candleStyle: "solid"
                }
            },
            {
                id: "line",
                name: "Line",
                settings: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
                    candleStyle: "line",
                    grid: false
                }
            }
        ],
        indicatorTemplates: [],
        activeIndicatorTemplateId: null,
        setLayout: (count)=>{
            const state = get();
            if (state.layoutCount === count) {
                // Re-selecting the active layout resets resized pane tracks to defaults.
                const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$layouts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["layoutKey"])(count, state.orientation);
                if (!(key in state.layoutTracks)) return;
                const next = {
                    ...state.layoutTracks
                };
                delete next[key];
                set({
                    layoutTracks: next
                });
                return;
            }
            set({
                layoutCount: count
            });
        },
        toggleOrientation: ()=>set({
                orientation: get().orientation === "h" ? "v" : "h"
            }),
        setLayoutTracks: (key, tracks)=>set({
                layoutTracks: {
                    ...get().layoutTracks,
                    [key]: tracks
                }
            }),
        setActivePane: (id)=>{
            const pane = get().panes.find((p)=>p.id === id);
            set({
                activePaneId: id,
                // Rematch from this pane's studies only — don't carry a sticky template
                // from another chart (e.g. MAWS on an empty multi-layout pane).
                activeIndicatorTemplateId: pane ? resolveActiveTemplateId(get().indicatorTemplates, pane.studies, null) : null
            });
        },
        setSymbol: (symbol, paneId)=>{
            const state = get();
            const id = paneId ?? state.activePaneId;
            const syncAll = state.layoutSync.symbol;
            const visible = new Set(state.panes.slice(0, state.layoutCount).map((p)=>p.id));
            const touched = state.panes.filter((p)=>syncAll && visible.has(p.id) || p.id === id).map((p)=>p.id);
            const autoScaleByPane = {
                ...state.autoScaleByPane
            };
            for (const pid of touched)autoScaleByPane[pid] = true;
            set({
                panes: state.panes.map((p)=>syncAll && visible.has(p.id) || p.id === id ? {
                        ...p,
                        symbol
                    } : p),
                autoScaleByPane,
                searchOpen: false
            });
        },
        setTimeframe: (timeframe, paneId)=>{
            const state = get();
            const id = paneId ?? state.activePaneId;
            const syncAll = state.layoutSync.interval;
            const visible = new Set(state.panes.slice(0, state.layoutCount).map((p)=>p.id));
            const touched = state.panes.filter((p)=>syncAll && visible.has(p.id) || p.id === id).map((p)=>p.id);
            const autoScaleByPane = {
                ...state.autoScaleByPane
            };
            for (const pid of touched)autoScaleByPane[pid] = true;
            set({
                panes: state.panes.map((p)=>syncAll && visible.has(p.id) || p.id === id ? {
                        ...p,
                        timeframe
                    } : p),
                autoScaleByPane
            });
        },
        addIndicator: (type, paneId)=>{
            const id = paneId ?? get().activePaneId;
            const defaults = get().indicatorSettings;
            const study = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStudy"])(type, defaults[type]);
            const before = get().panes.find((p)=>p.id === id);
            const pinned = before ? pinTemplateThroughEdit(get().indicatorTemplates, before.studies, get().activeIndicatorTemplateId) : get().activeIndicatorTemplateId;
            const panes = get().panes.map((p)=>p.id === id ? {
                    ...p,
                    studies: [
                        ...p.studies,
                        study
                    ]
                } : p);
            set({
                panes,
                activeIndicatorTemplateId: pinned
            });
        },
        removeIndicator: (instanceId, paneId)=>{
            const id = paneId ?? get().activePaneId;
            const before = get().panes.find((p)=>p.id === id);
            const pinned = before ? pinTemplateThroughEdit(get().indicatorTemplates, before.studies, get().activeIndicatorTemplateId) : get().activeIndicatorTemplateId;
            const panes = get().panes.map((p)=>p.id === id ? {
                    ...p,
                    studies: p.studies.filter((s)=>s.id !== instanceId)
                } : p);
            const openId = get().indicatorSettingsId;
            set({
                panes,
                indicatorSettingsId: openId === instanceId ? null : openId,
                activeIndicatorTemplateId: pinned
            });
        },
        setPaneNatives: (paneId, natives)=>set({
                panes: get().panes.map((p)=>p.id === paneId ? {
                        ...p,
                        natives
                    } : p)
            }),
        clearIndicators: (paneId)=>{
            const id = paneId ?? get().activePaneId;
            const before = get().panes.find((p)=>p.id === id);
            const pinned = before ? pinTemplateThroughEdit(get().indicatorTemplates, before.studies, get().activeIndicatorTemplateId) : get().activeIndicatorTemplateId;
            const panes = get().panes.map((p)=>p.id === id ? {
                    ...p,
                    studies: []
                } : p);
            set({
                panes,
                indicatorSettingsId: null,
                activeIndicatorTemplateId: pinned
            });
        },
        setIndicatorsHidden: (value)=>set({
                indicatorsHidden: value
            }),
        setIndicatorHidden: (instanceId, hidden, paneId)=>{
            const id = paneId ?? get().activePaneId;
            const before = get().panes.find((p)=>p.id === id);
            const pinned = before ? pinTemplateThroughEdit(get().indicatorTemplates, before.studies, get().activeIndicatorTemplateId) : get().activeIndicatorTemplateId;
            set({
                activeIndicatorTemplateId: pinned,
                panes: get().panes.map((p)=>p.id === id ? {
                        ...p,
                        studies: p.studies.map((s)=>s.id === instanceId ? {
                                ...s,
                                hidden
                            } : s)
                    } : p)
            });
        },
        updateStudySettings: (instanceId, settings, paneId)=>{
            const panes = get().panes;
            let id = paneId ?? get().activePaneId;
            const onPane = panes.find((p)=>p.id === id);
            if (!onPane?.studies.some((s)=>s.id === instanceId)) {
                id = panes.find((p)=>p.studies.some((s)=>s.id === instanceId))?.id ?? id;
            }
            const before = panes.find((p)=>p.id === id);
            const pinned = before ? pinTemplateThroughEdit(get().indicatorTemplates, before.studies, get().activeIndicatorTemplateId) : get().activeIndicatorTemplateId;
            set({
                activeIndicatorTemplateId: pinned,
                panes: panes.map((p)=>{
                    if (p.id !== id) return p;
                    return {
                        ...p,
                        studies: p.studies.map((s)=>{
                            if (s.id !== instanceId) return s;
                            return {
                                ...s,
                                settings: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeStudySettings"])(s.type, settings)
                            };
                        })
                    };
                })
            });
        },
        setRange: (range)=>set({
                range
            }),
        setIndicatorSettingsOpen: (id)=>set({
                indicatorSettingsId: id,
                settingsOpen: false,
                drawingSettingsTarget: null,
                contextMenu: null
            }),
        setIndicatorSettings: (value)=>set({
                indicatorSettings: {
                    vwap: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVwapSettings"])(value.vwap),
                    ema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEmaSettings"])({
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].ema,
                        ...value.ema,
                        visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(value.ema?.visibility ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].ema.visibility)
                    }),
                    bb: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeBbSettings"])(value.bb),
                    rsi: {
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].rsi,
                        ...value.rsi,
                        visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(value.rsi?.visibility)
                    },
                    stoch: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeStochSettings"])({
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].stoch,
                        ...value.stoch,
                        visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(value.stoch?.visibility ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].stoch.visibility)
                    }),
                    atr: {
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].atr,
                        ...value.atr,
                        visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(value.atr?.visibility)
                    },
                    adx: {
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].adx,
                        ...value.adx,
                        visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(value.adx?.visibility)
                    }
                }
            }),
        patchIndicatorSettings: (id, patch)=>{
            const prev = get().indicatorSettings[id];
            const base = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"][id];
            const next = {
                ...base,
                ...prev,
                ...patch
            };
            if (id === "vwap") {
                set({
                    indicatorSettings: {
                        ...get().indicatorSettings,
                        vwap: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVwapSettings"])(next)
                    }
                });
                return;
            }
            if (id === "ema") {
                const ema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEmaSettings"])(next);
                set({
                    indicatorSettings: {
                        ...get().indicatorSettings,
                        ema
                    }
                });
                return;
            }
            if (id === "bb") {
                set({
                    indicatorSettings: {
                        ...get().indicatorSettings,
                        bb: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeBbSettings"])(next)
                    }
                });
                return;
            }
            if (id === "stoch") {
                const stoch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeStochSettings"])(next);
                set({
                    indicatorSettings: {
                        ...get().indicatorSettings,
                        stoch
                    }
                });
                return;
            }
            set({
                indicatorSettings: {
                    ...get().indicatorSettings,
                    [id]: next
                }
            });
        },
        patchChartSettings: (patch)=>set({
                chartSettings: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
                    ...get().chartSettings,
                    ...patch
                }
            }),
        addAlert: (alert)=>set({
                alerts: [
                    ...get().alerts,
                    {
                        ...alert,
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])()
                    }
                ]
            }),
        updateAlert: (id, patch)=>set({
                alerts: get().alerts.map((a)=>a.id === id ? {
                        ...a,
                        ...patch
                    } : a)
            }),
        toggleAlert: (id)=>set({
                alerts: get().alerts.map((a)=>a.id === id ? {
                        ...a,
                        enabled: !a.enabled
                    } : a)
            }),
        removeAlert: (id)=>set({
                alerts: get().alerts.filter((a)=>a.id !== id)
            }),
        setMaximizedPane: (id)=>set({
                maximizedPaneId: id
            }),
        toggleFocusedPane: (chartPaneId, paneId)=>{
            const current = get().focusedPane;
            set({
                focusedPane: current?.chartPaneId === chartPaneId && current.paneId === paneId ? null : {
                    chartPaneId,
                    paneId
                }
            });
        },
        clearFocusedPane: ()=>set({
                focusedPane: null
            }),
        setPaneAutoScale: (paneId, on)=>set({
                autoScaleByPane: {
                    ...get().autoScaleByPane,
                    [paneId]: on
                }
            }),
        setPaneStretchFactors: (paneId, value)=>set({
                paneStretchFactors: {
                    ...get().paneStretchFactors,
                    [paneId]: value
                }
            }),
        startReplay: (paneId, index, total, cursorTime)=>set({
                replay: {
                    paneId,
                    index: Math.max(1, Math.min(index, total - 1)),
                    total,
                    playing: false,
                    speed: 1,
                    cursorTime: cursorTime ?? null,
                    remaining: null
                }
            }),
        stopReplay: ()=>set({
                replay: null
            }),
        patchReplay: (patch)=>{
            const cur = get().replay;
            if (!cur) return;
            set({
                replay: {
                    ...cur,
                    ...patch
                }
            });
        },
        setClipboardPrice: (price)=>set({
                clipboardPrice: price
            }),
        setVertCursorLocked: (value)=>set({
                vertCursorLocked: value,
                lockedCursorTime: value ? get().lockedCursorTime : null
            }),
        setLockedCursorTime: (time)=>set({
                lockedCursorTime: time
            }),
        saveChartTemplate: (name)=>set({
                chartTemplates: [
                    ...get().chartTemplates,
                    {
                        id: Math.random().toString(36).slice(2, 8),
                        name,
                        settings: {
                            ...get().chartSettings
                        }
                    }
                ]
            }),
        applyChartTemplate: (id)=>{
            const tpl = get().chartTemplates.find((t)=>t.id === id);
            if (tpl) set({
                chartSettings: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
                    ...tpl.settings
                }
            });
        },
        saveIndicatorTemplate: (name)=>{
            const pane = get().panes.find((p)=>p.id === get().activePaneId) ?? get().panes[0];
            if (!pane) return;
            const trimmed = name.trim();
            if (!trimmed) return;
            const now = Date.now();
            const snapshot = pane.studies.map((s)=>({
                    type: s.type,
                    settings: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneStudySettings"])(s.type, s.settings),
                    hidden: Boolean(s.hidden)
                }));
            const existing = get().indicatorTemplates.find((t)=>t.name.toLowerCase() === trimmed.toLowerCase());
            if (existing) {
                set({
                    activeIndicatorTemplateId: existing.id,
                    indicatorTemplates: get().indicatorTemplates.map((t)=>t.id === existing.id ? {
                            ...t,
                            name: trimmed,
                            studies: snapshot,
                            indicators: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["studiesTypeFlags"])(pane.studies),
                            lastUsedAt: now
                        } : t)
                });
                return;
            }
            const id = Math.random().toString(36).slice(2, 8);
            set({
                activeIndicatorTemplateId: id,
                indicatorTemplates: [
                    {
                        id,
                        name: trimmed,
                        studies: snapshot,
                        indicators: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["studiesTypeFlags"])(pane.studies),
                        lastUsedAt: now
                    },
                    ...get().indicatorTemplates
                ]
            });
        },
        applyIndicatorTemplate: (id)=>{
            const tpl = get().indicatorTemplates.find((t)=>t.id === id);
            if (!tpl) return;
            const paneId = get().activePaneId;
            const defaults = get().indicatorSettings;
            set({
                activeIndicatorTemplateId: id,
                panes: get().panes.map((p)=>p.id === paneId ? {
                        ...p,
                        studies: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["templateToStudies"])(tpl, defaults)
                    } : p),
                indicatorTemplates: get().indicatorTemplates.map((t)=>t.id === id ? {
                        ...t,
                        lastUsedAt: Date.now()
                    } : t)
            });
        },
        toggleIndicatorTemplateFavorite: (id)=>set({
                indicatorTemplates: get().indicatorTemplates.map((t)=>t.id === id ? {
                        ...t,
                        favorite: !t.favorite
                    } : t)
            }),
        removeIndicatorTemplate: (id)=>set({
                activeIndicatorTemplateId: get().activeIndicatorTemplateId === id ? null : get().activeIndicatorTemplateId,
                indicatorTemplates: get().indicatorTemplates.filter((t)=>t.id !== id)
            }),
        patchLayoutSync: (patch)=>{
            const state = get();
            const layoutSync = {
                ...state.layoutSync,
                ...patch
            };
            let panes = state.panes;
            if (patch.symbol === true || patch.interval === true) {
                const active = panes.find((p)=>p.id === state.activePaneId) ?? panes[0];
                const visible = new Set(panes.slice(0, state.layoutCount).map((p)=>p.id));
                if (active) {
                    panes = panes.map((p)=>{
                        if (!visible.has(p.id)) return p;
                        return {
                            ...p,
                            symbol: patch.symbol === true ? active.symbol : p.symbol,
                            timeframe: patch.interval === true ? active.timeframe : p.timeframe
                        };
                    });
                }
            }
            set({
                layoutSync,
                panes
            });
        }
    };
}
/** Study types that moved to Vela-native indicators — dropped on hydrate. */ const LEGACY_STUDY_TYPES = new Set([
    "volume",
    "pmo",
    "ob"
]);
function normalizeChartRehydrate(state) {
    state.chartSettings = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
        ...state.chartSettings,
        timezone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeTimezone"])(state.chartSettings?.timezone)
    };
    // Prefer the current default scale label size over the prior 14px default.
    if (state.chartSettings.scaleFontSize === 14) {
        state.chartSettings.scaleFontSize = 12;
    }
    state.layoutSync = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_LAYOUT_SYNC"],
        ...state.layoutSync
    };
    state.layoutTracks = state.layoutTracks ?? {};
    state.autoScaleByPane = state.autoScaleByPane ?? {};
    state.paneStretchFactors = state.paneStretchFactors ?? {};
    const rename = (sym)=>sym === "MATICUSDT" ? "POLUSDT" : sym;
    state.panes = (state.panes ?? []).map((p)=>({
            ...p,
            symbol: rename(p.symbol)
        })).map((p)=>/^EURUSD$/i.test(p.symbol) ? {
            ...p,
            symbol: "BTCUSDT"
        } : p);
    state.indicatorsHidden = state.indicatorsHidden === true;
    state.indicatorSettings = {
        vwap: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVwapSettings"])(state.indicatorSettings?.vwap),
        ema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEmaSettings"])(state.indicatorSettings?.ema),
        bb: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeBbSettings"])(state.indicatorSettings?.bb),
        rsi: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].rsi,
            ...state.indicatorSettings?.rsi,
            visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(state.indicatorSettings?.rsi?.visibility)
        },
        stoch: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeStochSettings"])(state.indicatorSettings?.stoch),
        atr: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].atr,
            ...state.indicatorSettings?.atr,
            visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(state.indicatorSettings?.atr?.visibility)
        },
        adx: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].adx,
            ...state.indicatorSettings?.adx,
            visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(state.indicatorSettings?.adx?.visibility)
        }
    };
    state.indicatorSettingsId = null;
    const seededIds = new Set([
        "vol-based",
        "momentum",
        "swing"
    ]);
    state.indicatorTemplates = (state.indicatorTemplates ?? []).filter((t)=>!seededIds.has(t.id));
    state.panes = state.panes.map((p)=>{
        const studies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensurePaneStudies"])(p, state.indicatorSettings).filter(// Volume / PMO / Order Blocks moved to Vela-native indicators added from
        // the Indicators menu — drop the legacy MAWS studies on hydrate.
        (s)=>!LEGACY_STUDY_TYPES.has(s.type));
        return {
            ...p,
            studies,
            indicators: undefined,
            hiddenIndicators: undefined,
            drawings: p.drawings.filter(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidDrawing"]).map((d)=>({
                    ...d,
                    visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(d.visibility),
                    lineWidth: d.lineWidth ?? 2,
                    lineStyle: d.lineStyle ?? "solid",
                    extend: d.extend ?? "none"
                }))
        };
    });
    state.indicatorTemplates = (state.indicatorTemplates ?? []).map((t)=>({
            ...t,
            studies: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["templateToStudies"])(t, state.indicatorSettings).filter((s)=>!LEGACY_STUDY_TYPES.has(s.type)).map((s)=>({
                    type: s.type,
                    settings: s.settings,
                    hidden: s.hidden
                }))
        }));
    const pane = state.panes.find((p)=>p.id === state.activePaneId) ?? state.panes[0];
    if (pane) {
        state.activeIndicatorTemplateId = resolveActiveTemplateId(state.indicatorTemplates, pane.studies, null);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slices/drawing-slice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDrawingSlice",
    ()=>createDrawingSlice,
    "normalizeDrawingRehydrate",
    ()=>normalizeDrawingRehydrate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/drawings.ts [app-client] (ecmascript)");
;
function createDrawingSlice(set, get) {
    return {
        drawingTool: "cursor",
        stayInDrawingMode: false,
        magnet: true,
        drawingsHidden: false,
        drawingHistory: [],
        drawingHistoryIndex: -1,
        drawingSettingsTarget: null,
        selectedDrawingId: null,
        addDrawing: (paneId, drawing)=>{
            const state = get();
            const pane = state.panes.find((p)=>p.id === paneId);
            if (!pane) return;
            // Save current state to history before making change
            const newHistory = state.drawingHistory.slice(0, state.drawingHistoryIndex + 1);
            newHistory.push({
                paneId,
                drawings: pane.drawings
            });
            set({
                panes: state.panes.map((p)=>p.id === paneId ? {
                        ...p,
                        drawings: [
                            ...p.drawings,
                            drawing
                        ]
                    } : p),
                selectedDrawingId: drawing.id,
                drawingHistory: newHistory,
                drawingHistoryIndex: newHistory.length - 1
            });
        },
        updateDrawing: (paneId, drawingId, patch)=>{
            // Don't save history for updates - they happen continuously during drag
            // History will be saved when drag ends (handled separately)
            set({
                panes: get().panes.map((p)=>p.id === paneId ? {
                        ...p,
                        drawings: p.drawings.map((d)=>d.id === drawingId ? {
                                ...d,
                                ...patch
                            } : d)
                    } : p)
            });
        },
        saveDrawingHistory: (paneId)=>{
            const state = get();
            const pane = state.panes.find((p)=>p.id === paneId);
            if (!pane) return;
            // Only save if different from last history entry
            const lastEntry = state.drawingHistory[state.drawingHistoryIndex];
            if (lastEntry && lastEntry.paneId === paneId) {
                const lastDrawingsJson = JSON.stringify(lastEntry.drawings);
                const currentDrawingsJson = JSON.stringify(pane.drawings);
                if (lastDrawingsJson === currentDrawingsJson) return;
            }
            // Save current state to history
            const newHistory = state.drawingHistory.slice(0, state.drawingHistoryIndex + 1);
            newHistory.push({
                paneId,
                drawings: pane.drawings
            });
            set({
                drawingHistory: newHistory,
                drawingHistoryIndex: newHistory.length - 1
            });
        },
        removeDrawing: (paneId, drawingId)=>{
            const state = get();
            const pane = state.panes.find((p)=>p.id === paneId);
            if (!pane) return;
            // Save current state to history before making change
            const newHistory = state.drawingHistory.slice(0, state.drawingHistoryIndex + 1);
            newHistory.push({
                paneId,
                drawings: pane.drawings
            });
            set({
                panes: state.panes.map((p)=>p.id === paneId ? {
                        ...p,
                        drawings: p.drawings.filter((d)=>d.id !== drawingId)
                    } : p),
                selectedDrawingId: state.selectedDrawingId === drawingId ? null : state.selectedDrawingId,
                drawingHistory: newHistory,
                drawingHistoryIndex: newHistory.length - 1
            });
        },
        clearDrawings: (paneId)=>{
            const state = get();
            const pane = state.panes.find((p)=>p.id === paneId);
            if (!pane) return;
            // Save current state to history before making change
            const newHistory = state.drawingHistory.slice(0, state.drawingHistoryIndex + 1);
            newHistory.push({
                paneId,
                drawings: pane.drawings
            });
            set({
                panes: state.panes.map((p)=>p.id === paneId ? {
                        ...p,
                        drawings: []
                    } : p),
                selectedDrawingId: null,
                drawingHistory: newHistory,
                drawingHistoryIndex: newHistory.length - 1
            });
        },
        undoDrawing: ()=>{
            const state = get();
            if (state.drawingHistoryIndex < 0) return;
            const historyEntry = state.drawingHistory[state.drawingHistoryIndex];
            if (!historyEntry) return;
            set({
                panes: state.panes.map((p)=>p.id === historyEntry.paneId ? {
                        ...p,
                        drawings: historyEntry.drawings
                    } : p),
                drawingHistoryIndex: state.drawingHistoryIndex - 1,
                selectedDrawingId: null
            });
        },
        redoDrawing: ()=>{
            const state = get();
            if (state.drawingHistoryIndex >= state.drawingHistory.length - 1) return;
            const nextIndex = state.drawingHistoryIndex + 1;
            const historyEntry = state.drawingHistory[nextIndex];
            if (!historyEntry) return;
            const pane = state.panes.find((p)=>p.id === historyEntry.paneId);
            if (!pane) return;
            // Get the state that was created after this history entry
            const nextHistoryEntry = state.drawingHistory[nextIndex + 1];
            if (!nextHistoryEntry) return;
            set({
                panes: state.panes.map((p)=>p.id === nextHistoryEntry.paneId ? {
                        ...p,
                        drawings: nextHistoryEntry.drawings
                    } : p),
                drawingHistoryIndex: nextIndex,
                selectedDrawingId: null
            });
        },
        setSelectedDrawing: (id)=>set({
                selectedDrawingId: id
            }),
        setDrawingTool: (tool)=>set({
                drawingTool: tool
            }),
        setStayInDrawingMode: (value)=>set({
                stayInDrawingMode: value
            }),
        setMagnet: (value)=>set({
                magnet: value
            }),
        setDrawingsHidden: (value)=>set({
                drawingsHidden: value
            }),
        setDrawingSettingsTarget: (target)=>set({
                drawingSettingsTarget: target,
                indicatorSettingsId: null,
                settingsOpen: false,
                contextMenu: null,
                selectedDrawingId: target?.drawingId ?? get().selectedDrawingId
            }),
        toggleDrawingHidden: (paneId, drawingId)=>set({
                panes: get().panes.map((p)=>p.id === paneId ? {
                        ...p,
                        drawings: p.drawings.map((d)=>d.id === drawingId ? {
                                ...d,
                                hidden: !d.hidden
                            } : d)
                    } : p)
            })
    };
}
function normalizeDrawingRehydrate(state) {
    if (state.drawingTool !== "cursor" && state.drawingTool !== "zoom" && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPersistTool"])(state.drawingTool)) {
        state.drawingTool = "cursor";
    }
    state.drawingSettingsTarget = null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slices/market-data-slice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collectHotSymbols",
    ()=>collectHotSymbols,
    "createMarketDataSlice",
    ()=>createMarketDataSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
;
function collectHotSymbols(state) {
    const hot = new Set();
    const add = (raw)=>{
        const sym = raw.replace(/\.P$/i, "").toUpperCase();
        if (sym) hot.add(sym);
    };
    for (const s of state.watchlist)add(s);
    for (const p of state.panes.slice(0, state.layoutCount))add(p.symbol);
    for (const o of state.orders)add(o.symbol);
    for (const p of state.positions)add(p.symbol);
    return [
        ...hot
    ];
}
function createMarketDataSlice(set, get) {
    return {
        hotSymbols: [],
        syncHotSymbols: ()=>{
            const hot = collectHotSymbols(get());
            set({
                hotSymbols: hot
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].setHotSymbols(hot);
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slices/news-slice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createNewsSlice",
    ()=>createNewsSlice,
    "normalizeNewsRehydrate",
    ()=>normalizeNewsRehydrate
]);
function createNewsSlice(set, get) {
    return {
        calendarNewsSplit: 0.52,
        detailsCollapsed: false,
        newsCollapsed: false,
        performanceCollapsed: false,
        technicalsCollapsed: false,
        setCalendarNewsSplit: (ratio)=>set({
                calendarNewsSplit: Math.min(0.78, Math.max(0.22, ratio))
            }),
        toggleDetailsCollapsed: ()=>set({
                detailsCollapsed: !get().detailsCollapsed
            }),
        toggleNewsCollapsed: ()=>set({
                newsCollapsed: !get().newsCollapsed
            }),
        togglePerformanceCollapsed: ()=>set({
                performanceCollapsed: !get().performanceCollapsed
            }),
        toggleTechnicalsCollapsed: ()=>set({
                technicalsCollapsed: !get().technicalsCollapsed
            })
    };
}
function normalizeNewsRehydrate(state) {
    if (typeof state.calendarNewsSplit !== "number" || !Number.isFinite(state.calendarNewsSplit)) {
        state.calendarNewsSplit = 0.52;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slices/paper-trading-slice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPaperTradingSlice",
    ()=>createPaperTradingSlice,
    "normalizePaperTradingRehydrate",
    ()=>normalizePaperTradingRehydrate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/brokers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trade-marks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
;
;
;
function createPaperTradingSlice(set, get) {
    return {
        connectedBroker: null,
        mockBalance: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"],
        mockRealized: 0,
        paperAccount: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"],
            leverage: {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"].leverage
            }
        },
        orders: [],
        positions: [],
        orderHistory: [],
        balanceHistory: [],
        journal: [],
        setConnectedBroker: (id)=>set({
                connectedBroker: id
            }),
        setMockBalance: (value)=>set({
                mockBalance: value
            }),
        setMockRealized: (value)=>set({
                mockRealized: value
            }),
        setPaperAccount: (value)=>set({
                paperAccount: {
                    ...value,
                    leverage: {
                        ...value.leverage
                    }
                }
            }),
        patchPaperAccount: (patch)=>set({
                paperAccount: {
                    ...get().paperAccount,
                    ...patch,
                    leverage: {
                        ...get().paperAccount.leverage,
                        ...patch.leverage ?? {}
                    }
                }
            }),
        resetPaperAccount: ()=>set({
                mockBalance: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"],
                mockRealized: 0,
                positions: [],
                orders: [],
                paperAccount: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"],
                    leverage: {
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"].leverage
                    }
                },
                chartSettings: {
                    ...get().chartSettings,
                    defaultLeverage: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"].leverage.crypto
                }
            }),
        addOrder: (order)=>set({
                orders: [
                    ...get().orders,
                    {
                        ...order,
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])()
                    }
                ]
            }),
        updateOrder: (id, patch)=>set({
                orders: get().orders.map((o)=>o.id === id ? {
                        ...o,
                        ...patch
                    } : o)
            }),
        removeOrder: (id)=>set({
                orders: get().orders.filter((o)=>o.id !== id)
            }),
        addPosition: (pos)=>{
            const protect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultProtect"])(pos.entry, pos.side);
            const next = {
                ...pos,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])(),
                openedAt: pos.openedAt ?? Date.now(),
                liq: pos.liq ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liquidationPrice"])(pos),
                tp: pos.tp === undefined ? protect.tp : pos.tp,
                sl: pos.sl === undefined ? protect.sl : pos.sl
            };
            set({
                positions: [
                    ...get().positions,
                    next
                ]
            });
        },
        updatePosition: (id, patch)=>set({
                positions: get().positions.map((p)=>{
                    if (p.id !== id) return p;
                    const next = {
                        ...p,
                        ...patch
                    };
                    if (patch.entry != null || patch.leverage != null || patch.side != null) {
                        next.liq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liquidationPrice"])(next);
                    }
                    return next;
                })
            }),
        removePosition: (id)=>set({
                positions: get().positions.filter((p)=>p.id !== id)
            }),
        addOrderHistory: (entry)=>set({
                orderHistory: [
                    {
                        ...entry,
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])()
                    },
                    ...get().orderHistory
                ].slice(0, 500)
            }),
        addBalanceHistory: (entry)=>set({
                balanceHistory: [
                    {
                        ...entry,
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])()
                    },
                    ...get().balanceHistory
                ].slice(0, 500)
            }),
        addJournalEntry: (entry)=>set({
                journal: [
                    {
                        ...entry,
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])()
                    },
                    ...get().journal
                ].slice(0, 500)
            })
    };
}
function normalizePaperTradingRehydrate(state) {
    const lev = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"].leverage,
        ...state.paperAccount?.leverage
    };
    delete lev.forex;
    state.paperAccount = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"],
        ...state.paperAccount,
        leverage: lev
    };
    state.orders = state.orders ?? [];
    state.positions = state.positions ?? [];
    state.orderHistory = state.orderHistory ?? [];
    state.balanceHistory = state.balanceHistory ?? [];
    state.journal = (state.journal ?? []).map((entry)=>{
        const legacy = entry;
        if (legacy.text && legacy.time != null) {
            return {
                id: legacy.id,
                time: legacy.time,
                text: legacy.text
            };
        }
        if (legacy.symbol && legacy.closedAt != null) {
            return {
                id: legacy.id,
                time: legacy.closedAt,
                text: `Close ${legacy.side ?? "position"} for symbol ${legacy.symbol} at price ${legacy.exit ?? "—"} for ${legacy.qty ?? "—"} units`
            };
        }
        return {
            id: legacy.id,
            time: legacy.time ?? Date.now(),
            text: legacy.text ?? "Journal entry"
        };
    });
    // Binance is server-authoritative and must be re-confirmed after reload;
    // never restore a stale live attachment from browser storage.
    state.connectedBroker = state.connectedBroker === "mock" ? "mock" : null;
    state.mockBalance = state.mockBalance ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"];
    state.mockRealized = state.mockRealized ?? 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slices/symbol-settings-slice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSymbolSettingsSlice",
    ()=>createSymbolSettingsSlice,
    "normalizeSymbolSettingsRehydrate",
    ()=>normalizeSymbolSettingsRehydrate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
;
function createSymbolSettingsSlice(set, get) {
    return {
        symbolTrading: {},
        patchSymbolTrading: (symbol, patch)=>{
            const prev = get().symbolTrading[symbol];
            const base = {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"],
                ...prev,
                leverage: prev?.leverage ?? get().chartSettings.defaultLeverage,
                margin: prev?.margin ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].margin,
                marginPercent: prev?.marginPercent ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].marginPercent
            };
            set({
                symbolTrading: {
                    ...get().symbolTrading,
                    [symbol]: {
                        ...base,
                        ...patch
                    }
                }
            });
        },
        setSymbolTrading: (symbol, value)=>set({
                symbolTrading: {
                    ...get().symbolTrading,
                    [symbol]: {
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"],
                        ...value
                    }
                }
            })
    };
}
function normalizeSymbolSettingsRehydrate(state) {
    state.symbolTrading = state.symbolTrading ?? {};
    for (const key of Object.keys(state.symbolTrading)){
        if (/^EURUSD$/i.test(key)) delete state.symbolTrading[key];
    }
    if (state.symbolTrading.MATICUSDT && !state.symbolTrading.POLUSDT) {
        state.symbolTrading.POLUSDT = state.symbolTrading.MATICUSDT;
        delete state.symbolTrading.MATICUSDT;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slices/ui-slice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUiSlice",
    ()=>createUiSlice,
    "normalizeUiRehydrate",
    ()=>normalizeUiRehydrate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/app-theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shortcuts.ts [app-client] (ecmascript)");
;
;
function createUiSlice(set, get) {
    return {
        shortcuts: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SHORTCUTS"]
        },
        rightOpen: true,
        bottomOpen: false,
        bottomTab: "positions",
        rightDock: "strategy",
        rightWidth: 360,
        bottomHeight: 220,
        searchOpen: false,
        indicatorMenuOpen: false,
        layoutMenuOpen: false,
        settingsOpen: false,
        brokerDialogOpen: false,
        accountSettingsOpen: false,
        buySellMenu: null,
        tradingSettingsSymbol: null,
        contextMenu: null,
        appSettings: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_APP_SETTINGS"]
        },
        columnWidths: {},
        strategyCardsHeight: 320,
        setShortcut: (id, chord)=>set({
                shortcuts: {
                    ...get().shortcuts,
                    [id]: chord
                }
            }),
        resetShortcuts: ()=>set({
                shortcuts: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SHORTCUTS"]
                }
            }),
        setRightOpen: (value)=>set({
                rightOpen: value
            }),
        setBottomOpen: (value)=>set({
                bottomOpen: value
            }),
        setBottomTab: (tab)=>set({
                bottomTab: tab,
                bottomOpen: true
            }),
        setBottomTabCollapsed: (tab)=>set({
                bottomTab: tab,
                bottomOpen: false
            }),
        toggleBottomTab: (tab)=>{
            const s = get();
            if (s.bottomOpen && s.bottomTab === tab) set({
                bottomOpen: false
            });
            else set({
                bottomTab: tab,
                bottomOpen: true
            });
        },
        setRightDock: (dock)=>set({
                rightDock: dock,
                rightOpen: true
            }),
        setRightWidth: (width)=>set({
                rightWidth: width
            }),
        setBottomHeight: (height)=>set({
                bottomHeight: height
            }),
        setSearchOpen: (value)=>set({
                searchOpen: value,
                indicatorMenuOpen: false,
                layoutMenuOpen: false,
                ...value ? {
                    settingsOpen: false
                } : {}
            }),
        setIndicatorMenuOpen: (value)=>set({
                indicatorMenuOpen: value,
                searchOpen: false,
                layoutMenuOpen: false,
                ...value ? {
                    settingsOpen: false
                } : {}
            }),
        setLayoutMenuOpen: (value)=>set({
                layoutMenuOpen: value,
                searchOpen: false,
                indicatorMenuOpen: false,
                ...value ? {
                    settingsOpen: false
                } : {}
            }),
        setSettingsOpen: (value)=>set({
                settingsOpen: value,
                contextMenu: null,
                ...value ? {
                    searchOpen: false,
                    indicatorMenuOpen: false,
                    layoutMenuOpen: false
                } : {}
            }),
        setBrokerDialogOpen: (value)=>set({
                brokerDialogOpen: value,
                contextMenu: null
            }),
        setAccountSettingsOpen: (value)=>set({
                accountSettingsOpen: value,
                contextMenu: null
            }),
        setBuySellMenu: (menu)=>set({
                buySellMenu: menu,
                contextMenu: menu ? null : get().contextMenu
            }),
        setTradingSettingsSymbol: (symbol)=>set({
                tradingSettingsSymbol: symbol,
                buySellMenu: null,
                contextMenu: null
            }),
        setContextMenu: (menu)=>set({
                contextMenu: menu,
                buySellMenu: menu ? null : get().buySellMenu
            }),
        closeMenus: ()=>set({
                searchOpen: false,
                indicatorMenuOpen: false,
                layoutMenuOpen: false,
                contextMenu: null,
                buySellMenu: null,
                accountSettingsOpen: false
            }),
        setColumnWidths: (tableId, widths)=>set({
                columnWidths: {
                    ...get().columnWidths,
                    [tableId]: widths
                }
            }),
        patchAppSettings: (patch)=>{
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSettings"])({
                ...get().appSettings,
                ...patch
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyAppTheme"])(next);
            set({
                appSettings: next
            });
        },
        setAppSettings: (value)=>{
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSettings"])(value);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyAppTheme"])(next);
            set({
                appSettings: next
            });
        },
        setStrategyCardsHeight: (height)=>set({
                strategyCardsHeight: height
            })
    };
}
function normalizeUiRehydrate(state) {
    state.appSettings = migrateLegacyAppSettings((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSettings"])(state.appSettings));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyAppTheme"])(state.appSettings);
    state.shortcuts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeShortcuts"])(state.shortcuts);
    if (state.rightDock === "watchlist" || state.rightDock === "screener") {
        state.rightDock = "strategy";
    }
    if (state.rightDock === "news") {
        state.rightDock = "calendar";
    }
    state.buySellMenu = null;
    state.tradingSettingsSymbol = null;
    state.accountSettingsOpen = false;
    state.brokerDialogOpen = false;
    if (state.bottomTab !== "positions" && state.bottomTab !== "orders" && state.bottomTab !== "orderHistory" && state.bottomTab !== "balanceHistory" && state.bottomTab !== "journal") {
        state.bottomTab = "positions";
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/slices/watchlist-slice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWatchlistSlice",
    ()=>createWatchlistSlice,
    "normalizeWatchlistRehydrate",
    ()=>normalizeWatchlistRehydrate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
;
function createWatchlistSlice(set, get) {
    return {
        watchlist: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_WATCHLIST"],
        watchlistGroups: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_WATCHLIST_GROUPS"].map((g)=>({
                ...g,
                symbols: [
                    ...g.symbols
                ]
            })),
        watchlistHeight: 248,
        watchlistCollapsed: false,
        watchlistGroupCollapsed: false,
        toggleWatchlistCollapsed: ()=>set({
                watchlistCollapsed: !get().watchlistCollapsed
            }),
        toggleWatchlistGroup: (id)=>set({
                watchlistGroups: get().watchlistGroups.map((g)=>g.id === id ? {
                        ...g,
                        collapsed: !g.collapsed
                    } : g)
            }),
        addToWatchlist: (symbol)=>{
            const groups = get().watchlistGroups;
            if (groups.some((g)=>g.symbols.includes(symbol))) return;
            const next = groups.map((g, i)=>i === 0 ? {
                    ...g,
                    symbols: [
                        ...g.symbols,
                        symbol
                    ]
                } : g);
            set({
                watchlistGroups: next,
                watchlist: next.flatMap((g)=>g.symbols)
            });
        },
        removeFromWatchlist: (symbol)=>{
            const next = get().watchlistGroups.map((g)=>({
                    ...g,
                    symbols: g.symbols.filter((s)=>s !== symbol)
                }));
            set({
                watchlistGroups: next,
                watchlist: next.flatMap((g)=>g.symbols)
            });
        },
        moveWatchlistSymbol: (symbol, toGroupId, toIndex)=>{
            const groups = get().watchlistGroups.map((g)=>({
                    ...g,
                    symbols: [
                        ...g.symbols
                    ]
                }));
            let fromGroupId = null;
            let fromIndex = -1;
            for (const g of groups){
                const i = g.symbols.indexOf(symbol);
                if (i < 0) continue;
                fromGroupId = g.id;
                fromIndex = i;
                g.symbols.splice(i, 1);
                break;
            }
            if (fromGroupId == null || fromIndex < 0) return;
            const dest = groups.find((g)=>g.id === toGroupId);
            if (!dest) return;
            let insertAt = Math.max(0, Math.min(toIndex, dest.symbols.length));
            if (fromGroupId === toGroupId && fromIndex < insertAt) insertAt -= 1;
            insertAt = Math.max(0, Math.min(insertAt, dest.symbols.length));
            dest.symbols.splice(insertAt, 0, symbol);
            set({
                watchlistGroups: groups,
                watchlist: groups.flatMap((g)=>g.symbols)
            });
        },
        reorderWatchlist: (fromIndex, toIndex)=>{
            const list = [
                ...get().watchlist
            ];
            if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length || fromIndex === toIndex) {
                return;
            }
            const [sym] = list.splice(fromIndex, 1);
            list.splice(toIndex, 0, sym);
            // Persist order in the first group so flatMap stays in sync.
            const groups = get().watchlistGroups.map((g, i)=>i === 0 ? {
                    ...g,
                    symbols: list
                } : {
                    ...g,
                    symbols: []
                });
            set({
                watchlist: list,
                watchlistGroups: groups
            });
        },
        setWatchlistOrder: (symbols)=>{
            const list = [
                ...symbols
            ];
            const groups = get().watchlistGroups.map((g, i)=>i === 0 ? {
                    ...g,
                    symbols: list
                } : {
                    ...g,
                    symbols: []
                });
            set({
                watchlist: list,
                watchlistGroups: groups
            });
        },
        setWatchlistHeight: (height)=>set({
                watchlistHeight: height
            })
    };
}
const renameSymbol = (sym)=>sym === "MATICUSDT" ? "POLUSDT" : sym;
const dropFx = (sym)=>{
    const s = renameSymbol(sym);
    return /^EURUSD$/i.test(s) ? null : s;
};
function normalizeWatchlistRehydrate(state) {
    state.watchlist = (state.watchlist ?? []).map(dropFx).filter((s)=>Boolean(s));
    state.watchlistGroups = (state.watchlistGroups ?? []).map((g)=>({
            ...g,
            symbols: g.symbols.map(dropFx).filter((s)=>Boolean(s))
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isIndicatorTemplateDirty",
    ()=>isIndicatorTemplateDirty,
    "useActivePane",
    ()=>useActivePane,
    "useAppStore",
    ()=>useAppStore,
    "workspacePartialize",
    ()=>workspacePartialize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$brand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/brand.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$ui$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slices/ui-slice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$watchlist$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slices/watchlist-slice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$symbol$2d$settings$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slices/symbol-settings-slice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$news$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slices/news-slice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$chart$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slices/chart-slice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$drawing$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slices/drawing-slice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$market$2d$data$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slices/market-data-slice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$paper$2d$trading$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slices/paper-trading-slice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/studies.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
function isIndicatorTemplateDirty(tpl, studies) {
    const saved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["templateToStudies"])(tpl);
    if (saved.length !== studies.length) return true;
    for(let i = 0; i < studies.length; i++){
        const a = studies[i];
        const b = saved[i];
        if (!a || !b) return true;
        if (a.type !== b.type || Boolean(a.hidden) !== Boolean(b.hidden)) return true;
        if (JSON.stringify(a.settings) !== JSON.stringify(b.settings)) return true;
    }
    return false;
}
const workspacePartialize = (state)=>({
        layoutCount: state.layoutCount,
        orientation: state.orientation,
        layoutTracks: state.layoutTracks,
        layoutSync: state.layoutSync,
        activePaneId: state.activePaneId,
        panes: state.panes,
        watchlist: state.watchlist,
        watchlistGroups: state.watchlistGroups,
        drawingTool: state.drawingTool,
        stayInDrawingMode: state.stayInDrawingMode,
        magnet: state.magnet,
        drawingsHidden: state.drawingsHidden,
        indicatorsHidden: state.indicatorsHidden,
        shortcuts: state.shortcuts,
        rightOpen: state.rightOpen,
        bottomOpen: state.bottomOpen,
        bottomTab: state.bottomTab,
        rightDock: state.rightDock,
        rightWidth: state.rightWidth,
        calendarNewsSplit: state.calendarNewsSplit,
        bottomHeight: state.bottomHeight,
        range: state.range,
        watchlistCollapsed: state.watchlistCollapsed,
        watchlistGroupCollapsed: state.watchlistGroupCollapsed,
        detailsCollapsed: state.detailsCollapsed,
        newsCollapsed: state.newsCollapsed,
        performanceCollapsed: state.performanceCollapsed,
        technicalsCollapsed: state.technicalsCollapsed,
        chartSettings: state.chartSettings,
        appSettings: state.appSettings,
        indicatorSettings: state.indicatorSettings,
        alerts: state.alerts,
        orders: state.orders,
        positions: state.positions,
        orderHistory: state.orderHistory,
        balanceHistory: state.balanceHistory,
        journal: state.journal,
        watchlistHeight: state.watchlistHeight,
        strategyCardsHeight: state.strategyCardsHeight,
        autoScaleByPane: state.autoScaleByPane,
        paneStretchFactors: state.paneStretchFactors,
        columnWidths: state.columnWidths,
        chartTemplates: state.chartTemplates,
        indicatorTemplates: state.indicatorTemplates,
        activeIndicatorTemplateId: state.activeIndicatorTemplateId,
        // Live attachment is confirmed by the server and must never survive a
        // reload as an unverified browser claim.
        connectedBroker: state.connectedBroker === "mock" ? "mock" : null,
        mockBalance: state.mockBalance,
        mockRealized: state.mockRealized,
        paperAccount: state.paperAccount,
        symbolTrading: state.symbolTrading
    });
const useAppStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$ui$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUiSlice"])(set, get),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$watchlist$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createWatchlistSlice"])(set, get),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$symbol$2d$settings$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbolSettingsSlice"])(set, get),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$news$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createNewsSlice"])(set, get),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$chart$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChartSlice"])(set, get),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$drawing$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDrawingSlice"])(set, get),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$market$2d$data$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createMarketDataSlice"])(set, get),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$paper$2d$trading$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPaperTradingSlice"])(set, get)
    }), {
    name: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$brand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAWS_WORKSPACE_KEY"],
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const pending = new Map();
        let timer;
        return {
            getItem: (name)=>window.localStorage.getItem(name),
            setItem: (name, value)=>{
                pending.set(name, value);
                if (timer != null) return;
                timer = window.setTimeout(()=>{
                    timer = undefined;
                    for (const [k, v] of pending){
                        try {
                            window.localStorage.setItem(k, v);
                        } catch  {
                        /* quota */ }
                    }
                    pending.clear();
                }, 400);
            },
            removeItem: (name)=>{
                pending.delete(name);
                window.localStorage.removeItem(name);
            }
        };
    }),
    partialize: workspacePartialize,
    onRehydrateStorage: ()=>(state)=>{
            if (!state) return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$drawing$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeDrawingRehydrate"])(state);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$chart$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeChartRehydrate"])(state);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$ui$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeUiRehydrate"])(state);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$symbol$2d$settings$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeSymbolSettingsRehydrate"])(state);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$watchlist$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWatchlistRehydrate"])(state);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$news$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeNewsRehydrate"])(state);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slices$2f$paper$2d$trading$2d$slice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizePaperTradingRehydrate"])(state);
        }
}));
function useActivePane() {
    _s();
    return useAppStore({
        "useActivePane.useAppStore": (s)=>{
            return s.panes.find({
                "useActivePane.useAppStore": (p)=>p.id === s.activePaneId
            }["useActivePane.useAppStore"]) ?? s.panes[0];
        }
    }["useActivePane.useAppStore"]);
}
_s(useActivePane, "WaWoZFGsV3qiiOjJHq8b1vvtvBw=", false, function() {
    return [
        useAppStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/strategy-screener.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HTF_TIMEFRAME",
    ()=>HTF_TIMEFRAME,
    "STRATEGY_ANALYZE_BARS",
    ()=>STRATEGY_ANALYZE_BARS,
    "analyzeSymbol",
    ()=>analyzeSymbol,
    "closedCandles",
    ()=>closedCandles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/indicators.ts [app-client] (ecmascript)");
;
const HTF_TIMEFRAME = "15m";
const STRATEGY_ANALYZE_BARS = 280;
function closedCandles(candles) {
    if (candles.length === 0) return candles;
    // The last candle in the live feed is the bar currently forming.
    return candles.slice(0, -1);
}
function lastDefined(values) {
    for(let i = values.length - 1; i >= 0; i--){
        if (values[i] != null) return values[i];
    }
    return null;
}
function emaTrend(candles, fast, slow) {
    if (candles.length < slow + 1) return "none";
    const fastEma = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeEma"])(candles, fast);
    const slowEma = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeEma"])(candles, slow);
    const f = lastDefined(fastEma);
    const s = lastDefined(slowEma);
    if (f == null || s == null) return "none";
    const price = candles[candles.length - 1].close;
    if (f > s && price > f) return "long";
    if (f < s && price < f) return "short";
    return "none";
}
function stochSnapshot(candles, length, kSmooth, dSmooth) {
    const { d } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeStochastic"])(candles, length, kSmooth, dSmooth);
    return {
        d: lastDefined(d)
    };
}
/** Stoch condition from D-line zone only — no HTF direction. */ function stochDCondition(id, label, d) {
    if (d == null) {
        return {
            id,
            label,
            status: "wait",
            detail: "Warming up",
            value: null,
            aux: null
        };
    }
    const zone = d >= 80 ? "overbought" : d <= 20 ? "oversold" : "neutral";
    const status = d <= 20 ? "pass" : d >= 80 ? "block" : "wait";
    return {
        id,
        label,
        status,
        detail: `${d.toFixed(1)} — ${zone}`,
        value: d,
        aux: null
    };
}
/**
 * Count how many of the 5 scored conditions fire for a given side.
 * Ignores HTF entirely — VWAP side, stoch zone, ADX strength only.
 */ function countSideConfluence(side, price, vwapVal, stochDs, adxVal) {
    let n = 0;
    if (vwapVal != null) {
        if (side === "long" && price > vwapVal) n += 1;
        if (side === "short" && price < vwapVal) n += 1;
    }
    for (const d of stochDs){
        if (d == null) continue;
        if (side === "long" && d <= 20) n += 1;
        if (side === "short" && d >= 80) n += 1;
    }
    if (adxVal != null && adxVal <= 40) n += 1;
    return n;
}
function evaluateSetup(ltfFull, htfFull) {
    if (ltfFull.length < 60) return null;
    // Session VWAP — cap lookback so watchlist-wide screener stays cheap.
    const vwapWindow = ltfFull.length > 600 ? ltfFull.slice(-600) : ltfFull;
    const vwap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeVwap"])(vwapWindow, "hlc3", "session");
    const vwapVal = lastDefined(vwap);
    // Stoch / ADX / HTF EMAs only need a recent window.
    const ltf = ltfFull.length > STRATEGY_ANALYZE_BARS ? ltfFull.slice(-STRATEGY_ANALYZE_BARS) : ltfFull;
    const htf = htfFull.length > STRATEGY_ANALYZE_BARS ? htfFull.slice(-STRATEGY_ANALYZE_BARS) : htfFull;
    const price = ltfFull[ltfFull.length - 1].close;
    const direction = emaTrend(htf, 20, 50);
    // --- Indicators on 1m candles (live: includes the forming bar) ---
    const stochFast = stochSnapshot(ltf, 14, 1, 3);
    const stochMid = stochSnapshot(ltf, 40, 1, 4);
    const stochSlow = stochSnapshot(ltf, 60, 1, 10);
    const adx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeAdx"])(ltf, 14);
    const adxVal = lastDefined(adx);
    const conditions = [];
    const add = (c)=>{
        conditions.push(c);
    };
    // 1. HTF bias — visual only; never gates VWAP / stoch / ADX / setup state.
    add({
        id: "htfBias",
        label: "HTF bias (15m EMA20/50)",
        status: "info",
        detail: direction === "long" ? "Bullish 15m Bias" : direction === "short" ? "Bearish 15m Bias" : "Neutral 15m Bias",
        value: direction === "long" ? 1 : direction === "short" ? -1 : 0,
        aux: null
    });
    // 2. VWAP position — location only (no HTF gate)
    if (vwapVal == null) {
        add({
            id: "vwap",
            label: "VWAP position",
            status: "wait",
            detail: "VWAP not yet defined",
            value: null,
            aux: null
        });
    } else {
        const above = price > vwapVal;
        add({
            id: "vwap",
            label: "VWAP position",
            status: "pass",
            detail: above ? "Price above VWAP" : "Price below VWAP",
            value: price - vwapVal,
            aux: vwapVal
        });
    }
    // 3–5. Stochs — zone only (no HTF gate)
    add(stochDCondition("stochFast", "Stoch 14.3 (fast)", stochFast.d));
    add(stochDCondition("stochMid", "Stoch 40.4 (mid)", stochMid.d));
    add(stochDCondition("stochSlow", "Stoch 60.10 (slow)", stochSlow.d));
    // 6. ADX(14) — ≤ 40 preferred; no HTF gate
    if (adxVal == null) {
        add({
            id: "adx",
            label: "ADX 14",
            status: "wait",
            detail: "—",
            value: null,
            aux: null
        });
    } else {
        add({
            id: "adx",
            label: "ADX 14",
            status: adxVal <= 40 ? "pass" : "wait",
            detail: adxVal.toFixed(1),
            value: adxVal,
            aux: null
        });
    }
    // Setup state from scored conditions only (HTF is "info" and excluded).
    // Stoch "block" = overbought zone for display — still counts as an extreme.
    const total = conditions.filter((c)=>c.status !== "info").length;
    const met = conditions.filter((c)=>{
        if (c.status === "info") return false;
        if (c.id === "stochFast" || c.id === "stochMid" || c.id === "stochSlow") {
            return c.status === "pass" || c.status === "block";
        }
        return c.status === "pass";
    }).length;
    const state = met === total ? "ready" : "waiting";
    const stochDs = [
        stochFast.d,
        stochMid.d,
        stochSlow.d
    ];
    const bullishMet = countSideConfluence("long", price, vwapVal, stochDs, adxVal);
    const bearishMet = countSideConfluence("short", price, vwapVal, stochDs, adxVal);
    return {
        direction,
        conditions,
        met,
        total,
        state,
        price,
        bullishMet,
        bearishMet
    };
}
function analyzeSymbol(symbol, candles1mRaw, candlesHtfRaw, now = Date.now(), opts) {
    const live = evaluateSetup(candles1mRaw, candlesHtfRaw);
    if (!live) return null;
    const wantConfirmed = opts?.confirmed !== false;
    const closed = wantConfirmed ? evaluateSetup(closedCandles(candles1mRaw), closedCandles(candlesHtfRaw)) : null;
    return {
        symbol,
        direction: live.direction,
        state: live.state,
        met: live.met,
        total: live.total,
        bullishMet: live.bullishMet,
        bearishMet: live.bearishMet,
        price: live.price,
        conditions: live.conditions,
        confirmedState: closed?.state ?? null,
        confirmedMet: closed?.met ?? null,
        at: now
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/studies.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneStudySettings",
    ()=>cloneStudySettings,
    "createStudy",
    ()=>createStudy,
    "defaultStudies",
    ()=>defaultStudies,
    "ensurePaneStudies",
    ()=>ensurePaneStudies,
    "findStudy",
    ()=>findStudy,
    "migrateLegacyIndicators",
    ()=>migrateLegacyIndicators,
    "newStudyId",
    ()=>newStudyId,
    "normalizeStudySettings",
    ()=>normalizeStudySettings,
    "studiesOfType",
    ()=>studiesOfType,
    "studiesSignature",
    ()=>studiesSignature,
    "studiesTypeFlags",
    ()=>studiesTypeFlags,
    "templateToStudies",
    ()=>templateToStudies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visibility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/indicators.ts [app-client] (ecmascript)");
;
;
;
function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
}
function newStudyId() {
    return `s_${Math.random().toString(36).slice(2, 10)}`;
}
function normalizeStudySettings(type, raw) {
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"][type];
    if (type === "vwap") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVwapSettings"])(raw);
    }
    if (type === "ema") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEmaSettings"])(raw);
    }
    if (type === "bb") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeBbSettings"])(raw);
    }
    if (type === "stoch") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeStochSettings"])(raw);
    }
    if (type === "rsi" || type === "atr" || type === "adx") {
        const merged = {
            ...base,
            ...raw,
            visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(raw?.visibility)
        };
        return merged;
    }
    return cloneJson(base);
}
function cloneStudySettings(type, settings) {
    return normalizeStudySettings(type, cloneJson(settings ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"][type]));
}
function createStudy(type, settings, hidden = false) {
    return {
        id: newStudyId(),
        type,
        hidden,
        settings: cloneStudySettings(type, settings)
    };
}
function defaultStudies(defaults = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"]) {
    return [
        createStudy("vwap", defaults.vwap)
    ];
}
function studiesOfType(studies, type) {
    return studies.filter((s)=>s.type === type);
}
function findStudy(studies, id) {
    return studies.find((s)=>s.id === id);
}
function migrateLegacyIndicators(indicators, hidden, defaults = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"]) {
    const flags = {
        ...Object.fromEntries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INDICATOR_ORDER"].map((id)=>[
                id,
                false
            ])),
        ...indicators
    };
    const out = [];
    for (const type of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INDICATOR_ORDER"]){
        if (!flags[type]) continue;
        out.push(createStudy(type, defaults[type], Boolean(hidden?.[type])));
    }
    return out;
}
function ensurePaneStudies(pane, defaults = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"]) {
    if (Array.isArray(pane.studies)) {
        if (pane.studies.length > 0 || !pane.indicators) {
            return pane.studies.filter((s)=>s.type in __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"]).map((s)=>({
                    id: s.id || newStudyId(),
                    type: s.type,
                    hidden: Boolean(s.hidden),
                    settings: cloneStudySettings(s.type, s.settings)
                }));
        }
    }
    if (pane.indicators) {
        return migrateLegacyIndicators(pane.indicators, pane.hiddenIndicators, defaults);
    }
    return defaultStudies(defaults);
}
function studiesSignature(studies) {
    return studies.map((s)=>`${s.type}:${s.hidden ? 1 : 0}`).join("|");
}
function studiesTypeFlags(studies) {
    const flags = Object.fromEntries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INDICATOR_ORDER"].map((id)=>[
            id,
            false
        ]));
    for (const s of studies)flags[s.type] = true;
    return flags;
}
function templateToStudies(tpl, defaults = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"]) {
    if (tpl.studies?.length) {
        return tpl.studies.filter((s)=>s.type in __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"]).map((s)=>createStudy(s.type, s.settings, Boolean(s.hidden)));
    }
    if (tpl.indicators) {
        return migrateLegacyIndicators(tpl.indicators, {}, defaults);
    }
    return defaultStudies(defaults);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Theme tokens shared by the app chrome around the chart.
 *
 * (The chart-surface options that used to live here were Lightweight-Charts
 * config; the Vela chart takes its own theme through `new Vela(el, { theme })`
 * and `chart.setTheme`.)
 */ __turbopack_context__.s([
    "TV",
    ()=>TV
]);
const TV = {
    bg: "#000000",
    panel: "#111111",
    border: "#222222",
    hover: "#1a1a1a",
    active: "#2a2a2a",
    text: "#d1d4dc",
    muted: "#787b86",
    faint: "#4c525e",
    blue: "#2962ff",
    blueText: "#90caf9",
    green: "#089981",
    red: "#f23645",
    candle: "#b2b5be",
    grid: "#141414",
    crosshair: "#758696",
    vwap: "#2962ff",
    rsi: "#ab47bc",
    atr: "#ffa726"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/timeframes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TIMEFRAMES",
    ()=>TIMEFRAMES,
    "alignTime",
    ()=>alignTime,
    "timeframeLabel",
    ()=>timeframeLabel,
    "timeframeSeconds",
    ()=>timeframeSeconds
]);
const TIMEFRAMES = [
    {
        id: "1m",
        label: "1m",
        seconds: 60
    },
    {
        id: "3m",
        label: "3m",
        seconds: 180
    },
    {
        id: "5m",
        label: "5m",
        seconds: 300
    },
    {
        id: "15m",
        label: "15m",
        seconds: 900
    },
    {
        id: "30m",
        label: "30m",
        seconds: 1800
    },
    {
        id: "1h",
        label: "1h",
        seconds: 3600
    },
    {
        id: "2h",
        label: "2h",
        seconds: 7200
    },
    {
        id: "4h",
        label: "4h",
        seconds: 14400
    },
    {
        id: "1D",
        label: "D",
        seconds: 86400
    },
    {
        id: "1W",
        label: "W",
        seconds: 604800
    },
    {
        id: "1M",
        label: "M",
        seconds: 2592000
    }
];
function timeframeSeconds(tf) {
    return TIMEFRAMES.find((t)=>t.id === tf)?.seconds ?? 60;
}
function timeframeLabel(tf) {
    return TIMEFRAMES.find((t)=>t.id === tf)?.label ?? tf;
}
function alignTime(unix, seconds) {
    return Math.floor(unix / seconds) * seconds;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/timezone.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TIMEZONE_OPTIONS",
    ()=>TIMEZONE_OPTIONS,
    "filterTimezones",
    ()=>filterTimezones,
    "formatChartTickMark",
    ()=>formatChartTickMark,
    "formatChartTime",
    ()=>formatChartTime,
    "formatClockTime",
    ()=>formatClockTime,
    "groupTimezones",
    ()=>groupTimezones,
    "liveOffsetLabel",
    ()=>liveOffsetLabel,
    "normalizeTimezone",
    ()=>normalizeTimezone,
    "timezoneIana",
    ()=>timezoneIana,
    "timezoneOption",
    ()=>timezoneOption,
    "timezoneTitle",
    ()=>timezoneTitle
]);
const LEGACY_TIMEZONE_MAP = {
    UTC: "UTC",
    "UTC+1": "Africa/Casablanca",
    "UTC+8": "Asia/Hong_Kong"
};
function opt(region, city, iana) {
    return {
        id: iana,
        city,
        region,
        iana
    };
}
const TIMEZONE_OPTIONS = [
    // Universal
    opt("Universal", "UTC", "UTC"),
    // Americas
    opt("Americas", "Honolulu", "Pacific/Honolulu"),
    opt("Americas", "Anchorage", "America/Anchorage"),
    opt("Americas", "Los Angeles", "America/Los_Angeles"),
    opt("Americas", "Vancouver", "America/Vancouver"),
    opt("Americas", "Denver", "America/Denver"),
    opt("Americas", "Phoenix", "America/Phoenix"),
    opt("Americas", "Chicago", "America/Chicago"),
    opt("Americas", "Mexico City", "America/Mexico_City"),
    opt("Americas", "New York", "America/New_York"),
    opt("Americas", "Toronto", "America/Toronto"),
    opt("Americas", "Bogota", "America/Bogota"),
    opt("Americas", "Lima", "America/Lima"),
    opt("Americas", "Santiago", "America/Santiago"),
    opt("Americas", "Buenos Aires", "America/Argentina/Buenos_Aires"),
    opt("Americas", "Sao Paulo", "America/Sao_Paulo"),
    // Atlantic
    opt("Atlantic", "Reykjavik", "Atlantic/Reykjavik"),
    opt("Atlantic", "Azores", "Atlantic/Azores"),
    // Europe / Africa
    opt("Europe / Africa", "London", "Europe/London"),
    opt("Europe / Africa", "Dublin", "Europe/Dublin"),
    opt("Europe / Africa", "Lisbon", "Europe/Lisbon"),
    opt("Europe / Africa", "Casablanca", "Africa/Casablanca"),
    opt("Europe / Africa", "Lagos", "Africa/Lagos"),
    opt("Europe / Africa", "Paris", "Europe/Paris"),
    opt("Europe / Africa", "Madrid", "Europe/Madrid"),
    opt("Europe / Africa", "Berlin", "Europe/Berlin"),
    opt("Europe / Africa", "Amsterdam", "Europe/Amsterdam"),
    opt("Europe / Africa", "Rome", "Europe/Rome"),
    opt("Europe / Africa", "Zurich", "Europe/Zurich"),
    opt("Europe / Africa", "Stockholm", "Europe/Stockholm"),
    opt("Europe / Africa", "Warsaw", "Europe/Warsaw"),
    opt("Europe / Africa", "Athens", "Europe/Athens"),
    opt("Europe / Africa", "Helsinki", "Europe/Helsinki"),
    opt("Europe / Africa", "Johannesburg", "Africa/Johannesburg"),
    opt("Europe / Africa", "Cairo", "Africa/Cairo"),
    opt("Europe / Africa", "Nairobi", "Africa/Nairobi"),
    opt("Europe / Africa", "Istanbul", "Europe/Istanbul"),
    opt("Europe / Africa", "Moscow", "Europe/Moscow"),
    // Middle East
    opt("Middle East", "Jerusalem", "Asia/Jerusalem"),
    opt("Middle East", "Riyadh", "Asia/Riyadh"),
    opt("Middle East", "Dubai", "Asia/Dubai"),
    opt("Middle East", "Tehran", "Asia/Tehran"),
    // Asia / Pacific
    opt("Asia / Pacific", "Karachi", "Asia/Karachi"),
    opt("Asia / Pacific", "Maldives", "Indian/Maldives"),
    opt("Asia / Pacific", "Delhi", "Asia/Kolkata"),
    opt("Asia / Pacific", "Colombo", "Asia/Colombo"),
    opt("Asia / Pacific", "Dhaka", "Asia/Dhaka"),
    opt("Asia / Pacific", "Bangkok", "Asia/Bangkok"),
    opt("Asia / Pacific", "Jakarta", "Asia/Jakarta"),
    opt("Asia / Pacific", "Ho Chi Minh", "Asia/Ho_Chi_Minh"),
    opt("Asia / Pacific", "Singapore", "Asia/Singapore"),
    opt("Asia / Pacific", "Hong Kong", "Asia/Hong_Kong"),
    opt("Asia / Pacific", "Shanghai", "Asia/Shanghai"),
    opt("Asia / Pacific", "Taipei", "Asia/Taipei"),
    opt("Asia / Pacific", "Seoul", "Asia/Seoul"),
    opt("Asia / Pacific", "Tokyo", "Asia/Tokyo"),
    opt("Asia / Pacific", "Perth", "Australia/Perth"),
    opt("Asia / Pacific", "Darwin", "Australia/Darwin"),
    opt("Asia / Pacific", "Brisbane", "Australia/Brisbane"),
    opt("Asia / Pacific", "Adelaide", "Australia/Adelaide"),
    opt("Asia / Pacific", "Sydney", "Australia/Sydney"),
    opt("Asia / Pacific", "Auckland", "Pacific/Auckland"),
    opt("Asia / Pacific", "Fiji", "Pacific/Fiji")
];
function normalizeTimezone(id) {
    if (!id) return "Africa/Casablanca";
    if (LEGACY_TIMEZONE_MAP[id]) return LEGACY_TIMEZONE_MAP[id];
    if (TIMEZONE_OPTIONS.some((o)=>o.id === id)) return id;
    // Accept unknown but valid-looking IANA ids.
    if (id.includes("/") || id === "UTC") return id;
    return "Africa/Casablanca";
}
function timezoneOption(id) {
    const normalized = normalizeTimezone(id);
    return TIMEZONE_OPTIONS.find((o)=>o.id === normalized) ?? {
        id: normalized,
        city: normalized.split("/").pop()?.replaceAll("_", " ") ?? normalized,
        region: "Other",
        iana: normalized
    };
}
function timezoneIana(id) {
    return timezoneOption(id).iana;
}
function timezoneTitle(opt) {
    if (opt.iana === "UTC") return "UTC";
    return opt.city;
}
function liveOffsetLabel(iana, at = new Date()) {
    try {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: iana,
            timeZoneName: "shortOffset"
        }).formatToParts(at);
        const raw = parts.find((p)=>p.type === "timeZoneName")?.value ?? "GMT";
        return raw.replace(/^GMT/, "UTC").replace(/^UTC([+-])0(\d)$/, "UTC$1$2").replace("UTC+0", "UTC").replace("UTC-0", "UTC");
    } catch  {
        return "UTC";
    }
}
function formatClockTime(id, hour12, at = new Date()) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12,
        timeZone: timezoneIana(id)
    }).format(at);
}
function formatChartTime(unixSec, id, hoursFormat) {
    const d = new Date(unixSec * 1000);
    const tz = timezoneIana(id);
    const datePart = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: tz
    }).format(d);
    const timePart = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: hoursFormat === "12",
        timeZone: tz
    }).format(d);
    // e.g. "Aug 24, 2026 - 11:20 PM"
    return `${datePart} - ${timePart}`;
}
function formatChartTickMark(unixSec, id, hoursFormat, tickMarkType) {
    const d = new Date(unixSec * 1000);
    const tz = timezoneIana(id);
    if (tickMarkType === 0) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            timeZone: tz
        }).format(d);
    }
    if (tickMarkType === 1) {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            timeZone: tz
        }).format(d);
    }
    if (tickMarkType === 2) {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            timeZone: tz
        }).format(d);
    }
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: hoursFormat === "12",
        timeZone: tz
    }).format(d);
}
function filterTimezones(query) {
    const q = query.trim().toLowerCase();
    if (!q) return TIMEZONE_OPTIONS;
    return TIMEZONE_OPTIONS.filter((o)=>{
        const offset = liveOffsetLabel(o.iana).toLowerCase();
        return o.city.toLowerCase().includes(q) || o.region.toLowerCase().includes(q) || o.iana.toLowerCase().includes(q) || offset.includes(q);
    });
}
function groupTimezones(options) {
    const map = new Map();
    for (const o of options){
        const list = map.get(o.region) ?? [];
        list.push(o);
        map.set(o.region, list);
    }
    return [
        ...map.entries()
    ].map(([region, items])=>({
            region,
            items
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/trade-marks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultProtect",
    ()=>defaultProtect,
    "findProtectiveOrderId",
    ()=>findProtectiveOrderId,
    "liquidationPrice",
    ()=>liquidationPrice,
    "uid",
    ()=>uid
]);
function uid() {
    return Math.random().toString(36).slice(2, 10);
}
function liquidationPrice(pos) {
    const lev = Math.max(1, pos.leverage);
    const buffer = 0.9 / lev;
    return pos.side === "long" ? pos.entry * (1 - buffer) : pos.entry * (1 + buffer);
}
function defaultProtect(entry, side) {
    if (side === "long") {
        return {
            tp: entry * 1.012,
            sl: entry * 0.994
        };
    }
    return {
        tp: entry * 0.988,
        sl: entry * 1.006
    };
}
function findProtectiveOrderId(orders, symbol, leg, tp, sl) {
    const target = leg === "tp" ? tp : sl;
    if (target == null || !Number.isFinite(target)) return null;
    const match = orders.find((o)=>o.symbol === symbol && o.closePosition && Number(o.price) === target);
    return match?.id ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/trading/dispatch.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activeBrokerId",
    ()=>activeBrokerId,
    "dispatchCancelOrder",
    ()=>dispatchCancelOrder,
    "dispatchClosePosition",
    ()=>dispatchClosePosition,
    "dispatchProtect",
    ()=>dispatchProtect,
    "dispatchSubmitOrder",
    ()=>dispatchSubmitOrder,
    "tradingHaltReason",
    ()=>tradingHaltReason
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/bridge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/symbol-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/trading/mock.ts [app-client] (ecmascript) <locals>");
;
;
;
;
;
;
;
function activeBrokerId() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().connectedBroker === "binance" ? "binance" : "mock";
}
function notifyLiveError(text) {
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().notify("error", text);
}
function describe(err) {
    if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"]) return err.message;
    if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]) return "Session expired; sign in again";
    return String(err);
}
function tradingHaltReason() {
    const liveState = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState();
    if (liveState.phase === "switching") return "profile_switch_in_progress";
    if (liveState.phase === "degraded" || liveState.phase === "failed" || liveState.phase === "detached") {
        return liveState.reasonCode ?? "profile_runtime_unavailable";
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().connectedBroker === "binance" && liveState.profileId !== null && (!liveState.ready || liveState.phase !== "ready")) {
        return liveState.reasonCode ?? "profile_runtime_unavailable";
    }
    const { health } = liveState;
    if (!health) return null;
    const ex = health.execution;
    if (ex.killSwitch) return "kill switch engaged";
    if (ex.frozen) return ex.frozenReason || "execution frozen";
    if (!ex.canSubmit) return ex.reasons[0] || "execution not allowed";
    if (health.submissionsFrozen) return health.frozenReasons[0] || "submissions frozen";
    return null;
}
async function dispatchSubmitOrder(input) {
    const state = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    const pane = state.panes.find((p)=>p.id === state.activePaneId);
    const tf = pane?.timeframe ?? "1D";
    const feedStatus = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getKlineStatus(input.symbol, tf);
    if (feedStatus !== "live") {
        notifyLiveError(`Trading halted: market data ${feedStatus}`);
        return {
            ok: false,
            error: `feed_${feedStatus}`
        };
    }
    const halt = tradingHaltReason();
    if (halt !== null) {
        notifyLiveError(`Trading halted: ${halt}`);
        return {
            ok: false,
            error: "trading_halted"
        };
    }
    if (activeBrokerId() !== "binance") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["submitOrder"])(input);
        return {
            ok: true
        };
    }
    try {
        const type = input.type === "limit" ? "LIMIT" : input.type === "stop" ? "STOP_MARKET" : "MARKET";
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].submitOrder({
            symbol: input.symbol,
            side: input.side === "buy" ? "BUY" : "SELL",
            type: type,
            qty: String(input.qty),
            price: input.type === "limit" && input.price != null ? String(input.price) : undefined,
            stopPrice: input.type === "stop" && input.price != null ? String(input.price) : undefined,
            // Binance computes initial margin from the exchange-side per-symbol
            // leverage, which is a persisted account setting — the server syncs it
            // before the order so margin matches the UI (margin × leverage) sizing.
            leverage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSymbolTrading"])(input.symbol).leverage,
            clientOrderId: input.clientOrderId
        });
        if (!res.ok) {
            notifyLiveError(res.error ?? "Order rejected");
            return {
                ok: false,
                error: res.error
            };
        }
        return {
            ok: true
        };
    } catch (err) {
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["redirectToLogin"])();
            return {
                ok: false,
                error: "unauthenticated"
            };
        }
        notifyLiveError(describe(err));
        return {
            ok: false,
            error: describe(err)
        };
    }
}
async function dispatchCancelOrder(id) {
    const halt = tradingHaltReason();
    if (halt !== null && activeBrokerId() === "binance") {
        notifyLiveError(`Trading halted: ${halt}`);
        return {
            ok: false,
            error: "trading_halted"
        };
    }
    if (activeBrokerId() !== "binance") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cancelOrder"])(id);
        return {
            ok: true
        };
    }
    const order = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState().orders.find((o)=>o.id === id);
    if (!order) return {
        ok: false,
        error: "Order not found"
    };
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].cancelOrder(id, order.symbol);
        if (!res.ok) {
            notifyLiveError(res.error ?? "Cancel rejected");
            return {
                ok: false,
                error: res.error
            };
        }
        return {
            ok: true
        };
    } catch (err) {
        notifyLiveError(describe(err));
        return {
            ok: false,
            error: describe(err)
        };
    }
}
async function dispatchClosePosition(idOrSymbol) {
    if (activeBrokerId() !== "binance") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["closePosition"])(idOrSymbol);
        return {
            ok: true
        };
    }
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].closePosition(idOrSymbol);
        if (!res.ok) {
            notifyLiveError(res.error ?? "Close rejected");
            return {
                ok: false,
                error: res.error
            };
        }
        return {
            ok: true
        };
    } catch (err) {
        notifyLiveError(describe(err));
        return {
            ok: false,
            error: describe(err)
        };
    }
}
async function dispatchProtect(symbol, tpPrice, slPrice) {
    const halt = tradingHaltReason();
    if (halt !== null && activeBrokerId() === "binance") {
        notifyLiveError(`Trading halted: ${halt}`);
        return {
            ok: false,
            error: "trading_halted"
        };
    }
    if (activeBrokerId() !== "binance") return {
        ok: true
    };
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].protect({
            symbol,
            tpPrice: tpPrice != null ? String(tpPrice) : undefined,
            slPrice: slPrice != null ? String(slPrice) : undefined
        });
        const failed = res.tp && !res.tp.ok || res.sl && !res.sl.ok;
        if (failed) {
            const msg = res.tp?.error ?? res.sl?.error ?? "Protective order rejected";
            notifyLiveError(msg);
            return {
                ok: false,
                error: msg
            };
        }
        return {
            ok: true
        };
    } catch (err) {
        notifyLiveError(describe(err));
        return {
            ok: false,
            error: describe(err)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/trading/exit-conditions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveExitCondition",
    ()=>resolveExitCondition
]);
function resolveExitCondition(pos, last) {
    const hitTp = pos.tp != null && (pos.side === "long" ? last >= pos.tp : last <= pos.tp);
    const hitSl = pos.sl != null && (pos.side === "long" ? last <= pos.sl : last >= pos.sl);
    const hitLiq = pos.liq != null && (pos.side === "long" ? last <= pos.liq : last >= pos.liq);
    if (!hitTp && !hitSl && !hitLiq) return null;
    // Priority: liquidation > stop loss > take profit
    const px = hitLiq ? pos.liq : hitSl ? pos.sl : pos.tp;
    const reason = hitLiq ? "liq" : hitSl ? "sl" : "tp";
    return {
        px,
        reason
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/trading/mock.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cancelOrder",
    ()=>cancelOrder,
    "closePosition",
    ()=>closePosition,
    "connectMock",
    ()=>connectMock,
    "disconnectBroker",
    ()=>disconnectBroker,
    "formatNum",
    ()=>formatNum,
    "formatUsd",
    ()=>formatUsd,
    "ordersMargin",
    ()=>ordersMargin,
    "positionPnl",
    ()=>positionPnl,
    "requireMock",
    ()=>requireMock,
    "submitOrder",
    ()=>submitOrder,
    "tickMock",
    ()=>tickMock,
    "usedMargin",
    ()=>usedMargin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/brokers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trade-marks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$exit$2d$conditions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/exit-conditions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/symbol-settings.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
function connectMock() {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    s.setConnectedBroker("mock");
    if (s.mockBalance <= 0) {
        s.setMockBalance(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"]);
        s.addBalanceHistory({
            time: Date.now(),
            type: "deposit",
            amount: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"],
            balanceAfter: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"],
            note: "Paper account funded"
        });
    }
    s.setBrokerDialogOpen(false);
    s.setBottomTabCollapsed("positions");
    if (s.bottomHeight < 240) s.setBottomHeight(260);
}
function disconnectBroker() {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    s.setConnectedBroker(null);
    s.setBottomOpen(false);
}
function requireMock() {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    if (s.connectedBroker === "mock") return true;
    s.setBrokerDialogOpen(true);
    return false;
}
function submitOrder(input) {
    if (!requireMock()) return;
    const qty = Math.abs(input.qty);
    if (!Number.isFinite(qty) || qty <= 0) return;
    if (input.clientOrderId && isDuplicateClientOrder(input.clientOrderId)) return;
    const last = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuote(input.symbol).last;
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    s.addJournalEntry({
        time: Date.now(),
        text: `Call to place ${input.type} order to ${input.side} ${qty} units of symbol ${input.symbol}`
    });
    if (input.type === "market" || isMarketable(input, last)) {
        applyFill(input.symbol, input.side, last, qty, {
            orderType: input.type === "market" ? "market" : input.type,
            reason: "manual",
            clientOrderId: input.clientOrderId,
            limitPrice: input.type === "limit" ? input.price : null,
            stopPrice: input.type === "stop" ? input.price : null
        });
        return;
    }
    const before = s.orders.length;
    s.addOrder({
        symbol: input.symbol,
        side: input.side,
        type: input.type,
        price: input.price,
        qty,
        clientOrderId: input.clientOrderId
    });
    const placedOrders = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().orders;
    const placed = placedOrders[placedOrders.length - 1];
    if (placed && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().orders.length > before) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().addJournalEntry({
            time: Date.now(),
            text: `Order ${placed.id} successfully placed`
        });
    }
}
/** True when an idempotency key was already consumed by an open order or history entry. */ function isDuplicateClientOrder(clientOrderId) {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    return s.orders.some((o)=>o.clientOrderId === clientOrderId) || s.orderHistory.some((h)=>h.clientOrderId === clientOrderId);
}
function cancelOrder(id) {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    const order = s.orders.find((o)=>o.id === id);
    if (!order) return;
    const trading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSymbolTrading"])(order.symbol);
    const leverage = Math.max(1, trading.leverage);
    const margin = order.qty * order.price / leverage;
    const now = Date.now();
    s.removeOrder(id);
    s.addOrderHistory({
        time: now,
        closingTime: now,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        qty: order.qty,
        price: order.price,
        limitPrice: order.type === "limit" ? order.price : null,
        stopPrice: order.type === "stop" ? order.price : null,
        status: "cancelled",
        leverage,
        margin,
        clientOrderId: order.clientOrderId
    });
    s.addJournalEntry({
        time: now,
        text: `Order ${order.id} for symbol ${order.symbol} has been cancelled`
    });
}
function closePosition(id) {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    const pos = s.positions.find((p)=>p.id === id);
    if (!pos) return;
    const last = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuote(pos.symbol).last;
    const closeSide = pos.side === "long" ? "sell" : "buy";
    applyFill(pos.symbol, closeSide, last, pos.qty, {
        orderType: "market",
        reason: "manual"
    });
}
function tickMock(quotes) {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    if (s.connectedBroker !== "mock") return;
    const lastBySymbol = new Map();
    for (const q of quotes)lastBySymbol.set(q.symbol, q.last);
    for (const order of [
        ...s.orders
    ]){
        const last = lastBySymbol.get(order.symbol) ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuote(order.symbol).last;
        if (!isMarketable(order, last)) continue;
        // Replayed/stale snapshot guard: the order may already have been filled or
        // cancelled by an earlier event in this batch (or a previous delivery).
        const current = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
        if (!current.orders.some((o)=>o.id === order.id)) continue;
        current.removeOrder(order.id);
        applyFill(order.symbol, order.side, last, order.qty, {
            orderType: order.type,
            reason: "manual",
            orderId: order.id,
            clientOrderId: order.clientOrderId,
            limitPrice: order.type === "limit" ? order.price : null,
            stopPrice: order.type === "stop" ? order.price : null
        });
    }
    for (const pos of [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().positions
    ]){
        const last = lastBySymbol.get(pos.symbol) ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuote(pos.symbol).last;
        const exitCondition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$exit$2d$conditions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveExitCondition"])(pos, last);
        if (!exitCondition) continue;
        // Replayed/stale snapshot guard: re-read the position by id and close the
        // CURRENT qty of exactly THIS position, never a later position on the
        // same symbol (closePositionId binds the fill to pos.id).
        const fresh = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().positions.find((p)=>p.id === pos.id);
        if (!fresh) continue;
        const closeSide = fresh.side === "long" ? "sell" : "buy";
        applyFill(fresh.symbol, closeSide, exitCondition.px, fresh.qty, {
            orderType: "market",
            reason: exitCondition.reason,
            closePositionId: fresh.id
        });
    }
}
function positionPnl(pos, last) {
    return pos.side === "long" ? (last - pos.entry) * pos.qty : (pos.entry - last) * pos.qty;
}
function usedMargin(positions) {
    return positions.reduce((sum, p)=>sum + p.qty * p.entry / Math.max(1, p.leverage), 0);
}
function ordersMargin(orders, leverage) {
    const lev = Math.max(1, leverage);
    return orders.reduce((sum, o)=>sum + o.qty * o.price / lev, 0);
}
function formatNum(value, digits = 2) {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
}
function formatUsd(value, digits = 2) {
    const abs = Math.abs(value).toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
    return value < 0 ? `-$${abs}` : `$${abs}`;
}
function isMarketable(order, last) {
    if (order.type === "market") return true;
    if (order.type === "limit") {
        return order.side === "buy" ? last <= order.price : last >= order.price;
    }
    return order.side === "buy" ? last >= order.price : last <= order.price;
}
function recordFilledOrder(symbol, side, qty, fillPrice, orderType, meta) {
    const now = Date.now();
    const id = meta.orderId;
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().addOrderHistory({
        time: now,
        closingTime: now,
        symbol,
        side,
        type: orderType,
        qty,
        price: fillPrice,
        limitPrice: meta.limitPrice ?? (orderType === "limit" ? fillPrice : null),
        stopPrice: meta.stopPrice ?? (orderType === "stop" ? fillPrice : null),
        status: "filled",
        fillPrice,
        leverage: meta.leverage,
        margin: meta.margin,
        clientOrderId: meta.clientOrderId
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().addJournalEntry({
        time: now,
        text: id ? `Order ${id} for symbol ${symbol} has been executed at price ${fillPrice} for ${qty} units` : `Order for symbol ${symbol} has been executed at price ${fillPrice} for ${qty} units`
    });
}
function applyFill(symbol, side, price, qty, meta = {}) {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    const trading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSymbolTrading"])(symbol);
    const leverage = Math.max(1, trading.leverage);
    const posSide = side === "buy" ? "long" : "short";
    const existing = meta.closePositionId ? s.positions.find((p)=>p.id === meta.closePositionId && p.symbol === symbol) : s.positions.find((p)=>p.symbol === symbol);
    const marginFor = (q, entry)=>q * entry / leverage;
    const orderType = meta.orderType ?? "market";
    const now = Date.now();
    // Replay guard: a close bound to a position id whose target is already gone
    // (or no longer on the opposite side) is a stale event — drop it instead of
    // opening or flipping anything.
    if (meta.closePositionId && (!existing || existing.side === posSide)) return;
    if (!existing) {
        const margin = marginFor(qty, price);
        if (s.mockBalance < margin) return;
        const protect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["protectFromSettings"])(price, posSide, trading);
        const balanceAfter = s.mockBalance - margin;
        s.setMockBalance(balanceAfter);
        s.addPosition({
            symbol,
            side: posSide,
            entry: price,
            qty,
            leverage,
            tp: protect.tp,
            sl: protect.sl,
            liq: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liquidationPrice"])({
                side: posSide,
                entry: price,
                leverage
            }),
            openedAt: now
        });
        recordFilledOrder(symbol, side, qty, price, orderType, {
            leverage,
            margin,
            limitPrice: meta.limitPrice,
            stopPrice: meta.stopPrice,
            orderId: meta.orderId,
            clientOrderId: meta.clientOrderId
        });
        s.addBalanceHistory({
            time: now,
            type: "margin_lock",
            amount: -margin,
            balanceAfter,
            note: `Margin locked · open ${posSide}`,
            symbol
        });
        return;
    }
    if (existing.side === posSide) {
        const margin = marginFor(qty, price);
        if (s.mockBalance < margin) return;
        const newQty = existing.qty + qty;
        const newEntry = (existing.entry * existing.qty + price * qty) / newQty;
        const balanceAfter = s.mockBalance - margin;
        s.setMockBalance(balanceAfter);
        s.updatePosition(existing.id, {
            qty: newQty,
            entry: newEntry,
            liq: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liquidationPrice"])({
                side: existing.side,
                entry: newEntry,
                leverage: existing.leverage
            })
        });
        recordFilledOrder(symbol, side, qty, price, orderType, {
            leverage,
            margin,
            limitPrice: meta.limitPrice,
            stopPrice: meta.stopPrice,
            orderId: meta.orderId,
            clientOrderId: meta.clientOrderId
        });
        s.addBalanceHistory({
            time: now,
            type: "margin_lock",
            amount: -margin,
            balanceAfter,
            note: `Margin locked · add to ${posSide}`,
            symbol
        });
        return;
    }
    const closed = Math.min(qty, existing.qty);
    const pnl = existing.side === "long" ? (price - existing.entry) * closed : (existing.entry - price) * closed;
    const released = marginFor(closed, existing.entry);
    const afterRelease = s.mockBalance + released;
    const balanceAfter = afterRelease + pnl;
    s.setMockBalance(balanceAfter);
    s.setMockRealized(s.mockRealized + pnl);
    recordFilledOrder(symbol, side, closed, price, orderType, {
        leverage: existing.leverage,
        margin: released,
        limitPrice: meta.limitPrice,
        stopPrice: meta.stopPrice,
        orderId: meta.orderId,
        clientOrderId: meta.clientOrderId
    });
    s.addBalanceHistory({
        time: now,
        type: "margin_release",
        amount: released,
        balanceAfter: afterRelease,
        note: `Margin released · close ${existing.side}`,
        symbol
    });
    s.addBalanceHistory({
        time: now,
        type: "realized_pnl",
        amount: pnl,
        balanceAfter,
        note: `Close ${existing.side} position for symbol ${symbol} at price ${price} for ${closed} units. Position AVG Price was ${existing.entry}, currency: USD, leverage: ${existing.leverage}x`,
        symbol
    });
    s.addJournalEntry({
        time: now,
        text: `Close ${existing.side} position for symbol ${symbol} at price ${price} for ${closed} units. Position AVG Price was ${existing.entry}`
    });
    if (qty < existing.qty) {
        s.updatePosition(existing.id, {
            qty: existing.qty - qty
        });
        return;
    }
    s.removePosition(existing.id);
    const leftover = qty - existing.qty;
    if (leftover > 0) {
        applyFill(symbol, side, price, leftover, {
            orderType,
            reason: "flip"
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/trading/symbol-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatMarginLabel",
    ()=>formatMarginLabel,
    "protectFromSettings",
    ()=>protectFromSettings,
    "quantizeQtyToStep",
    ()=>quantizeQtyToStep,
    "resolveMarginAmount",
    ()=>resolveMarginAmount,
    "resolveOrderQty",
    ()=>resolveOrderQty,
    "resolvePositionOrderQty",
    ()=>resolvePositionOrderQty,
    "resolveSymbolTrading",
    ()=>resolveSymbolTrading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
;
;
;
function normalizeSaved(saved) {
    if (!saved) return {};
    const sizingMode = saved.sizingMode === "riskPercent" || saved.sizingMode === "percent" ? "percent" : "fixed";
    const rest = {
        ...saved
    };
    delete rest.riskPercent;
    delete rest.qty;
    delete rest.sizingMode;
    return {
        ...rest,
        sizingMode,
        margin: saved.margin ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].margin,
        marginPercent: saved.marginPercent ?? saved.riskPercent ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].marginPercent
    };
}
function resolveSymbolTrading(symbol) {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
    const saved = normalizeSaved(s.symbolTrading[symbol]);
    return {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"],
        ...saved,
        leverage: saved.leverage ?? s.chartSettings.defaultLeverage,
        margin: saved.margin ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].margin,
        marginPercent: saved.marginPercent ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].marginPercent,
        sizingMode: saved.sizingMode ?? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].sizingMode
    };
}
function resolveMarginAmount(symbol) {
    const t = resolveSymbolTrading(symbol);
    if (t.sizingMode === "percent") {
        const balance = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().mockBalance;
        return Math.max(0, balance * (t.marginPercent / 100));
    }
    return Math.max(0, t.margin);
}
/** Decimal places implied by a step size (handles exponential notation). */ function stepDecimals(step) {
    const s = String(step);
    if (s.includes("e") || s.includes("E")) {
        const exp = Number(s.split(/e/i)[1]);
        return exp < 0 ? -exp : 0;
    }
    const dot = s.indexOf(".");
    return dot < 0 ? 0 : s.length - dot - 1;
}
function quantizeQtyToStep(qty, stepSize) {
    if (!Number.isFinite(qty) || qty <= 0) return 0;
    const stepStr = typeof stepSize === "string" ? stepSize : String(stepSize ?? "");
    const step = Number(stepStr);
    if (!Number.isFinite(step) || !(step > 0)) return qty;
    const d = stepDecimals(step);
    const scale = 10 ** d;
    const stepUnits = Math.round(step * scale); // exact integer step in 1e-d units
    const raw = qty * scale / stepUnits;
    const steps = Math.floor(raw + Math.abs(raw) * 1e-12);
    if (steps <= 0) return 0;
    return Number((steps * step).toFixed(d));
}
/** Effective qty step for a symbol: LOT_SIZE stepSize, else its price-tick precision. */ function qtyStepFor(symbol) {
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbol"])(symbol);
    if (info.stepSize) return info.stepSize;
    // 10 ** -4 evaluates to 0.00009999999999999999, so rebuild the step from a
    // clean decimal string ("0.0001") to keep the scale math exact.
    return (10 ** -info.precision).toFixed(Math.max(0, info.precision));
}
function resolveOrderQty(symbol, price) {
    if (!(price > 0)) return 0;
    const t = resolveSymbolTrading(symbol);
    const margin = resolveMarginAmount(symbol);
    const lev = Math.max(1, t.leverage);
    const qty = Number((margin * lev / price).toPrecision(8));
    return Math.max(0, quantizeQtyToStep(qty, qtyStepFor(symbol)));
}
function resolvePositionOrderQty(symbol, price, drawing) {
    if (!(price > 0)) return 0;
    const t = resolveSymbolTrading(symbol);
    const hasOverride = drawing.positionLotSize != null || drawing.positionRisk != null || drawing.positionLeverage != null || drawing.positionAccountSizeMode != null || drawing.positionAccountSize != null || drawing.positionRiskUnit != null;
    if (!hasOverride) return resolveOrderQty(symbol, price);
    const balance = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().mockBalance;
    const account = drawing.positionAccountSizeMode === "custom" && drawing.positionAccountSize != null && drawing.positionAccountSize > 0 ? drawing.positionAccountSize : balance;
    const riskUnit = drawing.positionRiskUnit ?? (t.sizingMode === "percent" ? "percent" : "money");
    const lot = drawing.positionLotSize ?? t.margin;
    const risk = drawing.positionRisk ?? (riskUnit === "percent" ? t.marginPercent : t.margin);
    const margin = riskUnit === "percent" ? Math.max(0, account * (risk / 100)) : Math.max(0, risk || lot);
    const lev = Math.max(1, drawing.positionLeverage ?? t.leverage);
    const qty = Number((margin * lev / price).toPrecision(8));
    return Math.max(0, quantizeQtyToStep(qty, qtyStepFor(symbol)));
}
function formatMarginLabel(symbol) {
    const t = resolveSymbolTrading(symbol);
    if (t.sizingMode === "percent") {
        const n = t.marginPercent;
        return `${Number.isInteger(n) ? n : Number(n.toFixed(2))}%`;
    }
    const n = t.margin;
    return Number.isInteger(n) ? String(n) : Number(n.toFixed(2)).toString();
}
function protectFromSettings(entry, side, settings) {
    if (!settings.attachBrackets) return {
        tp: null,
        sl: null
    };
    const tpM = Math.max(0, settings.tpPercent) / 100;
    const slM = Math.max(0, settings.slPercent) / 100;
    if (side === "long") {
        return {
            tp: tpM > 0 ? entry * (1 + tpM) : null,
            sl: slM > 0 ? entry * (1 - slM) : null
        };
    }
    return {
        tp: tpM > 0 ? entry * (1 - tpM) : null,
        sl: slM > 0 ? entry * (1 + slM) : null
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/trading/ui-orders.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "newClientOrderId",
    ()=>newClientOrderId,
    "submitOrderFromUi",
    ()=>submitOrderFromUi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/dispatch.ts [app-client] (ecmascript)");
;
function newClientOrderId() {
    return crypto.randomUUID();
}
function submitOrderFromUi(input) {
    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchSubmitOrder"])(input);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/use-quotes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useQuote",
    ()=>useQuote,
    "useQuotes",
    ()=>useQuotes,
    "useSyncHotSymbols",
    ()=>useSyncHotSymbols
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
function quoteUiEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return !a && !b;
    return a.symbol === b.symbol && a.last === b.last && a.changePct === b.changePct && a.change === b.change && a.volume === b.volume;
}
function quoteBoardSig(quotes) {
    let s = "";
    for (const q of quotes){
        s += q.symbol;
        s += ":";
        s += q.last;
        s += ":";
        s += q.changePct;
        s += "|";
    }
    return s;
}
function useQuotes(enabled = true) {
    _s();
    const [quotes, setQuotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useQuotes.useState": ()=>enabled ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuotes() : []
    }["useQuotes.useState"]);
    const sigRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuotes.useEffect": ()=>{
            if (!enabled) {
                setQuotes([]);
                sigRef.current = "";
                return;
            }
            const apply = {
                "useQuotes.useEffect.apply": (next)=>{
                    const sig = quoteBoardSig(next);
                    if (sig === sigRef.current) return;
                    sigRef.current = sig;
                    setQuotes(next);
                }
            }["useQuotes.useEffect.apply"];
            apply(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuotes());
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].subscribeQuotes({
                "useQuotes.useEffect": ()=>{
                    apply(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuotes());
                }
            }["useQuotes.useEffect"]);
        }
    }["useQuotes.useEffect"], [
        enabled
    ]);
    return quotes;
}
_s(useQuotes, "4c0gxWFlQud+CbKsC3LHHK1hzzE=");
function useQuote(symbol) {
    _s1();
    const bare = symbol.replace(/\.P$/i, "").toUpperCase();
    const [quote, setQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useQuote.useState": ()=>bare ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuote(bare) : undefined
    }["useQuote.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuote.useEffect": ()=>{
            if (!bare) {
                setQuote(undefined);
                return;
            }
            setQuote(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuote(bare));
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].subscribeQuotes({
                "useQuote.useEffect": (map)=>{
                    const next = map.get(bare) ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuote(bare);
                    setQuote({
                        "useQuote.useEffect": (prev)=>quoteUiEqual(prev, next) ? prev : next
                    }["useQuote.useEffect"]);
                }
            }["useQuote.useEffect"]);
        }
    }["useQuote.useEffect"], [
        bare
    ]);
    return quote;
}
_s1(useQuote, "eQ//5yuUKxbC8E5DMB0kE3htFbY=");
function useSyncHotSymbols(enabled = true) {
    _s2();
    const watchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useSyncHotSymbols.useAppStore[watchlist]": (s)=>s.watchlist
    }["useSyncHotSymbols.useAppStore[watchlist]"]);
    const layoutCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useSyncHotSymbols.useAppStore[layoutCount]": (s)=>s.layoutCount
    }["useSyncHotSymbols.useAppStore[layoutCount]"]);
    const paneKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useSyncHotSymbols.useAppStore[paneKey]": (s)=>s.panes.slice(0, s.layoutCount).map({
                "useSyncHotSymbols.useAppStore[paneKey]": (p)=>p.symbol
            }["useSyncHotSymbols.useAppStore[paneKey]"]).join("\0")
    }["useSyncHotSymbols.useAppStore[paneKey]"]);
    const tradeKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useSyncHotSymbols.useAppStore[tradeKey]": (s)=>[
                ...s.orders.map({
                    "useSyncHotSymbols.useAppStore[tradeKey]": (o)=>o.symbol
                }["useSyncHotSymbols.useAppStore[tradeKey]"]),
                ...s.positions.map({
                    "useSyncHotSymbols.useAppStore[tradeKey]": (p)=>p.symbol
                }["useSyncHotSymbols.useAppStore[tradeKey]"])
            ].sort().join("\0")
    }["useSyncHotSymbols.useAppStore[tradeKey]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSyncHotSymbols.useEffect": ()=>{
            if (!enabled) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().syncHotSymbols();
        }
    }["useSyncHotSymbols.useEffect"], [
        enabled,
        watchlist,
        layoutCount,
        paneKey,
        tradeKey
    ]);
}
_s2(useSyncHotSymbols, "arvl4ETnJqgOxCE4aflG0/U0GuM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/use-universe.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUniverse",
    ()=>useUniverse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function getSnapshot() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUniverseVersion"])();
}
function useUniverse() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeUniverse"], getSnapshot, getSnapshot);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNIVERSE"].slice();
}
_s(useUniverse, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/vela-chart-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mawsHostSections",
    ()=>mawsHostSections,
    "mawsToVelaConfig",
    ()=>mawsToVelaConfig,
    "velaToMawsPatch",
    ()=>velaToMawsPatch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
;
function mawsToVelaConfig(s) {
    const styleMap = {
        solid: "candles",
        hollow: "candles",
        bars: "bars",
        line: "line",
        area: "area",
        baseline: "baseline",
        heikinashi: "heikinashi"
    };
    const mode = s.priceScaleMode === "logarithmic" ? "price" : s.priceScaleMode === "percentage" ? "percent" : s.priceScaleMode === "indexed100" ? "indexed" : "price";
    return {
        series: {
            style: styleMap[s.candleStyle] ?? "candles"
        },
        candles: {
            bodyVisible: s.bodyVisible,
            upColor: s.bodyUpColor,
            downColor: s.bodyDownColor,
            borderVisible: s.borderVisible,
            borderUpColor: s.borderUpColor,
            borderDownColor: s.borderDownColor,
            wickVisible: s.wickVisible,
            wickUpColor: s.wickUpColor,
            wickDownColor: s.wickDownColor
        },
        grid: {
            vertLines: {
                visible: s.vertGrid,
                color: s.vertGridColor
            },
            horzLines: {
                visible: s.grid,
                color: s.horzGridColor
            }
        },
        crosshair: {
            color: s.crosshairColor,
            style: s.crosshairStyle
        },
        panes: {
            separatorColor: s.paneSeparatorColor
        },
        layout: {
            background: s.backgroundColor,
            textColor: s.scaleTextColor,
            fontSize: s.scaleFontSize
        },
        priceScale: {
            mode,
            log: s.priceScaleMode === "logarithmic" || s.logScale,
            invert: s.invertScale,
            borderColor: s.scaleLineColor,
            countdown: s.countdownToBarClose
        },
        margins: {
            top: s.marginTop,
            bottom: s.marginBottom,
            right: s.marginRightBars
        },
        timeScale: {
            timezone: s.timezone
        }
    };
}
function read(cfg, group, key) {
    const g = cfg?.[group];
    return g ? g[key] : undefined;
}
function velaToMawsPatch(cfg, cur) {
    const patch = {};
    const put = (k, v)=>{
        if (v !== undefined && cur[k] !== v) patch[k] = v;
    };
    const str = (v)=>typeof v === "string" && v !== "" ? v : undefined;
    const num = (v)=>typeof v === "number" && Number.isFinite(v) ? v : undefined;
    const bool = (v)=>typeof v === "boolean" ? v : undefined;
    // series.style → candleStyle
    const style = str(read(cfg, "series", "style"));
    if (style !== undefined) {
        const back = {
            candles: "solid",
            bars: "bars",
            line: "line",
            area: "area",
            baseline: "baseline",
            heikinashi: "heikinashi"
        };
        const mapped = back[style];
        if (mapped && cur.candleStyle !== "hollow") put("candleStyle", mapped);
    }
    // candles.*
    put("bodyVisible", bool(read(cfg, "candles", "bodyVisible")) ?? cur.bodyVisible);
    put("bodyUpColor", str(read(cfg, "candles", "upColor")) ?? cur.bodyUpColor);
    put("bodyDownColor", str(read(cfg, "candles", "downColor")) ?? cur.bodyDownColor);
    put("borderVisible", bool(read(cfg, "candles", "borderVisible")) ?? cur.borderVisible);
    put("borderUpColor", str(read(cfg, "candles", "borderUpColor")) ?? cur.borderUpColor);
    put("borderDownColor", str(read(cfg, "candles", "borderDownColor")) ?? cur.borderDownColor);
    put("wickVisible", bool(read(cfg, "candles", "wickVisible")) ?? cur.wickVisible);
    put("wickUpColor", str(read(cfg, "candles", "wickUpColor")) ?? cur.wickUpColor);
    put("wickDownColor", str(read(cfg, "candles", "wickDownColor")) ?? cur.wickDownColor);
    // grid
    const vert = read(cfg, "grid", "vertLines");
    const horz = read(cfg, "grid", "horzLines");
    if (vert) {
        put("vertGrid", bool(vert.visible) ?? cur.vertGrid);
        put("vertGridColor", str(vert.color) ?? cur.vertGridColor);
    }
    if (horz) {
        put("grid", bool(horz.visible) ?? cur.grid);
        put("horzGridColor", str(horz.color) ?? cur.horzGridColor);
    }
    // crosshair / panes / layout
    put("crosshairColor", str(read(cfg, "crosshair", "color")) ?? cur.crosshairColor);
    const chStyle = str(read(cfg, "crosshair", "style"));
    if (chStyle === "solid" || chStyle === "dashed" || chStyle === "dotted") put("crosshairStyle", chStyle);
    put("paneSeparatorColor", str(read(cfg, "panes", "separatorColor")) ?? cur.paneSeparatorColor);
    put("backgroundColor", str(read(cfg, "layout", "background")) ?? cur.backgroundColor);
    put("scaleTextColor", str(read(cfg, "layout", "textColor")) ?? cur.scaleTextColor);
    put("scaleFontSize", num(read(cfg, "layout", "fontSize")) ?? cur.scaleFontSize);
    // price scale
    const mode = str(read(cfg, "priceScale", "mode"));
    const log = bool(read(cfg, "priceScale", "log"));
    if (log === true) put("priceScaleMode", "logarithmic");
    else if (log === false && mode !== undefined) {
        put("priceScaleMode", mode === "percent" ? "percentage" : mode === "indexed" ? "indexed100" : "normal");
    }
    put("logScale", log ?? cur.logScale);
    put("invertScale", bool(read(cfg, "priceScale", "invert")) ?? cur.invertScale);
    put("scaleLineColor", str(read(cfg, "priceScale", "borderColor")) ?? cur.scaleLineColor);
    put("countdownToBarClose", bool(read(cfg, "priceScale", "countdown")) ?? cur.countdownToBarClose);
    // margins / timezone
    put("marginTop", num(read(cfg, "margins", "top")) ?? cur.marginTop);
    put("marginBottom", num(read(cfg, "margins", "bottom")) ?? cur.marginBottom);
    put("marginRightBars", num(read(cfg, "margins", "right")) ?? cur.marginRightBars);
    put("timezone", str(read(cfg, "timeScale", "timezone")) ?? cur.timezone);
    return patch;
}
const ALWAYS_HOVER_NEVER = [
    [
        "always",
        "Always visible"
    ],
    [
        "hover",
        "Visible on hover"
    ],
    [
        "never",
        "Always hidden"
    ]
];
function mawsHostSections() {
    const st = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().chartSettings;
    const patch = (p)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().patchChartSettings(p);
    const t = (label, key)=>({
            kind: "toggle",
            label,
            get: ()=>st()[key] === true,
            set: (v)=>patch({
                    [key]: v
                })
        });
    const sel = (label, key, options)=>({
            kind: "select",
            label,
            options,
            get: ()=>String(st()[key]),
            set: (v)=>patch({
                    [key]: v
                })
        });
    const col = (label, key)=>({
            kind: "color",
            label,
            get: ()=>String(st()[key]),
            set: (v)=>patch({
                    [key]: v
                })
        });
    return [
        {
            title: "Status line",
            rows: [
                t("Symbol title", "showTitle"),
                sel("Title mode", "titleMode", [
                    [
                        "symbol",
                        "Symbol"
                    ],
                    [
                        "description",
                        "Description"
                    ]
                ]),
                t("Logo", "showLogo"),
                t("Open market status", "showMarketStatus"),
                t("Chart values", "showChartValues"),
                t("Bar change values", "showBarChange"),
                t("Last day change values", "showLastDayChange"),
                {
                    kind: "heading",
                    label: "Indicators"
                },
                t("Titles", "showIndicatorLegend"),
                t("Inputs", "showIndicatorInputs"),
                t("Values", "showIndicatorValues"),
                t("Background", "showIndicatorBackground")
            ]
        },
        {
            title: "Scales & labels",
            rows: [
                sel("Precision", "pricePrecision", [
                    [
                        "default",
                        "Default"
                    ],
                    [
                        "0",
                        "0"
                    ],
                    [
                        "1",
                        "1"
                    ],
                    [
                        "2",
                        "2"
                    ],
                    [
                        "3",
                        "3"
                    ],
                    [
                        "4",
                        "4"
                    ],
                    [
                        "5",
                        "5"
                    ],
                    [
                        "6",
                        "6"
                    ],
                    [
                        "8",
                        "8"
                    ]
                ]),
                sel("Currency and unit", "currencyUnit", [
                    [
                        "always",
                        "Always visible"
                    ],
                    [
                        "hover",
                        "On hover"
                    ],
                    [
                        "never",
                        "Always hidden"
                    ]
                ]),
                sel("Scale modes (A and L)", "scaleModes", [
                    [
                        "always",
                        "Always visible"
                    ],
                    [
                        "hover",
                        "On hover"
                    ],
                    [
                        "never",
                        "Always hidden"
                    ]
                ]),
                sel("Scales placement", "scalesPlacement", [
                    [
                        "right",
                        "Stack on the right"
                    ],
                    [
                        "left",
                        "Stack on the left"
                    ],
                    [
                        "both",
                        "Left and right"
                    ]
                ]),
                t("No overlapping labels", "noOverlappingLabels"),
                t("Day of week on labels", "dayOfWeekOnLabels"),
                sel("Date format", "dateFormat", [
                    [
                        "MMM dd, yyyy",
                        "Sep 29, 1997"
                    ],
                    [
                        "yyyy-MM-dd",
                        "1997-09-29"
                    ],
                    [
                        "dd/MM/yyyy",
                        "29/09/1997"
                    ],
                    [
                        "MM/dd/yyyy",
                        "09/29/1997"
                    ]
                ]),
                sel("Time hours format", "timeHoursFormat", [
                    [
                        "12",
                        "12-hours"
                    ],
                    [
                        "24",
                        "24-hours"
                    ]
                ]),
                t("Lock price to bar ratio", "lockPriceRatio")
            ]
        },
        {
            title: "Chart chrome",
            rows: [
                t("Plus button", "showPlusButton"),
                t("Watermark", "watermark"),
                col("Watermark color", "watermarkColor"),
                sel("Navigation buttons", "navigationButtons", ALWAYS_HOVER_NEVER),
                sel("Pane buttons", "paneButtons", ALWAYS_HOVER_NEVER)
            ]
        }
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/vela-feed-adapter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fromVelaTicker",
    ()=>fromVelaTicker,
    "mawsVelaProvider",
    ()=>mawsVelaProvider,
    "toVelaTicker",
    ()=>toVelaTicker
]);
/**
 * vela-feed-adapter.ts
 *
 * Vela's native BinanceProvider drives the charts: it fetches its own
 * paginated history (REST) and streams its own kline WebSocket — no Next.js
 * API routes and no MAWS feed cache in the chart data path. Trading state
 * (positions, orders, TP/SL, PnL) still flows through MAWS; this file only
 * maps symbols between the two conventions.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$providers$2f$binance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vela/dist/providers/binance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/market/binance-intervals.ts [app-client] (ecmascript)");
;
;
const mawsVelaProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$providers$2f$binance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BinanceProvider"]();
function toVelaTicker(symbol) {
    const s = String(symbol ?? "").toUpperCase().replace(/\.P$/i, "");
    return `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$binance$2d$intervals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBinanceSymbol"])(s)}.P`;
}
function fromVelaTicker(ticker) {
    const t = String(ticker ?? "").trim().toUpperCase().replace(/\.P$/i, "");
    for (const [app, bin] of Object.entries(ALIASES)){
        if (bin === t) return app;
    }
    return t;
}
const ALIASES = {
    MATICUSDT: "POLUSDT",
    PEPEUSDT: "1000PEPEUSDT"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/vela-indicator-catalog.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * vela-indicator-catalog.ts
 *
 * MAWS's mirror of Vela's full native-indicator catalog
 * (vela/src/core/native-indicators/classics + the volume/vpvr built-ins).
 *
 * The add-indicator menu lists every type here and mounts instances straight
 * through Vela's own pipeline (`chart.addNativeIndicator(type)`) — Vela owns
 * the legend row, settings dialog, hide/show and removal for these; they are
 * NOT MAWS store studies (PMO, Order Blocks and Volume stay MAWS-managed).
 *
 * Titles here are the pre-fetch fallback; the authoritative ones (plus
 * supported/present flags) come from `chart.availableNativeIndicators()`.
 */ __turbopack_context__.s([
    "VELA_INDICATOR_CATALOG",
    ()=>VELA_INDICATOR_CATALOG,
    "VELA_INDICATOR_CATEGORIES",
    ()=>VELA_INDICATOR_CATEGORIES,
    "groupedVelaCatalog",
    ()=>groupedVelaCatalog,
    "velaCatalogEntry",
    ()=>velaCatalogEntry,
    "velaIndicatorCategory",
    ()=>velaIndicatorCategory
]);
const VELA_INDICATOR_CATEGORIES = [
    "Moving Averages",
    "Bands & Channels",
    "Oscillators",
    "Trend",
    "Volatility",
    "Volume",
    "Overlays & Levels"
];
const VELA_INDICATOR_CATALOG = [
    // Moving Averages (vela classics/averages.ts)
    {
        type: "sma",
        title: "Simple Moving Average",
        category: "Moving Averages"
    },
    {
        type: "ema",
        title: "Exponential Moving Average",
        category: "Moving Averages"
    },
    {
        type: "moving-average",
        title: "Moving Average",
        category: "Moving Averages"
    },
    {
        type: "rma",
        title: "Smoothed Moving Average",
        category: "Moving Averages"
    },
    {
        type: "zlema",
        title: "Zero-Lag Exponential Moving Average",
        category: "Moving Averages"
    },
    {
        type: "vidya",
        title: "Variable Index Dynamic Average",
        category: "Moving Averages"
    },
    {
        type: "ma-envelope",
        title: "Moving Average Envelope",
        category: "Moving Averages"
    },
    {
        type: "linear-regression",
        title: "Linear Regression Curve",
        category: "Moving Averages"
    },
    // Bands & Channels (vela classics/bands.ts)
    {
        type: "bollinger-bands",
        title: "Bollinger Bands",
        category: "Bands & Channels"
    },
    {
        type: "percent-b",
        title: "Bollinger Bands %B",
        category: "Bands & Channels"
    },
    {
        type: "bandwidth",
        title: "Bollinger Bands Width",
        category: "Bands & Channels"
    },
    {
        type: "keltner-channels",
        title: "Keltner Channels",
        category: "Bands & Channels"
    },
    {
        type: "donchian-channels",
        title: "Donchian Channels",
        category: "Bands & Channels"
    },
    {
        type: "chandelier-exit",
        title: "Chandelier Exit",
        category: "Bands & Channels"
    },
    {
        type: "chande-kroll-stop",
        title: "Chande Kroll Stop",
        category: "Bands & Channels"
    },
    {
        type: "supertrend",
        title: "SuperTrend",
        category: "Bands & Channels"
    },
    {
        type: "williams-alligator",
        title: "Williams Alligator",
        category: "Bands & Channels"
    },
    {
        type: "gator-oscillator",
        title: "Gator Oscillator",
        category: "Bands & Channels"
    },
    // Oscillators (vela classics/oscillators.ts)
    {
        type: "rsi",
        title: "Relative Strength Index",
        category: "Oscillators"
    },
    {
        type: "stochastic",
        title: "Stochastic",
        category: "Oscillators"
    },
    {
        type: "stochastic-rsi",
        title: "Stochastic RSI",
        category: "Oscillators"
    },
    {
        type: "macd",
        title: "MACD",
        category: "Oscillators"
    },
    {
        type: "ppo",
        title: "Percentage Price Oscillator",
        category: "Oscillators"
    },
    {
        type: "awesome-oscillator",
        title: "Awesome Oscillator",
        category: "Oscillators"
    },
    {
        type: "commodity-channel-index",
        title: "Commodity Channel Index",
        category: "Oscillators"
    },
    {
        type: "williams-percent-r",
        title: "Williams %R",
        category: "Oscillators"
    },
    {
        type: "chande-momentum-oscillator",
        title: "Chande Momentum Oscillator",
        category: "Oscillators"
    },
    {
        type: "connors-rsi",
        title: "Connors RSI",
        category: "Oscillators"
    },
    {
        type: "fisher-transform",
        title: "Fisher Transform",
        category: "Oscillators"
    },
    {
        type: "trix",
        title: "TRIX",
        category: "Oscillators"
    },
    {
        type: "true-strength-index",
        title: "True Strength Index",
        category: "Oscillators"
    },
    {
        type: "smi-ergodic",
        title: "SMI Ergodic Oscillator",
        category: "Oscillators"
    },
    {
        type: "schaff-trend-cycle",
        title: "Schaff Trend Cycle",
        category: "Oscillators"
    },
    {
        type: "know-sure-thing",
        title: "Know Sure Thing",
        category: "Oscillators"
    },
    {
        type: "coppock-curve",
        title: "Coppock Curve",
        category: "Oscillators"
    },
    {
        type: "detrended-price-oscillator",
        title: "Detrended Price Oscillator",
        category: "Oscillators"
    },
    {
        type: "rate-of-change",
        title: "Rate of Change",
        category: "Oscillators"
    },
    {
        type: "ultimate-oscillator",
        title: "Ultimate Oscillator",
        category: "Oscillators"
    },
    {
        type: "relative-vigor-index",
        title: "Relative Vigor Index",
        category: "Oscillators"
    },
    {
        type: "relative-volatility-index",
        title: "Relative Volatility Index",
        category: "Oscillators"
    },
    {
        type: "balance-of-power",
        title: "Balance of Power",
        category: "Oscillators"
    },
    {
        type: "elder-ray",
        title: "Elder Ray",
        category: "Oscillators"
    },
    {
        type: "ttm-squeeze",
        title: "TTM Squeeze",
        category: "Oscillators"
    },
    {
        type: "pmo",
        title: "PMO (Price Momentum Oscillator)",
        category: "Oscillators"
    },
    // Trend (vela classics/trend.ts)
    {
        type: "aroon",
        title: "Aroon",
        category: "Trend"
    },
    {
        type: "average-directional-index",
        title: "Average Directional Index",
        category: "Trend"
    },
    {
        type: "vortex-indicator",
        title: "Vortex Indicator",
        category: "Trend"
    },
    // Volatility (vela classics/volatility.ts)
    {
        type: "average-true-range",
        title: "Average True Range",
        category: "Volatility"
    },
    {
        type: "historical-volatility",
        title: "Historical Volatility",
        category: "Volatility"
    },
    {
        type: "chaikin-volatility",
        title: "Chaikin Volatility",
        category: "Volatility"
    },
    {
        type: "mass-index",
        title: "Mass Index",
        category: "Volatility"
    },
    {
        type: "standard-deviation",
        title: "Standard Deviation",
        category: "Volatility"
    },
    {
        type: "ulcer-index",
        title: "Ulcer Index",
        category: "Volatility"
    },
    {
        type: "choppiness-index",
        title: "Choppiness Index",
        category: "Volatility"
    },
    // Volume (vela classics/volume.ts + the vpvr built-in)
    {
        type: "on-balance-volume",
        title: "On Balance Volume",
        category: "Volume"
    },
    {
        type: "accumulation-distribution",
        title: "Accumulation / Distribution",
        category: "Volume"
    },
    {
        type: "chaikin-money-flow",
        title: "Chaikin Money Flow",
        category: "Volume"
    },
    {
        type: "chaikin-oscillator",
        title: "Chaikin Oscillator",
        category: "Volume"
    },
    {
        type: "ease-of-movement",
        title: "Ease of Movement",
        category: "Volume"
    },
    {
        type: "force-index",
        title: "Force Index",
        category: "Volume"
    },
    {
        type: "klinger-oscillator",
        title: "Klinger Oscillator",
        category: "Volume"
    },
    {
        type: "money-flow-index",
        title: "Money Flow Index",
        category: "Volume"
    },
    {
        type: "negative-volume-index",
        title: "Negative Volume Index",
        category: "Volume"
    },
    {
        type: "positive-volume-index",
        title: "Positive Volume Index",
        category: "Volume"
    },
    {
        type: "price-volume-trend",
        title: "Price Volume Trend",
        category: "Volume"
    },
    {
        type: "volume-oscillator",
        title: "Volume Oscillator",
        category: "Volume"
    },
    {
        type: "pvo",
        title: "Percentage Volume Oscillator",
        category: "Volume"
    },
    {
        type: "volume-flow-indicator",
        title: "Volume Flow Indicator",
        category: "Volume"
    },
    {
        type: "intraday-intensity",
        title: "Intraday Intensity",
        category: "Volume"
    },
    {
        type: "vpvr",
        title: "Volume Profile Visible Range",
        category: "Volume"
    },
    // Overlays & Levels (vela classics/overlays.ts)
    {
        type: "parabolic-sar",
        title: "Parabolic SAR",
        category: "Overlays & Levels"
    },
    {
        type: "vwap",
        title: "Volume Weighted Average Price",
        category: "Overlays & Levels"
    },
    {
        type: "pivot-points",
        title: "Pivot Points Standard",
        category: "Overlays & Levels"
    },
    {
        type: "52-week-high-low",
        title: "52 Week High/Low",
        category: "Overlays & Levels"
    },
    {
        type: "zigzag",
        title: "ZigZag",
        category: "Overlays & Levels"
    },
    {
        type: "williams-fractal",
        title: "Williams Fractal",
        category: "Overlays & Levels"
    },
    // Registered by MAWS (lib/vela-native-indicators.ts), not Vela's classic catalog.
    {
        type: "order-blocks",
        title: "Order Blocks & Breaker Blocks",
        category: "Overlays & Levels"
    }
];
const BY_TYPE = new Map(VELA_INDICATOR_CATALOG.map((e)=>[
        e.type,
        e
    ]));
function velaCatalogEntry(type) {
    return BY_TYPE.get(type);
}
function velaIndicatorCategory(type) {
    return BY_TYPE.get(type)?.category ?? "Other";
}
function groupedVelaCatalog() {
    const groups = new Map();
    for (const entry of VELA_INDICATOR_CATALOG){
        const list = groups.get(entry.category) ?? [];
        list.push(entry);
        groups.set(entry.category, list);
    }
    const order = (c)=>{
        const i = VELA_INDICATOR_CATEGORIES.indexOf(c);
        return i === -1 ? VELA_INDICATOR_CATEGORIES.length : i;
    };
    return [
        ...groups.entries()
    ].sort((a, b)=>order(a[0]) - order(b[0])).map(([category, entries])=>({
            category,
            entries: [
                ...entries
            ].sort((a, b)=>a.title.localeCompare(b.title))
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/vela-indicators.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * vela-indicators.ts
 *
 * Bridges MAWS indicator instances to Vela's indicator system.
 *
 * MAWS studies ride Vela's native catalog via
 * `chart.addNativeIndicator(type, { inputs })` — core-computed, no scripting
 * engine, full Vela pipeline (legend, settings, panes, persistence). PMO and
 * Order Blocks are registered as natives directly from MAWS
 * (lib/vela-native-indicators.ts) and are added from the Indicators menu
 * without a store study; Volume is Vela's built-in.
 *
 * Every managed indicator carries a stable id (`maws-<studyId>`) so a studies
 * change adds only what is new and removes only what is gone.
 */ __turbopack_context__.s([
    "isManagedHandle",
    ()=>isManagedHandle,
    "managedIndicatorId",
    ()=>managedIndicatorId,
    "removeManagedIndicators",
    ()=>removeManagedIndicators,
    "syncVelaIndicators",
    ()=>syncVelaIndicators
]);
/** Ids this bridge has mounted on a chart, keyed by chart instance. */ const managed = new WeakMap();
/** Latest studies handed to each chart — what the error watcher re-runs. */ const latestStudies = new WeakMap();
/** One `indicator:error` watcher per chart, with a bounded per-id retry count. */ const errorWatch = new WeakMap();
const MANAGED_PREFIX = "maws-";
function managedIndicatorId(studyId) {
    return `${MANAGED_PREFIX}${studyId}`;
}
// ---------------------------------------------------------------------------
// Vela native catalog mapping
// ---------------------------------------------------------------------------
/** MAWS study type → Vela native-indicator type (core-computed, no engine). */ const NATIVE_SPEC = {
    ema: "moving-average",
    bb: "bollinger-bands",
    rsi: "rsi",
    stoch: "stochastic",
    atr: "average-true-range",
    adx: "average-directional-index",
    vwap: "vwap"
};
/** MAWS source → Vela source key (Vela: Close/Open/High/Low/HL2/HLC3/OHLC4/HLCC4). */ function velaSource(s) {
    const map = {
        close: "Close",
        open: "Open",
        high: "High",
        low: "Low",
        hl2: "HL2",
        hlc3: "HLC3",
        ohlc4: "OHLC4"
    };
    return map[s] ?? "Close";
}
/** MAWS smoothing type → Vela moving-average type option. */ function velaMaType(s) {
    const map = {
        sma: "SMA",
        ema: "EMA",
        wma: "WMA",
        "smma": "RMA (SMMA)",
        none: "SMA"
    };
    return map[s] ?? "SMA";
}
/** MAWS VWAP anchor → Vela anchor option. */ function velaVwapAnchor(s) {
    const map = {
        session: "Session",
        week: "Week",
        month: "Month"
    };
    return map[s] ?? "Session";
}
/** MAWS line color → hex (MAWS colors may carry alpha; Vela inputs take plain colors). */ function colorOf(s, fallback) {
    const c = (s ?? "").trim();
    return c.length > 0 ? c : fallback;
}
/**
 * Map a MAWS study's settings onto the Vela native spec's input keys
 * (verified against vela/src/core/native-indicators/classics/*).
 */ function nativeInputs(study) {
    const s = study.settings;
    const num = (k, d)=>typeof s[k] === "number" && Number.isFinite(s[k]) ? s[k] : d;
    const str = (k, d)=>typeof s[k] === "string" && s[k].length > 0 ? s[k] : d;
    const line = (colorKey, widthKey, dColor)=>({
            color: colorOf(s[colorKey], dColor),
            lineWidth: typeof s[widthKey] === "number" ? s[widthKey] : 2
        });
    switch(study.type){
        case "ema":
            return {
                maType: velaMaType(str("smoothingType", "ema")),
                length: num("period", 9),
                source: velaSource(str("source", "close")),
                offset: num("offset", 0),
                ...line("color", "lineWidth", "#2962ff")
            };
        case "bb":
            return {
                length: num("period", 20),
                source: velaSource(str("source", "close")),
                mult: num("mult", 2),
                offset: num("offset", 0)
            };
        case "rsi":
            return {
                length: num("period", 14),
                source: "Close",
                ...line("color", "lineWidth", "#7e57c2")
            };
        case "stoch":
            return {
                kLength: num("length", 14),
                kSmoothing: num("kSmoothing", 3),
                dLength: num("dSmoothing", 3)
            };
        case "atr":
            return {
                length: num("period", 14),
                ...line("color", "lineWidth", "#ff9800")
            };
        case "adx":
            return {
                diLength: num("period", 14),
                adxLength: num("period", 14)
            };
        case "vwap":
            return {
                anchor: velaVwapAnchor(str("anchorPeriod", "session")),
                source: velaSource(str("source", "hlc3"))
            };
        default:
            return {};
    }
}
// ---------------------------------------------------------------------------
// History gate
// ---------------------------------------------------------------------------
/**
 * PineTS cannot execute against an EMPTY bar array (it throws
 * "Cannot read properties of undefined (reading 'openTime')" and the live
 * session dies without recovering), so adding an indicator must wait until the
 * chart has painted its first history. `getVisibleRange()` is the public
 * "bars are painted" signal. Otherwise wait for `load:end` — noting that Vela
 * fires it even when a load ended with ZERO bars, so the bar count must be
 * checked and a bar-less load must not resolve the gate.
 */ function waitForBars(chart, timeoutMs = 20_000) {
    if (chart.getVisibleRange() != null) return Promise.resolve();
    return new Promise((resolve)=>{
        let done = false;
        const finish = ()=>{
            if (done) return;
            // getVisibleRange() is non-null only once real bars are painted; a
            // bar-less load:end must not release the gate.
            if (chart.getVisibleRange() == null) return;
            done = true;
            off();
            clearTimeout(timer);
            resolve();
        };
        const off = chart.on("load:end", finish);
        const timer = setTimeout(finish, timeoutMs);
    });
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * Recover from a dead indicator session.
 *
 * A streaming engine can still lose its session at runtime (its live updater
 * crashes and the handle never recovers on its own), which surfaces as
 * `indicator:error` with no model ever following. The bridge's job is to keep
 * the chart usable: drop the dead handle and re-mount the script once the
 * chart has bars again. Bounded per id so a genuinely broken script cannot
 * loop forever.
 */ function watchIndicatorErrors(chart) {
    if (errorWatch.has(chart)) return;
    const attempts = new Map();
    const off = chart.on("indicator:error", ({ id })=>{
        if (!id.startsWith(MANAGED_PREFIX)) return;
        const tries = attempts.get(id) ?? 0;
        if (tries >= 3) return;
        attempts.set(id, tries + 1);
        const studies = latestStudies.get(chart);
        if (!studies) return;
        idsOf(chart).delete(id);
        try {
            chart.indicators().find((h)=>h.id === id)?.remove();
        } catch  {
        /* already gone */ }
        setTimeout(()=>{
            void syncVelaIndicators(chart, studies);
        }, 250);
    });
    errorWatch.set(chart, {
        off,
        attempts
    });
}
function idsOf(chart) {
    let set = managed.get(chart);
    if (!set) {
        set = new Set();
        managed.set(chart, set);
    }
    return set;
}
function isManagedHandle(chart, id) {
    return idsOf(chart).has(id);
}
async function syncVelaIndicators(chart, studies) {
    latestStudies.set(chart, studies);
    watchIndicatorErrors(chart);
    // Never mount scripts onto a bar-less chart (PineTS cannot run empty series).
    await waitForBars(chart);
    const desired = new Map();
    for (const study of studies){
        if (study.hidden) continue;
        if (!NATIVE_SPEC[study.type]) continue;
        desired.set(managedIndicatorId(study.id), study);
    }
    const current = idsOf(chart);
    // Remove studies that are gone (or now hidden).
    for (const id of [
        ...current
    ]){
        if (desired.has(id)) continue;
        current.delete(id);
        try {
            chart.indicators().find((h)=>h.id === id)?.remove();
        } catch  {
        /* already torn down */ }
    }
    // Add newly enabled studies as Vela natives (no scripting engine).
    let failed = false;
    for (const [id, study] of desired){
        if (current.has(id)) continue;
        const nativeType = NATIVE_SPEC[study.type];
        current.add(id);
        try {
            // addNativeIndicator mints its own registry id; track the returned
            // handle's id so removal below finds the right instance.
            const handle = chart.addNativeIndicator(nativeType, {
                inputs: nativeInputs(study)
            });
            if (handle?.id !== id) {
                current.delete(id);
                current.add(handle?.id ?? id);
            }
        } catch (err) {
            current.delete(id);
            failed = true;
            console.warn("[vela-indicators] failed to add native", study.type, err);
        }
    }
    // A transient failure (e.g. this sync raced the history load) retries once
    // on the next load completion — a broken script without a reload does not
    // fire `load:end` again, so this is bounded.
    if (failed) {
        const offRetry = chart.on("load:end", ()=>{
            offRetry();
            void syncVelaIndicators(chart, studies);
        });
    }
}
function removeManagedIndicators(chart) {
    const watch = errorWatch.get(chart);
    if (watch) {
        watch.off();
        errorWatch.delete(chart);
    }
    latestStudies.delete(chart);
    const current = idsOf(chart);
    for (const id of current){
        try {
            chart.indicators().find((h)=>h.id === id)?.remove();
        } catch  {
        /* ignore */ }
    }
    current.clear();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/vela-layers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * vela-layers.ts — MAWS custom renderer layers for Vela's native renderer.
 *
 * Registered at import time (before any chart mounts). Payloads are pushed per
 * chart via `handle.renderer.setNativeData(id, data)` from the overlay owners
 * (SessionBreaks, TradeMarks) — the existing MAWS engines and feed
 * keep computing; Vela only paints. (Order blocks moved to a Vela native
 * indicator — lib/vela-native-indicators.ts.)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$EKLUDYFM$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vela/dist/chunk-EKLUDYFM.js [app-client] (ecmascript)");
;
// ── painting helpers ────────────────────────────────────────────────────────
function prep(canvas, dpr) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
}
// ── layer: session breaks (vertical day separators) ─────────────────────────
(0, __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$EKLUDYFM$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerRendererLayer"])({
    id: "maws-session-breaks",
    placement: "above-data",
    create: ()=>{
        let ctx = null;
        let el = null;
        return {
            mount (canvas) {
                el = canvas;
                ctx = canvas.getContext("2d");
            },
            render ({ data, coords, bounds }) {
                if (!ctx || !el) return;
                const d = data;
                if (!d || d.times.length === 0) {
                    ctx.clearRect(0, 0, el.width, el.height);
                    return;
                }
                const g = prep(el, coords.dpr || 1);
                if (!g) return;
                g.strokeStyle = d.color;
                g.lineWidth = d.width;
                g.setLineDash(d.dash);
                const top = bounds.top;
                const bottom = bounds.top + bounds.height;
                for (const t of d.times){
                    const x = coords.timeToX(t);
                    if (x < -1 || x > coords.width + 1) continue;
                    g.beginPath();
                    g.moveTo(x, top);
                    g.lineTo(x, bottom);
                    g.stroke();
                }
            },
            destroy () {
                ctx = null;
                el = null;
            }
        };
    }
});
// ── layer: risk/reward zones behind the trade lines ─────────────────────────
(0, __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$EKLUDYFM$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerRendererLayer"])({
    id: "maws-trade-zones",
    placement: "below-data",
    create: ()=>{
        let ctx = null;
        let el = null;
        return {
            mount (canvas) {
                el = canvas;
                ctx = canvas.getContext("2d");
            },
            render ({ data, coords, scale, bounds }) {
                if (!ctx || !el) return;
                const d = data;
                if (!d || d.bands.length === 0) {
                    ctx.clearRect(0, 0, el.width, el.height);
                    return;
                }
                const g = prep(el, coords.dpr || 1);
                if (!g) return;
                g.globalAlpha = 0.1;
                for (const b of d.bands){
                    const y0 = coords.priceToY(b.entry, scale, bounds);
                    const y1 = coords.priceToY(b.other, scale, bounds);
                    const top = Math.max(bounds.top, Math.min(y0, y1));
                    const bottom = Math.min(bounds.top + bounds.height, Math.max(y0, y1));
                    if (bottom - top < 1) continue;
                    g.fillStyle = b.color;
                    g.fillRect(0, top, coords.width, bottom - top);
                }
                g.globalAlpha = 1;
            },
            destroy () {
                ctx = null;
                el = null;
            }
        };
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/vela-native-indicators.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * vela-native-indicators.ts
 *
 * MAWS-registered Vela native indicators — types that are NOT in Vela's classic
 * catalog but ride the exact same native pipeline (legend row, settings dialog
 * via the gear, hide/show, object tree, pane management, persistence hooks).
 *
 *  - `order-blocks`: the LuxAlgo "Order Blocks & Breaker Blocks" port, computed
 *    over the chart's own bars (`lib/order-blocks.ts` incremental engine) and
 *    emitted as Vela drawing boxes + labels. Replay is handled by Vela for
 *    free — replay restarts the indicator over the truncated bar array.
 *  - `pmo`: the Price Momentum Oscillator (double-smoothed ROC + signal EMA),
 *    emitted as two line series on its own pane.
 *
 * Registered once at import (idempotent); import this module before charts mount.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$EKLUDYFM$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vela/dist/chunk-EKLUDYFM.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/indicators.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$order$2d$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/order-blocks.ts [app-client] (ecmascript)");
;
;
;
const num = (v, k, d)=>typeof v[k] === "number" && Number.isFinite(v[k]) ? v[k] : d;
const str = (v, k, d)=>typeof v[k] === "string" && v[k].length > 0 ? v[k] : d;
const bool = (v, k, d)=>typeof v[k] === "boolean" ? v[k] : d;
/** Vela bars → MAWS Candle (seconds-epoch time, the order-blocks engine's unit). */ function toCandles(bars) {
    return bars.map((b)=>({
            time: Math.floor(b.time / 1000),
            open: b.open,
            high: b.high,
            low: b.low,
            close: b.close,
            volume: b.volume ?? 0
        }));
}
// ---------------------------------------------------------------------------
// PMO
// ---------------------------------------------------------------------------
const PMO_SOURCE_OPTIONS = [
    "Close",
    "Open",
    "High",
    "Low",
    "HL2",
    "HLC3",
    "OHLC4",
    "HLCC4"
];
function velaSourceToMaSource(s) {
    const map = {
        Close: "close",
        Open: "open",
        High: "high",
        Low: "low",
        HL2: "hl2",
        HLC3: "hlc3",
        OHLC4: "ohlc4",
        HLCC4: "hlc3"
    };
    return map[s] ?? "close";
}
class PmoIndicator {
    ctx = null;
    inputs = {};
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
        if (!this.ctx) return; // pre-start edits land at start()
        this.recompute();
    }
    suspend() {}
    resume() {
        this.recompute();
    }
    stop() {}
    recompute() {
        if (!this.ctx) return;
        const bars = this.ctx.bars();
        const p1 = num(this.inputs, "period1", 35);
        const p2 = num(this.inputs, "period2", 20);
        const sigLen = num(this.inputs, "signalPeriod", 10);
        const source = velaSourceToMaSource(str(this.inputs, "source", "Close"));
        const pmoColor = str(this.inputs, "pmoColor", "#2962ff");
        const sigColor = str(this.inputs, "signalColor", "#ff9800");
        const { pmo, signal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computePmo"])(toCandles(bars), p1, p2, sigLen, source);
        const toPoints = (values)=>bars.map((b, i)=>({
                    time: b.time,
                    value: values[i] ?? null
                }));
        const series = [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$EKLUDYFM$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stableSeriesId"])({
                    instanceId: "pmo",
                    kind: "line",
                    title: "PMO",
                    ordinal: 0
                }),
                title: "PMO",
                paneId: "",
                kind: "line",
                points: toPoints(pmo),
                style: {
                    color: pmoColor,
                    width: 2,
                    lineStyle: "solid"
                }
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$EKLUDYFM$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stableSeriesId"])({
                    instanceId: "pmo",
                    kind: "line",
                    title: "Signal",
                    ordinal: 1
                }),
                title: "Signal",
                paneId: "",
                kind: "line",
                points: toPoints(signal),
                style: {
                    color: sigColor,
                    width: 1,
                    lineStyle: "solid"
                }
            }
        ];
        this.ctx.emit({
            series
        });
    }
}
const pmoDescriptor = {
    type: "pmo",
    title: "PMO (Price Momentum Oscillator)",
    shortTitle: "PMO",
    paneHint: "new",
    overlay: false,
    multiInstance: true,
    inputsSchema: ()=>[
            {
                key: "period1",
                title: "PMO Length 1",
                type: "int",
                defval: 35,
                min: 1,
                max: 5000,
                step: 1
            },
            {
                key: "period2",
                title: "PMO Length 2",
                type: "int",
                defval: 20,
                min: 1,
                max: 5000,
                step: 1
            },
            {
                key: "signalPeriod",
                title: "Signal Length",
                type: "int",
                defval: 10,
                min: 1,
                max: 500,
                step: 1
            },
            {
                key: "source",
                title: "Source",
                type: "string",
                defval: "Close",
                options: PMO_SOURCE_OPTIONS
            },
            {
                key: "pmoColor",
                title: "PMO Color",
                type: "color",
                defval: "#2962ff"
            },
            {
                key: "signalColor",
                title: "Signal Color",
                type: "color",
                defval: "#ff9800"
            }
        ],
    defaultInputs: ()=>({
            period1: 35,
            period2: 20,
            signalPeriod: 10,
            source: "Close",
            pmoColor: "#2962ff",
            signalColor: "#ff9800"
        }),
    create: ()=>new PmoIndicator()
};
// ---------------------------------------------------------------------------
// Order Blocks
// ---------------------------------------------------------------------------
const BULL_DEFAULT = "#089981";
const BEAR_DEFAULT = "#f23645";
/** Apply 0–100 opacity onto a hex color. */ function withAlpha(hex, opacityPct) {
    const a = Math.min(1, Math.max(0, opacityPct / 100));
    const c = hex.trim();
    const m = c.match(/^#([0-9a-f]{6})$/i);
    if (!m) return c;
    const r = parseInt(m[1].slice(0, 2), 16);
    const g = parseInt(m[1].slice(2, 4), 16);
    const b = parseInt(m[1].slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
}
function drawBox(id, left, right, top, bottom, fill, border) {
    return {
        id,
        paneId: "",
        xloc: "bar_time",
        left,
        top,
        right: right ?? left,
        bottom,
        extend: right == null ? "right" : "none",
        bgColor: fill,
        borderColor: border,
        borderWidth: 1,
        borderStyle: "solid",
        textSize: "tiny",
        hAlign: "center",
        vAlign: "center",
        wrap: false,
        fontFamily: "default",
        bold: false,
        italic: false
    };
}
class OrderBlocksIndicator {
    ctx = null;
    inputs = {};
    cache = null;
    cfgSig = "";
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
        if (!this.ctx) return;
        this.recompute();
    }
    suspend() {}
    resume() {
        this.recompute();
    }
    stop() {
        this.cache = null;
    }
    config() {
        return {
            swingLookback: Math.max(3, Math.trunc(num(this.inputs, "swingLookback", 10))),
            showLastBull: Math.max(0, Math.trunc(num(this.inputs, "showLastBull", 3))),
            showLastBear: Math.max(0, Math.trunc(num(this.inputs, "showLastBear", 3))),
            useBody: bool(this.inputs, "useBody", false),
            showLabels: bool(this.inputs, "showLabels", true)
        };
    }
    recompute() {
        if (!this.ctx) return;
        const bars = this.ctx.bars();
        if (bars.length === 0) {
            this.ctx.emit({
                boxes: [],
                labels: []
            });
            return;
        }
        const candles = toCandles(bars);
        const cfg = this.config();
        // Config change → full recompute (the incremental cache keys on the config,
        // and ctx.bars() is a live accessor, so onBars() calls keep it warm).
        const sig = JSON.stringify(cfg);
        if (sig !== this.cfgSig) {
            this.cfgSig = sig;
            this.cache = null;
        }
        const { result } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$order$2d$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeOrderBlocksLive"])(candles, cfg, this.cache);
        const bullFill = withAlpha(str(this.inputs, "bullColor", BULL_DEFAULT), num(this.inputs, "opacity", 20));
        const bearFill = withAlpha(str(this.inputs, "bearColor", BEAR_DEFAULT), num(this.inputs, "opacity", 20));
        const bullBorder = str(this.inputs, "bullColor", BULL_DEFAULT);
        const bearBorder = str(this.inputs, "bearColor", BEAR_DEFAULT);
        const lastTime = bars[bars.length - 1].time;
        const boxes = [];
        result.displayed.forEach((ob, i)=>{
            const isBull = ob.side === "bull";
            const fill = isBull ? bullFill : bearFill;
            const border = isBull ? bullBorder : bearBorder;
            const breakMs = ob.breakLoc != null ? ob.breakLoc * 1000 : null;
            // Original block (solid) up to the mitigation point, then the breaker
            // extending right — matching the previous MAWS rendering.
            boxes.push(drawBox(`${this.ctx.id}:box#${i * 2}`, ob.loc * 1000, breakMs, ob.top, ob.btm, fill, border));
            boxes.push(drawBox(`${this.ctx.id}:box#${i * 2 + 1}`, breakMs ?? ob.loc * 1000, null, ob.top, ob.btm, // The breaker phase takes the opposite side's hue (the Pine rendering).
            withAlpha(isBull ? bearBorder : bullBorder, num(this.inputs, "opacity", 20)), isBull ? bearBorder : bullBorder));
        });
        const labels = [];
        if (cfg.showLabels) {
            for (const lab of result.labels){
                if (lab.barIndex < 0 || lab.barIndex >= candles.length) continue;
                const t = candles[lab.barIndex].time * 1000;
                const bull = lab.side === "bull";
                labels.push({
                    id: `${this.ctx.id}:label#${labels.length}`,
                    paneId: "",
                    xloc: "bar_time",
                    x: t,
                    y: lab.price,
                    yloc: "price",
                    text: bull ? "\u25BC" : "\u25B2",
                    style: "none",
                    textColor: bull ? str(this.inputs, "bearColor", BEAR_DEFAULT) : str(this.inputs, "bullColor", BULL_DEFAULT),
                    size: "tiny",
                    textAlign: "center",
                    fontFamily: "default",
                    noFill: true
                });
            }
        }
        this.ctx.emit({
            boxes,
            labels
        });
    }
}
const orderBlocksDescriptor = {
    type: "order-blocks",
    title: "Order Blocks & Breaker Blocks",
    shortTitle: "Order Blocks",
    paneHint: "price",
    overlay: true,
    multiInstance: true,
    inputsSchema: ()=>[
            {
                key: "swingLookback",
                title: "Swing Lookback",
                type: "int",
                defval: 10,
                min: 3,
                max: 500,
                step: 1
            },
            {
                key: "showLastBull",
                title: "Show Last Bullish OB",
                type: "int",
                defval: 3,
                min: 0,
                max: 50,
                step: 1
            },
            {
                key: "showLastBear",
                title: "Show Last Bearish OB",
                type: "int",
                defval: 3,
                min: 0,
                max: 50,
                step: 1
            },
            {
                key: "useBody",
                title: "Use Candle Body",
                type: "bool",
                defval: false
            },
            {
                key: "showLabels",
                title: "Show Historical Polarity Changes",
                type: "bool",
                defval: true
            },
            {
                key: "bullColor",
                title: "Bullish Color",
                type: "color",
                defval: BULL_DEFAULT
            },
            {
                key: "bearColor",
                title: "Bearish Color",
                type: "color",
                defval: BEAR_DEFAULT
            },
            {
                key: "bullBreakColor",
                title: "Bullish Breaker Color",
                type: "color",
                defval: BEAR_DEFAULT
            },
            {
                key: "bearBreakColor",
                title: "Bearish Breaker Color",
                type: "color",
                defval: BULL_DEFAULT
            },
            {
                key: "opacity",
                title: "Fill Opacity %",
                type: "int",
                defval: 20,
                min: 0,
                max: 100,
                step: 1
            }
        ],
    defaultInputs: ()=>({
            swingLookback: 10,
            showLastBull: 3,
            showLastBear: 3,
            useBody: false,
            showLabels: true,
            bullColor: BULL_DEFAULT,
            bearColor: BEAR_DEFAULT,
            bullBreakColor: BEAR_DEFAULT,
            bearBreakColor: BULL_DEFAULT,
            opacity: 20
        }),
    create: ()=>new OrderBlocksIndicator()
};
// Register once at import (registerNativeIndicator is idempotent per type).
(0, __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$EKLUDYFM$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerNativeIndicator"])(pmoDescriptor);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$vela$2f$dist$2f$chunk$2d$EKLUDYFM$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerNativeIndicator"])(orderBlocksDescriptor);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/visibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneVisibility",
    ()=>cloneVisibility,
    "isVisibleOnTimeframe",
    ()=>isVisibleOnTimeframe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timeframes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/timeframes.ts [app-client] (ecmascript)");
;
;
function cloneVisibility(value) {
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_OBJECT_VISIBILITY"];
    return {
        ticks: value?.ticks ?? base.ticks,
        ranges: value?.ranges ?? base.ranges,
        seconds: {
            ...base.seconds,
            ...value?.seconds
        },
        minutes: {
            ...base.minutes,
            ...value?.minutes
        },
        hours: {
            ...base.hours,
            ...value?.hours
        },
        days: {
            ...base.days,
            ...value?.days
        },
        weeks: {
            ...base.weeks,
            ...value?.weeks
        },
        months: {
            ...base.months,
            ...value?.months
        }
    };
}
function familyForTimeframe(tf) {
    const sec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timeframes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeSeconds"])(tf);
    if (sec < 1) return {
        family: "ticks",
        units: 1
    };
    if (sec < 60) return {
        family: "seconds",
        units: sec
    };
    if (sec < 3600) return {
        family: "minutes",
        units: sec / 60
    };
    if (sec < 86400) return {
        family: "hours",
        units: sec / 3600
    };
    if (sec < 604800) return {
        family: "days",
        units: sec / 86400
    };
    if (sec < 2592000) return {
        family: "weeks",
        units: sec / 604800
    };
    return {
        family: "months",
        units: sec / 2592000
    };
}
function bandAllows(band, units) {
    if (!band.enabled) return false;
    return units >= band.min && units <= band.max;
}
function isVisibleOnTimeframe(visibility, timeframe) {
    const vis = cloneVisibility(visibility);
    const { family, units } = familyForTimeframe(timeframe);
    if (family === "ticks") return vis.ticks;
    if (family === "ranges") return vis.ranges;
    if (family === "seconds") return bandAllows(vis.seconds, units);
    if (family === "minutes") return bandAllows(vis.minutes, units);
    if (family === "hours") return bandAllows(vis.hours, units);
    if (family === "days") return bandAllows(vis.days, units);
    if (family === "weeks") return bandAllows(vis.weeks, units);
    return bandAllows(vis.months, units);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_0o38r9m._.js.map