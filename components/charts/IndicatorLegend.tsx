"use client";

import { computeBbPlot, computeEmaPlot, computePmo, computeStochastic, computeVolumeMa, computeVwapPlot, INDICATOR_ORDER, indicatorTitle } from "@/lib/indicators";
import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import type { ChartPaneState, IndicatorId, IndicatorInstance } from "@/types";
import { ChevronUp, Eye, EyeOff, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  pane: ChartPaneState;
  /** Filter by type (overlay legend). */
  ids?: IndicatorId[];
  /** Filter by concrete study instance ids (study-pane legends). */
  instanceIds?: string[];
  /** Show the collapse chevron (main overlay only). */
  showCollapse?: boolean;
  /** Shared selection across all legends on this chart. */
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
};

function studyInputHint(study: IndicatorInstance): string {
  const s = study.settings as Record<string, unknown>;
  if (study.type === "rsi") return ` (${s.period})`;
  if (study.type === "atr") return ` (${s.period})`;
  if (study.type === "adx") return ` (${s.period})`;
  if (study.type === "pmo") {
    if (!(s.showStatusInputs as boolean)) return "";
    return ` (${s.period1}, ${s.period2}, ${s.signalPeriod})`;
  }
  if (study.type === "ob") {
    if (!(s.showStatusInputs as boolean)) return "";
    return ` (${s.swingLookback}, ${s.showLastBull}, ${s.showLastBear})`;
  }
  if (study.type === "volume") {
    if (!(s.showStatusInputs as boolean)) return "";
    return ` (${s.maLength})`;
  }
  if (study.type === "ema") {
    if (!(s.showStatusInputs as boolean)) return "";
    return ` (${s.period})`;
  }
  if (study.type === "bb") {
    if (!(s.showStatusInputs as boolean)) return "";
    return ` (${s.period}, ${s.mult})`;
  }
  if (study.type === "stoch") {
    if (!(s.showStatusInputs as boolean)) return "";
    return ` (${s.length}, ${s.kSmoothing}, ${s.dSmoothing})`;
  }
  if (study.type === "vwap") {
    if (!(s.showStatusInputs as boolean)) return "";
    const anchor = String(s.anchorPeriod ?? "session");
    return ` (${anchor})`;
  }
  return "";
}

function studyStatusValues(study: IndicatorInstance, pane: ChartPaneState): string {
  const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
  if (!candles.length) return "";
  const i = candles.length - 1;

  if (study.type === "ema") {
    const ema = study.settings as import("@/types").EmaIndicatorSettings;
    if (!ema.showStatusValues || ema.visible === false) return "";
    const { line } = computeEmaPlot(candles, ema);
    if (line[i] == null) return "";
    const prec = ema.precision === "default" ? 2 : ema.precision;
    return ` ${line[i]!.toFixed(prec)}`;
  }

  if (study.type === "volume") {
    const vol = study.settings as import("@/types").VolumeIndicatorSettings;
    if (!vol.showStatusValues) return "";
    const parts: string[] = [];
    if (vol.volumeVisible && candles[i]?.volume != null) {
      parts.push(Math.round(candles[i].volume).toLocaleString("en-US"));
    }
    if (vol.maVisible) {
      const ma = computeVolumeMa(candles, vol.maLength)[i];
      if (ma != null) parts.push(Math.round(ma).toLocaleString("en-US"));
    }
    return parts.length ? ` ${parts.join("  ")}` : "";
  }

  if (study.type === "vwap") {
    const vwap = study.settings as import("@/types").VwapIndicatorSettings;
    if (!vwap.showStatusValues || vwap.visible === false) return "";
    const line = computeVwapPlot(candles, vwap, pane.timeframe);
    if (line[i] == null) return "";
    const prec = vwap.precision === "default" ? 2 : vwap.precision;
    return ` ${line[i]!.toFixed(prec)}`;
  }

  if (study.type === "bb") {
    const bb = study.settings as import("@/types").BbIndicatorSettings;
    if (!bb.showStatusValues) return "";
    const plot = computeBbPlot(candles, bb);
    const prec = bb.precision === "default" ? 2 : bb.precision;
    const parts: string[] = [];
    if (bb.basisVisible && plot.basis[i] != null) parts.push(plot.basis[i]!.toFixed(prec));
    if (bb.upperVisible && plot.upper[i] != null) parts.push(plot.upper[i]!.toFixed(prec));
    if (bb.lowerVisible && plot.lower[i] != null) parts.push(plot.lower[i]!.toFixed(prec));
    return parts.length ? ` ${parts.join("  ")}` : "";
  }

  if (study.type === "stoch") {
    const stoch = study.settings as import("@/types").StochIndicatorSettings;
    if (!stoch.showStatusValues) return "";
    const { k, d } = computeStochastic(
      candles,
      stoch.length,
      stoch.kSmoothing,
      stoch.dSmoothing,
    );
    const prec = stoch.precision === "default" ? 2 : stoch.precision;
    const parts: string[] = [];
    if (stoch.kVisible !== false && k[i] != null) parts.push(k[i]!.toFixed(prec));
    if (stoch.dVisible !== false && d[i] != null) parts.push(d[i]!.toFixed(prec));
    return parts.length ? ` ${parts.join("  ")}` : "";
  }

  if (study.type === "pmo") {
    const pmo = study.settings as import("@/types").PmoIndicatorSettings;
    if (!pmo.showStatusValues) return "";
    const { pmo: pmoLine, signal: signalLine } = computePmo(
      candles,
      pmo.period1,
      pmo.period2,
      pmo.signalPeriod,
      pmo.source,
    );
    const prec = pmo.precision === "default" ? 2 : pmo.precision;
    const parts: string[] = [];
    if (pmo.pmoVisible && pmoLine[i] != null) parts.push(pmoLine[i]!.toFixed(prec));
    if (pmo.signalVisible && signalLine[i] != null) parts.push(signalLine[i]!.toFixed(prec));
    return parts.length ? ` ${parts.join("  ")}` : "";
  }

  return "";
}

export function IndicatorLegend({
  pane,
  ids,
  instanceIds,
  showCollapse = true,
  selectedId = null,
  onSelect,
}: Props) {
  const removeIndicator = useAppStore((s) => s.removeIndicator);
  const setIndicatorHidden = useAppStore((s) => s.setIndicatorHidden);
  const setIndicatorSettingsOpen = useAppStore((s) => s.setIndicatorSettingsOpen);
  const showInputs = useAppStore((s) => s.chartSettings.showIndicatorInputs);
  const showBg = useAppStore((s) => s.chartSettings.showIndicatorBackground);
  const bgOpacity = useAppStore((s) => s.chartSettings.indicatorBackgroundOpacity);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const allow = ids ?? INDICATOR_ORDER;
  const studies = pane.studies.filter((s) => {
    if (instanceIds) return instanceIds.includes(s.id);
    return allow.includes(s.type);
  });

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("[data-ind-legend]")) return;
      onSelect?.(null);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [onSelect]);

  if (studies.length === 0) return null;

  const bg =
    showBg && bgOpacity > 0
      ? `rgba(0,0,0,${Math.min(1, Math.max(0, bgOpacity / 100) * 0.55)})`
      : "transparent";

  const openSettings = (id: string) => {
    setIndicatorSettingsOpen(id);
  };

  const select = (id: string) => {
    onSelect?.(id);
  };

  return (
    <div
      data-ind-legend
      className="pointer-events-auto flex flex-col items-start rounded-[4px] px-1 py-0.5"
      style={{ background: bg }}
    >
      <div
        className={`grid w-full transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {studies.map((study) => {
            const hidden = Boolean(study.hidden);
            const on = selectedId === study.id;
            const showActions = on || hoveredId === study.id;
            const showInput =
              showInputs ||
              (study.type === "stoch" &&
                (study.settings as import("@/types").StochIndicatorSettings).showStatusInputs) ||
              (study.type === "ema" &&
                (study.settings as import("@/types").EmaIndicatorSettings).showStatusInputs) ||
              (study.type === "bb" &&
                (study.settings as import("@/types").BbIndicatorSettings).showStatusInputs) ||
              (study.type === "volume" &&
                (study.settings as import("@/types").VolumeIndicatorSettings).showStatusInputs) ||
              (study.type === "vwap" &&
                (study.settings as import("@/types").VwapIndicatorSettings).showStatusInputs);
            return (
              <div
                key={study.id}
                className="relative"
                onMouseEnter={() => setHoveredId(study.id)}
                onMouseLeave={() => {
                  setHoveredId((cur) => (cur === study.id ? null : cur));
                }}
              >
                <div
                  className={`ind-row ${on ? "is-on" : ""} ${hidden ? "is-off" : ""}`}
                  onClick={() => select(study.id)}
                >
                  <span
                    className="ind-title"
                    onClick={(e) => {
                      e.stopPropagation();
                      select(study.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      select(study.id);
                      openSettings(study.id);
                    }}
                  >
                    {indicatorTitle(study.type, pane.symbol)}
                    {showInput ? (
                      <span className="ind-inputs">{studyInputHint(study)}</span>
                    ) : null}
                    <span className="ind-values">{studyStatusValues(study, pane)}</span>
                  </span>
                  <button
                    type="button"
                    title={hidden ? "Show" : "Hide"}
                    className="ind-hide"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndicatorHidden(study.id, !hidden, pane.id);
                    }}
                  >
                    {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <div className={`ind-actions ${showActions ? "is-open" : ""}`}>
                    <button
                      type="button"
                      title="Settings"
                      className="flex h-[18px] w-[18px] items-center justify-center text-[#787b86] hover:text-[#d1d4dc]"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSettings(study.id);
                      }}
                    >
                      <Settings size={13} />
                    </button>
                    <button
                      type="button"
                      title="Remove"
                      className="flex h-[18px] w-[18px] items-center justify-center text-[#787b86] hover:text-[#f23645]"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeIndicator(study.id, pane.id);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showCollapse && (
        <button
          type="button"
          className="mt-0.5 flex h-[16px] w-[16px] items-center justify-center text-[#787b86] hover:text-[#d1d4dc]"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand" : "Collapse"}
          aria-expanded={!collapsed}
        >
          <ChevronUp
            size={13}
            className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              collapsed ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      )}
    </div>
  );
}
