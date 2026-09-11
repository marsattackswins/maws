"use client";

import { useAppStore } from "@/lib/store";
import type { MouseEvent } from "react";

export function useColumnWidths(tableId: string, defaults: number[]) {
  const stored = useAppStore((s) => s.columnWidths[tableId]);
  const setColumnWidths = useAppStore((s) => s.setColumnWidths);
  const widths =
    stored && stored.length === defaults.length ? stored : defaults;

  const setWidth = (index: number, next: number, min = 40) => {
    const current = useAppStore.getState().columnWidths[tableId] ?? defaults;
    const copy = current.length === defaults.length ? [...current] : [...defaults];
    copy[index] = Math.max(min, Math.round(next));
    setColumnWidths(tableId, copy);
  };

  const onResize =
    (index: number, min = 40, invert = false) =>
    (event: MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const startX = event.clientX;
      const start = useAppStore.getState().columnWidths[tableId] ?? defaults;
      const startW = start[index] ?? defaults[index];
      const prev = document.body.style.userSelect;
      document.body.style.userSelect = "none";
      const move = (ev: globalThis.MouseEvent) => {
        const dx = ev.clientX - startX;
        setWidth(index, startW + (invert ? -dx : dx), min);
      };
      const up = () => {
        document.body.style.userSelect = prev;
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    };

  const template = widths.map((w) => `${w}px`).join(" ");
  return { widths, template, onResize };
}

export function ColResize({ onMouseDown }: { onMouseDown: (e: MouseEvent<HTMLSpanElement>) => void }) {
  return (
    <span
      className="col-resizer"
      onMouseDown={onMouseDown}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
