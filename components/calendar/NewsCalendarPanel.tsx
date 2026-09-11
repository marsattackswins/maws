"use client";

import { EconomicCalendar } from "@/components/calendar/EconomicCalendar";
import { NewsPanel } from "@/components/news/NewsPanel";
import { useAppStore } from "@/lib/store";
import { useRef } from "react";

const MIN_RATIO = 0.22;
const MAX_RATIO = 0.78;

/** Combined Calendar + News dock with a vertical resize split (Calendar on top). */
export function NewsCalendarPanel() {
  const calendarRatio = useAppStore((s) => s.calendarNewsSplit);
  const setCalendarNewsSplit = useAppStore((s) => s.setCalendarNewsSplit);
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef} className="flex h-full min-h-0 flex-col">
      <div
        className="min-h-0 overflow-hidden"
        style={{ flex: `${calendarRatio} 1 0%` }}
      >
        <EconomicCalendar />
      </div>

      <div
        className="relative z-10 h-1.5 shrink-0 cursor-row-resize border-y border-[var(--maws-border)] bg-[var(--maws-panel)] hover:bg-[var(--maws-elevated)]"
        title="Drag to resize Calendar / News"
        onMouseDown={(e) => {
          e.preventDefault();
          const el = rootRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const prev = document.body.style.userSelect;
          document.body.style.userSelect = "none";
          const move = (ev: MouseEvent) => {
            const next = (ev.clientY - rect.top) / Math.max(1, rect.height);
            setCalendarNewsSplit(Math.min(MAX_RATIO, Math.max(MIN_RATIO, next)));
          };
          const up = () => {
            document.body.style.userSelect = prev;
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
          };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", up);
        }}
      />

      <div
        className="min-h-0 overflow-hidden"
        style={{ flex: `${1 - calendarRatio} 1 0%` }}
      >
        <NewsPanel />
      </div>
    </div>
  );
}
