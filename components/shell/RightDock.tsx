"use client";

import { useMemo, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  moveDockId,
  normalizeDockOrder,
  sameDockOrder,
  shiftDockId,
} from "@/lib/slices/ui-slice";
import type { DockId } from "@/types";
import { Bell, CalendarDays, Code2, Layers, List } from "lucide-react";

type DockItem = { id: DockId; label: string; icon: typeof List };

const ITEMS: DockItem[] = [
  { id: "strategy", label: "Watchlist", icon: List },
  { id: "calendar", label: "News & Calendar", icon: CalendarDays },
  { id: "objects", label: "Object tree", icon: Layers },
  { id: "scripts", label: "Pine scripts", icon: Code2 },
  { id: "alerts", label: "Alerts", icon: Bell },
];

export function RightDock() {
  const dock = useAppStore((s) => s.rightDock);
  const setRightDock = useAppStore((s) => s.setRightDock);
  const rightOpen = useAppStore((s) => s.rightOpen);
  const setRightOpen = useAppStore((s) => s.setRightOpen);
  const order = useAppStore((s) => s.rightDockOrder);
  const setRightDockOrder = useAppStore((s) => s.setRightDockOrder);

  const savedIds = useMemo(() => normalizeDockOrder(order), [order]);
  /** The icon being dragged. */
  const [dragId, setDragId] = useState<DockId | null>(null);
  /** Live order while a drag is in flight — like the drawing bar, the buttons
   *  physically move as you cross a neighbour's midpoint; nothing is persisted
   *  until the drag ends. */
  const [preview, setPreview] = useState<DockId[] | null>(null);
  /** Browsers can fire a click after a drag ends — do not toggle the panel then. */
  const draggedRef = useRef(false);
  /** The dragged id is also kept in a ref: the very first `dragover` can arrive
   *  before React has re-rendered from `dragstart`, and must not be dropped. */
  const dragRef = useRef<DockId | null>(null);

  const ids = preview ?? savedIds;
  const items = useMemo(() => {
    const byId = new Map(ITEMS.map((item) => [item.id, item]));
    return ids
      .map((id) => byId.get(id))
      .filter((item): item is DockItem => item !== undefined);
  }, [ids]);

  const endDrag = () => {
    if (preview && !sameDockOrder(preview, savedIds)) setRightDockOrder(preview);
    dragRef.current = null;
    setDragId(null);
    setPreview(null);
    window.setTimeout(() => {
      draggedRef.current = false;
    }, 0);
  };

  /** Keyboard reordering (Alt+Arrow) — commits straight to the store. */
  const shift = (id: DockId, delta: number) => {
    const next = shiftDockId(savedIds, id, delta);
    if (!sameDockOrder(next, savedIds)) setRightDockOrder(next);
  };

  return (
    <aside
      className="flex w-[44px] shrink-0 flex-col items-center gap-1 border-l py-2"
      style={{ background: "var(--maws-panel)", borderColor: "var(--maws-border)" }}
      aria-label="Right panel shortcuts"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = rightOpen && dock === item.id;
        const dragging = dragId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            draggable
            title={`${item.label} — drag to reorder`}
            aria-label={item.label}
            onClick={() => {
              if (draggedRef.current) return;
              if (active) setRightOpen(false);
              else setRightDock(item.id);
            }}
            onDragStart={(e) => {
              draggedRef.current = true;
              dragRef.current = item.id;
              setDragId(item.id);
              setPreview(savedIds);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", item.id);
            }}
            onDragOver={(e) => {
              const held = dragRef.current;
              if (!held) return;
              e.preventDefault(); // mark droppable
              if (held === item.id) return; // already holding this slot
              e.dataTransfer.dropEffect = "move";
              const rect = e.currentTarget.getBoundingClientRect();
              const after = e.clientY >= rect.top + rect.height / 2;
              setPreview((prev) => {
                const base = prev ?? savedIds;
                const next = moveDockId(base, held, item.id, after);
                return sameDockOrder(next, base) ? prev : next;
              });
            }}
            onDrop={(e) => e.preventDefault()} // commit happens on dragend
            onDragEnd={endDrag}
            onKeyDown={(e) => {
              if (!e.altKey) return;
              if (e.key === "ArrowUp") {
                e.preventDefault();
                shift(item.id, -1);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                shift(item.id, 1);
              }
            }}
            className="flex h-8 w-8 cursor-grab items-center justify-center rounded-[4px] active:cursor-grabbing"
            style={{
              // Neutral grey "lifted" highlight while dragging — the same dimmed
              // ghost the drawing toolbar shows, never the old blue drop line.
              background: dragging
                ? "rgba(255, 255, 255, 0.10)"
                : active
                  ? "var(--maws-hover)"
                  : "transparent",
              color: dragging || active ? "var(--maws-text)" : "var(--maws-muted)",
            }}
          >
            <Icon size={16} className={dragging ? "opacity-40" : undefined} />
          </button>
        );
      })}
    </aside>
  );
}
