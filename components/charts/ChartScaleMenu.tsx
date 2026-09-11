"use client";

import { useAppStore } from "@/lib/store";
import {
  filterTimezones,
  groupTimezones,
  liveOffsetLabel,
  timezoneIana,
  timezoneOption,
  timezoneTitle,
  type AppTimezone,
} from "@/lib/timezone";
import {
  Check,
  ChevronRight,
  Globe,
  RotateCcw,
  Settings,
  Search,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { applyAutoFit, clearAutoFit } from "@/components/charts/ChartAutoScale";

// ─── helpers ────────────────────────────────────────────────────────────────

type ScaleMode = "normal" | "logarithmic" | "percentage" | "indexed100";

function ScaleModeLabel(mode: ScaleMode): string {
  if (mode === "logarithmic") return "Logarithmic";
  if (mode === "percentage") return "Percent";
  if (mode === "indexed100") return "Indexed to 100";
  return "Regular";
}

// ─── sub-panel: timezone picker ─────────────────────────────────────────────

function TimezonePicker({ onClose }: { onClose: () => void }) {
  const timezone = useAppStore((s) => s.chartSettings.timezone);
  const patchChartSettings = useAppStore((s) => s.patchChartSettings);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const groups = useMemo(() => groupTimezones(filterTimezones(query)), [query]);
  const current = timezoneOption(timezone);

  useEffect(() => {
    const id = window.setTimeout(() => {
      searchRef.current?.focus();
      activeRef.current?.scrollIntoView({ block: "nearest" });
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const select = (id: AppTimezone) => {
    patchChartSettings({ timezone: id });
    onClose();
  };

  return (
    <div className="scale-menu-tz-panel">
      {/* header */}
      <div className="scale-menu-tz-header">
        <button
          type="button"
          className="scale-menu-tz-back"
          onClick={onClose}
        >
          <ChevronRight
            size={13}
            style={{ transform: "rotate(180deg)" }}
          />
        </button>
        <span className="scale-menu-tz-title">Timezone</span>
      </div>

      {/* search */}
      <div className="scale-menu-tz-search">
        <label className="scale-menu-tz-search-label">
          <Search size={12} className="scale-menu-tz-search-icon" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or UTC offset"
            className="scale-menu-tz-search-input"
          />
        </label>
      </div>

      {/* list */}
      <div className="scale-menu-tz-list">
        {groups.length === 0 ? (
          <div className="scale-menu-tz-empty">No timezones match &quot;{query}&quot;</div>
        ) : (
          groups.map((group) => (
            <div key={group.region}>
              <div className="scale-menu-tz-region">
                {group.region.toUpperCase()}
              </div>
              {group.items.map((opt) => {
                const on = opt.id === current.id;
                return (
                  <button
                    key={opt.id}
                    ref={on ? activeRef : undefined}
                    type="button"
                    role="menuitemradio"
                    aria-checked={on}
                    className="scale-menu-tz-row"
                    style={on ? { background: "var(--maws-hover)" } : undefined}
                    onClick={() => select(opt.id)}
                  >
                    <span className="scale-menu-tz-check">
                      {on && <Check size={12} />}
                    </span>
                    <span className="scale-menu-tz-name">{timezoneTitle(opt)}</span>
                    <span className="scale-menu-tz-offset">
                      {liveOffsetLabel(opt.iana)}
                    </span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── sub-panel: labels submenu ───────────────────────────────────────────────

function LabelsSubmenu({ onClose }: { onClose: () => void }) {
  const settings = useAppStore((s) => s.chartSettings);
  const patch = useAppStore((s) => s.patchChartSettings);

  const rows: { label: string; key: keyof typeof settings; val: "value" | "line" | "value_line" | "hidden" }[] = [
    { label: "Last price", key: "lastPriceDisplay", val: settings.lastPriceDisplay as "value" | "line" | "value_line" | "hidden" },
    { label: "Prev day close", key: "prevDayClose", val: settings.prevDayClose as "value" | "line" | "hidden" },
    { label: "High/Low", key: "highLowDisplay", val: settings.highLowDisplay as "value" | "line" | "hidden" },
    { label: "Bid/Ask", key: "bidAskDisplay", val: settings.bidAskDisplay as "value" | "line" | "hidden" },
  ];

  const displayOptions = ["value", "line", "value_line", "hidden"] as const;

  return (
    <div className="scale-menu-sub-panel">
      <div className="scale-menu-tz-header">
        <button type="button" className="scale-menu-tz-back" onClick={onClose}>
          <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} />
        </button>
        <span className="scale-menu-tz-title">Labels</span>
      </div>
      <div className="scale-menu-sub-body">
        {rows.map(({ label, key }) => {
          const current = settings[key] as string;
          return (
            <div key={key} className="scale-menu-sub-row">
              <span className="scale-menu-sub-label">{label}</span>
              <div className="scale-menu-sub-options">
                {displayOptions
                  .filter((o) => key !== "prevDayClose" && key !== "highLowDisplay" && key !== "bidAskDisplay" ? true : o !== "value_line")
                  .map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`scale-menu-sub-opt ${current === opt ? "scale-menu-sub-opt--on" : ""}`}
                      onClick={() => patch({ [key]: opt } as never)}
                    >
                      {opt === "value_line" ? "value+line" : opt}
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── sub-panel: lines submenu ────────────────────────────────────────────────

function LinesSubmenu({ onClose }: { onClose: () => void }) {
  const settings = useAppStore((s) => s.chartSettings);
  const patch = useAppStore((s) => s.patchChartSettings);

  const rows: { label: string; key: "showAlertLines" | "showOrderLines" | "showPositionLines" | "showTpSlLines" | "showLiqLines" }[] = [
    { label: "Alert lines", key: "showAlertLines" },
    { label: "Order lines", key: "showOrderLines" },
    { label: "Position lines", key: "showPositionLines" },
    { label: "TP / SL lines", key: "showTpSlLines" },
    { label: "Liquidation lines", key: "showLiqLines" },
  ];

  return (
    <div className="scale-menu-sub-panel">
      <div className="scale-menu-tz-header">
        <button type="button" className="scale-menu-tz-back" onClick={onClose}>
          <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} />
        </button>
        <span className="scale-menu-tz-title">Lines</span>
      </div>
      <div className="scale-menu-sub-body">
        {rows.map(({ label, key }) => (
          <button
            key={key}
            type="button"
            className="scale-menu-check-row"
            onClick={() => patch({ [key]: !settings[key] } as never)}
          >
            <span className="scale-menu-check-box">
              {settings[key] && <Check size={11} />}
            </span>
            <span className="scale-menu-check-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

type Props = {
  paneId: string;
  style?: CSSProperties;
  visibility: string;
  autoScaleOn: boolean;
  onAutoChangeAction: (on: boolean) => void;
  onOpenChangeAction?: (open: boolean) => void;
};

type Panel = "main" | "timezone" | "labels" | "lines";

export function ChartScaleMenu({
  paneId,
  style,
  visibility,
  autoScaleOn,
  onAutoChangeAction,
  onOpenChangeAction,
}: Props) {
  const setActivePane = useAppStore((s) => s.setActivePane);
  const settings = useAppStore((s) => s.chartSettings);
  const patch = useAppStore((s) => s.patchChartSettings);
  const setPaneAutoScale = useAppStore((s) => s.setPaneAutoScale);

  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("main");
  const rootRef = useRef<HTMLDivElement>(null);

  const setOpenAndNotify = useCallback(
    (v: boolean) => {
      setOpen(v);
      onOpenChangeAction?.(v);
    },
    [onOpenChangeAction],
  );

  // Derive a clock + offset for the timezone row display
  const [tzOffset, setTzOffset] = useState(() => liveOffsetLabel(timezoneIana(settings.timezone)));
  useEffect(() => {
    const tick = () => setTzOffset(liveOffsetLabel(timezoneIana(settings.timezone)));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [settings.timezone]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpenAndNotify(false);
        setPanel("main");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenAndNotify(false);
        setPanel("main");
      }
    };
    const id = window.setTimeout(() => {
      window.addEventListener("mousedown", onDown);
      window.addEventListener("keydown", onKey);
    }, 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpenAndNotify]);

  const close = () => {
    setOpenAndNotify(false);
    setPanel("main");
  };

  const currentMode = settings.priceScaleMode ?? "normal";
  const tzCurrent = timezoneOption(settings.timezone);

  // Dropdown should open upward from the gear button, anchored to the right edge
  // of the scale corner (same parent as the auto label).
  const menuStyle: CSSProperties = {
    position: "absolute",
    bottom: "100%",
    right: 0,
    marginBottom: 4,
    zIndex: 50,
    width: 256,
  };

  return (
    <div
      ref={rootRef}
      className={`absolute z-41 flex items-center justify-center ${visibility}`}
      style={style}
    >
      {/* gear button */}
      <button
        type="button"
        title="Price scale settings"
        aria-label="Price scale settings"
        aria-expanded={open}
        className={`scale-menu-gear ${open ? "scale-menu-gear--open" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDownCapture={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActivePane(paneId);
          if (!open) setPanel("main");
          setOpenAndNotify(!open);
        }}
      >
        <Settings size={11} />
      </button>

      {/* dropdown */}
      {open && (
        <div
          className="scale-menu-dropdown"
          style={menuStyle}
          data-dropdown-open
          onPointerDownCapture={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {panel === "main" && (
            <>
              {/* Reset */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => {
                  applyAutoFit(paneId);
                  setPaneAutoScale(paneId, true);
                  onAutoChangeAction(true);
                  close();
                }}
              >
                <span className="ctx-ico"><RotateCcw size={13} /></span>
                <span className="ctx-body">
                  <span className="ctx-label">Reset price scale</span>
                  <span className="ctx-shortcut">Alt+R</span>
                </span>
              </button>

              {/* Auto */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => {
                  if (autoScaleOn) {
                    clearAutoFit(paneId);
                    onAutoChangeAction(false);
                  } else {
                    applyAutoFit(paneId);
                    onAutoChangeAction(true);
                  }
                  close();
                }}
              >
                <span className="ctx-ico">
                  {autoScaleOn && <Check size={13} />}
                </span>
                <span className="ctx-body">
                  <span className="ctx-label">Auto (fits data to screen)</span>
                </span>
              </button>

              {/* Lock price to bar ratio */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => {
                  patch({ lockPriceRatio: !settings.lockPriceRatio });
                  close();
                }}
              >
                <span className="ctx-ico">
                  {settings.lockPriceRatio && <Check size={13} />}
                </span>
                <span className="ctx-body">
                  <span className="ctx-label">Lock price to bar ratio</span>
                </span>
              </button>

              {/* Scale price chart only — hides volume/study scales */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => {
                  patch({ scaleModes: settings.scaleModes === "never" ? "always" : "never" });
                  close();
                }}
              >
                <span className="ctx-ico">
                  {settings.scaleModes === "never" && <Check size={13} />}
                </span>
                <span className="ctx-body">
                  <span className="ctx-label">Scale price chart only</span>
                </span>
              </button>

              {/* Invert scale */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => {
                  patch({ invertScale: !settings.invertScale });
                  close();
                }}
              >
                <span className="ctx-ico">
                  {settings.invertScale && <Check size={13} />}
                </span>
                <span className="ctx-body">
                  <span className="ctx-label">Invert scale</span>
                  <span className="ctx-shortcut">Alt+I</span>
                </span>
              </button>

              <div className="ctx-sep" />

              {/* Scale mode radio group */}
              {(["normal", "percentage", "indexed100", "logarithmic"] as ScaleMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className="ctx-item"
                  onClick={() => {
                    patch({
                      priceScaleMode: m,
                      // keep legacy logScale in sync
                      logScale: m === "logarithmic",
                    });
                    close();
                  }}
                >
                  <span className="ctx-ico">
                    {currentMode === m && <Check size={13} />}
                  </span>
                  <span className="ctx-body">
                    <span className="ctx-label">{ScaleModeLabel(m)}</span>
                    {m === "logarithmic" && <span className="ctx-shortcut">Alt+L</span>}
                    {m === "percentage" && <span className="ctx-shortcut">Alt+P</span>}
                  </span>
                </button>
              ))}

              <div className="ctx-sep" />

              {/* Move scale to left / right */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => {
                  const next = settings.scalesPlacement === "left" ? "right" : "left";
                  patch({ scalesPlacement: next });
                  close();
                }}
              >
                <span className="ctx-ico" />
                <span className="ctx-body">
                  <span className="ctx-label">
                    {settings.scalesPlacement === "left"
                      ? "Move scale to right"
                      : "Move scale to left"}
                  </span>
                </span>
              </button>

              <div className="ctx-sep" />

              {/* Labels → */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => setPanel("labels")}
              >
                <span className="ctx-ico" />
                <span className="ctx-body">
                  <span className="ctx-label">Labels</span>
                  <span className="ctx-trail"><ChevronRight size={12} /></span>
                </span>
              </button>

              {/* Lines → */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => setPanel("lines")}
              >
                <span className="ctx-ico" />
                <span className="ctx-body">
                  <span className="ctx-label">Lines</span>
                  <span className="ctx-trail"><ChevronRight size={12} /></span>
                </span>
              </button>

              {/* Plus button toggle */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => {
                  patch({ showPlusButton: !settings.showPlusButton });
                  close();
                }}
              >
                <span className="ctx-ico">
                  {settings.showPlusButton && <Check size={13} />}
                </span>
                <span className="ctx-body">
                  <span className="ctx-label">Plus button</span>
                </span>
              </button>

              <div className="ctx-sep" />

              {/* Timezone → */}
              <button
                type="button"
                className="ctx-item"
                onClick={() => setPanel("timezone")}
              >
                <span className="ctx-ico"><Globe size={13} /></span>
                <span className="ctx-body">
                  <span className="ctx-label" style={{ flex: 1 }}>
                    Timezone
                  </span>
                  <span className="ctx-shortcut" style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {timezoneTitle(tzCurrent)} {tzOffset}
                  </span>
                  <span className="ctx-trail" style={{ marginLeft: 4 }}>
                    <ChevronRight size={12} />
                  </span>
                </span>
              </button>
            </>
          )}

          {panel === "timezone" && (
            <TimezonePicker onClose={() => setPanel("main")} />
          )}

          {panel === "labels" && (
            <LabelsSubmenu onClose={() => setPanel("main")} />
          )}

          {panel === "lines" && (
            <LinesSubmenu onClose={() => setPanel("main")} />
          )}
        </div>
      )}
    </div>
  );
}
