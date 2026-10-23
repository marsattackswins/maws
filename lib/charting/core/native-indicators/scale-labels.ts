import type { InputSchema, InputValue } from '../model/inputs';
import type { SeriesDisplay } from '../model/series';

/**
 * The "Labels on price scale" toggle every native indicator carries.
 *
 * A study's latest value is drawn as a chip on the price scale by the chrome
 * layer (`ChromeRenderer.drawIndicatorValueChips`) whenever the series is shown
 * there — and a series with no `display` is shown everywhere. That made every
 * indicator stamp its last value onto the scale whether or not the value reads
 * there (a bounded oscillator's 0.0 next to the price axis is noise), so the
 * catalog now declares one shared, OFF-by-default toggle and stamps it onto the
 * plots it emits.
 *
 * One key, one title, one default — the catalog, the classics adapter and
 * host-registered natives all speak this vocabulary (MAWS: PMO).
 */

/** The input key shared by every indicator's toggle (also the persisted document key). */
export const SCALE_LABELS_KEY = 'labelsOnPriceScale';

/** Display label of the toggle — the dialog row and the legend's settings vocabulary. */
export const SCALE_LABELS_TITLE = 'Labels on price scale';

/** OFF: a study's value on the scale is opt-in. */
export const SCALE_LABELS_DEFAULT = false;

/** The dialog section the toggle sits in (appended last, after the look controls). */
export const SCALE_LABELS_GROUP = 'Output values';

/**
 * The toggle's schema declaration. `placement` carries the tab/section of the
 * spec it is appended to: a tabbed spec (the Stochastic puts its look rows on a
 * Style tab) keeps the toggle on that same tab, so it lands beside the other
 * output-surface switches instead of spawning a stray Inputs section.
 */
export function scaleLabelsInput(placement: { tab?: string; group?: string } = {}): InputSchema {
    return {
        key: SCALE_LABELS_KEY,
        title: SCALE_LABELS_TITLE,
        type: 'bool',
        defval: SCALE_LABELS_DEFAULT,
        group: placement.group ?? SCALE_LABELS_GROUP,
        ...(placement.tab != null && placement.tab.length > 0 ? { tab: placement.tab } : {}),
        tooltip: 'Draw this indicator\u2019s latest value as a chip on the price scale. Off by default.',
    };
}

/** Read the toggle out of an input bag — absent means {@link SCALE_LABELS_DEFAULT}. */
export function scaleLabelsOn(inputs: Record<string, InputValue>): boolean {
    const v = inputs[SCALE_LABELS_KEY];
    return typeof v === 'boolean' ? v : SCALE_LABELS_DEFAULT;
}

/**
 * Stamp the toggle onto a plot's per-surface display — the seam between the
 * declaration and the renderer's chip loop:
 *
 * - an explicit `priceScale` on the plot wins (a spec that already decided);
 * - a plot painted nowhere (a fill anchor, a data-window row) keeps its own
 *   display — there is nothing on the scale to label;
 * - everything else gets the toggle's value, so the chip appears only once the
 *   user turns it on.
 */
export function withScaleLabels(display: SeriesDisplay | undefined, on: boolean): SeriesDisplay | undefined {
    const base = display;
    if (base?.priceScale !== undefined) return base;
    if (base?.pane === false) return base;
    return { ...base, priceScale: on };
}
