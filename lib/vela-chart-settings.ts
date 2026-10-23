import { useAppStore } from "@/lib/store";
import type { ChartSettings } from "@/types";

/**
 * vela-chart-settings.ts — the single bridge between MAWS's persisted
 * `chartSettings` and Vela's native chart settings system.
 *
 * Direction of truth:
 *  - CHART COSMETICS (candles, grid, crosshair, scales, margins, timezone…)
 *    are EDITED in Vela's native settings dialog only. Vela commits through
 *    `applyConfig` → `onConfigChanged`, and we mirror the changed keys back
 *    into the zustand store (persistence + MAWS consumers).
 *  - On chart mount the store seeds the Vela config (`mawsToVelaConfig`).
 *  - MAWS-ONLY chart knobs (status line, indicator legend, watermark, plus
 *    button, formats…) are contributed to the SAME Vela dialog as host
 *    sections (`mawsHostSections`); their rows read/write the store directly.
 *  - The MAWS SettingsModal keeps only non-chart sections (app, trading,
 *    alerts, events, shortcuts).
 */

/** MAWS ChartSettings → a (partial) Vela `ChartConfig` document. */
export function mawsToVelaConfig(s: ChartSettings): Record<string, unknown> {
  const styleMap: Record<ChartSettings["candleStyle"], string> = {
    solid: "candles",
    hollow: "candles",
    bars: "bars",
    line: "line",
    area: "area",
    baseline: "baseline",
    heikinashi: "heikinashi",
  };
  const mode =
    s.priceScaleMode === "logarithmic"
      ? "price"
      : s.priceScaleMode === "percentage"
        ? "percent"
        : s.priceScaleMode === "indexed100"
          ? "indexed"
          : "price";
  return {
    series: { style: styleMap[s.candleStyle] ?? "candles" },
    candles: {
      bodyVisible: s.bodyVisible,
      upColor: s.bodyUpColor,
      downColor: s.bodyDownColor,
      borderVisible: s.borderVisible,
      borderUpColor: s.borderUpColor,
      borderDownColor: s.borderDownColor,
      wickVisible: s.wickVisible,
      wickUpColor: s.wickUpColor,
      wickDownColor: s.wickDownColor,
    },
    grid: {
      vertLines: { visible: s.vertGrid, color: s.vertGridColor },
      horzLines: { visible: s.grid, color: s.horzGridColor },
    },
    crosshair: { color: s.crosshairColor, style: s.crosshairStyle },
    panes: { separatorColor: s.paneSeparatorColor },
    layout: {
      background: s.backgroundColor,
      textColor: s.scaleTextColor,
      fontSize: s.scaleFontSize,
    },
    priceScale: {
      mode,
      log: s.priceScaleMode === "logarithmic" || s.logScale,
      invert: s.invertScale,
      borderColor: s.scaleLineColor,
      countdown: s.countdownToBarClose,
    },
    margins: {
      top: s.marginTop,
      bottom: s.marginBottom,
      right: s.marginRightBars,
    },
    timeScale: { timezone: s.timezone },
    timeLabelFormat: {
      hours12: s.timeHoursFormat !== "24",
      dateStyle:
        s.dateFormat === "yyyy-MM-dd"
          ? "iso"
          : s.dateFormat === "MM/dd/yyyy"
            ? "us"
            : s.dateFormat === "dd/MM/yyyy"
              ? "eu"
              : "default",
      dayOfWeek: s.dayOfWeekOnLabels === true,
      overlap: s.noOverlappingLabels === true ? "skip" : "allow",
    },
  };
}

type AnyCfg = Record<string, Record<string, unknown> | undefined>;

function read(cfg: unknown, group: string, key: string): unknown {
  const g = (cfg as AnyCfg)?.[group];
  return g ? g[key] : undefined;
}

/** Pick only MAWS keys the Vela config actually moved — keeps the sync
 *  echo-free (an empty diff means "don't touch the store"). */
export function velaToMawsPatch(
  cfg: unknown,
  cur: ChartSettings,
): Partial<ChartSettings> {
  const patch: Partial<ChartSettings> = {};
  const put = <K extends keyof ChartSettings>(k: K, v: ChartSettings[K]) => {
    if (v !== undefined && cur[k] !== v) (patch as Record<string, unknown>)[k] = v;
  };
  const str = (v: unknown): string | undefined => (typeof v === "string" && v !== "" ? v : undefined);
  const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
  const bool = (v: unknown): boolean | undefined => (typeof v === "boolean" ? v : undefined);

  // series.style → candleStyle
  const style = str(read(cfg, "series", "style"));
  if (style !== undefined) {
    const back: Record<string, ChartSettings["candleStyle"]> = {
      candles: "solid",
      bars: "bars",
      line: "line",
      area: "area",
      baseline: "baseline",
      heikinashi: "heikinashi",
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
  const vert = read(cfg, "grid", "vertLines") as Record<string, unknown> | undefined;
  const horz = read(cfg, "grid", "horzLines") as Record<string, unknown> | undefined;
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
    put(
      "priceScaleMode",
      mode === "percent" ? "percentage" : mode === "indexed" ? "indexed100" : "normal",
    );
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

// ── Host sections: MAWS-only chart knobs inside Vela's settings dialog ──────

type HostRow =
  | { kind: "heading"; label: string }
  | { kind: "toggle"; label: string; get: () => boolean; set: (v: boolean) => void }
  | { kind: "select"; label: string; options: ReadonlyArray<readonly [string, string] | string>; get: () => string; set: (v: string) => void }
  | { kind: "color"; label: string; get: () => string; set: (v: string) => void };

export type MawsHostSection = { title: string; rows: readonly HostRow[]; placement?: "after-symbol" | "end" | "symbol" | "scales" | "canvas" };

/** MAWS-only chart knobs, contributed to Vela's dialog via
 *  `renderer.setSettingsSections(...)`. Every row reads/writes the zustand
 *  `chartSettings` directly — no draft, live apply. */
import { applyVelaThemeEverywhere } from "@/lib/app-theme";
import { forEachChart } from "@/lib/chart-registry";
import { registerHostSettingsSections } from "@/lib/charting/core/host-extensions";
import type { ThemeName } from "@/lib/charting";

/**
 * Re-push the host sections onto every live chart renderer so the open
 * settings dialog reflects the new section list immediately (e.g. when
 * "Advanced" is toggled, the color rows appear/disappear without closing
 * and reopening the dialog).
 */
function rebuildHostSections(): void {
  forEachChart((_, h) => {
    try {
      h.renderer.setSettingsSections(mawsHostSections());
    } catch {
      /* renderer may not have the seam */
    }
  });
}

/**
 * LIVE echo: store → renderer. The store is MAWS's source of truth for chart
 * cosmetics, so any `patchChartSettings` writes the mapped keys straight onto
 * every live renderer via `applyConfig` — no remount needed. The reverse
 * direction (`onConfigChanged` from Vela's own dialog) compensates with the
 * `syncing` guard so an applied patch doesn't feed back as another patch.
 * Chart mounts replay `mawsToVelaConfig(chartSettings)` as the initial seed.
 */
let syncing = false;

function applyMappedChartKeys(): void {
  if (syncing) return;
  syncing = true;
  try {
    const config = mawsToVelaConfig(useAppStore.getState().chartSettings);
    forEachChart((_, h) => {
      try {
        h.vela.renderer.applyConfig(config);
      } catch {
        /* renderer without the config seam */
      }
      // Fixed price-axis precision: `setPricePrecision` takes a tick size, so a
      // "digit" preference maps to a 10^-d synthetic tick (overriding the
      // symbol's own metadata decimals). "default" clears the override.
      try {
        const raw = useAppStore.getState().chartSettings.pricePrecision;
        const digits = Number(raw);
        const override =
          Number.isFinite(digits) && digits >= 0
            ? Math.pow(10, -Math.min(digits, 8))
            : undefined;
        h.vela.renderer.setPricePrecision?.(override);
      } catch {
        /* renderer without the precision seam */
      }
      // Time-axis label format knobs (12/24h clock, date style, weekday prefix,
      // overlap policy). `set` invalidates the renderer itself.
      try {
        const s = useAppStore.getState().chartSettings;
        h.vela.renderer.set("timeLabelFormat", {
          hours12: s.timeHoursFormat !== "24",
          dateStyle:
            s.dateFormat === "yyyy-MM-dd"
              ? "iso"
              : s.dateFormat === "MM/dd/yyyy"
                ? "us"
                : s.dateFormat === "dd/MM/yyyy"
                  ? "eu"
                  : "default",
          dayOfWeek: s.dayOfWeekOnLabels === true,
          overlap: s.noOverlappingLabels === true ? "skip" : "allow",
        });
      } catch {
        /* renderer without the format seam */
      }
      // Symbol watermark: no MAWS echo here — the built-in Symbol-tab toggle
      // owns it via per-cell `ChartCell.setWatermarkVisible` (persisted cell
      // state). A store-driven echo would clobber that choice on every patch.
    });
  } finally {
    syncing = false;
  }
}

/** Subscribe once per app boot (called from VelaWorkspaceHost mount). */
export function startChartSettingsEcho(): () => void {
  const unsubSettings = useAppStore.subscribe((state, prev) => {
    if (state.chartSettings !== prev.chartSettings) applyMappedChartKeys();
  });
  const unsubApp = useAppStore.subscribe((state, prev) => {
    if (state.appSettings !== prev.appSettings) {
      // Shell palette changed: mirror the chart-surface keys that ride it.
      applyMappedChartKeys();
      requestAnimationFrame(rebuildHostSections);
    }
  });
  return () => {
    unsubSettings();
    unsubApp();
  };
}

// Graft registration: every chart mount merges these into its settings
// sections additively (see lib/charting/core/host-extensions.ts). The engine
// reads the provider function live at each cell settings rebuild.
/**
 * Reskin every live chart with a Vela theme AND mirror the resulting chart
 * cosmetics (background, candle/grid/scale colors) into the persisted
 * `chartSettings`.
 *
 * Chart mounts replay `mawsToVelaConfig(chartSettings)` OVER the theme, so a
 * theme pick that only calls `setTheme` looks right until the next remount
 * (refresh, timeframe/symbol change) and then reverts to the store's stale
 * palette. Mirroring the post-`setTheme` config (`getConfig()` resolves every
 * theme-owned slot from the live theme) keeps the store in step, so the themed
 * look survives every chart rebuild.
 */
export function applyThemeToCharts(themeName: ThemeName): void {
  forEachChart((_, h) => {
    try {
      h.vela.setTheme(themeName);
    } catch {
      return; /* chart without a theme seam */
    }
    try {
      const patch = velaToMawsPatch(
        h.vela.renderer.getConfig(),
        useAppStore.getState().chartSettings,
      );
      if (Object.keys(patch).length > 0) {
        useAppStore.getState().patchChartSettings(patch);
      }
    } catch {
      /* renderer without the config seam — the live theme still applied */
    }
  });
}

registerHostSettingsSections(mawsHostSections as never);

/** MAWS-only chart knobs, contributed to Vela's dialog via
 *  `renderer.setSettingsSections(...)`. Every row reads/writes the zustand
 *  `chartSettings` directly — no draft, live apply. */
export function mawsHostSections(): MawsHostSection[] {
  const st = () => useAppStore.getState().chartSettings;
  const stApp = () => useAppStore.getState().appSettings;
  const patch = (p: Partial<ChartSettings>) =>
    useAppStore.getState().patchChartSettings(p);
  const patchApp = (p: Partial<import("@/lib/app-theme").AppSettings>) =>
    useAppStore.getState().patchAppSettings(p);

  const advanced = stApp().advancedColors === true;

  const t = (label: string, key: keyof ChartSettings): HostRow => ({
    kind: "toggle",
    label,
    get: () => st()[key] === true,
    set: (v) => patch({ [key]: v } as Partial<ChartSettings>),
  });
  const sel = (
    label: string,
    key: keyof ChartSettings,
    options: ReadonlyArray<readonly [string, string]>,
  ): HostRow => ({
    kind: "select",
    label,
    options,
    get: () => String(st()[key]),
    set: (v) => patch({ [key]: v } as Partial<ChartSettings>),
  });
  const col = (label: string, key: keyof ChartSettings): HostRow => ({
    kind: "color",
    label,
    get: () => String(st()[key]),
    set: (v) => patch({ [key]: v } as Partial<ChartSettings>),
  });
  const appCol = (label: string, key: keyof import("@/lib/app-theme").AppSettings): HostRow => ({
    kind: "color",
    label,
    get: () => String(stApp()[key] ?? ""),
    set: (v) => patchApp({ [key]: v } as Partial<import("@/lib/app-theme").AppSettings>),
  });

  // Individual color rows — only included when Advanced is on.
  // The CHART canvas background/text pickers live here next to their shell
  // counterparts (one colors section for both surfaces), moved out of the
  // Canvas tab's "Background & text" group — which keeps text size + pane
  // separator. "Chart …" labels disambiguate from the shell rows.
  const colorRows: HostRow[] = advanced ? [
    { kind: "heading", label: "Custom colors" },
    appCol("Background", "backgroundColor"),
    col("Chart background", "backgroundColor"),
    appCol("Panels", "panelColor"),
    appCol("Elevated surfaces", "elevatedColor"),
    appCol("Borders", "borderColor"),
    appCol("Bar / top rail", "barColor"),
    appCol("Hover", "hoverColor"),
    appCol("Text", "textColor"),
    col("Chart text color", "scaleTextColor"),
    appCol("Muted text", "mutedColor"),
  ] : [];

  return [
    // ── Status line: Vela's built-in section owns these rows (logo/name/market/
    //    OHLC/change/indicator titles+values live through the cell's own state and
    //    apply immediately). MAWS's duplicate rows wrote store keys with zero
    //    consumers — removed during the Vela rewiring audit. ─────────────────────
    {
      title: "Scales & labels",
      rows: [
        sel("Precision", "pricePrecision", [
          ["default", "Default"],
          ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"],
          ["4", "4"], ["5", "5"], ["6", "6"], ["8", "8"],
        ]),
        t("No overlapping labels", "noOverlappingLabels"),
        t("Day of week on labels", "dayOfWeekOnLabels"),
        sel("Date format", "dateFormat", [["MMM dd, yyyy", "Sep 29, 1997"], ["yyyy-MM-dd", "1997-09-29"], ["dd/MM/yyyy", "29/09/1997"], ["MM/dd/yyyy", "09/29/1997"]]),
        sel("Time hours format", "timeHoursFormat", [["12", "12-hours"], ["24", "24-hours"]]),
      ],
    },
    // ── Chart chrome — the floating HTML overlays MAWS portals over each cell.
    //    They are MAWS-owned components, not renderer config, so their show/hide
    //    knobs live here as host rows inside the built-in Canvas tab. LIVE: the
    //    overlays read the store on every render, so a change applies without
    //    reopening the dialog. (The zoom/pan/reset nav bar that used to be one of
    //    these was removed — view reset lives on the chart context menu, ALT+R,
    //    and the workspace cell cluster.) ─────────────────────────────────────
    {
      title: "Chart chrome",
      placement: "canvas",
      rows: [t("Crosshair plus button", "showPlusButton")],
    },

    // ── Theme — folded INSIDE the built-in Canvas tab ('canvas' placement) so
    // canvas and theme settings share one tab instead of two. ───────────────
    {
      title: "Theme",
      placement: "canvas",
      rows: [
        // Theme preset selector: picks a Vela theme, reskins charts AND shell.
        {
          kind: "select",
          label: "Color theme",
          options: [
            ["dark", "Vela Muted (Dark)"],
            ["classic", "Standard Classic"],
            ["light", "Light"],
          ] as const,
          get: (): string => {
            const bg = stApp().backgroundColor.trim().toLowerCase();
            if (bg === "#ffffff") return "light";
            if (bg === "#131722") return "classic";
            return "dark";
          },
          set: (v: string) => {
            const name = (v === "classic" || v === "light" ? v : "dark") as ThemeName;
            // Apply CSS vars to shell immediately.
            const next = applyVelaThemeEverywhere(name);
            // Persist the new palette.
            useAppStore.getState().setAppSettings({ ...next, advancedColors: stApp().advancedColors });
            // Reskin every live chart canvas AND mirror the theme's chart
            // cosmetics into chartSettings (see applyThemeToCharts).
            applyThemeToCharts(name);
            // Rebuild sections so the color row values refresh to the new palette.
            requestAnimationFrame(rebuildHostSections);
          },
        },
        // Advanced toggle: shows/hides per-component color pickers.
        {
          kind: "toggle",
          label: "Advanced (custom colors)",
          get: () => stApp().advancedColors === true,
          set: (v: boolean) => {
            patchApp({ advancedColors: v });
            // Rebuild so the color rows appear/disappear in the open dialog.
            requestAnimationFrame(rebuildHostSections);
          },
        },
        // Color rows — only present when Advanced is on (list is empty otherwise).
        ...colorRows,
      ],
    },

    // ── Trading ──────────────────────────────────────────────────────────────
    {
      title: "Trading",
      placement: "end",
      rows: [
        { kind: "heading", label: "General" },
        t("Buy/sell buttons", "showBuySell"),
        t("One-click trading", "oneClickTrading"),
        t("Execution sound", "executionSound"),
        sel("Sound", "executionSoundName", [["alarm", "Alarm Clock"], ["beep", "Beep"], ["chime", "Chime"]]),
        t("Show only rejection notifications", "showOnlyRejectionNotifications"),
        { kind: "heading", label: "Appearance" },
        t("Positions and orders", "showPositionLines"),
        t("Take profit / stop loss", "showTpSlLines"),
        col("TP line color", "tpLineColor"),
        col("SL line color", "slLineColor"),
        t("Liquidation", "showLiqLines"),
        col("Liquidation line color", "liqLineColor"),
        { kind: "heading", label: "Defaults" },
        sel("Order type", "defaultOrderType", [["market", "Market"], ["limit", "Limit"]]),
        sel("Default order size", "defaultQty", [
          ["0.01", "0.01"], ["0.1", "0.1"], ["0.5", "0.5"],
          ["1", "1"], ["5", "5"], ["10", "10"], ["50", "50"], ["100", "100"],
        ]),
        sel("Default leverage", "defaultLeverage", [
          ["1", "1×"], ["2", "2×"], ["3", "3×"], ["5", "5×"],
          ["10", "10×"], ["20", "20×"], ["50", "50×"], ["100", "100×"],
          ["125", "125×"],
        ]),
      ],
    },

    // ── Alerts — folded inside the built-in Scales and lines tab ('scales'
    //    placement): the row set is too small to deserve its own rail tab, and
    //    the lines they style ARE scale-adjacent overlays. ─────────────────────
    {
      title: "Alerts",
      placement: "scales",
      rows: [
        t("Alert lines", "showAlertLines"),
        col("Alert line color", "alertLineColor"),
      ],
    },

    // ── Event sources ────────────────────────────────────────────────────────
    // NOT "Events": Vela's own Events tab (timeline-mark group visibility, driven
    // by `chart.marks`) already owns that name — one tab per idea.
    {
      title: "Event sources",
      placement: "end",
      rows: [
        t("Session breaks", "sessionBreaks"),
        col("Session break color", "sessionBreakColor"),
        sel("Session break width", "sessionBreakLineWidth", [["1", "1px"], ["2", "2px"], ["3", "3px"], ["4", "4px"]]),
        sel("Session break style", "sessionBreakLineStyle", [["solid", "Solid"], ["dashed", "Dashed"], ["dotted", "Dotted"]]),
        t("Economic events", "economicEvents"),
        t("Only future events", "onlyFutureEvents"),
        t("Events breaks", "eventsBreaks"),
        col("Events break color", "eventsBreakColor"),
        t("Latest news", "latestNews"),
        t("News notification", "newsNotification"),
      ],
    },
  ];
}