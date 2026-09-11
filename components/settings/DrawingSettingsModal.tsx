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
  SettingsOverlay,
  SettingsPanel,
  SettingsSection,
  SettingsSelectWrap,
  SettingsTabs,
  settingsUi,
} from "@/components/settings/settings-ui";
import {
  ALL_POSITION_STATS,
  DEFAULT_POSITION_LINE_COLOR,
  DEFAULT_POSITION_STOP_COLOR,
  DEFAULT_POSITION_TARGET_COLOR,
  DEFAULT_RECT_BORDER_COLOR,
  DEFAULT_RECT_FILL_COLOR,
  DEFAULT_RECT_MIDDLE_LINE_COLOR,
  DEFAULT_CIRCLE_BORDER_COLOR,
  DEFAULT_CIRCLE_FILL_COLOR,
  DEFAULT_FIB_ONE_COLOR,
  DEFAULT_FIB_TREND_COLOR,
  cloneFibLevels,
  DRAW_LABEL,
  POSITION_STAT_LABELS,
  isPositionTool,
  positionAnchors,
  positionPricesFromTicks,
  positionTickSize,
  withPositionPrices,
} from "@/lib/drawings";
import { getSymbol } from "@/lib/maws/universe";
import { useAppStore } from "@/lib/store";
import { resolveSymbolTrading } from "@/lib/trading/symbol-settings";
import { cloneVisibility } from "@/lib/visibility";
import type {
  Drawing,
  DrawingExtend,
  DrawingLineStyle,
  DrawingTextHAlign,
  DrawingTextVAlign,
  FibLevel,
  FibLevelsFormat,
  ObjectVisibility,
  PositionAccountSizeMode,
  PositionQtyPrecision,
  PositionRiskUnit,
  PositionStatKey,
} from "@/types";
import { Pencil } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

type GenericTab = "style" | "text" | "coordinates" | "visibility";
type FibTab = "style" | "coordinates" | "visibility";
type PositionTab = "inputs" | "style" | "visibility";

const inputClass = settingsUi.inputSm;

type Draft = {
  color: string;
  lineWidth: 1 | 2 | 3 | 4;
  lineStyle: DrawingLineStyle;
  extend: DrawingExtend;
  showMiddlePoint: boolean;
  showPriceLabels: boolean;
  fillColor: string;
  fillVisible: boolean;
  middleLineColor: string;
  middleLineStyle: DrawingLineStyle;
  text: string;
  textColor: string;
  textSize: number;
  textBold: boolean;
  textItalic: boolean;
  textAlignV: DrawingTextVAlign;
  textAlignH: DrawingTextHAlign;
  points: { time: number; price: number }[];
  visibility: ObjectVisibility;
  stopColor: string;
  targetColor: string;
  compactStats: boolean;
  alwaysShowStats: boolean;
  positionStats: PositionStatKey[];
  positionAccountSizeMode: PositionAccountSizeMode;
  positionAccountSize: number;
  positionLotSize: number;
  positionRisk: number;
  positionRiskUnit: PositionRiskUnit;
  positionLeverage: number;
  positionQtyPrecision: PositionQtyPrecision;
  fibTrendVisible: boolean;
  fibTrendColor: string;
  fibTrendStyle: DrawingLineStyle;
  fibLevels: FibLevel[];
  fibUseOneColor: boolean;
  fibOneColor: string;
  fibBackground: boolean;
  fibBackgroundOpacity: number;
  fibReverse: boolean;
  fibShowPrices: boolean;
  fibShowLevels: boolean;
  fibLevelsFormat: FibLevelsFormat;
  fibLabelH: DrawingTextHAlign;
  fibLabelV: DrawingTextVAlign;
  fibShowText: boolean;
  fibLogScale: boolean;
};

function toDraft(
  d: Drawing,
  defaults: {
    accountSize: number;
    lotSize: number;
    risk: number;
    riskUnit: PositionRiskUnit;
    leverage: number;
  },
): Draft {
  return {
    color:
      d.color ||
      (isPositionTool(d.tool)
        ? DEFAULT_POSITION_LINE_COLOR
        : d.tool === "rect"
          ? DEFAULT_RECT_BORDER_COLOR
          : d.tool === "circle"
            ? DEFAULT_CIRCLE_BORDER_COLOR
            : "#2962ff"),
    lineWidth: d.lineWidth ?? 2,
    lineStyle: d.lineStyle ?? "solid",
    extend: d.extend ?? "none",
    showMiddlePoint: Boolean(d.showMiddlePoint),
    showPriceLabels: Boolean(d.showPriceLabels),
    fillColor:
      d.fillColor ??
      (d.tool === "circle" ? DEFAULT_CIRCLE_FILL_COLOR : DEFAULT_RECT_FILL_COLOR),
    fillVisible: d.fillVisible ?? d.tool !== "circle",
    middleLineColor: d.middleLineColor ?? DEFAULT_RECT_MIDDLE_LINE_COLOR,
    middleLineStyle: d.middleLineStyle ?? "dashed",
    text: d.text ?? "",
    textColor: d.textColor ?? "#ffffff",
    textSize: d.textSize ?? (isPositionTool(d.tool) ? 11 : 14),
    textBold: Boolean(d.textBold),
    textItalic: Boolean(d.textItalic),
    textAlignV: d.textAlignV ?? "top",
    textAlignH: d.textAlignH ?? "left",
    points: d.points.map((p) => ({ ...p })),
    visibility: cloneVisibility(d.visibility),
    stopColor: d.stopColor ?? DEFAULT_POSITION_STOP_COLOR,
    targetColor: d.targetColor ?? DEFAULT_POSITION_TARGET_COLOR,
    compactStats: d.compactStats ?? true,
    alwaysShowStats: d.alwaysShowStats ?? false,
    positionStats: d.positionStats ? [...d.positionStats] : [...ALL_POSITION_STATS],
    positionAccountSizeMode: d.positionAccountSizeMode ?? "default",
    positionAccountSize: d.positionAccountSize ?? defaults.accountSize,
    positionLotSize: d.positionLotSize ?? defaults.lotSize,
    positionRisk: d.positionRisk ?? defaults.risk,
    positionRiskUnit: d.positionRiskUnit ?? defaults.riskUnit,
    positionLeverage: d.positionLeverage ?? defaults.leverage,
    positionQtyPrecision: d.positionQtyPrecision ?? "default",
    fibTrendVisible: d.fibTrendVisible ?? true,
    fibTrendColor: d.fibTrendColor ?? DEFAULT_FIB_TREND_COLOR,
    fibTrendStyle: d.fibTrendStyle ?? "dashed",
    fibLevels: cloneFibLevels(d.fibLevels),
    fibUseOneColor: Boolean(d.fibUseOneColor),
    fibOneColor: d.fibOneColor ?? DEFAULT_FIB_ONE_COLOR,
    fibBackground: Boolean(d.fibBackground),
    fibBackgroundOpacity: d.fibBackgroundOpacity ?? 20,
    fibReverse: Boolean(d.fibReverse),
    fibShowPrices: Boolean(d.fibShowPrices),
    fibShowLevels: d.fibShowLevels ?? true,
    fibLevelsFormat: d.fibLevelsFormat ?? "percents",
    fibLabelH: d.fibLabelH ?? "right",
    fibLabelV: d.fibLabelV ?? "middle",
    fibShowText: Boolean(d.fibShowText),
    fibLogScale: Boolean(d.fibLogScale),
  };
}

function drawingPatchFromDraft(next: Draft): Partial<Drawing> {
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
    fibLogScale: next.fibLogScale,
  };
}

function StatsMultiSelect({
  value,
  onChange,
}: {
  value: PositionStatKey[];
  onChange: (next: PositionStatKey[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = new Set(value);
  const summary =
    value.length === 0
      ? "None"
      : value.length === ALL_POSITION_STATS.length
        ? "All"
        : value.map((k) => POSITION_STAT_LABELS[k]).join(", ");

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        className={`${settingsUi.input} flex w-[220px] max-w-full items-center justify-between gap-2 text-left`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{summary}</span>
        <span className="shrink-0 text-[10px] text-[#787b86]">▾</span>
      </button>
      {open ? (
        <div className="absolute top-[calc(100%+4px)] right-0 z-20 max-h-[240px] w-[240px] overflow-y-auto rounded-[6px] border border-[#363a45] bg-[#1b1b1b] py-1 shadow-[0_8px_28px_rgba(0,0,0,0.65)]">
          {ALL_POSITION_STATS.map((key) => {
            const on = selected.has(key);
            return (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[12px] text-[#d1d4dc] hover:bg-[#2a2e39]"
              >
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={on}
                  onChange={() => {
                    if (on) onChange(value.filter((k) => k !== key));
                    else onChange([...value, key]);
                  }}
                />
                {POSITION_STAT_LABELS[key]}
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function DrawingSettingsModal() {
  const target = useAppStore((s) => s.drawingSettingsTarget);
  const setTarget = useAppStore((s) => s.setDrawingSettingsTarget);
  const panes = useAppStore((s) => s.panes);
  const mockBalance = useAppStore((s) => s.mockBalance);
  const updateDrawing = useAppStore((s) => s.updateDrawing);
  const [genericTab, setGenericTab] = useState<GenericTab>("style");
  const [fibTab, setFibTab] = useState<FibTab>("style");
  const [positionTab, setPositionTab] = useState<PositionTab>("inputs");
  const [draft, setDraft] = useState<Draft | null>(null);
  const snapshotRef = useRef<Draft | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);

  const pane = useMemo(() => {
    if (!target) return null;
    return panes.find((p) => p.id === target.paneId) ?? null;
  }, [target, panes]);

  const drawing = useMemo(() => {
    if (!target || !pane) return null;
    return pane.drawings.find((d) => d.id === target.drawingId) ?? null;
  }, [target, pane]);

  const trading = useMemo(
    () => (pane ? resolveSymbolTrading(pane.symbol) : null),
    [pane],
  );

  const inputDefaults = useMemo(
    () => ({
      accountSize: mockBalance,
      lotSize: trading?.margin ?? 100,
      risk:
        trading?.sizingMode === "percent"
          ? (trading?.marginPercent ?? 1)
          : (trading?.margin ?? 100),
      riskUnit: (trading?.sizingMode === "percent" ? "percent" : "money") as PositionRiskUnit,
      leverage: trading?.leverage ?? 10,
    }),
    [mockBalance, trading],
  );

  useEffect(() => {
    if (!drawing) {
      setDraft(null);
      snapshotRef.current = null;
      return;
    }
    const t = pane ? resolveSymbolTrading(pane.symbol) : null;
    const defaults = {
      accountSize: useAppStore.getState().mockBalance,
      lotSize: t?.margin ?? 100,
      risk:
        t?.sizingMode === "percent" ? (t?.marginPercent ?? 1) : (t?.margin ?? 100),
      riskUnit: (t?.sizingMode === "percent" ? "percent" : "money") as PositionRiskUnit,
      leverage: t?.leverage ?? 10,
    };
    const next = toDraft(drawing, defaults);
    setDraft(next);
    snapshotRef.current = next;
    setDragged(false);
    if (isPositionTool(drawing.tool)) setPositionTab("inputs");
    else if (drawing.tool === "fib") setFibTab("style");
    else setGenericTab("style");
    // Only re-seed when opening a different drawing — not when live account values tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawing?.id, target?.paneId, target?.drawingId]);

  if (!target || !drawing || !draft || !pane) return null;

  const title = DRAW_LABEL[drawing.tool] ?? drawing.tool;
  const positionSide: "long" | "short" | null = isPositionTool(drawing.tool)
    ? drawing.tool
    : null;
  const isPosition = positionSide != null;
  const isFib = drawing.tool === "fib";
  const close = () => setTarget(null);

  const push = (next: Draft) => {
    setDraft(next);
    updateDrawing(target.paneId, target.drawingId, drawingPatchFromDraft(next));
  };

  const patch = (partial: Partial<Draft>) => push({ ...draft, ...partial });

  const cancel = () => {
    const snap = snapshotRef.current;
    if (snap) {
      updateDrawing(target.paneId, target.drawingId, drawingPatchFromDraft(snap));
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

  const dashFor = (style: DrawingLineStyle) => {
    if (style === "dashed") return "6 4";
    if (style === "dotted") return "2 3";
    return undefined;
  };

  const anchors = isPosition ? positionAnchors(draft.points) : null;
  const tick = positionTickSize(getSymbol(pane.symbol).precision);
  const entryPrice = anchors?.entry.price ?? 0;
  const targetPrice = anchors?.target.price ?? 0;
  const stopPrice = anchors?.stop.price ?? 0;
  const tpMove = Math.abs(targetPrice - entryPrice);
  const slMove = Math.abs(stopPrice - entryPrice);
  const tpTicks = tick > 0 ? Math.round(tpMove / tick) : 0;
  const slTicks = tick > 0 ? Math.round(slMove / tick) : 0;

  const setPositionPrices = (entry: number, target: number, stop: number) => {
    patch({ points: withPositionPrices(draft.points, entry, target, stop) });
  };

  const accountDisplay =
    draft.positionAccountSizeMode === "default"
      ? inputDefaults.accountSize
      : draft.positionAccountSize;

  return (
    <SettingsOverlay onClose={close}>
      <SettingsPanel
        width={isPosition ? 420 : isFib ? 480 : 460}
        panelRef={boxRef}
        style={
          dragged
            ? { position: "fixed", left: pos.x, top: pos.y, margin: 0 }
            : undefined
        }
      >
        <SettingsHeader
          title={
            <>
              {title}
              <Pencil size={13} className="text-[#787b86]" />
            </>
          }
          onClose={close}
          onMouseDown={startDrag}
        />
        {isPosition ? (
          <SettingsTabs
            tabs={["inputs", "style", "visibility"] as const}
            value={positionTab}
            onChange={setPositionTab}
          />
        ) : isFib ? (
          <SettingsTabs
            tabs={["style", "coordinates", "visibility"] as const}
            value={fibTab}
            onChange={setFibTab}
          />
        ) : (
          <SettingsTabs
            tabs={["style", "text", "coordinates", "visibility"] as const}
            value={genericTab}
            onChange={setGenericTab}
          />
        )}
        <SettingsBody className="min-h-[220px] max-h-[min(60vh,420px)]">
          {isPosition && positionTab === "inputs" && anchors && (
            <div className="space-y-1">
              <SettingsFieldRow label="Account size">
                <div className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step="any"
                    disabled={draft.positionAccountSizeMode === "default"}
                    value={accountDisplay}
                    onChange={(e) =>
                      patch({
                        positionAccountSizeMode: "custom",
                        positionAccountSize: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                  />
                  <SettingsSelectWrap>
                    <select
                      className={`${settingsUi.select} w-[100px]`}
                      value={draft.positionAccountSizeMode}
                      onChange={(e) => {
                        const mode = e.target.value as PositionAccountSizeMode;
                        patch({
                          positionAccountSizeMode: mode,
                          positionAccountSize:
                            mode === "default"
                              ? inputDefaults.accountSize
                              : draft.positionAccountSize,
                        });
                      }}
                    >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                    </select>
                  </SettingsSelectWrap>
                </div>
              </SettingsFieldRow>

              <SettingsFieldRow label="Lot size">
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  step="any"
                  value={draft.positionLotSize}
                  onChange={(e) =>
                    patch({ positionLotSize: Math.max(0, Number(e.target.value) || 0) })
                  }
                />
              </SettingsFieldRow>

              <SettingsFieldRow label="Risk">
                <div className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step="any"
                    value={draft.positionRisk}
                    onChange={(e) =>
                      patch({ positionRisk: Math.max(0, Number(e.target.value) || 0) })
                    }
                  />
                  <SettingsSelectWrap>
                    <select
                      className={`${settingsUi.select} w-[72px]`}
                      value={draft.positionRiskUnit}
                      onChange={(e) =>
                        patch({ positionRiskUnit: e.target.value as PositionRiskUnit })
                      }
                    >
                      <option value="percent">%</option>
                      <option value="money">Cash</option>
                    </select>
                  </SettingsSelectWrap>
                </div>
              </SettingsFieldRow>

              <SettingsFieldRow label="Entry price">
                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => {
                    const entry = Number(e.target.value) || 0;
                    setPositionPrices(entry, targetPrice, stopPrice);
                  }}
                />
              </SettingsFieldRow>

              <SettingsFieldRow label="Leverage">
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  step="any"
                  value={draft.positionLeverage}
                  onChange={(e) =>
                    patch({
                      positionLeverage: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                />
              </SettingsFieldRow>

              <div className="pt-3">
                <div className={settingsUi.sectionTitle}>PROFIT LEVEL</div>
                <SettingsFieldRow label="Ticks">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step={1}
                    value={tpTicks}
                    onChange={(e) => {
                      if (!positionSide) return;
                      const nextTicks = Math.max(0, Math.round(Number(e.target.value) || 0));
                      const next = positionPricesFromTicks(
                        positionSide,
                        entryPrice,
                        nextTicks,
                        slTicks,
                        tick,
                      );
                      setPositionPrices(entryPrice, next.target, next.stop);
                    }}
                  />
                </SettingsFieldRow>
                <SettingsFieldRow label="Price">
                  <input
                    className={inputClass}
                    type="number"
                    step="any"
                    value={targetPrice}
                    onChange={(e) =>
                      setPositionPrices(entryPrice, Number(e.target.value) || 0, stopPrice)
                    }
                  />
                </SettingsFieldRow>
              </div>

              <div className="pt-3">
                <div className={settingsUi.sectionTitle}>STOP LEVEL</div>
                <SettingsFieldRow label="Ticks">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step={1}
                    value={slTicks}
                    onChange={(e) => {
                      if (!positionSide) return;
                      const nextTicks = Math.max(0, Math.round(Number(e.target.value) || 0));
                      const next = positionPricesFromTicks(
                        positionSide,
                        entryPrice,
                        tpTicks,
                        nextTicks,
                        tick,
                      );
                      setPositionPrices(entryPrice, next.target, next.stop);
                    }}
                  />
                </SettingsFieldRow>
                <SettingsFieldRow label="Price">
                  <input
                    className={inputClass}
                    type="number"
                    step="any"
                    value={stopPrice}
                    onChange={(e) =>
                      setPositionPrices(entryPrice, targetPrice, Number(e.target.value) || 0)
                    }
                  />
                </SettingsFieldRow>
              </div>

              <div className="pt-2">
              <SettingsFieldRow label="QTY precision">
                <SettingsSelectWrap>
                  <select
                    className={`${settingsUi.select} min-w-[120px]`}
                    value={String(draft.positionQtyPrecision)}
                    onChange={(e) => {
                      const v = e.target.value;
                      patch({
                        positionQtyPrecision:
                          v === "default"
                            ? "default"
                            : (Number(v) as Exclude<PositionQtyPrecision, "default">),
                      });
                    }}
                  >
                    <option value="default">Default</option>
                    {[0, 1, 2, 3, 4, 5, 6, 8].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </SettingsSelectWrap>
              </SettingsFieldRow>
              </div>
            </div>
          )}

          {isPosition && positionTab === "style" && (
            <div className="space-y-1">
              <SettingsFieldRow label="Lines">
                <div className="flex items-center gap-2">
                  <SettingsColorSwatch
                    value={draft.color}
                    onChange={(color) => patch({ color })}
                  />
                  <select
                    className={`${inputClass} w-[64px]`}
                    value={draft.lineWidth}
                    onChange={(e) =>
                      patch({ lineWidth: Number(e.target.value) as Draft["lineWidth"] })
                    }
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <svg width="36" height="12" className="text-[#d1d4dc]">
                    <line
                      x1="0"
                      y1="6"
                      x2="36"
                      y2="6"
                      stroke={draft.color}
                      strokeWidth={draft.lineWidth}
                      strokeDasharray={dashFor(draft.lineStyle)}
                    />
                  </svg>
                </div>
              </SettingsFieldRow>

              <SettingsFieldRow label="Stop color">
                <SettingsColorSwatch
                  value={draft.stopColor}
                  onChange={(stopColor) => patch({ stopColor })}
                />
              </SettingsFieldRow>

              <SettingsFieldRow label="Target color">
                <SettingsColorSwatch
                  value={draft.targetColor}
                  onChange={(targetColor) => patch({ targetColor })}
                />
              </SettingsFieldRow>

              <SettingsFieldRow label="Text">
                <div className="flex items-center gap-2">
                  <SettingsColorSwatch
                    value={draft.textColor}
                    onChange={(textColor) => patch({ textColor })}
                    showOpacity={false}
                  />
                  <select
                    className={`${inputClass} w-[64px]`}
                    value={draft.textSize}
                    onChange={(e) => patch({ textSize: Number(e.target.value) || 11 })}
                  >
                    {[10, 11, 12, 13, 14, 16, 18, 20, 24].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </SettingsFieldRow>

              <SettingsCheck
                label="Price labels"
                checked={draft.showPriceLabels}
                onChange={(showPriceLabels) => patch({ showPriceLabels })}
              />

              <SettingsSection title="INFO">
                <SettingsFieldRow label="Stats">
                  <StatsMultiSelect
                    value={draft.positionStats}
                    onChange={(positionStats) => patch({ positionStats })}
                  />
                </SettingsFieldRow>
                <SettingsCheck
                  label="Compact stats mode"
                  checked={draft.compactStats}
                  onChange={(compactStats) => patch({ compactStats })}
                />
                <SettingsCheck
                  label="Always show stats"
                  checked={draft.alwaysShowStats}
                  onChange={(alwaysShowStats) => patch({ alwaysShowStats })}
                />
              </SettingsSection>
            </div>
          )}

          {isPosition && positionTab === "visibility" && (
            <VisibilitySettingsPanel
              value={draft.visibility}
              onChange={(visibility) => patch({ visibility })}
            />
          )}

          {isFib && fibTab === "style" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.fibTrendVisible}
                  onChange={(e) => patch({ fibTrendVisible: e.target.checked })}
                />
                <span className="w-[88px] shrink-0 text-[13px] text-[#d1d4dc]">Trend line</span>
                <SettingsColorSwatch
                  value={draft.fibTrendColor}
                  onChange={(fibTrendColor) => patch({ fibTrendColor })}
                  showOpacity={false}
                />
                <select
                  className={`${inputClass} min-w-[96px]`}
                  value={draft.fibTrendStyle}
                  onChange={(e) =>
                    patch({ fibTrendStyle: e.target.value as DrawingLineStyle })
                  }
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
                <svg width="36" height="12" className="shrink-0">
                  <line
                    x1="0"
                    y1="6"
                    x2="36"
                    y2="6"
                    stroke={draft.fibTrendColor}
                    strokeWidth={1.5}
                    strokeDasharray={dashFor(draft.fibTrendStyle)}
                  />
                </svg>
              </div>

              <SettingsFieldRow label="Levels line">
                <div className="flex items-center gap-2">
                  <select
                    className={`${inputClass} w-[56px]`}
                    value={draft.lineWidth}
                    onChange={(e) =>
                      patch({ lineWidth: Number(e.target.value) as Draft["lineWidth"] })
                    }
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <select
                    className={`${inputClass} min-w-[96px]`}
                    value={draft.lineStyle}
                    onChange={(e) => patch({ lineStyle: e.target.value as DrawingLineStyle })}
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                  <svg width="36" height="12" className="shrink-0">
                    <line
                      x1="0"
                      y1="6"
                      x2="36"
                      y2="6"
                      stroke="#d1d4dc"
                      strokeWidth={draft.lineWidth}
                      strokeDasharray={dashFor(draft.lineStyle)}
                    />
                  </svg>
                </div>
              </SettingsFieldRow>

              <SettingsFieldRow label="Extend">
                <SettingsSelectWrap>
                  <select
                    className={`${settingsUi.select} min-w-[160px]`}
                    value={draft.extend}
                    onChange={(e) => patch({ extend: e.target.value as DrawingExtend })}
                  >
                    <option value="none">Don&apos;t extend</option>
                    <option value="left">Extend left</option>
                    <option value="right">Extend right</option>
                    <option value="both">Extend both</option>
                  </select>
                </SettingsSelectWrap>
              </SettingsFieldRow>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 py-1">
                {draft.fibLevels.map((lvl, i) => (
                  <div key={`${lvl.level}-${i}`} className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      className="accent-[#2962ff]"
                      checked={lvl.visible}
                      onChange={(e) => {
                        const fibLevels = draft.fibLevels.map((l, idx) =>
                          idx === i ? { ...l, visible: e.target.checked } : l,
                        );
                        patch({ fibLevels });
                      }}
                    />
                    <input
                      className={`${inputClass} w-[64px]`}
                      type="number"
                      step="any"
                      value={lvl.level}
                      onChange={(e) => {
                        const fibLevels = draft.fibLevels.map((l, idx) =>
                          idx === i
                            ? { ...l, level: Number(e.target.value) || 0 }
                            : l,
                        );
                        patch({ fibLevels });
                      }}
                    />
                    <SettingsColorSwatch
                      value={lvl.color}
                      onChange={(color) => {
                        const fibLevels = draft.fibLevels.map((l, idx) =>
                          idx === i ? { ...l, color } : l,
                        );
                        patch({ fibLevels });
                      }}
                      showOpacity={false}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.fibUseOneColor}
                  onChange={(e) => patch({ fibUseOneColor: e.target.checked })}
                />
                <span className="w-[110px] shrink-0 text-[13px] text-[#d1d4dc]">Use one color</span>
                <SettingsColorSwatch
                  value={draft.fibOneColor}
                  onChange={(fibOneColor) => patch({ fibOneColor })}
                  showOpacity={false}
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.fibBackground}
                  onChange={(e) => patch({ fibBackground: e.target.checked })}
                />
                <span className="w-[110px] shrink-0 text-[13px] text-[#d1d4dc]">Background</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={draft.fibBackgroundOpacity}
                  className="h-1.5 w-[140px] accent-[#2962ff]"
                  onChange={(e) =>
                    patch({ fibBackgroundOpacity: Number(e.target.value) || 0 })
                  }
                />
                <span className="text-[11px] text-[#787b86]">{draft.fibBackgroundOpacity}%</span>
              </div>

              <SettingsCheck
                label="Reverse"
                checked={draft.fibReverse}
                onChange={(fibReverse) => patch({ fibReverse })}
              />
              <SettingsCheck
                label="Prices"
                checked={draft.fibShowPrices}
                onChange={(fibShowPrices) => patch({ fibShowPrices })}
              />

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.fibShowLevels}
                  onChange={(e) => patch({ fibShowLevels: e.target.checked })}
                />
                <span className="w-[72px] shrink-0 text-[13px] text-[#d1d4dc]">Levels</span>
                <SettingsSelectWrap>
                  <select
                    className={`${settingsUi.select} w-[120px]`}
                    value={draft.fibLevelsFormat}
                    onChange={(e) =>
                      patch({ fibLevelsFormat: e.target.value as FibLevelsFormat })
                    }
                  >
                    <option value="percents">Percents</option>
                    <option value="values">Values</option>
                  </select>
                </SettingsSelectWrap>
              </div>

              <SettingsFieldRow label="Labels">
                <div className="flex items-center gap-2">
                  <SettingsSelectWrap>
                    <select
                      className={`${settingsUi.select} w-[100px]`}
                      value={draft.fibLabelH}
                      onChange={(e) =>
                        patch({ fibLabelH: e.target.value as DrawingTextHAlign })
                      }
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </SettingsSelectWrap>
                  <SettingsSelectWrap>
                    <select
                      className={`${settingsUi.select} w-[100px]`}
                      value={draft.fibLabelV}
                      onChange={(e) =>
                        patch({ fibLabelV: e.target.value as DrawingTextVAlign })
                      }
                    >
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </SettingsSelectWrap>
                </div>
              </SettingsFieldRow>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.fibShowText}
                  onChange={(e) => patch({ fibShowText: e.target.checked })}
                />
                <span className="w-[48px] shrink-0 text-[13px] text-[#d1d4dc]">Text</span>
                <SettingsSelectWrap>
                  <select
                    className={`${settingsUi.select} w-[100px]`}
                    disabled={!draft.fibShowText}
                    value={draft.textAlignH}
                    onChange={(e) =>
                      patch({ textAlignH: e.target.value as DrawingTextHAlign })
                    }
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </SettingsSelectWrap>
                <SettingsSelectWrap>
                  <select
                    className={`${settingsUi.select} w-[100px]`}
                    disabled={!draft.fibShowText}
                    value={draft.textAlignV}
                    onChange={(e) =>
                      patch({ textAlignV: e.target.value as DrawingTextVAlign })
                    }
                  >
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </SettingsSelectWrap>
              </div>
              {draft.fibShowText && (
                <textarea
                  className="min-h-[64px] w-full resize-y rounded-[4px] border border-[#363a45] bg-[#0b0e14] px-3 py-2 text-[13px] text-[#d1d4dc] outline-none focus:border-[#2962ff]"
                  placeholder="Add text"
                  value={draft.text}
                  onChange={(e) => patch({ text: e.target.value })}
                />
              )}

              <SettingsFieldRow label="Font size">
                <select
                  className={`${inputClass} w-[72px]`}
                  value={draft.textSize}
                  onChange={(e) => patch({ textSize: Number(e.target.value) || 14 })}
                >
                  {[10, 12, 14, 16, 18, 20, 24].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </SettingsFieldRow>

              <SettingsCheck
                label="Fib levels based on log scale"
                checked={draft.fibLogScale}
                onChange={(fibLogScale) => patch({ fibLogScale })}
              />
            </div>
          )}

          {!isPosition && !isFib && genericTab === "style" && drawing.tool === "rect" && (
            <div className="space-y-1">
              <SettingsFieldRow label="Extend">
                <SettingsSelectWrap>
                  <select
                    className={`${settingsUi.select} min-w-[160px]`}
                    value={draft.extend}
                    onChange={(e) => patch({ extend: e.target.value as DrawingExtend })}
                  >
                    <option value="none">Don&apos;t extend</option>
                    <option value="left">Extend left</option>
                    <option value="right">Extend right</option>
                    <option value="both">Extend both</option>
                  </select>
                </SettingsSelectWrap>
              </SettingsFieldRow>

              <SettingsFieldRow label="Border">
                <div className="flex items-center gap-2">
                  <SettingsColorSwatch
                    value={draft.color}
                    onChange={(color) => patch({ color })}
                  />
                  <select
                    className={`${inputClass} w-[56px]`}
                    value={draft.lineWidth}
                    onChange={(e) =>
                      patch({ lineWidth: Number(e.target.value) as Draft["lineWidth"] })
                    }
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </SettingsFieldRow>

              <div className="flex items-center gap-2 py-1.5">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.showMiddlePoint}
                  onChange={(e) => patch({ showMiddlePoint: e.target.checked })}
                />
                <span className="w-[92px] shrink-0 text-[13px] text-[#d1d4dc]">Middle line</span>
                <SettingsColorSwatch
                  value={draft.middleLineColor}
                  onChange={(middleLineColor) => patch({ middleLineColor })}
                  showOpacity={false}
                />
                <select
                  className={`${inputClass} min-w-[96px]`}
                  value={draft.middleLineStyle}
                  onChange={(e) =>
                    patch({ middleLineStyle: e.target.value as DrawingLineStyle })
                  }
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
                <svg width="40" height="12" className="shrink-0">
                  <line
                    x1="0"
                    y1="6"
                    x2="40"
                    y2="6"
                    stroke={draft.middleLineColor}
                    strokeWidth={1.5}
                    strokeDasharray={dashFor(draft.middleLineStyle)}
                  />
                </svg>
              </div>

              <div className="flex items-center gap-2 py-1.5">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.fillVisible}
                  onChange={(e) => patch({ fillVisible: e.target.checked })}
                />
                <span className="w-[92px] shrink-0 text-[13px] text-[#d1d4dc]">Background</span>
                <SettingsColorSwatch
                  value={draft.fillColor}
                  onChange={(fillColor) => patch({ fillColor })}
                />
              </div>
            </div>
          )}

          {!isPosition &&
            !isFib &&
            genericTab === "style" &&
            drawing.tool === "circle" && (
            <div className="space-y-1">
              <SettingsFieldRow label="Border">
                <div className="flex items-center gap-2">
                  <SettingsColorSwatch
                    value={draft.color}
                    onChange={(color) => patch({ color })}
                  />
                  <select
                    className={`${inputClass} w-[56px]`}
                    value={draft.lineWidth}
                    onChange={(e) =>
                      patch({ lineWidth: Number(e.target.value) as Draft["lineWidth"] })
                    }
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <select
                    className={`${inputClass} min-w-[96px]`}
                    value={draft.lineStyle}
                    onChange={(e) => patch({ lineStyle: e.target.value as DrawingLineStyle })}
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                  <svg width="40" height="12" className="shrink-0">
                    <line
                      x1="0"
                      y1="6"
                      x2="40"
                      y2="6"
                      stroke={draft.color}
                      strokeWidth={draft.lineWidth}
                      strokeDasharray={dashFor(draft.lineStyle)}
                    />
                  </svg>
                </div>
              </SettingsFieldRow>

              <div className="flex items-center gap-2 py-1.5">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.fillVisible}
                  onChange={(e) => patch({ fillVisible: e.target.checked })}
                />
                <span className="w-[92px] shrink-0 text-[13px] text-[#d1d4dc]">Background</span>
                <SettingsColorSwatch
                  value={draft.fillColor}
                  onChange={(fillColor) => patch({ fillColor })}
                />
              </div>
            </div>
          )}

          {!isPosition &&
            !isFib &&
            genericTab === "style" &&
            drawing.tool !== "rect" &&
            drawing.tool !== "circle" && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <SettingsColorSwatch value={draft.color} onChange={(color) => patch({ color })} />
                <select
                  className={`${inputClass} w-[72px]`}
                  value={draft.lineWidth}
                  onChange={(e) =>
                    patch({ lineWidth: Number(e.target.value) as Draft["lineWidth"] })
                  }
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <select
                  className={`${inputClass} min-w-[100px]`}
                  value={draft.lineStyle}
                  onChange={(e) => patch({ lineStyle: e.target.value as DrawingLineStyle })}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
                <svg width="48" height="12" className="text-[#d1d4dc]">
                  <line
                    x1="0"
                    y1="6"
                    x2="48"
                    y2="6"
                    stroke={draft.color}
                    strokeWidth={draft.lineWidth}
                    strokeDasharray={dashFor(draft.lineStyle)}
                  />
                </svg>
              </div>
              <SettingsFieldRow label="Extend">
                <select
                  className={`${inputClass} min-w-[140px]`}
                  value={draft.extend}
                  onChange={(e) => patch({ extend: e.target.value as DrawingExtend })}
                >
                  <option value="none">Don&apos;t extend</option>
                  <option value="left">Extend left</option>
                  <option value="right">Extend right</option>
                  <option value="both">Extend both</option>
                </select>
              </SettingsFieldRow>
              <label className="flex items-center gap-2 py-1 text-[13px] text-[#d1d4dc]">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.showMiddlePoint}
                  onChange={(e) => patch({ showMiddlePoint: e.target.checked })}
                />
                Middle point
              </label>
              <label className="flex items-center gap-2 py-1 text-[13px] text-[#d1d4dc]">
                <input
                  type="checkbox"
                  className="accent-[#2962ff]"
                  checked={draft.showPriceLabels}
                  onChange={(e) => patch({ showPriceLabels: e.target.checked })}
                />
                Price labels
              </label>
            </div>
          )}

          {!isPosition && !isFib && genericTab === "text" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <SettingsColorSwatch
                  value={draft.textColor}
                  onChange={(textColor) => patch({ textColor })}
                  showOpacity={false}
                />
                <select
                  className={`${inputClass} w-[72px]`}
                  value={draft.textSize}
                  onChange={(e) => patch({ textSize: Number(e.target.value) || 14 })}
                >
                  {[10, 12, 14, 16, 18, 20, 24].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={`flex h-7 w-7 items-center justify-center rounded border border-[#363a45] text-[13px] font-bold ${
                    draft.textBold ? "bg-[#2a2e39] text-white" : "text-[#d1d4dc]"
                  }`}
                  onClick={() => patch({ textBold: !draft.textBold })}
                >
                  B
                </button>
                <button
                  type="button"
                  className={`flex h-7 w-7 items-center justify-center rounded border border-[#363a45] text-[13px] italic ${
                    draft.textItalic ? "bg-[#2a2e39] text-white" : "text-[#d1d4dc]"
                  }`}
                  onClick={() => patch({ textItalic: !draft.textItalic })}
                >
                  I
                </button>
              </div>
              <textarea
                className="min-h-[88px] w-full resize-y rounded-[4px] border border-[#2962ff] bg-[#0b0e14] px-3 py-2 text-[13px] text-[#d1d4dc] outline-none"
                placeholder="Add text"
                value={draft.text}
                onChange={(e) => patch({ text: e.target.value })}
              />
              {drawing.tool === "rect" && (
                <SettingsFieldRow label="Text alignment">
                  <div className="flex items-center gap-2">
                    <SettingsSelectWrap>
                      <select
                        className={`${settingsUi.select} w-[110px]`}
                        value={draft.textAlignV}
                        onChange={(e) =>
                          patch({ textAlignV: e.target.value as DrawingTextVAlign })
                        }
                      >
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </SettingsSelectWrap>
                    <SettingsSelectWrap>
                      <select
                        className={`${settingsUi.select} w-[110px]`}
                        value={draft.textAlignH}
                        onChange={(e) =>
                          patch({ textAlignH: e.target.value as DrawingTextHAlign })
                        }
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </SettingsSelectWrap>
                  </div>
                </SettingsFieldRow>
              )}
            </div>
          )}

          {((!isPosition && !isFib && genericTab === "coordinates") ||
            (isFib && fibTab === "coordinates")) && (
            <div className="space-y-3">
              {draft.points.map((p, i) => (
                <div key={i}>
                  <div className="mb-1 text-[12px] text-[#787b86]">
                    #{i + 1} (price, bar time)
                  </div>
                  <div className="flex gap-2">
                    <input
                      className={`${inputClass} w-[140px]`}
                      type="number"
                      step="any"
                      value={p.price}
                      onChange={(e) => {
                        const points = draft.points.map((pt, idx) =>
                          idx === i ? { ...pt, price: Number(e.target.value) || 0 } : pt,
                        );
                        patch({ points });
                      }}
                    />
                    <input
                      className={`${inputClass} w-[140px]`}
                      type="number"
                      value={p.time}
                      onChange={(e) => {
                        const points = draft.points.map((pt, idx) =>
                          idx === i
                            ? { ...pt, time: Math.round(Number(e.target.value) || 0) }
                            : pt,
                        );
                        patch({ points });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {((!isPosition && !isFib && genericTab === "visibility") ||
            (isFib && fibTab === "visibility")) && (
            <VisibilitySettingsPanel
              value={draft.visibility}
              onChange={(visibility) => patch({ visibility })}
            />
          )}
        </SettingsBody>

        <SettingsFooter
          left={
            <SettingsBtn disabled title="Templates coming soon">
              Template
            </SettingsBtn>
          }
        >
          <SettingsBtn onClick={cancel}>Cancel</SettingsBtn>
          <SettingsBtn variant="primary" onClick={apply}>
            Ok
          </SettingsBtn>
        </SettingsFooter>
      </SettingsPanel>
    </SettingsOverlay>
  );
}
