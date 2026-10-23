"use client";

/**
 * PineScriptsPanel.tsx — the right-dock Pine Script editor, laid out like Vela's own
 * editor: a header (script name + chevron, Run, save / save-as / history, then
 * fullscreen, kebab, close), a line-numbered highlighted code surface, and a Logs bar
 * with the language label. The name opens the "Recent scripts" menu.
 *
 * The engine and every mutation go through Vela's public seams:
 *  - Run adds the script via the workspace shell (`addScript` → the active cell's
 *    `addExternalIndicator`), so it lands in the undo timeline, legend row, indicator
 *    count and the auto-generated Settings dialog; an already-running script is
 *    edited in place with `updateCode`.
 *  - Compile/runtime errors arrive on `indicator:error` and print to Logs.
 *  - Scripts survive a reload through the `ext` handler in lib/vela-pine-scripts.ts.
 *
 * Editor documents: the open script may be UNSAVED (a fresh "My script" is not in the
 * library until you save it — that is what the menu's empty state describes). The
 * library is user content in localStorage; the live scripts are cell state in Vela's
 * document.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  History,
  Maximize2,
  Minimize2,
  MoreVertical,
  Pencil,
  Play,
  Plus,
  Save,
  SaveAll,
  SquareX,
  Trash2,
  X,
} from "lucide-react";
import type { Vela } from "@/lib/charting";
import { getChart, getWorkspace, subscribeWorkspace } from "@/lib/chart-registry";
import { useActivePane, useAppStore } from "@/lib/store";
import { PineCodeEditor } from "@/components/pine/PineCodeEditor";
import {
  blankPineScript,
  chartIdForScript,
  livePineScripts,
  loadOpenPineScriptId,
  loadPineDraft,
  loadPineScripts,
  saveOpenPineScriptId,
  savePineDraft,
  savePineScripts,
  type LivePineScript,
  type PineScript,
} from "@/lib/vela-pine-scripts";

type LogEntry = { id: number; level: "info" | "error"; text: string; time: number };
type RecentRun = { id: string; name: string; symbol: string; timeframe: string; at: number };
type MenuKind = "scripts" | "more" | "history" | "version" | null;

// The editor is its own dark surface (like Vela's), independent of the app theme.
const SURFACE = "#131722";
const MENU_BG = "#1e222d";
const BORDER = "#2a2e39";
const TEXT = "#d1d4dc";
const MUTED = "#8f96a3";

function clock(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function IconButton({
  title,
  onClick,
  active,
  disabled,
  trigger,
  children,
}: {
  title: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  trigger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      {...(trigger ? { "data-pine-menu-trigger": true } : {})}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] transition-colors disabled:opacity-35 ${
        active
          ? "bg-[#2a2e39] text-[#d1d4dc]"
          : "text-[#9aa0ab] hover:bg-[#2a2e39] hover:text-[#d1d4dc]"
      }`}
    >
      {children}
    </button>
  );
}

function MenuRow({
  label,
  icon,
  hint,
  danger,
  checked,
  disabled,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  danger?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-full items-center gap-2 px-4 text-left text-[12px] transition-colors hover:bg-[#2a2e39] disabled:opacity-40 disabled:hover:bg-transparent"
      style={{ color: danger ? "#f23645" : TEXT }}
    >
      <span
        className="flex w-4 shrink-0 items-center justify-center"
        style={{ color: checked ? "#2962ff" : MUTED }}
      >
        {checked ? <Check size={13} /> : icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {hint && (
        <span className="shrink-0 text-[10px]" style={{ color: MUTED }}>
          {hint}
        </span>
      )}
    </button>
  );
}

function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-4 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em]"
      style={{ color: MUTED }}
    >
      {children}
    </div>
  );
}

function MenuPanel({
  children,
  menuRef,
  className,
}: {
  children: React.ReactNode;
  menuRef: React.RefObject<HTMLDivElement | null>;
  className: string;
}) {
  return (
    <div
      ref={menuRef}
      className={`absolute z-30 w-80 rounded-md border py-1 ${className}`}
      style={{
        background: MENU_BG,
        borderColor: BORDER,
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.55)",
      }}
      role="menu"
    >
      {children}
    </div>
  );
}

export function PineScriptsPanel() {
  const pane = useActivePane();
  const activePaneId = useAppStore((s) => s.activePaneId);
  const setRightOpen = useAppStore((s) => s.setRightOpen);

  // One boot read: the saved library plus the open document (a saved script, the
  // restored unsaved draft, or a fresh "My script").
  const [boot] = useState(() => {
    const library = loadPineScripts();
    const lastId = loadOpenPineScriptId();
    const savedOpen = library.find((s) => s.id === lastId);
    const current = savedOpen ?? loadPineDraft() ?? blankPineScript();
    return { library, current };
  });
  const [scripts, setScripts] = useState<PineScript[]>(boot.library);
  const [openId, setOpenId] = useState<string>(boot.current.id);
  const [draft, setDraft] = useState(boot.current.script);
  const [draftName, setDraftName] = useState(boot.current.name);
  const [renaming, setRenaming] = useState(false);
  const [live, setLive] = useState<LivePineScript[]>([]);
  const [chart, setChart] = useState<Vela | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsOpen, setLogsOpen] = useState(false);
  const [menu, setMenu] = useState<MenuKind>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [recent, setRecent] = useState<RecentRun[]>([]);

  const codeRef = useRef<HTMLTextAreaElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  /** The indicator id whose run we are waiting on (matched on event arrival). */
  const pendingRef = useRef<string | null>(null);
  const logId = useRef(0);
  /** Latest render values for chart-event handlers (subscriptions must not rebind). */
  const runContext = useRef({ name: "", symbol: "", timeframe: "" });
  runContext.current = { name: draftName, symbol: pane.symbol, timeframe: pane.timeframe };
  const scriptsRef = useRef(scripts);
  scriptsRef.current = scripts;

  /** The saved library entry behind the open document (null while unsaved). */
  const saved = useMemo(() => scripts.find((s) => s.id === openId) ?? null, [scripts, openId]);

  const addLog = useCallback((level: LogEntry["level"], text: string) => {
    setLogs((list) => {
      const next = [...list, { id: (logId.current += 1), level, text, time: Date.now() }];
      return next.length > 100 ? next.slice(next.length - 100) : next;
    });
    if (level === "error") setLogsOpen(true);
  }, []);

  /** Record a successful run for the history menu (by chart indicator id). */
  const noteRun = useCallback((chartId: string) => {
    const libId = chartId.startsWith("pine:") ? chartId.slice("pine:".length) : null;
    const script = scriptsRef.current.find((s) => s.id === libId);
    if (!script) return;
    const c = runContext.current;
    setRecent((list) =>
      [
        {
          id: script.id,
          name: script.name,
          symbol: c.symbol,
          timeframe: c.timeframe,
          at: Date.now(),
        },
        ...list.filter((r) => r.id !== script.id),
      ].slice(0, 8),
    );
  }, []);

  // ── saved library autosave ──
  useEffect(() => {
    const timer = setTimeout(() => savePineScripts(scripts), 300);
    return () => clearTimeout(timer);
  }, [scripts]);

  // ── keep the UNSAVED document across a reload (saved scripts live in the library) ──
  useEffect(() => {
    if (saved) {
      savePineDraft(null);
      return;
    }
    const timer = setTimeout(() => savePineDraft({ id: openId, name: draftName, script: draft }), 300);
    return () => clearTimeout(timer);
  }, [saved, openId, draftName, draft]);

  // ── the ACTIVE pane's chart (the panel can mount before the workspace exists) ──
  useEffect(() => {
    const sync = () => setChart(getChart(activePaneId)?.vela ?? null);
    sync();
    return subscribeWorkspace(sync);
  }, [activePaneId]);

  const refreshLive = useCallback(() => {
    setLive(chart ? livePineScripts(chart) : []);
  }, [chart]);

  // ── chart events: the live set, errors into Logs ──
  useEffect(() => {
    if (!chart) return;
    refreshLive();
    const offs = [
      chart.on("indicator:added", ({ id }) => {
        refreshLive();
        if (pendingRef.current !== id) return;
        pendingRef.current = null;
        const c = runContext.current;
        addLog("info", `Running ${c.name || "script"} on ${c.symbol} · ${c.timeframe}.`);
        noteRun(id);
      }),
      chart.on("indicator:removed", ({ id }) => {
        refreshLive();
        // Native studies share this event — only script rows belong in the editor log.
        if (id.startsWith("pine:")) addLog("info", "Removed from the chart.");
      }),
      chart.on("indicator:visibility", refreshLive),
      chart.on("indicator:error", ({ id, error }) => {
        refreshLive();
        if (pendingRef.current === id) pendingRef.current = null;
        addLog("error", error.message);
      }),
    ];
    return () => {
      for (const off of offs) off();
    };
  }, [chart, refreshLive, addLog, noteRun]);

  // ── dismiss the open menu on an outside click; Esc closes menu, then fullscreen ──
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("[data-pine-menu-trigger]")) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menu) setMenu(null);
      else if (fullscreen) setFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu, fullscreen]);

  // ── document handling ──
  const openDocument = useCallback((doc: { id: string; name: string; script: string }) => {
    setOpenId(doc.id);
    setDraft(doc.script);
    setDraftName(doc.name);
    setMenu(null);
    saveOpenPineScriptId(doc.id);
  }, []);

  const commitName = () => {
    setRenaming(false);
    const name = draftName.trim();
    if (!name) {
      setDraftName(saved?.name ?? "My script");
      return;
    }
    setDraftName(name);
    if (saved && name !== saved.name) {
      setScripts((list) =>
        list.map((s) => (s.id === saved.id ? { ...s, name, updatedAt: Date.now() } : s)),
      );
      addLog("info", `Renamed to ${name}.`);
    }
  };

  const saveCurrent = () => {
    const name = draftName.trim() || "My script";
    setDraftName(name);
    setScripts((list) => {
      const entry: PineScript = {
        id: openId,
        name,
        script: draft,
        updatedAt: Date.now(),
      };
      const exists = list.some((s) => s.id === openId);
      return exists ? list.map((s) => (s.id === openId ? entry : s)) : [...list, entry];
    });
    saveOpenPineScriptId(openId);
    addLog("info", `Saved ${name}.`);
  };

  const duplicateScript = () => {
    const name = `${draftName.trim() || "My script"} copy`;
    const copy = blankPineScript(name);
    const entry: PineScript = { ...copy, script: draft, updatedAt: Date.now() };
    setScripts((list) => [...list, entry]);
    openDocument(entry);
    addLog("info", `Saved a copy as ${name}.`);
  };

  const newScript = () => {
    const script = blankPineScript();
    openDocument(script);
    setLogsOpen(false);
    codeRef.current?.focus();
  };

  const deleteScript = () => {
    setMenu(null);
    if (!saved) {
      // Nothing in the library to delete — start a clean document instead.
      newScript();
      return;
    }
    if (!window.confirm(`Delete "${saved.name}" from the library?`)) return;
    setScripts((list) => list.filter((s) => s.id !== saved.id));
    addLog("info", `Deleted ${saved.name} from the library.`);
    newScript();
  };

  const selectSaved = (id: string) => {
    const doc = scripts.find((s) => s.id === id);
    if (doc) openDocument(doc);
  };

  /** Editor edits land in the library immediately once the document is saved. */
  const onDraft = (value: string) => {
    setDraft(value);
    if (!saved) return;
    setScripts((list) =>
      list.map((s) => (s.id === saved.id ? { ...s, script: value, updatedAt: Date.now() } : s)),
    );
  };

  // ── run / update on the active chart ──
  const chartId = chartIdForScript(openId);
  const liveRow = live.find((l) => l.id === chartId);

  const run = () => {
    if (!draft.trim()) return;
    if (!chart) {
      addLog("error", "The Vela workspace is not running.");
      return;
    }
    const shell = getWorkspace();
    if (!shell) {
      addLog("error", "The Vela workspace is not running.");
      return;
    }
    const existing = chart.indicators().find((h) => h.id === chartId);
    if (existing) {
      // In place: same legend row, same pane, same settings. A broken edit leaves the
      // running script computing and reports through `indicator:error`.
      existing.updateCode(draft);
      // No shell event covers a code swap — mark the cell document dirty so a refresh
      // restores the new source, not the previous one.
      shell.markStateDirty();
      addLog(
        "info",
        `Updated ${draftName || "script"} on ${runContext.current.symbol} · ${runContext.current.timeframe}.`,
      );
      noteRun(chartId);
      return;
    }
    pendingRef.current = chartId;
    addLog("info", `Running ${draftName || "script"}…`);
    shell.addScript({
      id: chartId,
      name: draftName.trim() || "My script",
      script: draft,
      language: "pine",
    });
  };

  const toggleVisible = () => {
    if (!chart || !liveRow) return;
    const handle = chart.indicators().find((h) => h.id === chartId);
    if (!handle) return;
    handle.setVisible(!handle.visible);
    addLog("info", `${handle.visible ? "Shown" : "Hidden"} on the chart.`);
  };

  const removeFromChart = () => {
    setMenu(null);
    chart?.indicators().find((h) => h.id === chartId)?.remove();
  };

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[100] flex min-h-0 flex-col"
          : "relative flex h-full min-h-0 flex-col"
      }
      style={{ background: SURFACE, color: TEXT }}
    >
      {/* Header — name + chevron, Run, divider, save / save-as / history | fullscreen / more / close */}
      <div
        className="flex h-10 shrink-0 items-center gap-1 border-b px-2"
        style={{ borderColor: BORDER, background: SURFACE }}
      >
        {renaming ? (
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName();
              if (e.key === "Escape") setRenaming(false);
            }}
            aria-label="Script name"
            className="h-6 min-w-0 flex-1 rounded-[3px] border bg-transparent px-1 text-[12px] outline-none"
            style={{ borderColor: BORDER, color: TEXT }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setMenu(menu === "scripts" ? null : "scripts")}
            onDoubleClick={() => setRenaming(true)}
            className="flex min-w-0 flex-1 items-center gap-1 text-left text-[13px] font-semibold hover:text-white"
            title="Recent scripts"
            data-pine-menu-trigger
            style={{ color: TEXT }}
          >
            <span className="truncate">{draftName || "My script"}</span>
            {menu === "scripts" ? (
              <ChevronUp size={11} style={{ color: MUTED }} />
            ) : (
              <ChevronDown size={11} style={{ color: MUTED }} />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={run}
          disabled={!draft.trim()}
          className="flex h-[26px] shrink-0 items-center gap-1 rounded-[4px] border px-2.5 text-[12px] transition-colors hover:bg-[#2a2e39] disabled:opacity-40"
          style={{ borderColor: "#363a45", color: TEXT }}
          title="Run on the active chart"
        >
          <Play size={11} />
          Run
        </button>

        <span className="mx-1 h-4 w-px shrink-0" style={{ background: BORDER }} />

        <IconButton title={saved ? "Save script" : "Save to library"} onClick={saveCurrent} trigger>
          <Save size={14} />
        </IconButton>
        <IconButton title="Save as copy" onClick={duplicateScript}>
          <SaveAll size={14} />
        </IconButton>
        <IconButton
          title="Recent runs"
          active={menu === "history"}
          trigger
          onClick={() => setMenu(menu === "history" ? null : "history")}
        >
          <History size={14} />
        </IconButton>

        <span className="ml-auto flex shrink-0 items-center gap-0.5">
          <IconButton
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={() => setFullscreen((v) => !v)}
          >
            {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </IconButton>
          <IconButton
            title="More"
            active={menu === "more"}
            trigger
            onClick={() => setMenu(menu === "more" ? null : "more")}
          >
            <MoreVertical size={14} />
          </IconButton>
          <IconButton title="Close panel" onClick={() => setRightOpen(false)}>
            <X size={14} />
          </IconButton>
        </span>
      </div>

      {/* ── menus ── */}
      {menu === "scripts" && (
        <MenuPanel menuRef={menuRef} className="left-1 top-[42px]">
          <MenuLabel>Recent scripts</MenuLabel>
          {scripts.length === 0 ? (
            <p className="px-4 pb-3 text-[12px] leading-[18px]" style={{ color: MUTED }}>
              No saved scripts yet — save the script you are editing to list it here.
            </p>
          ) : (
            <div className="max-h-64 overflow-auto">
              {scripts.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => openDocument(s)}
                  className="flex h-8 w-full items-center px-4 text-left text-[12px] transition-colors hover:bg-[#2a2e39]"
                  style={{
                    color: TEXT,
                    background: s.id === openId ? BORDER : undefined,
                  }}
                >
                  <span className="truncate">{s.name}</span>
                </button>
              ))}
            </div>
          )}
          <div className="my-1 h-px" style={{ background: BORDER }} />
          <button
            type="button"
            onClick={newScript}
            className="flex h-8 w-full items-center gap-2 px-4 text-left text-[12px] transition-colors hover:bg-[#2a2e39]"
            style={{ color: TEXT }}
          >
            <span className="flex w-4 shrink-0 items-center justify-center" style={{ color: MUTED }}>
              <Plus size={13} />
            </span>
            New script
          </button>
        </MenuPanel>
      )}

      {menu === "more" && (
        <MenuPanel menuRef={menuRef} className="right-1 top-[42px]">
          <MenuRow
            label="Rename script"
            icon={<Pencil size={13} />}
            onClick={() => {
              setMenu(null);
              setRenaming(true);
            }}
          />
          <MenuRow
            label={liveRow?.visible === false ? "Show on chart" : "Hide on chart"}
            icon={liveRow?.visible === false ? <Eye size={13} /> : <EyeOff size={13} />}
            disabled={!liveRow}
            onClick={() => {
              setMenu(null);
              toggleVisible();
            }}
          />
          <MenuRow
            label="Remove from chart"
            icon={<SquareX size={13} />}
            disabled={!liveRow}
            onClick={removeFromChart}
          />
          <MenuRow
            label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            icon={fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            onClick={() => {
              setMenu(null);
              setFullscreen((v) => !v);
            }}
          />
          <div className="my-1 h-px" style={{ background: BORDER }} />
          <MenuRow
            label="Delete script"
            icon={<Trash2 size={13} />}
            danger
            disabled={!saved}
            onClick={deleteScript}
          />
        </MenuPanel>
      )}

      {menu === "history" && (
        <MenuPanel menuRef={menuRef} className="right-1 top-[42px]">
          <MenuLabel>Recent runs</MenuLabel>
          {recent.length === 0 && (
            <p className="px-4 pb-3 text-[12px] leading-[18px]" style={{ color: MUTED }}>
              No runs yet in this session.
            </p>
          )}
          {recent
            .filter((r) => scripts.some((s) => s.id === r.id))
            .map((r) => (
              <MenuRow
                key={`${r.id}-${r.at}`}
                label={`${r.name} · ${r.symbol} ${r.timeframe}`}
                icon={<History size={13} />}
                hint={clock(r.at)}
                onClick={() => selectSaved(r.id)}
              />
            ))}
        </MenuPanel>
      )}

      {menu === "version" && (
        <MenuPanel menuRef={menuRef} className="bottom-8 right-1">
          <MenuLabel>Pine version</MenuLabel>
          <MenuRow label="Pine v5" checked onClick={() => setMenu(null)} />
          <p className="px-4 pb-2 text-[10px]" style={{ color: MUTED }}>
            Pine v6 is not part of the installed runtime.
          </p>
        </MenuPanel>
      )}

      <PineCodeEditor value={draft} onChange={onDraft} inputRef={codeRef} />

      {logsOpen && (
        <div
          className="max-h-40 shrink-0 overflow-auto border-t"
          style={{ borderColor: BORDER, background: SURFACE }}
        >
          {logs.length === 0 && (
            <div className="px-2 py-1 text-[11px]" style={{ color: MUTED }}>
              No output yet.
            </div>
          )}
          {logs.map((entry) => (
            <div key={entry.id} className="flex gap-2 px-2 py-0.5 text-[11px]">
              <span className="shrink-0" style={{ color: MUTED }}>
                {clock(entry.time)}
              </span>
              <span style={{ color: entry.level === "error" ? "#f23645" : "#b9bdc9" }}>
                {entry.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        className="flex h-7 shrink-0 items-stretch border-t"
        style={{ borderColor: BORDER, background: SURFACE }}
      >
        <button
          type="button"
          onClick={() => {
            setMenu(null);
            setLogsOpen((v) => !v);
          }}
          className="flex flex-1 items-center gap-1 px-2 text-[11px] transition-colors hover:bg-[#1e222d]"
          style={{ color: MUTED }}
          title={logsOpen ? "Hide logs" : "Show logs"}
        >
          {logsOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          <span>Logs</span>
          <span
            className="rounded-[3px] px-1 text-[10px]"
            style={{ background: "#2a2e39", color: TEXT }}
          >
            {logs.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMenu(menu === "version" ? null : "version")}
          className="flex items-center gap-1 border-l px-2 text-[11px] transition-colors hover:bg-[#1e222d]"
          style={{ borderColor: BORDER, color: MUTED }}
          title="Pine version"
          data-pine-menu-trigger
        >
          Pine v5
          <ChevronUp size={11} />
        </button>
      </div>
    </div>
  );
}
