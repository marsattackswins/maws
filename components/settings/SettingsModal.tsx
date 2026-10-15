"use client";

/**
 * SettingsModal.tsx — Keyboard shortcuts only.
 *
 * The ONE global settings panel is Vela's native settings dialog (top-bar gear
 * icon): its built-in tabs plus the full MAWS host-section set contributed by
 * `mawsHostSections()` (Status line, Scales & labels, Chart chrome, Theme with
 * app colors, Trading, Alerts, Events). Chart cosmetics follow the store↔Vela
 * bridge in `lib/vela-chart-settings.ts`, so editing there persists and applies
 * everywhere.
 *
 * This modal is kept solely for the keyboard shortcuts panel, which requires
 * live key-capture and cannot be expressed as Vela host-section rows.
 */

import { KeyboardShortcutsPanel } from "@/components/settings/KeyboardShortcutsPanel";
import { useAppStore } from "@/lib/store";
import { Keyboard, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

export function SettingsModal() {
  const open = useAppStore((s) => s.settingsOpen);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDragged(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !(target instanceof Node)) return;
      if (boxRef.current?.contains(target)) return;
      if (target.closest("[data-settings-trigger]")) return;
      setSettingsOpen(false);
    };
    const id = window.setTimeout(() => {
      window.addEventListener("mousedown", onDown, true);
    }, 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("mousedown", onDown, true);
    };
  }, [open, setSettingsOpen]);

  if (!open) return null;

  const close = () => setSettingsOpen(false);

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
      className="fixed z-[70] flex w-[620px] max-h-[calc(100vh-168px)] overflow-hidden rounded-[8px] bg-[var(--app-elevated)] shadow-[0_8px_28px_rgba(0,0,0,0.65)]"
      style={
        dragged
          ? { left: pos.x, top: pos.y }
          : { left: "50%", top: 160, transform: "translateX(-50%)" }
      }
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div
          className="flex h-12 shrink-0 cursor-move items-center gap-2 border-b border-(--app-border) px-5"
          onMouseDown={startDrag}
        >
          <Keyboard size={15} className="text-(--app-muted)" />
          <span className="flex-1 text-[14px] font-semibold text-(--app-text)">Keyboard Shortcuts</span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)"
            onClick={close}
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          <KeyboardShortcutsPanel active />
        </div>
      </div>
    </div>
  );
}
