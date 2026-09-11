"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  actions?: ReactNode;
  children?: ReactNode;
};

export function Widget({ title, collapsed, onToggle, actions, children }: Props) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <header
        className="flex h-8 shrink-0 items-center gap-1 border-b px-1"
        style={{ borderColor: "var(--maws-border)" }}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-1 px-1 text-left"
          style={{ color: "var(--maws-text)" }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform ${collapsed ? "-rotate-90" : ""}`}
            style={{ color: "var(--maws-muted)" }}
          />
          <span className="truncate text-[13px] font-semibold">{title}</span>
        </button>
        <div className="flex items-center">{actions}</div>
      </header>
      {!collapsed ? children : null}
    </section>
  );
}
