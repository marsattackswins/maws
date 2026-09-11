"use client";

import {
  CALENDAR_FORWARD_DAYS,
  fetchCalendarEvents,
  getMockCalendarEvents,
  type CalendarEvent,
} from "@/lib/calendar";
import { getEventGuide } from "@/lib/calendar-event-guide";
import { useAppStore } from "@/lib/store";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const DAY_MS = 86_400_000;
/** Event is treated as live from release time through this window. */
const LIVE_WINDOW_MS = 30 * 60_000;

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatEventTime(at: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(at);
}

function EventCard({
  event,
  open,
  now,
  onToggle,
  onOpenSymbol,
}: {
  event: CalendarEvent;
  open: boolean;
  now: number;
  onToggle: () => void;
  onOpenSymbol: (symbol: string) => void;
}) {
  const time = formatEventTime(event.at);
  const live = now >= event.at && now < event.at + LIVE_WINDOW_MS;
  const past = !live && event.at < now;
  const guide = open ? getEventGuide(event.title) : null;
  const impactBar =
    event.impact === "high"
      ? "bg-[#f23645]"
      : event.impact === "medium"
        ? "bg-[#ffa726]"
        : "bg-[#4c525e]";
  const impactLabel =
    event.impact === "high"
      ? "High impact"
      : event.impact === "medium"
        ? "Medium impact"
        : "Low impact";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative w-full overflow-hidden rounded-md border text-left transition-colors ${
        live
          ? "border-[#3a3a3a] bg-[var(--maws-elevated)]"
          : open
            ? "border-[#333333] bg-[var(--maws-elevated)]"
            : "border-[var(--maws-border)] bg-[var(--maws-panel)] hover:border-[#2a2a2a] hover:bg-[var(--maws-elevated)]"
      } ${past ? "opacity-55" : ""}`}
    >
      <span
        className={`absolute inset-y-0 left-0 w-[3px] ${impactBar}`}
        aria-hidden
      />

      <div className="px-3 py-2.5 pr-3 pb-6 pl-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-[11px] leading-[16px]">
            <div className="flex min-w-0 items-baseline gap-2 text-[#787b86]">
              <span className="shrink-0 tabular-nums font-medium text-[#d1d4dc]">
                {time}
              </span>
              {live && (
                <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-[#d1d4dc]">
                  Live
                </span>
              )}
              <span className="text-[#333333]">·</span>
              <span className="shrink-0 uppercase tracking-wide">{event.country}</span>
            </div>
            {event.forecast ? (
              <span className="shrink-0 tabular-nums text-[#5b9cf6]">
                Forecast: {event.forecast}
              </span>
            ) : (
              <span className="shrink-0" />
            )}
          </div>

          <div className="flex items-baseline justify-between gap-3 text-[13px] leading-[18px]">
            <div className="min-w-0 font-medium text-[#d1d4dc]">{event.title}</div>
            {event.previous ? (
              <span className="shrink-0 text-[11px] leading-[16px] tabular-nums text-[#ffa726]">
                Previous: {event.previous}
              </span>
            ) : event.actual ? (
              <span className="shrink-0 text-[11px] leading-[16px] tabular-nums text-[#26a69a]">
                Actual: {event.actual}
              </span>
            ) : (
              <span className="shrink-0" />
            )}
          </div>

          {event.actual && event.previous ? (
            <div className="flex justify-end text-[11px] leading-[16px]">
              <span className="tabular-nums text-[#26a69a]">
                Actual: {event.actual}
              </span>
            </div>
          ) : null}
        </div>

        {open && guide && (
          <div className="mt-2 space-y-2.5 border-t border-[#1c1c1c] pt-2.5 text-[11px] leading-snug">
            <div>
              <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#4c525e]">
                Description
              </div>
              <p className="text-[#b2b5be]">{guide.description}</p>
            </div>
            <div>
              <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#4c525e]">
                Usual effect
              </div>
              <p className="text-[#b2b5be]">{guide.usualEffect}</p>
            </div>
            <div>
              <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#4c525e]">
                Why traders care
              </div>
              <p className="text-[#b2b5be]">{guide.whyTradersCare}</p>
            </div>
            <div
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                event.impact === "high"
                  ? "text-[#f23645]"
                  : event.impact === "medium"
                    ? "text-[#ffa726]"
                    : "text-[#4c525e]"
              }`}
            >
              {impactLabel}
            </div>
            {event.category === "crypto" ? (
              <span
                className="inline-block cursor-pointer text-[#2962ff] hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSymbol("BTCUSDT");
                }}
              >
                Open BTCUSDT
              </span>
            ) : event.category === "commodity" ? (
              <span
                className="inline-block cursor-pointer text-[#2962ff] hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSymbol("XAUUSDT");
                }}
              >
                Open XAUUSDT
              </span>
            ) : null}
          </div>
        )}
      </div>

      <span
        className={`pointer-events-none absolute right-2 bottom-1.5 text-[#4c525e] transition-opacity ${
          open ? "opacity-70" : "opacity-0 group-hover:opacity-70"
        }`}
        aria-hidden
      >
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </span>
    </button>
  );
}

export function EconomicCalendar() {
  const setSymbol = useAppStore((s) => s.setSymbol);
  const onlyFuture = useAppStore((s) => s.chartSettings.onlyFutureEvents);
  const economicEvents = useAppStore((s) => s.chartSettings.economicEvents);
  const [todayStart] = useState(() => startOfDay(Date.now()));
  const [cursor, setCursor] = useState(todayStart);
  const [selected, setSelected] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    getMockCalendarEvents().filter((e) => e.impact !== "low"),
  );
  const [source, setSource] = useState<"xoomar" | "mock">("mock");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [windowStart, setWindowStart] = useState(todayStart);
  const [windowEnd, setWindowEnd] = useState(
    todayStart + CALENDAR_FORWARD_DAYS * DAY_MS,
  );

  const [reloadToken, setReloadToken] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchCalendarEvents().then((result) => {
      if (cancelled) return;
      setEvents(result.events);
      setSource(result.source);
      setStatus(result.error ?? null);
      setWindowStart(result.windowStart);
      setWindowEnd(result.windowEnd);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const nowMs = now;
  const maxDay = windowEnd - DAY_MS;
  const minDay = windowStart;

  const dayEvents = useMemo(() => {
    return events
      .filter((e) => startOfDay(e.at) === cursor)
      .filter((e) => (onlyFuture ? e.at >= nowMs - LIVE_WINDOW_MS : true))
      .sort((a, b) => a.at - b.at);
  }, [events, cursor, onlyFuture, nowMs]);

  const label = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(cursor);

  const isToday = cursor === todayStart;
  const canPrev = cursor > minDay;
  const canNext = cursor < maxDay;

  if (!economicEvents) {
    return (
      <div className="flex h-full items-center justify-center px-4 text-center text-[13px] text-[#787b86]">
        Economic events are hidden in Settings → Events
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#222222] px-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-[13px] font-semibold text-[#d1d4dc]">Calendar</span>
          <span
            className="truncate text-[10px] uppercase tracking-wide text-[#4c525e]"
            title={status ?? undefined}
          >
            {loading
              ? "…"
              : source === "mock"
                ? "Demo"
                : "Live"}
          </span>
          <button
            type="button"
            title="Reload calendar"
            className="h-5 rounded px-1 text-[10px] text-[#4c525e] hover:bg-[#222222] hover:text-[#d1d4dc]"
            onClick={() => setReloadToken((n) => n + 1)}
          >
            Reload
          </button>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Previous day"
            disabled={!canPrev}
            className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#787b86] hover:bg-[#222222] disabled:opacity-30"
            onClick={() => setCursor(Math.max(minDay, cursor - DAY_MS))}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="min-w-[4.5rem] px-1 text-center text-[12px] text-[#d1d4dc] hover:text-white"
            onClick={() => setCursor(todayStart)}
          >
            {isToday ? "Today" : label}
          </button>
          <button
            type="button"
            title="Next day"
            disabled={!canNext}
            className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#787b86] hover:bg-[#222222] disabled:opacity-30"
            onClick={() => setCursor(Math.min(maxDay, cursor + DAY_MS))}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {source === "mock" && status && (
        <div className="shrink-0 border-b border-[#222222] px-2 py-1 text-[10px] text-[#787b86]">
          {status}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
        {dayEvents.length === 0 && (
          <div className="px-2 py-8 text-center text-[12px] text-[#787b86]">
            {loading ? "Loading events…" : "No high/medium events this day"}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {dayEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              open={selected === event.id}
              now={nowMs}
              onToggle={() =>
                setSelected(selected === event.id ? null : event.id)
              }
              onOpenSymbol={setSymbol}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
