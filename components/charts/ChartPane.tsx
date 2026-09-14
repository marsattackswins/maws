"use client";

import { ChartAutoScale } from "@/components/charts/ChartAutoScale";
import { ChartCanvas, type StudyPaneLayout } from "@/components/charts/ChartCanvas";
import { ChartNavigation } from "@/components/charts/ChartNavigation";
import { CrosshairPlus } from "@/components/charts/CrosshairPlus";
import { IndicatorLegend } from "@/components/charts/IndicatorLegend";
import { IndicatorPaneAutoScale } from "@/components/charts/IndicatorPaneAutoScale";
import { TradeMarks } from "@/components/charts/TradeMarks";
import { SessionBreaks } from "@/components/charts/SessionBreaks";
import { OrderBlocks } from "@/components/charts/OrderBlocks";
import { DrawingOverlay } from "@/components/drawings/DrawingOverlay";
import { getChart } from "@/lib/chart-registry";
import { MAIN_PRICE_PANE_ID } from "@/lib/slices/chart-slice";
import { OVERLAY_INDICATORS, PANE_INDICATORS } from "@/lib/indicators";
import { useAppStore } from "@/lib/store";
import type { ChartPaneState } from "@/types";
import { Maximize2, Minimize2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type Props = {
  pane: ChartPaneState;
};

export function ChartPane({ pane }: Props) {
  const activePaneId = useAppStore((s) => s.activePaneId);
  const layoutCount = useAppStore((s) => s.layoutCount);
  const setActivePane = useAppStore((s) => s.setActivePane);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setContextMenu = useAppStore((s) => s.setContextMenu);
  const showStatusLine = useAppStore(
    (s) =>
      s.chartSettings.showLogo ||
      s.chartSettings.showTitle ||
      s.chartSettings.showMarketStatus ||
      s.chartSettings.showChartValues ||
      s.chartSettings.showBarChange ||
      s.chartSettings.showVolume ||
      s.chartSettings.showLastDayChange,
  );
  const showPlusButton = useAppStore((s) => s.chartSettings.showPlusButton);
  const navigationButtons = useAppStore((s) => s.chartSettings.navigationButtons);
  const scaleModes = useAppStore((s) => s.chartSettings.scaleModes);
  const showIndicatorLegend = useAppStore((s) => s.chartSettings.showIndicatorLegend);
  const chartBg = useAppStore((s) => s.chartSettings.backgroundColor);
  const maximizedPaneId = useAppStore((s) => s.maximizedPaneId);
  const focusedPane = useAppStore((s) => s.focusedPane);
  const setMaximizedPane = useAppStore((s) => s.setMaximizedPane);
  const [studyLayouts, setStudyLayouts] = useState<StudyPaneLayout[]>([]);
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
  const [overMaximize, setOverMaximize] = useState(false);
  const autoScaleOn = useAppStore((s) => s.autoScaleByPane[pane.id] ?? true);
  const setPaneAutoScale = useAppStore((s) => s.setPaneAutoScale);
  const chartHostRef = useRef<HTMLDivElement>(null);
  const selectedStillPresent =
    !selectedStudyId || pane.studies.some((s) => s.id === selectedStudyId);
  const effectiveSelectedId = selectedStillPresent ? selectedStudyId : null;
  const active = pane.id === activePaneId;
  const maximized = maximizedPaneId === pane.id;
  const showMaximize = layoutCount > 1 || Boolean(maximizedPaneId);
  const requestedFocus = focusedPane?.chartPaneId === pane.id ? focusedPane.paneId : null;
  const focusedTarget =
    requestedFocus === MAIN_PRICE_PANE_ID ||
    pane.studies.some(
      (study) => study.id === requestedFocus && PANE_INDICATORS.includes(study.type),
    )
      ? requestedFocus
      : null;
  const showMainLegend = focusedTarget === null || focusedTarget === MAIN_PRICE_PANE_ID;

  const onSymbolClick = useCallback(() => {
    setActivePane(pane.id);
    setSearchOpen(true);
  }, [pane.id, setActivePane, setSearchOpen]);

  const onStudyLayouts = useCallback((layouts: StudyPaneLayout[]) => {
    setStudyLayouts((prev) => {
      if (
        prev.length === layouts.length &&
        prev.every(
          (p, i) =>
            p.instanceId === layouts[i]?.instanceId &&
            p.type === layouts[i]?.type &&
            Math.abs(p.top - layouts[i]!.top) < 0.5 &&
            Math.abs(p.height - layouts[i]!.height) < 0.5,
        )
      ) {
        return prev;
      }
      return layouts;
    });
  }, []);

  return (
    <section
      onMouseDown={() => setActivePane(pane.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        setActivePane(pane.id);
        const handle = getChart(pane.id);
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const price = handle?.series.coordinateToPrice(e.clientY - rect.top) ?? 0;
        const timeRaw = handle?.chart.timeScale().coordinateToTime(e.clientX - rect.left);
        const time = typeof timeRaw === "number" ? timeRaw : null;
        setContextMenu({ x: e.clientX, y: e.clientY, paneId: pane.id, price, time });
      }}
      className="group relative flex h-full min-h-0 min-w-0 flex-col"
      style={{ background: chartBg || "#000000" }}
    >
      <div ref={chartHostRef} data-chart-host className="relative min-h-0 flex-1">
        <DrawingOverlay pane={pane} studyLayouts={studyLayouts} />
        <ChartCanvas
          pane={pane}
          active={active}
          showMainLegend={showMainLegend}
          onSymbolClick={onSymbolClick}
          onStudyLayouts={onStudyLayouts}
        />
        <SessionBreaks pane={pane} />
        <OrderBlocks pane={pane} />
        <TradeMarks pane={pane} />
        <div
          className={`pointer-events-none absolute left-2 z-30 flex flex-col items-start gap-1 ${
            showStatusLine ? "top-7" : "top-1"
          }`}
        >
          {showIndicatorLegend && showMainLegend && (
            <IndicatorLegend
              pane={pane}
              ids={[...OVERLAY_INDICATORS]}
              selectedId={effectiveSelectedId}
              onSelect={setSelectedStudyId}
            />
          )}
        </div>
        {showIndicatorLegend &&
          studyLayouts
            .filter((layout) => focusedTarget === null || focusedTarget === layout.instanceId)
            .map((layout) => (
              <div
                key={`${pane.id}-${layout.instanceId}-legend`}
                className="pointer-events-none absolute left-2 z-30"
                style={{ top: Math.max(2, layout.top + 2) }}
              >
                <IndicatorLegend
                  pane={pane}
                  instanceIds={[layout.instanceId]}
                  showCollapse={false}
                  selectedId={effectiveSelectedId}
                  onSelect={setSelectedStudyId}
                />
              </div>
            ))}
        {/* Auto-scale buttons for each indicator sub-pane (hover-visible, one per pane). */}
        {studyLayouts.map((layout, i) => (
          <IndicatorPaneAutoScale
            key={`${pane.id}-${layout.instanceId}-autoscale`}
            chartPaneId={pane.id}
            layout={layout}
            paneIndex={i + 1}
          />
        ))}
        {showPlusButton && <CrosshairPlus pane={pane} suppress={overMaximize} />}
        <ChartNavigation
          paneId={pane.id}
          mode={navigationButtons}
          onViewReset={() => setPaneAutoScale(pane.id, true)}
        />
        <ChartAutoScale
          paneId={pane.id}
          mode={scaleModes}
          hostRef={chartHostRef}
          active={autoScaleOn}
          onActiveChange={(on) => setPaneAutoScale(pane.id, on)}
        />
        {showMaximize && (
          <div
            data-maximize-zone
            className="absolute top-0 right-[62px] z-40 flex h-8 w-10 items-center justify-center"
            onMouseEnter={() => setOverMaximize(true)}
            onMouseLeave={() => setOverMaximize(false)}
          >
            <button
              type="button"
              title={maximized ? "Restore layout (Esc)" : "Maximize chart"}
              className="flex h-6 w-6 items-center justify-center rounded-[3px] text-[#787b86] hover:bg-[#222222] hover:text-[#d1d4dc]"
              onClick={(e) => {
                e.stopPropagation();
                setActivePane(pane.id);
                setMaximizedPane(maximized ? null : pane.id);
              }}
            >
              {maximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
