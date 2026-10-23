import type { InputSchema, InputValue } from '../model/inputs';
import { inputVisible } from '../model/inputs';

/**
 * The "Show settings in legend" toggle every indicator carries.
 *
 * An indicator's legend chip is a NAME, not a ticker: `Stoch 14 1 3` tells the
 * user what they added, while `Stoch 62.31 58.02` is a number the chart already
 * draws (and the data window already reports at the crosshair). So each
 * calculation input opts into the static name with `legend: true`
 * ({@link InputSchema.legend}) and the chip's title is built from those values —
 * `legendTitle()`. The live value readout is controlled independently.
 *
 * The toggle decides whether the instance name includes its settings. A separate
 * "Show values in legend" switch controls the live value readout without changing
 * the name. One key, one title, one default — the catalog, the classics adapter
 * and host-registered natives all speak this vocabulary.
 */

/** The input key shared by every indicator's toggle (also the persisted document key). */
export const LEGEND_SETTINGS_KEY = 'legendSettings';

/** Display label of the toggle — the dialog row. */
export const LEGEND_SETTINGS_TITLE = 'Show settings in legend';

/** ON: the chip names the instance after its settings (`Stoch 14 1 3`). */
export const LEGEND_SETTINGS_DEFAULT = true;

/** The dialog section the toggle sits in (appended last, after the look controls). */
export const LEGEND_SETTINGS_GROUP = 'Output values';

/**
 * The toggle's schema declaration. `placement` carries the tab of the spec it is
 * appended to, so it lands beside the other output-surface switches instead of
 * spawning a stray section on an untabbed spec.
 */
export function legendSettingsInput(placement: { tab?: string; group?: string } = {}): InputSchema {
    return {
        key: LEGEND_SETTINGS_KEY,
        title: LEGEND_SETTINGS_TITLE,
        type: 'bool',
        defval: LEGEND_SETTINGS_DEFAULT,
        group: placement.group ?? LEGEND_SETTINGS_GROUP,
        ...(placement.tab != null && placement.tab.length > 0 ? { tab: placement.tab } : {}),
        tooltip:
            'Name this indicator in the legend after the settings it was added with (Stoch 14 1 3) instead of its plain name. Live values are controlled separately.',
    };
}

/** The input key shared by every indicator's live-value readout toggle. */
export const LEGEND_VALUES_KEY = 'legendValues';

/** Display label of the live-value toggle. */
export const LEGEND_VALUES_TITLE = 'Show values in legend';

/** ON preserves the existing behavior for indicators whose names do not include settings. */
export const LEGEND_VALUES_DEFAULT = true;

/** The live-value toggle, placed beside the settings-in-legend toggle. */
export function legendValuesInput(placement: { tab?: string; group?: string } = {}): InputSchema {
    return {
        key: LEGEND_VALUES_KEY,
        title: LEGEND_VALUES_TITLE,
        type: 'bool',
        defval: LEGEND_VALUES_DEFAULT,
        group: placement.group ?? LEGEND_SETTINGS_GROUP,
        ...(placement.tab != null && placement.tab.length > 0 ? { tab: placement.tab } : {}),
        tooltip: 'Show or hide this indicator\u2019s live value in the legend. The chart-wide Values setting still applies.',
    };
}

/** Read the live-value toggle — absent means {@link LEGEND_VALUES_DEFAULT}. */
export function legendValuesOn(inputs: Record<string, InputValue>): boolean {
    const v = inputs[LEGEND_VALUES_KEY];
    return typeof v === 'boolean' ? v : LEGEND_VALUES_DEFAULT;
}

/** Read the toggle out of an input bag — absent means {@link LEGEND_SETTINGS_DEFAULT}. */
export function legendSettingsOn(inputs: Record<string, InputValue>): boolean {
    const v = inputs[LEGEND_SETTINGS_KEY];
    return typeof v === 'boolean' ? v : LEGEND_SETTINGS_DEFAULT;
}

/** Input types that are never part of a name: switches, colors, free text, pickers. */
const NON_NAME_TYPES = new Set<InputSchema['type']>([
    'bool',
    'color',
    'text_area',
    'price',
    'time',
    'session',
    'timeframe',
    'symbol',
]);

/** One input's contribution to the name — numbers trimmed, strings as declared. */
function formatNameValue(value: InputValue): string {
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) return '';
        // Lengths print as integers; multipliers keep their decimals (2, 2.5).
        return String(Number(value.toFixed(3)));
    }
    if (typeof value === 'string') return value.trim();
    return '';
}

/**
 * The static readout beside an indicator's name — `14 1 3` for a Stochastic set
 * to 14/1/3 — built from the inputs that opted in with `legend: true`, in
 * declaration order. Gated inputs (`when`) contribute only while their gate
 * passes, exactly like the settings dialog. Empty when the toggle is off or the
 * indicator declares no name inputs (a volume bar chart, a fill-only overlay).
 */
export function legendSettingsText(
    schema: readonly InputSchema[],
    values: Record<string, InputValue>,
): string {
    if (!legendSettingsOn(values)) return '';
    const bag: Record<string, InputValue> = {};
    for (const inp of schema) bag[inp.key] = values[inp.key] ?? inp.defval;
    const parts: string[] = [];
    for (const inp of schema) {
        if (inp.legend !== true) continue;
        if (NON_NAME_TYPES.has(inp.type)) continue;
        if (!inputVisible(inp.when, bag)) continue;
        const text = formatNameValue(bag[inp.key]!);
        if (text.length > 0) parts.push(text);
    }
    return parts.join(' ');
}

/**
 * An indicator's legend name for one instance: its base name plus the settings
 * readout when the toggle is on (`Stoch` → `Stoch 14 1 3`). A study with no name
 * inputs keeps its base name either way.
 */
export function legendTitle(
    base: string,
    schema: readonly InputSchema[],
    values: Record<string, InputValue>,
): string {
    const settings = legendSettingsText(schema, values);
    return settings.length > 0 ? `${base} ${settings}` : base;
}
