"use client";

import { VisibilitySettingsPanel } from "@/components/settings/VisibilitySettingsPanel";
import {
  SettingsBody,
  SettingsBtn,
  SettingsCheck,
  SettingsColorSwatch,
  SettingsFieldRow,
  SettingsFooter,
  SettingsHeader,
  SettingsSection,
  SettingsTabs,
  settingsUi,
} from "@/components/settings/settings-ui";
import { indicatorTitle } from "@/lib/indicators";
import { cloneStudySettings } from "@/lib/studies";
import { useAppStore } from "@/lib/store";
import { cloneVisibility } from "@/lib/visibility";
import {
  DEFAULT_INDICATOR_SETTINGS,
  type AdxIndicatorSettings,
  type AtrIndicatorSettings,
  type BbIndicatorSettings,
  type DrawingLineStyle,
  type EmaIndicatorSettings,
  type IndicatorId,
  type IndicatorLineStyleSettings,
  type IndicatorLineWidth,
  type IndicatorSettingsMap,
  type MaSource,
  type ObIndicatorSettings,
  type PmoIndicatorSettings,
  type RsiIndicatorSettings,
  type StochBandSettings,
  type StochIndicatorSettings,
  type VolumeIndicatorSettings,
  type VolumePlotStyle,
  type VwapIndicatorSettings,
  normalizeBbSettings,
  normalizeEmaSettings,
  normalizeObSettings,
  normalizePmoSettings,
  normalizeStochSettings,
  normalizeVolumeSettings,
  normalizeVwapSettings,
} from "@/types";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

type Tab = "inputs" | "style" | "visibility";

const inputClass = settingsUi.inputSm;

function VolumePlotStyleSelect({
  value,
  onChange,
}: {
  value: VolumePlotStyle;
  onChange: (v: VolumePlotStyle) => void;
}) {
  return (
    <select
      className={`${settingsUi.select} min-w-[118px]`}
      value={value}
      title="Volume plot style"
      onChange={(e) => onChange(e.target.value as VolumePlotStyle)}
    >
      <option value="histogram">Histogram</option>
      <option value="line">Line</option>
      <option value="candle">Candle</option>
    </select>
  );
}

function LineStyleSelect({
  value,
  onChange,
}: {
  value: DrawingLineStyle;
  onChange: (v: DrawingLineStyle) => void;
}) {
  return (
    <select
      className={inputClass}
      value={value}
      onChange={(e) => onChange(e.target.value as DrawingLineStyle)}
    >
      <option value="solid">Solid</option>
      <option value="dashed">Dashed</option>
      <option value="dotted">Dotted</option>
    </select>
  );
}

function LineWidthSelect({
  value,
  onChange,
}: {
  value: IndicatorLineWidth;
  onChange: (v: IndicatorLineWidth) => void;
}) {
  return (
    <select
      className={inputClass}
      value={value}
      onChange={(e) => onChange(Number(e.target.value) as IndicatorLineWidth)}
    >
      {[1, 2, 3, 4].map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
}

function LineAppearanceFields({
  label,
  value,
  onChange,
  fillOnly = false,
}: {
  label?: string;
  value: IndicatorLineStyleSettings;
  onChange: (v: IndicatorLineStyleSettings) => void;
  fillOnly?: boolean;
}) {
  return (
    <div className={label ? "mb-3 border-b border-[#2a2e39] pb-2" : undefined}>
      {label ? (
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#787b86]">
          {label}
        </div>
      ) : null}
      <SettingsFieldRow label="Color">
        <SettingsColorSwatch
          value={value.color}
          opacity={value.opacity}
          onChange={(color) => onChange({ ...value, color })}
          onOpacityChange={(opacity) => onChange({ ...value, opacity })}
        />
      </SettingsFieldRow>
      {fillOnly ? null : (
        <>
          <SettingsFieldRow label="Line width">
            <LineWidthSelect
              value={value.lineWidth}
              onChange={(lineWidth) => onChange({ ...value, lineWidth })}
            />
          </SettingsFieldRow>
          <SettingsFieldRow label="Line style">
            <LineStyleSelect
              value={value.lineStyle}
              onChange={(lineStyle) => onChange({ ...value, lineStyle })}
            />
          </SettingsFieldRow>
        </>
      )}
    </div>
  );
}

function VolumeForm({
  value,
  onChange,
  tab,
}: {
  value: VolumeIndicatorSettings;
  onChange: (v: VolumeIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  const safe = normalizeVolumeSettings(value);

  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="MA Length">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={500}
            value={safe.maLength}
            onChange={(e) =>
              onChange({
                ...safe,
                maLength: Math.max(1, Math.min(500, Number(e.target.value) || 20)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsCheck
          label="Color based on previous close"
          checked={safe.colorBasedOnPreviousClose}
          onChange={(colorBasedOnPreviousClose) =>
            onChange({ ...safe, colorBasedOnPreviousClose })
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="py-1.5">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-white"
            checked={safe.volumeVisible}
            onChange={(e) => onChange({ ...safe, volumeVisible: e.target.checked })}
          />
          <span className="text-[13px] text-[#d1d4dc]">Volume</span>
          <VolumePlotStyleSelect
            value={safe.plotStyle ?? "histogram"}
            onChange={(plotStyle) => onChange({ ...safe, plotStyle })}
          />
        </div>
        <div className="mt-1.5 ml-6 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-[64px] shrink-0 text-[12px] text-[#787b86]">Growing</span>
            <SettingsColorSwatch
              value={safe.upColor}
              onChange={(upColor) => onChange({ ...safe, upColor })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[64px] shrink-0 text-[12px] text-[#787b86]">Falling</span>
            <SettingsColorSwatch
              value={safe.downColor}
              onChange={(downColor) => onChange({ ...safe, downColor })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 py-1.5">
        <input
          type="checkbox"
          className="accent-white"
          checked={safe.maVisible}
          onChange={(e) => onChange({ ...safe, maVisible: e.target.checked })}
        />
        <span className="w-[88px] shrink-0 text-[13px] text-[#d1d4dc]">Volume MA</span>
        <SettingsColorSwatch
          value={safe.maColor}
          opacity={safe.maOpacity}
          onChange={(maColor) => onChange({ ...safe, maColor })}
          onOpacityChange={(maOpacity) => onChange({ ...safe, maOpacity })}
        />
        <LineWidthSelect
          value={safe.maLineWidth}
          onChange={(maLineWidth) => onChange({ ...safe, maLineWidth })}
        />
        <LineStyleSelect
          value={safe.maLineStyle}
          onChange={(maLineStyle) => onChange({ ...safe, maLineStyle })}
        />
      </div>

      <div className="mt-4">
        <SettingsSection title="OUTPUT VALUES">
          <SettingsFieldRow label="Precision">
            <select
              className={inputClass}
              value={safe.precision === "default" ? "default" : String(safe.precision)}
              onChange={(e) => {
                const v = e.target.value;
                onChange({
                  ...safe,
                  precision: v === "default" ? "default" : Number(v),
                });
              }}
            >
              <option value="default">Default</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </SettingsFieldRow>
          <SettingsCheck
            label="Labels on price scale"
            checked={safe.showScaleValues}
            onChange={(showScaleValues) => onChange({ ...safe, showScaleValues })}
          />
          <SettingsCheck
            label="Values in status line"
            checked={safe.showStatusValues}
            onChange={(showStatusValues) => onChange({ ...safe, showStatusValues })}
          />
        </SettingsSection>
        <SettingsSection title="INPUT VALUES">
          <SettingsCheck
            label="Inputs in status line"
            checked={safe.showStatusInputs}
            onChange={(showStatusInputs) => onChange({ ...safe, showStatusInputs })}
          />
        </SettingsSection>
      </div>
    </div>
  );
}

function VwapForm({
  value,
  onChange,
  tab,
}: {
  value: VwapIndicatorSettings;
  onChange: (v: VwapIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  const safe = normalizeVwapSettings(value);

  if (tab === "inputs") {
    return (
      <div>
        <SettingsSection title="VWAP SETTINGS">
          <SettingsCheck
            label="Hide VWAP on 1D or Above"
            checked={safe.hideOn1DOrAbove}
            onChange={(hideOn1DOrAbove) => onChange({ ...safe, hideOn1DOrAbove })}
          />
          <SettingsFieldRow label="Anchor Period">
            <select
              className={inputClass}
              value={safe.anchorPeriod}
              onChange={(e) =>
                onChange({
                  ...safe,
                  anchorPeriod: e.target.value as VwapIndicatorSettings["anchorPeriod"],
                })
              }
            >
              <option value="session">Session</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </SettingsFieldRow>
          <SettingsFieldRow label="Source">
            <select
              className={inputClass}
              value={safe.source}
              onChange={(e) =>
                onChange({
                  ...safe,
                  source: e.target.value as VwapIndicatorSettings["source"],
                })
              }
            >
              <option value="hlc3">(H + L + C) / 3</option>
              <option value="ohlc4">(O + H + L + C) / 4</option>
              <option value="hl2">(H + L) / 2</option>
              <option value="close">Close</option>
              <option value="open">Open</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </SettingsFieldRow>
          <SettingsFieldRow label="Offset">
            <input
              className={inputClass}
              type="number"
              min={-500}
              max={500}
              value={safe.offset}
              onChange={(e) =>
                onChange({
                  ...safe,
                  offset: Math.max(-500, Math.min(500, Number(e.target.value) || 0)),
                })
              }
            />
          </SettingsFieldRow>
        </SettingsSection>

        <SettingsSection title="CALCULATION">
          <SettingsFieldRow label="Timeframe">
            <select className={inputClass} value={safe.timeframe} disabled>
              <option value="chart">Chart</option>
            </select>
          </SettingsFieldRow>
          <SettingsCheck
            label="Wait for timeframe closes"
            checked={safe.waitForTimeframeCloses}
            onChange={(waitForTimeframeCloses) => onChange({ ...safe, waitForTimeframeCloses })}
          />
        </SettingsSection>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 py-1.5">
        <input
          type="checkbox"
          className="accent-white"
          checked={safe.visible}
          onChange={(e) => onChange({ ...safe, visible: e.target.checked })}
        />
        <span className="w-[56px] shrink-0 text-[13px] text-[#d1d4dc]">VWAP</span>
        <SettingsColorSwatch
          value={safe.color}
          opacity={safe.opacity}
          onChange={(color) => onChange({ ...safe, color })}
          onOpacityChange={(opacity) => onChange({ ...safe, opacity })}
        />
        <LineWidthSelect
          value={safe.lineWidth}
          onChange={(lineWidth) => onChange({ ...safe, lineWidth })}
        />
        <LineStyleSelect
          value={safe.lineStyle}
          onChange={(lineStyle) => onChange({ ...safe, lineStyle })}
        />
      </div>

      <div className="mt-4">
        <SettingsSection title="OUTPUT VALUES">
          <SettingsFieldRow label="Precision">
            <select
              className={inputClass}
              value={safe.precision === "default" ? "default" : String(safe.precision)}
              onChange={(e) => {
                const v = e.target.value;
                onChange({
                  ...safe,
                  precision: v === "default" ? "default" : Number(v),
                });
              }}
            >
              <option value="default">Default</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </SettingsFieldRow>
          <SettingsCheck
            label="Labels on price scale"
            checked={safe.showScaleValues}
            onChange={(showScaleValues) => onChange({ ...safe, showScaleValues })}
          />
          <SettingsCheck
            label="Values in status line"
            checked={safe.showStatusValues}
            onChange={(showStatusValues) => onChange({ ...safe, showStatusValues })}
          />
        </SettingsSection>
        <SettingsSection title="INPUT VALUES">
          <SettingsCheck
            label="Inputs in status line"
            checked={safe.showStatusInputs}
            onChange={(showStatusInputs) => onChange({ ...safe, showStatusInputs })}
          />
        </SettingsSection>
      </div>
    </div>
  );
}

function EmaForm({
  value,
  onChange,
  tab,
}: {
  value: EmaIndicatorSettings;
  onChange: (v: EmaIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  const safe = normalizeEmaSettings(value);
  const smoothingOn = safe.smoothingType !== "none";

  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="Length">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={500}
            value={safe.period}
            onChange={(e) =>
              onChange({
                ...safe,
                period: Math.max(1, Math.min(500, Number(e.target.value) || 9)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Source">
          <select
            className={inputClass}
            value={safe.source}
            onChange={(e) =>
              onChange({ ...safe, source: e.target.value as EmaIndicatorSettings["source"] })
            }
          >
            <option value="close">Close</option>
            <option value="open">Open</option>
            <option value="high">High</option>
            <option value="low">Low</option>
            <option value="hl2">HL2</option>
            <option value="hlc3">HLC3</option>
            <option value="ohlc4">OHLC4</option>
          </select>
        </SettingsFieldRow>
        <SettingsFieldRow label="Offset">
          <input
            className={inputClass}
            type="number"
            min={-500}
            max={500}
            value={safe.offset}
            onChange={(e) =>
              onChange({
                ...safe,
                offset: Math.max(-500, Math.min(500, Number(e.target.value) || 0)),
              })
            }
          />
        </SettingsFieldRow>

        <div className="mt-4">
          <SettingsSection title="SMOOTHING">
            <SettingsFieldRow label="Type">
              <select
                className={inputClass}
                value={safe.smoothingType}
                onChange={(e) =>
                  onChange({
                    ...safe,
                    smoothingType: e.target.value as EmaIndicatorSettings["smoothingType"],
                  })
                }
              >
                <option value="none">None</option>
                <option value="sma">SMA</option>
                <option value="ema">EMA</option>
                <option value="smma">SMMA</option>
                <option value="wma">WMA</option>
              </select>
            </SettingsFieldRow>
            <SettingsFieldRow label="Length">
              <input
                className={inputClass}
                type="number"
                min={1}
                max={500}
                disabled={!smoothingOn}
                value={safe.smoothingLength}
                onChange={(e) =>
                  onChange({
                    ...safe,
                    smoothingLength: Math.max(1, Math.min(500, Number(e.target.value) || 14)),
                  })
                }
              />
            </SettingsFieldRow>
            <SettingsFieldRow label="BB StdDev">
              <input
                className={inputClass}
                type="number"
                min={0.1}
                max={10}
                step={0.1}
                disabled={!smoothingOn}
                value={safe.bbStdDev}
                onChange={(e) =>
                  onChange({
                    ...safe,
                    bbStdDev: Math.max(0.1, Math.min(10, Number(e.target.value) || 2)),
                  })
                }
              />
            </SettingsFieldRow>
          </SettingsSection>
        </div>

        <SettingsSection title="CALCULATION">
          <SettingsFieldRow label="Timeframe">
            <select className={inputClass} value={safe.timeframe} disabled>
              <option value="chart">Chart</option>
            </select>
          </SettingsFieldRow>
          <SettingsCheck
            label="Wait for timeframe closes"
            checked={safe.waitForTimeframeCloses}
            onChange={(waitForTimeframeCloses) => onChange({ ...safe, waitForTimeframeCloses })}
          />
        </SettingsSection>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 py-1.5">
        <input
          type="checkbox"
          className="accent-white"
          checked={safe.visible}
          onChange={(e) => onChange({ ...safe, visible: e.target.checked })}
        />
        <span className="w-[48px] shrink-0 text-[13px] text-[#d1d4dc]">EMA</span>
        <SettingsColorSwatch
          value={safe.color}
          opacity={safe.opacity}
          onChange={(color) => onChange({ ...safe, color })}
          onOpacityChange={(opacity) => onChange({ ...safe, opacity })}
        />
        <LineWidthSelect
          value={safe.lineWidth}
          onChange={(lineWidth) => onChange({ ...safe, lineWidth })}
        />
        <LineStyleSelect
          value={safe.lineStyle}
          onChange={(lineStyle) => onChange({ ...safe, lineStyle })}
        />
      </div>

      <div className="mt-4">
        <SettingsSection title="OUTPUT VALUES">
          <SettingsFieldRow label="Precision">
            <select
              className={inputClass}
              value={safe.precision === "default" ? "default" : String(safe.precision)}
              onChange={(e) => {
                const v = e.target.value;
                onChange({
                  ...safe,
                  precision: v === "default" ? "default" : Number(v),
                });
              }}
            >
              <option value="default">Default</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </SettingsFieldRow>
          <SettingsCheck
            label="Labels on price scale"
            checked={safe.showScaleValues}
            onChange={(showScaleValues) => onChange({ ...safe, showScaleValues })}
          />
          <SettingsCheck
            label="Values in status line"
            checked={safe.showStatusValues}
            onChange={(showStatusValues) => onChange({ ...safe, showStatusValues })}
          />
        </SettingsSection>
        <SettingsSection title="INPUT VALUES">
          <SettingsCheck
            label="Inputs in status line"
            checked={safe.showStatusInputs}
            onChange={(showStatusInputs) => onChange({ ...safe, showStatusInputs })}
          />
        </SettingsSection>
      </div>
    </div>
  );
}

function BbForm({
  value,
  onChange,
  tab,
}: {
  value: BbIndicatorSettings;
  onChange: (v: BbIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  const safe = normalizeBbSettings(value);

  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="Length">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={500}
            value={safe.period}
            onChange={(e) =>
              onChange({
                ...safe,
                period: Math.max(1, Math.min(500, Number(e.target.value) || 20)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Basis MA Type">
          <select
            className={inputClass}
            value={safe.maType}
            onChange={(e) =>
              onChange({
                ...safe,
                maType: e.target.value as BbIndicatorSettings["maType"],
              })
            }
          >
            <option value="sma">SMA</option>
            <option value="ema">EMA</option>
            <option value="smma">SMMA</option>
            <option value="wma">WMA</option>
          </select>
        </SettingsFieldRow>
        <SettingsFieldRow label="Source">
          <select
            className={inputClass}
            value={safe.source}
            onChange={(e) =>
              onChange({
                ...safe,
                source: e.target.value as BbIndicatorSettings["source"],
              })
            }
          >
            <option value="close">Close</option>
            <option value="open">Open</option>
            <option value="high">High</option>
            <option value="low">Low</option>
            <option value="hl2">HL2</option>
            <option value="hlc3">HLC3</option>
            <option value="ohlc4">OHLC4</option>
          </select>
        </SettingsFieldRow>
        <SettingsFieldRow label="StdDev">
          <input
            className={inputClass}
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={safe.mult}
            onChange={(e) =>
              onChange({
                ...safe,
                mult: Math.max(0.1, Math.min(10, Number(e.target.value) || 2)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Offset">
          <input
            className={inputClass}
            type="number"
            min={-500}
            max={500}
            value={safe.offset}
            onChange={(e) =>
              onChange({
                ...safe,
                offset: Math.max(-500, Math.min(500, Number(e.target.value) || 0)),
              })
            }
          />
        </SettingsFieldRow>

        <SettingsSection title="CALCULATION">
          <SettingsFieldRow label="Timeframe">
            <select className={inputClass} value={safe.timeframe} disabled>
              <option value="chart">Chart</option>
            </select>
          </SettingsFieldRow>
          <SettingsCheck
            label="Wait for timeframe closes"
            checked={safe.waitForTimeframeCloses}
            onChange={(waitForTimeframeCloses) => onChange({ ...safe, waitForTimeframeCloses })}
          />
        </SettingsSection>
      </div>
    );
  }

  const StyleLineRow = ({
    label,
    visible,
    onVisible,
    line,
    onLine,
  }: {
    label: string;
    visible: boolean;
    onVisible: (v: boolean) => void;
    line: IndicatorLineStyleSettings;
    onLine: (v: IndicatorLineStyleSettings) => void;
  }) => (
    <div className="flex items-center gap-2 py-1.5">
      <input
        type="checkbox"
        className="accent-white"
        checked={visible}
        onChange={(e) => onVisible(e.target.checked)}
      />
      <span className="w-[72px] shrink-0 text-[13px] text-[#d1d4dc]">{label}</span>
      <SettingsColorSwatch
        value={line.color}
        opacity={line.opacity}
        onChange={(color) => onLine({ ...line, color })}
        onOpacityChange={(opacity) => onLine({ ...line, opacity })}
      />
      <LineWidthSelect
        value={line.lineWidth}
        onChange={(lineWidth) => onLine({ ...line, lineWidth })}
      />
      <LineStyleSelect
        value={line.lineStyle}
        onChange={(lineStyle) => onLine({ ...line, lineStyle })}
      />
    </div>
  );

  return (
    <div>
      <StyleLineRow
        label="Basis"
        visible={safe.basisVisible}
        onVisible={(basisVisible) => onChange({ ...safe, basisVisible })}
        line={safe.basis}
        onLine={(basis) => onChange({ ...safe, basis })}
      />
      <StyleLineRow
        label="Upper"
        visible={safe.upperVisible}
        onVisible={(upperVisible) => onChange({ ...safe, upperVisible })}
        line={safe.upper}
        onLine={(upper) => onChange({ ...safe, upper })}
      />
      <StyleLineRow
        label="Lower"
        visible={safe.lowerVisible}
        onVisible={(lowerVisible) => onChange({ ...safe, lowerVisible })}
        line={safe.lower}
        onLine={(lower) => onChange({ ...safe, lower })}
      />
      <div className="flex items-center gap-2 py-1.5">
        <input
          type="checkbox"
          className="accent-white"
          checked={safe.backgroundVisible}
          onChange={(e) => onChange({ ...safe, backgroundVisible: e.target.checked })}
        />
        <span className="w-[72px] shrink-0 text-[13px] text-[#d1d4dc]">Background</span>
        <SettingsColorSwatch
          value={safe.backgroundColor}
          opacity={safe.backgroundOpacity}
          onChange={(backgroundColor) => onChange({ ...safe, backgroundColor })}
          onOpacityChange={(backgroundOpacity) =>
            onChange({ ...safe, backgroundOpacity })
          }
        />
      </div>

      <div className="mt-4">
        <SettingsSection title="OUTPUT VALUES">
          <SettingsFieldRow label="Precision">
            <select
              className={inputClass}
              value={safe.precision === "default" ? "default" : String(safe.precision)}
              onChange={(e) => {
                const v = e.target.value;
                onChange({
                  ...safe,
                  precision: v === "default" ? "default" : Number(v),
                });
              }}
            >
              <option value="default">Default</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </SettingsFieldRow>
          <SettingsCheck
            label="Labels on price scale"
            checked={safe.showScaleValues}
            onChange={(showScaleValues) => onChange({ ...safe, showScaleValues })}
          />
          <SettingsCheck
            label="Values in status line"
            checked={safe.showStatusValues}
            onChange={(showStatusValues) => onChange({ ...safe, showStatusValues })}
          />
        </SettingsSection>
        <SettingsSection title="INPUT VALUES">
          <SettingsCheck
            label="Inputs in status line"
            checked={safe.showStatusInputs}
            onChange={(showStatusInputs) => onChange({ ...safe, showStatusInputs })}
          />
        </SettingsSection>
      </div>
    </div>
  );
}

function RsiForm({
  value,
  onChange,
  tab,
}: {
  value: RsiIndicatorSettings;
  onChange: (v: RsiIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="Length">
          <input
            className={inputClass}
            type="number"
            min={2}
            max={200}
            value={value.period}
            onChange={(e) =>
              onChange({ ...value, period: Math.max(2, Math.min(200, Number(e.target.value) || 14)) })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Upper band">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={99}
            value={value.upperLevel}
            onChange={(e) =>
              onChange({
                ...value,
                upperLevel: Math.max(1, Math.min(99, Number(e.target.value) || 70)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Lower band">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={99}
            value={value.lowerLevel}
            onChange={(e) =>
              onChange({
                ...value,
                lowerLevel: Math.max(1, Math.min(99, Number(e.target.value) || 30)),
              })
            }
          />
        </SettingsFieldRow>
      </div>
    );
  }
  return (
    <LineAppearanceFields
      value={{
        color: value.color,
        opacity: value.opacity ?? 100,
        lineWidth: value.lineWidth,
        lineStyle: value.lineStyle ?? "solid",
      }}
      onChange={(line) => onChange({ ...value, ...line })}
    />
  );
}

function StochForm({
  value,
  onChange,
  tab,
}: {
  value: StochIndicatorSettings;
  onChange: (v: StochIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  const safe = normalizeStochSettings(value);

  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="%K Length">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={200}
            value={safe.length}
            onChange={(e) =>
              onChange({
                ...safe,
                length: Math.max(1, Math.min(200, Number(e.target.value) || 14)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="%K Smoothing">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={50}
            value={safe.kSmoothing}
            onChange={(e) =>
              onChange({
                ...safe,
                kSmoothing: Math.max(1, Math.min(50, Number(e.target.value) || 1)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="%D Smoothing">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={50}
            value={safe.dSmoothing}
            onChange={(e) =>
              onChange({
                ...safe,
                dSmoothing: Math.max(1, Math.min(50, Number(e.target.value) || 3)),
              })
            }
          />
        </SettingsFieldRow>
      </div>
    );
  }

  const patchBand = (key: "upper" | "middle" | "lower", patch: Partial<StochBandSettings>) => {
    onChange({ ...safe, [key]: { ...safe[key], ...patch } });
  };

  const StyleLineRow = ({
    label,
    visible,
    onVisible,
    line,
    onLine,
    level,
    onLevel,
  }: {
    label: string;
    visible: boolean;
    onVisible: (v: boolean) => void;
    line: IndicatorLineStyleSettings;
    onLine: (v: IndicatorLineStyleSettings) => void;
    level?: number;
    onLevel?: (v: number) => void;
  }) => (
    <div className="flex items-center gap-2 py-1.5">
      <input
        type="checkbox"
        className="accent-white"
        checked={visible}
        onChange={(e) => onVisible(e.target.checked)}
      />
      <span className="w-[88px] shrink-0 text-[13px] text-[#d1d4dc]">{label}</span>
      <SettingsColorSwatch
        value={line.color}
        opacity={line.opacity}
        onChange={(color) => onLine({ ...line, color })}
        onOpacityChange={(opacity) => onLine({ ...line, opacity })}
      />
      <select
        className={`${settingsUi.inputSm} w-[96px]`}
        value={line.lineStyle}
        onChange={(e) => onLine({ ...line, lineStyle: e.target.value as DrawingLineStyle })}
      >
        <option value="solid">Solid</option>
        <option value="dashed">Dashed</option>
        <option value="dotted">Dotted</option>
      </select>
      {onLevel != null && level != null ? (
        <input
          className={`${inputClass} w-[64px]`}
          type="number"
          min={0}
          max={100}
          value={level}
          onChange={(e) =>
            onLevel(Math.max(0, Math.min(100, Number(e.target.value) || 0)))
          }
        />
      ) : null}
    </div>
  );

  return (
    <div>
      <StyleLineRow
        label="%K"
        visible={safe.kVisible}
        onVisible={(kVisible) => onChange({ ...safe, kVisible })}
        line={safe.k}
        onLine={(k) => onChange({ ...safe, k })}
      />
      <StyleLineRow
        label="%D"
        visible={safe.dVisible}
        onVisible={(dVisible) => onChange({ ...safe, dVisible })}
        line={safe.d}
        onLine={(d) => onChange({ ...safe, d })}
      />
      <StyleLineRow
        label="Upper Band"
        visible={safe.upper.visible}
        onVisible={(visible) => patchBand("upper", { visible })}
        line={safe.upper}
        onLine={(line) => patchBand("upper", line)}
        level={safe.upper.level}
        onLevel={(level) => patchBand("upper", { level })}
      />
      <StyleLineRow
        label="Middle Band"
        visible={safe.middle.visible}
        onVisible={(visible) => patchBand("middle", { visible })}
        line={safe.middle}
        onLine={(line) => patchBand("middle", line)}
        level={safe.middle.level}
        onLevel={(level) => patchBand("middle", { level })}
      />
      <StyleLineRow
        label="Lower Band"
        visible={safe.lower.visible}
        onVisible={(visible) => patchBand("lower", { visible })}
        line={safe.lower}
        onLine={(line) => patchBand("lower", line)}
        level={safe.lower.level}
        onLevel={(level) => patchBand("lower", { level })}
      />
      <div className="flex items-center gap-2 py-1.5">
        <input
          type="checkbox"
          className="accent-white"
          checked={safe.backgroundVisible}
          onChange={(e) => onChange({ ...safe, backgroundVisible: e.target.checked })}
        />
        <span className="w-[88px] shrink-0 text-[13px] text-[#d1d4dc]">Background</span>
        <SettingsColorSwatch
          value={safe.backgroundColor}
          opacity={safe.backgroundOpacity}
          onChange={(backgroundColor) => onChange({ ...safe, backgroundColor })}
          onOpacityChange={(backgroundOpacity) =>
            onChange({ ...safe, backgroundOpacity })
          }
        />
      </div>

      <div className="mt-4">
        <SettingsSection title="OUTPUT VALUES">
          <SettingsFieldRow label="Precision">
            <select
              className={inputClass}
              value={safe.precision === "default" ? "default" : String(safe.precision)}
              onChange={(e) => {
                const v = e.target.value;
                onChange({
                  ...safe,
                  precision: v === "default" ? "default" : Number(v),
                });
              }}
            >
              <option value="default">Default</option>
              {[0, 1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </SettingsFieldRow>
          <SettingsCheck
            label="Labels on price scale"
            checked={safe.showScaleValues}
            onChange={(showScaleValues) => onChange({ ...safe, showScaleValues })}
          />
          <SettingsCheck
            label="Values in status line"
            checked={safe.showStatusValues}
            onChange={(showStatusValues) => onChange({ ...safe, showStatusValues })}
          />
        </SettingsSection>
        <SettingsSection title="INPUT VALUES">
          <SettingsCheck
            label="Inputs in status line"
            checked={safe.showStatusInputs}
            onChange={(showStatusInputs) => onChange({ ...safe, showStatusInputs })}
          />
        </SettingsSection>
      </div>
    </div>
  );
}

function AtrForm({
  value,
  onChange,
  tab,
}: {
  value: AtrIndicatorSettings;
  onChange: (v: AtrIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="Length">
          <input
            className={inputClass}
            type="number"
            min={2}
            max={200}
            value={value.period}
            onChange={(e) =>
              onChange({ ...value, period: Math.max(2, Math.min(200, Number(e.target.value) || 14)) })
            }
          />
        </SettingsFieldRow>
      </div>
    );
  }
  return (
    <LineAppearanceFields
      value={{
        color: value.color,
        opacity: value.opacity ?? 100,
        lineWidth: value.lineWidth,
        lineStyle: value.lineStyle ?? "solid",
      }}
      onChange={(line) => onChange({ ...value, ...line })}
    />
  );
}

function PmoForm({
  value,
  onChange,
  tab,
}: {
  value: PmoIndicatorSettings;
  onChange: (v: PmoIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  const safe = normalizePmoSettings(value);

  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="First Smoothing (Period 1)">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={200}
            value={safe.period1}
            onChange={(e) =>
              onChange({ ...safe, period1: Math.max(1, Math.min(200, Number(e.target.value) || 35)) })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Second Smoothing (Period 2)">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={200}
            value={safe.period2}
            onChange={(e) =>
              onChange({ ...safe, period2: Math.max(1, Math.min(200, Number(e.target.value) || 20)) })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Signal Period">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={200}
            value={safe.signalPeriod}
            onChange={(e) =>
              onChange({ ...safe, signalPeriod: Math.max(1, Math.min(200, Number(e.target.value) || 10)) })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Source">
          <select
            className={inputClass}
            value={safe.source}
            onChange={(e) => onChange({ ...safe, source: e.target.value as MaSource })}
          >
            <option value="close">Close</option>
            <option value="open">Open</option>
            <option value="high">High</option>
            <option value="low">Low</option>
            <option value="hl2">HL/2</option>
            <option value="hlc3">HLC/3</option>
            <option value="ohlc4">OHLC/4</option>
          </select>
        </SettingsFieldRow>
      </div>
    );
  }

  const StyleLineRow = ({
    label,
    visible,
    onVisible,
    line,
    onLine,
  }: {
    label: string;
    visible: boolean;
    onVisible: (v: boolean) => void;
    line: IndicatorLineStyleSettings;
    onLine: (v: IndicatorLineStyleSettings) => void;
  }) => (
    <div className="space-y-3">
      <SettingsFieldRow label={label}>
        <input type="checkbox" checked={visible} onChange={(e) => onVisible(e.target.checked)} />
      </SettingsFieldRow>
      {visible && <LineAppearanceFields value={line} onChange={onLine} />}
    </div>
  );

  return (
    <div className="space-y-4">
      <StyleLineRow
        label="PMO Line"
        visible={safe.pmoVisible}
        onVisible={(v) => onChange({ ...safe, pmoVisible: v })}
        line={safe.pmo}
        onLine={(pmo) => onChange({ ...safe, pmo })}
      />
      <StyleLineRow
        label="Signal Line"
        visible={safe.signalVisible}
        onVisible={(v) => onChange({ ...safe, signalVisible: v })}
        line={safe.signal}
        onLine={(signal) => onChange({ ...safe, signal })}
      />
      <div className="space-y-3">
        <SettingsFieldRow label="Zero Line">
          <input
            type="checkbox"
            checked={safe.zeroLine.visible}
            onChange={(e) =>
              onChange({ ...safe, zeroLine: { ...safe.zeroLine, visible: e.target.checked } })
            }
          />
        </SettingsFieldRow>
        {safe.zeroLine.visible && (
          <LineAppearanceFields
            value={{
              color: safe.zeroLine.color,
              opacity: safe.zeroLine.opacity,
              lineWidth: safe.zeroLine.lineWidth,
              lineStyle: safe.zeroLine.lineStyle,
            }}
            onChange={(line) => onChange({ ...safe, zeroLine: { ...safe.zeroLine, ...line } })}
          />
        )}
      </div>
      <SettingsFieldRow label="Precision">
        <select
          className={inputClass}
          value={safe.precision}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ ...safe, precision: v === "default" ? "default" : Number(v) });
          }}
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
      </SettingsFieldRow>
      <SettingsFieldRow label="Show values on scale">
        <input
          type="checkbox"
          checked={safe.showScaleValues}
          onChange={(e) => onChange({ ...safe, showScaleValues: e.target.checked })}
        />
      </SettingsFieldRow>
      <SettingsFieldRow label="Show values in legend">
        <input
          type="checkbox"
          checked={safe.showStatusValues}
          onChange={(e) => onChange({ ...safe, showStatusValues: e.target.checked })}
        />
      </SettingsFieldRow>
      <SettingsFieldRow label="Show inputs in legend">
        <input
          type="checkbox"
          checked={safe.showStatusInputs}
          onChange={(e) => onChange({ ...safe, showStatusInputs: e.target.checked })}
        />
      </SettingsFieldRow>
    </div>
  );
}

function ObForm({
  value,
  onChange,
  tab,
}: {
  value: ObIndicatorSettings;
  onChange: (v: ObIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  const safe = normalizeObSettings(value);

  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="Swing Lookback">
          <input
            className={inputClass}
            type="number"
            min={3}
            max={200}
            value={safe.swingLookback}
            onChange={(e) =>
              onChange({
                ...safe,
                swingLookback: Math.max(3, Math.min(200, Number(e.target.value) || 10)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Show Last Bullish OB">
          <input
            className={inputClass}
            type="number"
            min={0}
            max={200}
            value={safe.showLastBull}
            onChange={(e) =>
              onChange({
                ...safe,
                showLastBull: Math.max(0, Math.min(200, Number(e.target.value) || 0)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Show Last Bearish OB">
          <input
            className={inputClass}
            type="number"
            min={0}
            max={200}
            value={safe.showLastBear}
            onChange={(e) =>
              onChange({
                ...safe,
                showLastBear: Math.max(0, Math.min(200, Number(e.target.value) || 0)),
              })
            }
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Use Candle Body">
          <input
            type="checkbox"
            checked={safe.useBody}
            onChange={(e) => onChange({ ...safe, useBody: e.target.checked })}
          />
        </SettingsFieldRow>
        <SettingsFieldRow label="Show Historical Polarity Changes">
          <input
            type="checkbox"
            checked={safe.showLabels}
            onChange={(e) => onChange({ ...safe, showLabels: e.target.checked })}
          />
        </SettingsFieldRow>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LineAppearanceFields
        label="Bullish"
        value={safe.bull}
        onChange={(bull) => onChange({ ...safe, bull })}
        fillOnly
      />
      <LineAppearanceFields
        label="Bullish Breaker"
        value={safe.bullBreak}
        onChange={(bullBreak) => onChange({ ...safe, bullBreak })}
        fillOnly
      />
      <LineAppearanceFields
        label="Bearish"
        value={safe.bear}
        onChange={(bear) => onChange({ ...safe, bear })}
        fillOnly
      />
      <LineAppearanceFields
        label="Bearish Breaker"
        value={safe.bearBreak}
        onChange={(bearBreak) => onChange({ ...safe, bearBreak })}
        fillOnly
      />
      <SettingsFieldRow label="Show values in legend">
        <input
          type="checkbox"
          checked={safe.showStatusValues}
          onChange={(e) => onChange({ ...safe, showStatusValues: e.target.checked })}
        />
      </SettingsFieldRow>
      <SettingsFieldRow label="Show inputs in legend">
        <input
          type="checkbox"
          checked={safe.showStatusInputs}
          onChange={(e) => onChange({ ...safe, showStatusInputs: e.target.checked })}
        />
      </SettingsFieldRow>
    </div>
  );
}

function AdxForm({
  value,
  onChange,
  tab,
}: {
  value: AdxIndicatorSettings;
  onChange: (v: AdxIndicatorSettings) => void;
  tab: "inputs" | "style";
}) {
  if (tab === "inputs") {
    return (
      <div>
        <SettingsFieldRow label="Length">
          <input
            className={inputClass}
            type="number"
            min={2}
            max={200}
            value={value.period}
            onChange={(e) =>
              onChange({ ...value, period: Math.max(2, Math.min(200, Number(e.target.value) || 14)) })
            }
          />
        </SettingsFieldRow>
      </div>
    );
  }
  return (
    <div>
      <SettingsFieldRow label="Show values on scale">
        <input
          type="checkbox"
          checked={value.showScaleValues !== false}
          onChange={(e) => onChange({ ...value, showScaleValues: e.target.checked })}
        />
      </SettingsFieldRow>
      <LineAppearanceFields
        value={{
          color: value.color,
          opacity: value.opacity,
          lineWidth: value.lineWidth,
          lineStyle: value.lineStyle,
        }}
        onChange={(line) => onChange({ ...value, ...line })}
      />
    </div>
  );
}

function mergeDraft(saved: IndicatorSettingsMap): IndicatorSettingsMap {
  return {
    volume: normalizeVolumeSettings(saved.volume),
    vwap: normalizeVwapSettings(saved.vwap),
    ema: normalizeEmaSettings(saved.ema),
    bb: normalizeBbSettings(saved.bb),
    rsi: {
      ...DEFAULT_INDICATOR_SETTINGS.rsi,
      ...saved.rsi,
      visibility: cloneVisibility(saved.rsi?.visibility),
    },
    stoch: normalizeStochSettings(saved.stoch),
    atr: {
      ...DEFAULT_INDICATOR_SETTINGS.atr,
      ...saved.atr,
      visibility: cloneVisibility(saved.atr?.visibility),
    },
    adx: {
      ...DEFAULT_INDICATOR_SETTINGS.adx,
      ...saved.adx,
      visibility: cloneVisibility(saved.adx?.visibility),
    },
    pmo: normalizePmoSettings(saved.pmo),
    ob: normalizeObSettings(saved.ob),
  };
}

export function IndicatorSettingsModal() {
  const instanceId = useAppStore((s) => s.indicatorSettingsId);
  const setOpen = useAppStore((s) => s.setIndicatorSettingsOpen);
  const updateStudySettings = useAppStore((s) => s.updateStudySettings);
  const patchIndicatorSettings = useAppStore((s) => s.patchIndicatorSettings);
  const hostPaneId = useAppStore((s) => {
    if (!s.indicatorSettingsId) return null;
    return (
      s.panes.find((p) => p.studies.some((st) => st.id === s.indicatorSettingsId))?.id ?? null
    );
  });
  const hostSymbol = useAppStore((s) => {
    if (!hostPaneId) return null;
    return s.panes.find((p) => p.id === hostPaneId)?.symbol ?? null;
  });
  const study = useAppStore((s) => {
    if (!s.indicatorSettingsId || !hostPaneId) return null;
    return (
      s.panes
        .find((p) => p.id === hostPaneId)
        ?.studies.find((st) => st.id === s.indicatorSettingsId) ?? null
    );
  });
  const type = study?.type ?? null;
  const [tab, setTab] = useState<Tab>("inputs");
  const [draft, setDraft] = useState<IndicatorSettingsMap>(() =>
    mergeDraft(useAppStore.getState().indicatorSettings),
  );
  const boxRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef<{
    paneId: string;
    type: IndicatorId;
    studySettings: IndicatorSettingsMap[IndicatorId];
    factorySettings: IndicatorSettingsMap[IndicatorId];
  } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);

  // Hydrate once per opened instance — live commits update the store, so don't re-sync from it.
  useEffect(() => {
    if (!instanceId) {
      snapshotRef.current = null;
      return;
    }
    const state = useAppStore.getState();
    const paneHost =
      state.panes.find((p) => p.studies.some((s) => s.id === instanceId)) ?? null;
    const opened = paneHost?.studies.find((s) => s.id === instanceId) ?? null;
    if (!paneHost || !opened) return;
    const initial = mergeDraft({
      ...state.indicatorSettings,
      [opened.type]: opened.settings,
    } as IndicatorSettingsMap);
    setDraft(initial);
    snapshotRef.current = {
      paneId: paneHost.id,
      type: opened.type,
      studySettings: cloneStudySettings(opened.type, opened.settings as never),
      factorySettings: cloneStudySettings(
        opened.type,
        state.indicatorSettings[opened.type] as never,
      ),
    };
    setTab("inputs");
    setDragged(false);
  }, [instanceId]);

  useEffect(() => {
    if (!instanceId) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (boxRef.current?.contains(target)) return;
      if (target.closest("[data-color-picker-popover]")) return;
      setOpen(null);
    };
    const timer = window.setTimeout(() => {
      window.addEventListener("mousedown", onDown, true);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousedown", onDown, true);
    };
  }, [instanceId, setOpen]);

  if (!instanceId || !hostPaneId || !hostSymbol || !study || !type) return null;

  const title = indicatorTitle(type, hostSymbol);
  const close = () => setOpen(null);

  const commit = (next: IndicatorSettingsMap) => {
    const merged = mergeDraft(next);
    setDraft(merged);
    updateStudySettings(instanceId, merged[type], hostPaneId);
    patchIndicatorSettings(type, merged[type] as never);
  };

  const cancel = () => {
    const snap = snapshotRef.current;
    if (snap) {
      updateStudySettings(instanceId, snap.studySettings, snap.paneId);
      patchIndicatorSettings(snap.type, snap.factorySettings as never);
    }
    close();
  };

  const apply = () => close();

  const startDrag = (event: ReactMouseEvent<HTMLDivElement>) => {
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
      data-indicator-settings-panel
      data-dropdown-open
      className="fixed z-[70] flex w-[420px] max-h-[calc(100vh-188px)] flex-col overflow-hidden rounded-[8px] bg-[#1b1b1b] shadow-[0_8px_28px_rgba(0,0,0,0.65)]"
      style={
        dragged
          ? { left: pos.x, top: pos.y }
          : { left: "50%", top: 160, transform: "translateX(-50%)" }
      }
      onMouseDown={(e) => e.stopPropagation()}
    >
      <SettingsHeader title={title} onClose={close} onMouseDown={startDrag} />
      <SettingsTabs tabs={["inputs", "style", "visibility"] as const} value={tab} onChange={setTab} />
      <SettingsBody className="min-h-0 flex-1">
        {tab === "visibility" ? (
          <VisibilitySettingsPanel
            value={draft[type].visibility}
            onChange={(visibility) =>
              commit({
                ...draft,
                [type]: { ...draft[type], visibility },
              })
            }
          />
        ) : (
          <>
            {type === "volume" && (
              <VolumeForm
                value={draft.volume}
                onChange={(volume) => commit({ ...draft, volume })}
                tab={tab}
              />
            )}
            {type === "vwap" && (
              <VwapForm
                value={draft.vwap}
                onChange={(vwap) => commit({ ...draft, vwap })}
                tab={tab}
              />
            )}
            {type === "ema" && (
              <EmaForm
                value={draft.ema}
                onChange={(ema) => commit({ ...draft, ema })}
                tab={tab}
              />
            )}
            {type === "bb" && (
              <BbForm value={draft.bb} onChange={(bb) => commit({ ...draft, bb })} tab={tab} />
            )}
            {type === "rsi" && (
              <RsiForm
                value={draft.rsi}
                onChange={(rsi) => commit({ ...draft, rsi })}
                tab={tab}
              />
            )}
            {type === "stoch" && (
              <StochForm
                value={draft.stoch}
                onChange={(stoch) => commit({ ...draft, stoch })}
                tab={tab}
              />
            )}
            {type === "atr" && (
              <AtrForm
                value={draft.atr}
                onChange={(atr) => commit({ ...draft, atr })}
                tab={tab}
              />
            )}
            {type === "adx" && (
              <AdxForm
                value={draft.adx}
                onChange={(adx) => commit({ ...draft, adx })}
                tab={tab}
              />
            )}
            {type === "pmo" && (
              <PmoForm
                value={draft.pmo}
                onChange={(pmo) => commit({ ...draft, pmo })}
                tab={tab}
              />
            )}
            {type === "ob" && (
              <ObForm value={draft.ob} onChange={(ob) => commit({ ...draft, ob })} tab={tab} />
            )}
          </>
        )}
      </SettingsBody>
      <SettingsFooter>
        <SettingsBtn onClick={cancel}>Cancel</SettingsBtn>
        <SettingsBtn variant="primary" onClick={apply}>
          Ok
        </SettingsBtn>
      </SettingsFooter>
    </div>
  );
}

