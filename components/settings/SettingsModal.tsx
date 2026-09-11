"use client";

import {
  SettingsBtn,
  SettingsCheck,
  SettingsColorSwatch,
  SettingsFieldRow,
  SettingsSection,
  settingsUi,
} from "@/components/settings/settings-ui";
import { KeyboardShortcutsPanel } from "@/components/settings/KeyboardShortcutsPanel";
import {
  DEFAULT_APP_SETTINGS,
  normalizeAppSettings,
  type AppSettings,
} from "@/lib/app-theme";
import { useAppStore } from "@/lib/store";
import { liveOffsetLabel, TIMEZONE_OPTIONS } from "@/lib/timezone";
import { DEFAULT_CHART_SETTINGS, type ChartSettings, type DrawingLineStyle } from "@/types";
import {
  AlarmClock,
  ArrowLeftRight,
  Calendar,
  CandlestickChart,
  Keyboard,
  List,
  Move3d,
  Palette,
  Pencil,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

const TABS = [
  { id: "symbol", label: "Symbol", icon: CandlestickChart },
  { id: "status", label: "Status line", icon: List },
  { id: "scales", label: "Scales and lines", icon: Move3d },
  { id: "canvas", label: "Canvas", icon: Pencil },
  { id: "app", label: "App settings", icon: Palette },
  { id: "trading", label: "Trading", icon: ArrowLeftRight },
  { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
  { id: "alerts", label: "Alerts", icon: AlarmClock },
  { id: "events", label: "Events", icon: Calendar },
] as const;

type TabId = (typeof TABS)[number]["id"];

const inputClass = `${settingsUi.input} min-w-[140px]`;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <SettingsSection title={title}>{children}</SettingsSection>;
}

function Check({
  label,
  hint,
  checked,
  onChange,
  disabled,
  extra,
  indent,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  extra?: ReactNode;
  indent?: boolean;
}) {
  return (
    <SettingsCheck
      label={label}
      hint={hint}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      extra={extra}
      indent={indent}
    />
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <SettingsFieldRow label={label}>{children}</SettingsFieldRow>;
}

function ColorSwatch({
  value,
  onChange,
  disabled,
}: {
  value?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return <SettingsColorSwatch value={value} onChange={onChange} disabled={disabled} />;
}

function ColorPair({
  up,
  down,
  onUp,
  onDown,
  disabled,
}: {
  up: string;
  down: string;
  onUp: (v: string) => void;
  onDown: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <span className={`flex items-center gap-1 ${disabled ? "pointer-events-none opacity-40" : ""}`}>
      <ColorSwatch value={up} onChange={onUp} />
      <ColorSwatch value={down} onChange={onDown} />
    </span>
  );
}

export function SettingsModal() {
  const open = useAppStore((s) => s.settingsOpen);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const settings = useAppStore((s) => s.chartSettings);
  const patch = useAppStore((s) => s.patchChartSettings);
  const appSettings = useAppStore((s) => s.appSettings);
  const patchApp = useAppStore((s) => s.patchAppSettings);
  const setAppSettings = useAppStore((s) => s.setAppSettings);
  const templates = useAppStore((s) => s.chartTemplates);
  const applyChartTemplate = useAppStore((s) => s.applyChartTemplate);
  const saveChartTemplate = useAppStore((s) => s.saveChartTemplate);
  const [tab, setTab] = useState<TabId>("symbol");
  const [draft, setDraft] = useState<ChartSettings>(settings);
  const [appDraft, setAppDraft] = useState<AppSettings>(appSettings);
  const snapshot = useRef<ChartSettings>(settings);
  const appSnapshot = useRef<AppSettings>(appSettings);
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);
  const [tplOpen, setTplOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const state = useAppStore.getState();
    const merged = { ...DEFAULT_CHART_SETTINGS, ...state.chartSettings };
    snapshot.current = merged;
    setDraft(merged);
    const appMerged = normalizeAppSettings(state.appSettings);
    appSnapshot.current = appMerged;
    setAppDraft(appMerged);
    setTplOpen(false);
    setDragged(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (boxRef.current?.contains(target)) return;
      if (target.closest("[data-settings-trigger]")) return;
      if (target.closest("[data-color-picker-popover]")) return;
      setSettingsOpen(false);
    };
    // Defer so the click that opened the panel doesn't immediately close it
    const id = window.setTimeout(() => {
      window.addEventListener("mousedown", onDown, true);
    }, 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("mousedown", onDown, true);
    };
  }, [open, setSettingsOpen]);

  if (!open) return null;

  const update = (partial: Partial<ChartSettings>) => {
    const next = { ...DEFAULT_CHART_SETTINGS, ...draft, ...partial };
    setDraft(next);
    patch(partial);
  };

  const updateApp = (partial: Partial<AppSettings>) => {
    const next = normalizeAppSettings({ ...appDraft, ...partial });
    setAppDraft(next);
    patchApp(partial);
  };

  const close = () => setSettingsOpen(false);
  const cancel = () => {
    patch(snapshot.current);
    setDraft(snapshot.current);
    setAppSettings(appSnapshot.current);
    setAppDraft(appSnapshot.current);
    close();
  };

  const startDrag = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    const rect = boxRef.current?.getBoundingClientRect();
    const originX = rect?.left ?? pos.x;
    const originY = rect?.top ?? pos.y;
    setDragged(true);
    setPos({ x: originX, y: originY });
    const startX = event.clientX - originX;
    const startY = event.clientY - originY;
    const move = (ev: globalThis.MouseEvent) => {
      const x = Math.min(window.innerWidth - 80, Math.max(8, ev.clientX - startX));
      const y = Math.min(window.innerHeight - 48, Math.max(8, ev.clientY - startY));
      setPos({ x, y });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      ref={boxRef}
      data-settings-panel
      data-dropdown-open
      className="fixed z-[70] flex w-[560px] max-h-[calc(100vh-168px)] items-start overflow-hidden rounded-[8px] bg-[var(--app-elevated)] shadow-[0_8px_28px_rgba(0,0,0,0.65)]"
      style={
        dragged
          ? { left: pos.x, top: pos.y }
          : { left: "50%", top: 160, transform: "translateX(-50%)" }
      }
      onMouseDown={(e) => e.stopPropagation()}
    >
      <nav className="w-[168px] shrink-0 border-r border-[#2a2e39] py-2">
        {TABS.map((item) => {
          const Icon = item.icon;
          const on = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={settingsUi.navItem(on)}
            >
              <Icon size={15} className="shrink-0 text-[#787b86]" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="flex max-h-[calc(100vh-168px)] min-w-0 flex-1 flex-col overflow-hidden">
        <div
          className="flex h-12 shrink-0 cursor-move items-center justify-between border-b border-[#2a2e39] px-5"
          onMouseDown={startDrag}
        >
          <span className={settingsUi.title}>Settings</span>
          <button
            type="button"
            className={settingsUi.closeBtn}
            onClick={close}
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {tab === "symbol" && (
            <>
              <Section title="Candles">
                <Check
                  label="Color bars based on previous close"
                  checked={draft.colorBasedOnPrevClose}
                  onChange={(colorBasedOnPrevClose) => update({ colorBasedOnPrevClose })}
                />
                <Check
                  label="Body"
                  checked={draft.bodyVisible}
                  onChange={(bodyVisible) => update({ bodyVisible })}
                  extra={
                    <ColorPair
                      up={draft.bodyUpColor}
                      down={draft.bodyDownColor}
                      onUp={(bodyUpColor) => update({ bodyUpColor })}
                      onDown={(bodyDownColor) => update({ bodyDownColor })}
                      disabled={!draft.bodyVisible}
                    />
                  }
                />
                <Check
                  label="Borders"
                  checked={draft.borderVisible}
                  onChange={(borderVisible) => update({ borderVisible })}
                  extra={
                    <ColorPair
                      up={draft.borderUpColor}
                      down={draft.borderDownColor}
                      onUp={(borderUpColor) => update({ borderUpColor })}
                      onDown={(borderDownColor) => update({ borderDownColor })}
                      disabled={!draft.borderVisible}
                    />
                  }
                />
                <Check
                  label="Wick"
                  checked={draft.wickVisible}
                  onChange={(wickVisible) => update({ wickVisible })}
                  extra={
                    <ColorPair
                      up={draft.wickUpColor}
                      down={draft.wickDownColor}
                      onUp={(wickUpColor) => update({ wickUpColor })}
                      onDown={(wickDownColor) => update({ wickDownColor })}
                      disabled={!draft.wickVisible}
                    />
                  }
                />
              </Section>
              <Section title="Data modification">
                <Field label="Precision">
                  <select
                    className={inputClass}
                    value={draft.pricePrecision}
                    onChange={(e) =>
                      update({ pricePrecision: e.target.value as ChartSettings["pricePrecision"] })
                    }
                  >
                    <option value="default">Default</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                  </select>
                </Field>
                <Field label="Timezone">
                  <select
                    className={inputClass}
                    value={draft.timezone}
                    onChange={(e) => update({ timezone: e.target.value })}
                  >
                    {TIMEZONE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.iana === "UTC"
                          ? "UTC"
                          : `(${liveOffsetLabel(opt.iana)}) ${opt.city}`}
                      </option>
                    ))}
                  </select>
                </Field>
              </Section>
            </>
          )}

          {tab === "status" && (
            <>
              <Section title="Instrument">
                <Check
                  label="Logo"
                  checked={draft.showLogo}
                  onChange={(showLogo) => update({ showLogo })}
                />
                <Check
                  label="Title"
                  checked={draft.showTitle}
                  onChange={(showTitle) => update({ showTitle, showLegend: showTitle || draft.showChartValues })}
                  extra={
                    <select
                      className={inputClass}
                      disabled={!draft.showTitle}
                      value={draft.titleMode}
                      onChange={(e) =>
                        update({ titleMode: e.target.value as ChartSettings["titleMode"] })
                      }
                    >
                      <option value="symbol">Symbol</option>
                      <option value="description">Description</option>
                    </select>
                  }
                />
                <Check
                  label="Open market status"
                  checked={draft.showMarketStatus}
                  onChange={(showMarketStatus) => update({ showMarketStatus })}
                />
                <Check
                  label="Chart values"
                  checked={draft.showChartValues}
                  onChange={(showChartValues) =>
                    update({ showChartValues, showLegend: draft.showTitle || showChartValues })
                  }
                />
                <Check
                  label="Bar change values"
                  checked={draft.showBarChange}
                  onChange={(showBarChange) => update({ showBarChange })}
                />
                <Check
                  label="Volume"
                  checked={draft.showVolume}
                  onChange={(showVolume) => update({ showVolume })}
                />
                <Check
                  label="Last day change values"
                  checked={draft.showLastDayChange}
                  onChange={(showLastDayChange) => update({ showLastDayChange })}
                />
              </Section>
              <Section title="Indicators">
                <Check
                  label="Titles"
                  checked={draft.showIndicatorLegend}
                  onChange={(showIndicatorLegend) => update({ showIndicatorLegend })}
                />
                <Check
                  label="Inputs"
                  indent
                  checked={draft.showIndicatorInputs}
                  onChange={(showIndicatorInputs) => update({ showIndicatorInputs })}
                  disabled={!draft.showIndicatorLegend}
                />
                <Check
                  label="Values"
                  checked={draft.showIndicatorValues}
                  onChange={(showIndicatorValues) => update({ showIndicatorValues })}
                />
                <Check
                  label="Background"
                  checked={draft.showIndicatorBackground}
                  onChange={(showIndicatorBackground) => update({ showIndicatorBackground })}
                  extra={
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draft.indicatorBackgroundOpacity}
                      disabled={!draft.showIndicatorBackground}
                      onChange={(e) =>
                        update({ indicatorBackgroundOpacity: Number(e.target.value) })
                      }
                      className="w-28 accent-[#2962ff]"
                    />
                  }
                />
              </Section>
            </>
          )}

          {tab === "scales" && (
            <>
              <Section title="Price scale">
                <Field label="Currency and Unit">
                  <select
                    className={inputClass}
                    value={draft.currencyUnit}
                    onChange={(e) =>
                      update({ currencyUnit: e.target.value as ChartSettings["currencyUnit"] })
                    }
                  >
                    <option value="always">Always visible</option>
                    <option value="hover">On hover</option>
                    <option value="never">Always invisible</option>
                  </select>
                </Field>
                <Field label="Scale modes (A and L)">
                  <select
                    className={inputClass}
                    value={draft.scaleModes}
                    onChange={(e) =>
                      update({ scaleModes: e.target.value as ChartSettings["scaleModes"] })
                    }
                  >
                    <option value="always">Always visible</option>
                    <option value="hover">On hover</option>
                    <option value="never">Always invisible</option>
                  </select>
                </Field>
                <Check
                  label="Logarithmic scale"
                  checked={draft.logScale}
                  onChange={(logScale) => update({ logScale })}
                />
                <Check
                  label="Lock price to bar ratio"
                  checked={draft.lockPriceRatio}
                  onChange={(lockPriceRatio) => update({ lockPriceRatio })}
                />
                <Field label="Scales placement">
                  <select
                    className={inputClass}
                    value={draft.scalesPlacement}
                    onChange={(e) =>
                      update({
                        scalesPlacement: e.target.value as ChartSettings["scalesPlacement"],
                      })
                    }
                  >
                    <option value="right">Stack on the right</option>
                    <option value="left">Stack on the left</option>
                    <option value="both">Left and right</option>
                  </select>
                </Field>
              </Section>
              <Section title="Price labels & lines">
                <Check
                  label="No overlapping labels"
                  checked={draft.noOverlappingLabels}
                  onChange={(noOverlappingLabels) => update({ noOverlappingLabels })}
                />
                <Check
                  label="Plus button"
                  checked={draft.showPlusButton}
                  onChange={(showPlusButton) => update({ showPlusButton })}
                />
                <Check
                  label="Countdown to bar close"
                  checked={draft.countdownToBarClose}
                  onChange={(countdownToBarClose) => update({ countdownToBarClose })}
                />
                <Field label="Symbol">
                  <select
                    className={inputClass}
                    value={draft.lastPriceDisplay}
                    onChange={(e) =>
                      update({
                        lastPriceDisplay: e.target.value as ChartSettings["lastPriceDisplay"],
                      })
                    }
                  >
                    <option value="value_line">Value, line</option>
                    <option value="value">Value</option>
                    <option value="line">Line</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </Field>
                <Field label="Previous day close">
                  <select
                    className={inputClass}
                    value={draft.prevDayClose}
                    onChange={(e) =>
                      update({ prevDayClose: e.target.value as ChartSettings["prevDayClose"] })
                    }
                  >
                    <option value="hidden">Hidden</option>
                    <option value="value">Value</option>
                    <option value="line">Line</option>
                  </select>
                </Field>
                <Field label="High and low">
                  <select
                    className={inputClass}
                    value={draft.highLowDisplay}
                    onChange={(e) =>
                      update({
                        highLowDisplay: e.target.value as ChartSettings["highLowDisplay"],
                      })
                    }
                  >
                    <option value="hidden">Hidden</option>
                    <option value="value">Value</option>
                    <option value="line">Line</option>
                  </select>
                </Field>
                <Field label="Bid and ask">
                  <select
                    className={inputClass}
                    value={draft.bidAskDisplay}
                    onChange={(e) =>
                      update({ bidAskDisplay: e.target.value as ChartSettings["bidAskDisplay"] })
                    }
                  >
                    <option value="hidden">Hidden</option>
                    <option value="value">Value</option>
                    <option value="line">Line</option>
                  </select>
                </Field>
              </Section>
              <Section title="Time scale">
                <Check
                  label="Day of week on labels"
                  checked={draft.dayOfWeekOnLabels}
                  onChange={(dayOfWeekOnLabels) => update({ dayOfWeekOnLabels })}
                />
                <Field label="Date format">
                  <select
                    className={inputClass}
                    value={draft.dateFormat}
                    onChange={(e) =>
                      update({ dateFormat: e.target.value as ChartSettings["dateFormat"] })
                    }
                  >
                    <option value="MMM dd, yyyy">Sep 29, 1997</option>
                    <option value="yyyy-MM-dd">1997-09-29</option>
                    <option value="dd/MM/yyyy">29/09/1997</option>
                    <option value="MM/dd/yyyy">09/29/1997</option>
                  </select>
                </Field>
                <Field label="Time hours format">
                  <select
                    className={inputClass}
                    value={draft.timeHoursFormat}
                    onChange={(e) =>
                      update({
                        timeHoursFormat: e.target.value as ChartSettings["timeHoursFormat"],
                      })
                    }
                  >
                    <option value="12">12-hours</option>
                    <option value="24">24-hours</option>
                  </select>
                </Field>
              </Section>
            </>
          )}

          {tab === "canvas" && (
            <>
              <Section title="Chart basic styles">
                <Field label="Background">
                  <span className="flex items-center gap-2">
                    <select className={inputClass} value="solid" disabled>
                      <option value="solid">Solid</option>
                    </select>
                    <ColorSwatch
                      value={draft.backgroundColor}
                      onChange={(backgroundColor) => update({ backgroundColor })}
                    />
                  </span>
                </Field>
                <Check
                  label="Vertical grid lines"
                  checked={draft.vertGrid}
                  onChange={(vertGrid) => update({ vertGrid })}
                  extra={
                    <ColorSwatch
                      value={draft.vertGridColor}
                      onChange={(vertGridColor) => update({ vertGridColor })}
                      disabled={!draft.vertGrid}
                    />
                  }
                />
                <Check
                  label="Horizontal grid lines"
                  checked={draft.grid}
                  onChange={(grid) => update({ grid })}
                  extra={
                    <ColorSwatch
                      value={draft.horzGridColor}
                      onChange={(horzGridColor) => update({ horzGridColor })}
                      disabled={!draft.grid}
                    />
                  }
                />
                <Field label="Pane separators">
                  <ColorSwatch
                    value={draft.paneSeparatorColor}
                    onChange={(paneSeparatorColor) => update({ paneSeparatorColor })}
                  />
                </Field>
                <Field label="Crosshair">
                  <span className="flex items-center gap-2">
                    <ColorSwatch
                      value={draft.crosshairColor}
                      onChange={(crosshairColor) => update({ crosshairColor })}
                    />
                    <select
                      className={inputClass}
                      value={draft.crosshairStyle}
                      onChange={(e) =>
                        update({
                          crosshairStyle: e.target.value as ChartSettings["crosshairStyle"],
                        })
                      }
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </span>
                </Field>
                <Field label="Watermark">
                  <span className="flex items-center gap-2">
                    <select
                      className={inputClass}
                      value={draft.watermark ? "visible" : "hidden"}
                      onChange={(e) => update({ watermark: e.target.value === "visible" })}
                    >
                      <option value="hidden">Hidden</option>
                      <option value="visible">Visible</option>
                    </select>
                    <ColorSwatch
                      value={draft.watermarkColor}
                      onChange={(watermarkColor) => update({ watermarkColor })}
                      disabled={!draft.watermark}
                    />
                  </span>
                </Field>
              </Section>
              <Section title="Scales">
                <Field label="Text">
                  <span className="flex items-center gap-2">
                    <ColorSwatch
                      value={draft.scaleTextColor}
                      onChange={(scaleTextColor) => update({ scaleTextColor })}
                    />
                    <select
                      className={inputClass}
                      value={String(draft.scaleFontSize)}
                      onChange={(e) => update({ scaleFontSize: Number(e.target.value) || 12 })}
                    >
                      {[10, 11, 12, 13, 14, 16].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </span>
                </Field>
                <Field label="Lines">
                  <ColorSwatch
                    value={draft.scaleLineColor}
                    onChange={(scaleLineColor) => update({ scaleLineColor })}
                  />
                </Field>
              </Section>
              <Section title="Buttons">
                <Field label="Navigation">
                  <select
                    className={inputClass}
                    value={draft.navigationButtons}
                    onChange={(e) =>
                      update({
                        navigationButtons: e.target.value as ChartSettings["navigationButtons"],
                      })
                    }
                  >
                    <option value="always">Always visible</option>
                    <option value="hover">Visible near navigation area</option>
                    <option value="never">Always invisible</option>
                  </select>
                </Field>
                <Field label="Pane">
                  <select
                    className={inputClass}
                    value={draft.paneButtons}
                    onChange={(e) =>
                      update({ paneButtons: e.target.value as ChartSettings["paneButtons"] })
                    }
                  >
                    <option value="always">Always visible</option>
                    <option value="hover">Visible on mouse over</option>
                    <option value="never">Always invisible</option>
                  </select>
                </Field>
              </Section>
              <Section title="Margins">
                <Field label="Top">
                  <span className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={40}
                      className={`${inputClass} w-16`}
                      value={draft.marginTop}
                      onChange={(e) => update({ marginTop: Number(e.target.value) || 0 })}
                    />
                    <span className="text-[12px] text-[#787b86]">%</span>
                  </span>
                </Field>
                <Field label="Bottom">
                  <span className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={40}
                      className={`${inputClass} w-16`}
                      value={draft.marginBottom}
                      onChange={(e) => update({ marginBottom: Number(e.target.value) || 0 })}
                    />
                    <span className="text-[12px] text-[#787b86]">%</span>
                  </span>
                </Field>
                <Field label="Right">
                  <span className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      className={`${inputClass} w-16`}
                      value={draft.marginRightBars}
                      onChange={(e) => update({ marginRightBars: Number(e.target.value) || 0 })}
                    />
                    <span className="text-[12px] text-[#787b86]">bars</span>
                  </span>
                </Field>
              </Section>
            </>
          )}

          {tab === "app" && (
            <>
              <Section title="Chrome colors">
                <p className="mb-3 text-[12px] leading-[16px] text-[var(--app-muted)]">
                  Colors for panes, panels, watchlist, menus, and the rest of the app shell. Chart
                  candles and grid stay under Canvas settings.
                </p>
                <Field label="Background">
                  <ColorSwatch
                    value={appDraft.backgroundColor}
                    onChange={(backgroundColor) => updateApp({ backgroundColor })}
                  />
                </Field>
                <Field label="Panels">
                  <ColorSwatch
                    value={appDraft.panelColor}
                    onChange={(panelColor) => updateApp({ panelColor })}
                  />
                </Field>
                <Field label="Elevated surfaces">
                  <ColorSwatch
                    value={appDraft.elevatedColor}
                    onChange={(elevatedColor) => updateApp({ elevatedColor })}
                  />
                </Field>
                <Field label="Borders">
                  <ColorSwatch
                    value={appDraft.borderColor}
                    onChange={(borderColor) => updateApp({ borderColor })}
                  />
                </Field>
                <Field label="Hover">
                  <ColorSwatch
                    value={appDraft.hoverColor}
                    onChange={(hoverColor) => updateApp({ hoverColor })}
                  />
                </Field>
                <Field label="Text">
                  <ColorSwatch
                    value={appDraft.textColor}
                    onChange={(textColor) => updateApp({ textColor })}
                  />
                </Field>
                <Field label="Muted text">
                  <ColorSwatch
                    value={appDraft.mutedColor}
                    onChange={(mutedColor) => updateApp({ mutedColor })}
                  />
                </Field>
              </Section>
              <Section title="Reset">
                <SettingsBtn
                  onClick={() => {
                    setAppSettings(DEFAULT_APP_SETTINGS);
                    setAppDraft(DEFAULT_APP_SETTINGS);
                  }}
                >
                  Reset app colors
                </SettingsBtn>
              </Section>
            </>
          )}

          {tab === "trading" && (
            <>
              <Section title="General">
                <Check
                  label="Buy/sell buttons"
                  hint="Displays buy and sell buttons directly on the chart"
                  checked={draft.showBuySell}
                  onChange={(showBuySell) => update({ showBuySell })}
                />
                <Check
                  label="One-click trading"
                  hint="Instantly place, edit, cancel orders, or close positions without confirmation"
                  checked={draft.oneClickTrading}
                  onChange={(oneClickTrading) => update({ oneClickTrading })}
                />
                <Check
                  label="Execution sound"
                  checked={draft.executionSound}
                  onChange={(executionSound) => update({ executionSound })}
                  extra={
                    <span className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={draft.executionSoundVolume}
                        disabled={!draft.executionSound}
                        onChange={(e) =>
                          update({ executionSoundVolume: Number(e.target.value) })
                        }
                        className="w-20 accent-[#2962ff]"
                      />
                      <select
                        className={inputClass}
                        disabled={!draft.executionSound}
                        value={draft.executionSoundName}
                        onChange={(e) =>
                          update({
                            executionSoundName: e.target
                              .value as ChartSettings["executionSoundName"],
                          })
                        }
                      >
                        <option value="alarm">Alarm Clock</option>
                        <option value="beep">Beep</option>
                        <option value="chime">Chime</option>
                      </select>
                    </span>
                  }
                />
                <Check
                  label="Show only rejection notifications"
                  checked={draft.showOnlyRejectionNotifications}
                  onChange={(showOnlyRejectionNotifications) =>
                    update({ showOnlyRejectionNotifications })
                  }
                />
              </Section>
              <Section title="Appearance">
                <Check
                  label="Positions and orders"
                  checked={draft.showPositionLines && draft.showOrderLines}
                  onChange={(on) =>
                    update({ showPositionLines: on, showOrderLines: on })
                  }
                />
                <Check
                  label="Reverse position button"
                  hint="Adds the reverse button next to the open position on the chart"
                  indent
                  checked={draft.reversePositionButton}
                  onChange={(reversePositionButton) => update({ reversePositionButton })}
                  disabled={!draft.showPositionLines}
                />
                <Check
                  label="Take profit / stop loss"
                  checked={draft.showTpSlLines}
                  onChange={(showTpSlLines) => update({ showTpSlLines })}
                  extra={
                    <span className="flex items-center gap-1">
                      <ColorSwatch
                        value={draft.tpLineColor}
                        onChange={(tpLineColor) => update({ tpLineColor })}
                      />
                      <ColorSwatch
                        value={draft.slLineColor}
                        onChange={(slLineColor) => update({ slLineColor })}
                      />
                    </span>
                  }
                />
                <Check
                  label="Liquidation"
                  checked={draft.showLiqLines}
                  onChange={(showLiqLines) => update({ showLiqLines })}
                  extra={
                    <ColorSwatch
                      value={draft.liqLineColor}
                      onChange={(liqLineColor) => update({ liqLineColor })}
                    />
                  }
                />
                <Check
                  label="Project order for market orders"
                  hint="Shows a project order on the chart before sending a market order"
                  checked={draft.projectMarketOrders}
                  onChange={(projectMarketOrders) => update({ projectMarketOrders })}
                />
                <Check
                  label="Profit and loss value"
                  checked={draft.showPnlValue}
                  onChange={(showPnlValue) => update({ showPnlValue })}
                />
                <Check
                  label="Positions"
                  indent
                  checked={draft.showPnlValue}
                  onChange={(showPnlValue) => update({ showPnlValue })}
                  disabled={!draft.showPnlValue}
                  extra={
                    <select
                      className={inputClass}
                      value={draft.pnlPositionsFormat}
                      disabled={!draft.showPnlValue}
                      onChange={(e) =>
                        update({
                          pnlPositionsFormat: e.target.value as ChartSettings["pnlPositionsFormat"],
                        })
                      }
                    >
                      <option value="pct">%</option>
                      <option value="currency">Money</option>
                    </select>
                  }
                />
                <Check
                  label="Brackets"
                  indent
                  checked={draft.showPnlValue}
                  onChange={(showPnlValue) => update({ showPnlValue })}
                  disabled={!draft.showPnlValue}
                  extra={
                    <select
                      className={inputClass}
                      value={draft.pnlBracketsFormat}
                      disabled={!draft.showPnlValue}
                      onChange={(e) =>
                        update({
                          pnlBracketsFormat: e.target.value as ChartSettings["pnlBracketsFormat"],
                        })
                      }
                    >
                      <option value="pct">%</option>
                      <option value="currency">Money</option>
                    </select>
                  }
                />
                <Check
                  label="Execution marks"
                  checked={draft.executionMarks}
                  onChange={(executionMarks) => update({ executionMarks })}
                />
                <Check
                  label="Execution labels"
                  indent
                  checked={draft.executionLabels}
                  onChange={(executionLabels) => update({ executionLabels })}
                  disabled={!draft.executionMarks}
                />
                <Check
                  label="Extended price lines across the entire chart width"
                  checked={draft.extendedPriceLines}
                  onChange={(extendedPriceLines) => update({ extendedPriceLines })}
                />
                <Field label="Order and position alignment">
                  <select
                    className={inputClass}
                    value={draft.orderAlignment}
                    onChange={(e) =>
                      update({
                        orderAlignment: e.target.value as ChartSettings["orderAlignment"],
                      })
                    }
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                  </select>
                </Field>
                <Check
                  label="Orders, executions, and positions in chart snapshots"
                  hint="Shows your trades on the chart in snapshots"
                  checked={draft.includeTradesInSnapshots}
                  onChange={(includeTradesInSnapshots) => update({ includeTradesInSnapshots })}
                />
                <Field label="Order size">
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    className={`${inputClass} w-24`}
                    value={draft.defaultQty}
                    onChange={(e) => update({ defaultQty: Number(e.target.value) || 0.01 })}
                  />
                </Field>
                <Field label="Leverage">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    className={`${inputClass} w-24`}
                    value={draft.defaultLeverage}
                    onChange={(e) => update({ defaultLeverage: Number(e.target.value) || 10 })}
                  />
                </Field>
              </Section>
            </>
          )}

          {tab === "shortcuts" && <KeyboardShortcutsPanel active={tab === "shortcuts"} />}

          {tab === "alerts" && (
            <Section title="Chart line visibility">
              <Check
                label="Alert lines"
                checked={draft.showAlertLines}
                onChange={(showAlertLines) => update({ showAlertLines })}
                extra={
                  <ColorSwatch
                    value={draft.alertLineColor}
                    onChange={(alertLineColor) => update({ alertLineColor })}
                  />
                }
              />
            </Section>
          )}

          {tab === "events" && (
            <Section title="Events">
              <Check
                label="Ideas"
                checked={draft.showIdeas}
                onChange={(showIdeas) => update({ showIdeas })}
                extra={
                  <select
                    className={inputClass}
                    disabled={!draft.showIdeas}
                    value={draft.ideasFilter}
                    onChange={(e) =>
                      update({ ideasFilter: e.target.value as ChartSettings["ideasFilter"] })
                    }
                  >
                    <option value="all">All ideas</option>
                    <option value="following">Following</option>
                    <option value="mine">My ideas</option>
                  </select>
                }
              />
              <Check
                label="Session breaks"
                checked={draft.sessionBreaks}
                onChange={(sessionBreaks) => update({ sessionBreaks })}
                extra={
                  <div className="flex flex-wrap items-center gap-1.5">
                    <ColorSwatch
                      value={draft.sessionBreakColor}
                      onChange={(sessionBreakColor) => update({ sessionBreakColor })}
                      disabled={!draft.sessionBreaks}
                    />
                    <select
                      className={`${settingsUi.input} h-7 w-[64px] px-1.5 text-[12px]`}
                      value={draft.sessionBreakLineWidth}
                      disabled={!draft.sessionBreaks}
                      onChange={(e) =>
                        update({
                          sessionBreakLineWidth: Number(e.target.value) as 1 | 2 | 3 | 4,
                        })
                      }
                      title="Line width"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}px
                        </option>
                      ))}
                    </select>
                    <select
                      className={`${settingsUi.input} h-7 min-w-[88px] px-1.5 text-[12px]`}
                      value={draft.sessionBreakLineStyle}
                      disabled={!draft.sessionBreaks}
                      onChange={(e) =>
                        update({
                          sessionBreakLineStyle: e.target.value as DrawingLineStyle,
                        })
                      }
                      title="Line style"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                }
              />
              <Check
                label="Economic events"
                checked={draft.economicEvents}
                onChange={(economicEvents) => update({ economicEvents })}
              />
              <Check
                label="Only future events"
                indent
                checked={draft.onlyFutureEvents}
                onChange={(onlyFutureEvents) => update({ onlyFutureEvents })}
                disabled={!draft.economicEvents}
              />
              <Check
                label="Events breaks"
                indent
                checked={draft.eventsBreaks}
                onChange={(eventsBreaks) => update({ eventsBreaks })}
                disabled={!draft.economicEvents}
                extra={
                  <ColorSwatch
                    value={draft.eventsBreakColor}
                    onChange={(eventsBreakColor) => update({ eventsBreakColor })}
                    disabled={!draft.economicEvents || !draft.eventsBreaks}
                  />
                }
              />
              <Check
                label="Latest news"
                checked={draft.latestNews}
                onChange={(latestNews) => update({ latestNews })}
              />
              <Check
                label="News notification"
                checked={draft.newsNotification}
                onChange={(newsNotification) => update({ newsNotification })}
              />
            </Section>
          )}
        </div>

        <div className="relative flex shrink-0 items-center justify-between border-t border-[#2a2e39] px-5 py-3.5">
          <div className="relative">
            <SettingsBtn onClick={() => setTplOpen(!tplOpen)}>Template ▾</SettingsBtn>
            {tplOpen && (
              <div className="absolute bottom-10 left-0 z-10 min-w-[160px] rounded-[6px] border border-[#2a2e39] bg-[#1b1b1b] py-1 shadow-lg">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="block w-full px-3 py-1.5 text-left text-[12px] text-[#d1d4dc] hover:bg-[#2a2e39]"
                    onClick={() => {
                      applyChartTemplate(t.id);
                      setDraft({ ...DEFAULT_CHART_SETTINGS, ...t.settings });
                      setTplOpen(false);
                    }}
                  >
                    {t.name}
                  </button>
                ))}
                <button
                  type="button"
                  className="block w-full px-3 py-1.5 text-left text-[12px] text-[#d1d4dc] hover:bg-[#2a2e39]"
                  onClick={() => {
                    const name = window.prompt("Template name", "My template");
                    if (name) saveChartTemplate(name);
                    setTplOpen(false);
                  }}
                >
                  Save current…
                </button>
                <button
                  type="button"
                  className="block w-full px-3 py-1.5 text-left text-[12px] text-[#d1d4dc] hover:bg-[#2a2e39]"
                  onClick={() => {
                    patch(DEFAULT_CHART_SETTINGS);
                    setDraft(DEFAULT_CHART_SETTINGS);
                    setTplOpen(false);
                  }}
                >
                  Defaults
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <SettingsBtn onClick={cancel}>Cancel</SettingsBtn>
            <SettingsBtn variant="primary" onClick={close}>
              Ok
            </SettingsBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
