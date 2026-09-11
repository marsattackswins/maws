"use client";

import { settingsUi } from "@/components/settings/settings-ui";
import type { ObjectVisibility, VisibilityBand } from "@/types";
import { cloneVisibility } from "@/lib/visibility";

const inputClass = `${settingsUi.input} w-[52px] px-1.5 text-center`;

function BandRow({
  label,
  band,
  onChange,
  hasRange,
}: {
  label: string;
  band: VisibilityBand;
  onChange: (band: VisibilityBand) => void;
  hasRange?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 py-1.5 ${settingsUi.text}`}>
      <label className="flex min-w-[72px] items-center gap-2">
        <input
          type="checkbox"
          className="accent-white"
          checked={band.enabled}
          onChange={(e) => onChange({ ...band, enabled: e.target.checked })}
        />
        {label}
      </label>
      {hasRange !== false && (
        <div className="ml-auto flex items-center gap-2">
          <input
            className={inputClass}
            type="number"
            disabled={!band.enabled}
            value={band.min}
            onChange={(e) =>
              onChange({ ...band, min: Math.max(1, Number(e.target.value) || 1) })
            }
          />
          <div className="h-[2px] w-16 rounded bg-[#363a45]">
            <div
              className="h-full rounded bg-[#787b86]"
              style={{ width: `${Math.min(100, (band.min / Math.max(band.max, 1)) * 100)}%` }}
            />
          </div>
          <input
            className={inputClass}
            type="number"
            disabled={!band.enabled}
            value={band.max}
            onChange={(e) =>
              onChange({ ...band, max: Math.max(band.min, Number(e.target.value) || band.min) })
            }
          />
        </div>
      )}
    </div>
  );
}

export function VisibilitySettingsPanel({
  value,
  onChange,
}: {
  value?: ObjectVisibility;
  onChange: (next: ObjectVisibility) => void;
}) {
  const vis = cloneVisibility(value);
  const set = (patch: Partial<ObjectVisibility>) => onChange({ ...vis, ...patch });

  return (
    <div className="space-y-0.5">
      <label className={`flex items-center gap-2 py-1.5 ${settingsUi.text}`}>
        <input
          type="checkbox"
          className="accent-white"
          checked={vis.ticks}
          onChange={(e) => set({ ticks: e.target.checked })}
        />
        Ticks
      </label>
      <BandRow label="Seconds" band={vis.seconds} onChange={(seconds) => set({ seconds })} />
      <BandRow label="Minutes" band={vis.minutes} onChange={(minutes) => set({ minutes })} />
      <BandRow label="Hours" band={vis.hours} onChange={(hours) => set({ hours })} />
      <BandRow label="Days" band={vis.days} onChange={(days) => set({ days })} />
      <BandRow label="Weeks" band={vis.weeks} onChange={(weeks) => set({ weeks })} />
      <BandRow label="Months" band={vis.months} onChange={(months) => set({ months })} />
      <label className={`flex items-center gap-2 py-1.5 ${settingsUi.text}`}>
        <input
          type="checkbox"
          className="accent-white"
          checked={vis.ranges}
          onChange={(e) => set({ ranges: e.target.checked })}
        />
        Ranges
      </label>
    </div>
  );
}
