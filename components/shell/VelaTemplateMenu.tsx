"use client";

/**
 * VelaTemplateMenu.tsx — the top-bar chart-template switcher, built on Vela's
 * OWN template core (lib/vela-templates.ts): each template includes renderer
 * config and the pane's indicator set.
 *
 * Visual language matches the TopBar's other dropdowns (`menu` rows, token
 * colors) so it reads as native chart chrome.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, FolderOpen, Trash2 } from "lucide-react";
import {
  applyTemplate,
  getTemplates,
  removeTemplate,
  saveTemplate,
  subscribeTemplates,
  templateSummary,
  type VelaChartTemplate,
} from "@/lib/vela-templates";
import { forEachChart } from "@/lib/chart-registry";

const EMPTY: readonly VelaChartTemplate[] = [];
function getServerTemplates(): readonly VelaChartTemplate[] {
  return EMPTY;
}

export function VelaTemplateMenu() {
  const templates = useSyncExternalStore(subscribeTemplates, getTemplates, getServerTemplates);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /** Which template patch most recently landed on this pane (actor highlight). */
  const [activeName, setActiveName] = useState<string | null>(null);
  const defaultTemplate = templates.find(
    (template) => template.name.trim().toLowerCase() === "maws",
  );

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as HTMLElement)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const save = () => {
    const name = window.prompt("Name this chart template", activeName ?? "My template");
    if (!name?.trim()) return;
    if (!saveTemplate(name.trim())) {
      window.alert("Could not save the chart template. Make sure a chart is open and browser storage is available.");
      return;
    }
    setActiveName(name.trim());
    setOpen(false);
  };

  /** Apply chart styling and the saved indicator set to every open chart. */
  const applyToAll = (id: string, name: string) => {
    let applied = true;
    forEachChart((pid) => {
      if (!applyTemplate(id, pid)) applied = false;
    });
    if (!applied) {
      window.alert("Could not apply the chart template to every open chart.");
      return;
    }
    setActiveName(name);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title="Chart templates"
        aria-label="Chart templates"
        aria-expanded={open}
        role="button"
        data-template-trigger
        onClick={() => setOpen(!open)}
        className={`toolbar-btn gap-1 px-2 text-[12px] ${open ? "is-active" : ""} text-(--app-text)`}
      >
        <TemplateGlyph />
        <span className="max-w-[140px] truncate">{activeName ?? defaultTemplate?.name ?? "Template"}</span>
        <ChevronDown size={11} className="text-(--app-muted)" />
      </button>
      {open && (
        <div className="menu right-0 left-auto w-[320px]" data-dropdown-open>
          <button type="button" className="menu-row w-full" onClick={save}>
            <SaveGlyph />
            Save current…
          </button>
          {templates.length > 0 ? (
            <>
              <div className="my-1 border-t border-(--app-border)" />
              <div className="menu-section-title">CHART TEMPLATES</div>
              <MaxScroll>
                {templates.map((tpl) => (
                  <div key={tpl.id} className="flex items-center gap-1 px-2 hover:bg-(--app-hover)">
                    <button
                      type="button"
                      className="min-w-0 flex-1 py-2 text-left"
                      onClick={() => {
                        if (!applyTemplate(tpl.id)) {
                          window.alert("Could not apply the chart template. Make sure a chart is open.");
                          return;
                        }
                        setActiveName(tpl.name);
                        setOpen(false);
                      }}
                    >
                      <div
                        className={`truncate text-[13px] font-semibold ${
                          activeName === tpl.name ? "text-(--app-text)" : "text-(--app-text)"
                        }`}
                      >
                        {tpl.name}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-(--app-muted)">
                        {templateSummary(tpl)}
                      </div>
                    </button>
                    <button
                      type="button"
                      title="Apply to all charts"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)"
                      onClick={() => applyToAll(tpl.id, tpl.name)}
                    >
                      <FolderOpen size={14} strokeWidth={1.6} />
                    </button>
                    <button
                      type="button"
                      title="Delete template"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] text-(--app-muted) hover:bg-(--app-hover) hover:text-[#f23645]"
                      onClick={() => removeTemplate(tpl.id)}
                    >
                      <Trash2 size={14} strokeWidth={1.6} />
                    </button>
                  </div>
                ))}
              </MaxScroll>
            </>
          ) : (
            <div className="border-t border-(--app-border) px-3 py-3 text-[12px] leading-[16px] text-(--app-muted)">
              No chart templates yet. Configure chart styling and indicators, then save
              a snapshot to apply them to any pane or symbol.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Cap tall lists so the menu never runs off the viewport. */
function MaxScroll({ children }: { children: React.ReactNode }) {
  return <div className="max-h-[50vh] overflow-y-auto">{children}</div>;
}

function TemplateGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5h12M6.5 6.5v7.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function SaveGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 2.5h8L13.5 5v8.5h-10.5V2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M5.5 2.5v3.5h4V2.5M5.5 13v-3.5h5V13" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
