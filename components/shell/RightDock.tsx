"use client";

import { useAppStore } from "@/lib/store";
import type { DockId } from "@/types";
import { Bell, CalendarDays, Layers, List } from "lucide-react";

const ITEMS: { id: DockId; label: string; icon: typeof List }[] = [
  { id: "strategy", label: "Watchlist", icon: List },
  { id: "calendar", label: "News & Calendar", icon: CalendarDays },
  { id: "objects", label: "Object tree", icon: Layers },
  { id: "alerts", label: "Alerts", icon: Bell },
];

export function RightDock() {
  const dock = useAppStore((s) => s.rightDock);
  const setRightDock = useAppStore((s) => s.setRightDock);
  const rightOpen = useAppStore((s) => s.rightOpen);
  const setRightOpen = useAppStore((s) => s.setRightOpen);

  return (
    <aside
      className="flex w-[44px] shrink-0 flex-col items-center gap-1 border-l py-2"
      style={{ background: "var(--maws-bg)", borderColor: "var(--maws-border)" }}
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = rightOpen && dock === item.id;
        return (
          <button
            key={item.id}
            type="button"
            title={item.label}
            onClick={() => {
              if (active) setRightOpen(false);
              else setRightDock(item.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-[4px]"
            style={
              active
                ? { background: "var(--maws-hover)", color: "var(--maws-text)" }
                : { color: "var(--maws-muted)" }
            }
          >
            <Icon size={16} />
          </button>
        );
      })}
    </aside>
  );
}
