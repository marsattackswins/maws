"use client";

import { SettingsBtn, SettingsSection, settingsUi } from "@/components/settings/settings-ui";
import {
  DEFAULT_SHORTCUTS,
  SHORTCUT_DEFS,
  findShortcutConflict,
  formatShortcut,
  chordFromEvent,
  type ShortcutChord,
  type ShortcutId,
} from "@/lib/shortcuts";
import { useAppStore } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";

/** Shortcuts editor embedded in global Settings (under Trading). */
export function KeyboardShortcutsPanel({ active }: { active: boolean }) {
  const shortcuts = useAppStore((s) => s.shortcuts);
  const setShortcut = useAppStore((s) => s.setShortcut);
  const resetShortcuts = useAppStore((s) => s.resetShortcuts);
  const [recording, setRecording] = useState<ShortcutId | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);

  useEffect(() => {
    if (!active) {
      setRecording(null);
      setConflict(null);
    }
  }, [active]);

  useEffect(() => {
    if (!active || !recording) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") {
        setRecording(null);
        setConflict(null);
        return;
      }
      const chord = chordFromEvent(e);
      if (!chord) return;
      const clash = findShortcutConflict(shortcuts, chord, recording);
      if (clash) {
        const label = SHORTCUT_DEFS.find((d) => d.id === clash)?.label ?? clash;
        setConflict(`Already used by “${label}”. Press another key, or Esc to cancel.`);
        return;
      }
      setShortcut(recording, chord);
      setRecording(null);
      setConflict(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [active, recording, shortcuts, setShortcut]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof SHORTCUT_DEFS>();
    for (const def of SHORTCUT_DEFS) {
      const list = map.get(def.group) ?? [];
      list.push(def);
      map.set(def.group, list);
    }
    return [...map.entries()];
  }, []);

  const assign = (id: ShortcutId, chord: ShortcutChord | null) => {
    if (chord) {
      const clash = findShortcutConflict(shortcuts, chord, id);
      if (clash) {
        const label = SHORTCUT_DEFS.find((d) => d.id === clash)?.label ?? clash;
        setConflict(`Already used by “${label}”.`);
        return;
      }
    }
    setShortcut(id, chord);
    setConflict(null);
  };

  return (
    <>
      <p className={`${settingsUi.muted} mb-4`}>
        Click a shortcut, then press the new key combination. Esc cancels recording.
      </p>
      {conflict && (
        <p className="mb-3 rounded-[4px] bg-[#2a2e39] px-3 py-2 text-[12px] text-[#f23645]">
          {conflict}
        </p>
      )}
      {groups.map(([group, defs]) => (
        <SettingsSection key={group} title={group}>
          <div className="flex flex-col gap-1">
            {defs.map((def) => {
              const chord = shortcuts[def.id];
              const isRec = recording === def.id;
              return (
                <div
                  key={def.id}
                  className="flex items-center justify-between gap-3 rounded-[6px] px-1 py-1.5 hover:bg-[#222]"
                >
                  <span className={settingsUi.text}>{def.label}</span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setConflict(null);
                        setRecording(isRec ? null : def.id);
                      }}
                      className={`min-w-[108px] rounded-[4px] border px-2.5 py-1.5 text-[12px] font-medium tabular-nums ${
                        isRec
                          ? "border-white bg-[#2a2e39] text-white"
                          : "border-[#363a45] bg-[#1a1a1a] text-[#d1d4dc] hover:border-[#787b86]"
                      }`}
                    >
                      {isRec ? "Press keys…" : formatShortcut(chord)}
                    </button>
                    <button
                      type="button"
                      title="Clear"
                      className="rounded-[4px] px-1.5 py-1 text-[11px] text-[#787b86] hover:bg-[#2a2e39] hover:text-[#d1d4dc]"
                      onClick={() => {
                        setRecording(null);
                        assign(def.id, null);
                      }}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      title="Reset"
                      className="rounded-[4px] px-1.5 py-1 text-[11px] text-[#787b86] hover:bg-[#2a2e39] hover:text-[#d1d4dc]"
                      onClick={() => {
                        setRecording(null);
                        assign(def.id, DEFAULT_SHORTCUTS[def.id]);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SettingsSection>
      ))}
      <div className="mt-2">
        <SettingsBtn variant="ghost" onClick={() => resetShortcuts()}>
          Reset all shortcuts
        </SettingsBtn>
      </div>
    </>
  );
}
