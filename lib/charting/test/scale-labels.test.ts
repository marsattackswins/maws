// "Labels on price scale" — the catalog-wide, OFF-by-default toggle that decides
// whether an indicator stamps its latest value onto the price scale. The pure helper
// (withScaleLabels), the declaration every classic publishes, and the emitted series'
// display, plus the tabbed Stochastic's placement beside its status-line switch.
import { describe, it, expect, afterAll } from 'vitest';
import type { OHLCV } from '../core/model/ohlcv';
import type { InputValue } from '../core/model/inputs';
import type { SeriesSpec } from '../core/model/series';
import type { NativeIndicatorContext, NativeIndicatorOutput } from '../core/native-indicators/NativeIndicator';
import {
    SCALE_LABELS_DEFAULT,
    SCALE_LABELS_KEY,
    SCALE_LABELS_TITLE,
    scaleLabelsInput,
    scaleLabelsOn,
    withScaleLabels,
} from '../core/native-indicators/scale-labels';
import { LEGEND_SETTINGS_KEY, LEGEND_VALUES_KEY } from '../core/native-indicators/legend-settings';
import { classicSpecs, classicDescriptor } from '../core/native-indicators/classics';
import type { ClassicIndicatorSpec } from '../core/native-indicators/classics';
import { tabInputs } from '../renderers/shared/IndicatorInputsDialog';
import { unregisterNativeIndicator } from '../core/native-indicators/NativeIndicator';

function bar(close: number, i: number): OHLCV {
    return { time: i * 60000, open: close, high: close + 1, low: close - 1, close };
}

const bars = Array.from({ length: 200 }, (_, i) => bar(100 + 10 * Math.sin(i / 9), i));

/** Run a spec's instance and return its LAST emitted output (after the optional edit). */
function emitOf(spec: ClassicIndicatorSpec, edit?: Record<string, InputValue>): NativeIndicatorOutput {
    const desc = classicDescriptor(spec);
    const defaults = desc.defaultInputs();
    const instance = desc.create();
    let captured: NativeIndicatorOutput | undefined;
    const ctx: NativeIndicatorContext = {
        id: 'native-test',
        symbol: 'TEST',
        timeframe: '1m',
        live: false,
        bars: () => bars,
        data: undefined as never,
        emit: (out) => {
            captured = out;
        },
        pushData: () => {},
        setStatus: () => {},
    };
    instance.start(ctx, defaults);
    if (edit) instance.setInputs({ ...defaults, ...edit });
    instance.stop();
    expect(captured).toBeDefined();
    return captured!;
}

/** The value series actually painted in the pane — fill anchors (pane-hidden) excluded. */
const drawnSeries = (out: NativeIndicatorOutput): SeriesSpec[] =>
    (out.series ?? []).filter(
        (s) => (s.kind === 'line' || s.kind === 'area' || s.kind === 'histogram' || s.kind === 'columns') && s.display?.pane !== false,
    );

afterAll(() => {
    for (const spec of classicSpecs) unregisterNativeIndicator(spec.type);
});

describe('scaleLabelsInput', () => {
    it('declares one shared key, title and an OFF default', () => {
        const decl = scaleLabelsInput();
        expect(decl.key).toBe(SCALE_LABELS_KEY);
        expect(decl.title).toBe(SCALE_LABELS_TITLE);
        expect(decl.type).toBe('bool');
        expect(decl.defval).toBe(false);
        expect(SCALE_LABELS_DEFAULT).toBe(false);
        expect(decl.tab).toBeUndefined(); // untabbed specs keep it on the default Inputs tab
    });

    it('rides a tabbed spec’s tab when asked', () => {
        expect(scaleLabelsInput({ tab: 'Style' }).tab).toBe('Style');
        expect(scaleLabelsInput({ tab: '' }).tab).toBeUndefined();
    });

    it('reads the toggle out of a bag, defaulting to off', () => {
        expect(scaleLabelsOn({})).toBe(false);
        expect(scaleLabelsOn({ [SCALE_LABELS_KEY]: true })).toBe(true);
        expect(scaleLabelsOn({ [SCALE_LABELS_KEY]: 'yes' })).toBe(false); // wrong type → default
    });
});

describe('withScaleLabels', () => {
    it('stamps the toggle onto a plot that declared nothing', () => {
        expect(withScaleLabels(undefined, false)).toEqual({ priceScale: false });
        expect(withScaleLabels(undefined, true)).toEqual({ priceScale: true });
    });

    it('keeps the plot’s own surfaces when it already declared priceScale', () => {
        expect(withScaleLabels({ priceScale: false, legend: false }, true)).toEqual({ priceScale: false, legend: false });
        expect(withScaleLabels({ priceScale: true }, false)).toEqual({ priceScale: true });
    });

    it('leaves a plot painted nowhere alone (a fill anchor has nothing to label)', () => {
        expect(withScaleLabels({ pane: false, legend: false, dataWindow: false }, true)).toEqual({
            pane: false,
            legend: false,
            dataWindow: false,
        });
    });
});

describe('every classic indicator declares the toggle', () => {
    it('appends it last, defaulting to off', () => {
        expect(classicSpecs.length).toBeGreaterThan(40);
        for (const spec of classicSpecs) {
            if (spec.scaleLabels === false) continue; // draw-only studies opt out (below)
            const desc = classicDescriptor(spec);
            const schema = desc.inputsSchema();
            const last = schema[schema.length - 1]!;
            expect(last.key, spec.type).toBe(SCALE_LABELS_KEY);
            expect(last.defval, spec.type).toBe(false);
            expect(desc.defaultInputs()[SCALE_LABELS_KEY], spec.type).toBe(false);
            // One toggle per indicator — a spec cannot also declare its own.
            expect(schema.filter((s) => s.key === SCALE_LABELS_KEY)).toHaveLength(1);
        }
    });

    it('leaves a markers/segments-only study without a dead switch', () => {
        // ZigZag and Williams Fractal draw no value line — there is nothing on the scale
        // to label, so declaring the toggle would be a switch that does nothing.
        const drawOnly = classicSpecs.filter((s) => s.scaleLabels === false).map((s) => s.type);
        expect(drawOnly).toEqual(['zigzag', 'williams-fractal']);
        for (const spec of classicSpecs.filter((s) => s.scaleLabels === false)) {
            const desc = classicDescriptor(spec);
            expect(desc.inputsSchema().some((i) => i.key === SCALE_LABELS_KEY), spec.type).toBe(false);
            expect(SCALE_LABELS_KEY in desc.defaultInputs(), spec.type).toBe(false);
        }
    });

    it('puts the Stochastic’s toggle beside its "Show settings in legend" switch on the Style tab', () => {
        const stochastic = classicSpecs.find((s) => s.type === 'stochastic')!;
        const tabs = tabInputs(classicDescriptor(stochastic).inputsSchema());
        const style = tabs.find((t) => t.name === 'Style')!;
        const keys = style.inputs.map((i) => i.key);
        expect(keys).toContain(SCALE_LABELS_KEY);
        expect(keys.indexOf(SCALE_LABELS_KEY)).toBe(keys.indexOf(LEGEND_SETTINGS_KEY) + 2);
        expect(style.inputs.find((i) => i.key === SCALE_LABELS_KEY)!.group).toBe(
            style.inputs.find((i) => i.key === LEGEND_SETTINGS_KEY)!.group,
        );
    });
});

describe('the emitted series follow the toggle', () => {
    it('keeps a study off the price scale by default', () => {
        const out = emitOf(classicSpecs.find((s) => s.type === 'rsi')!);
        const plots = drawnSeries(out);
        expect(plots.length).toBeGreaterThan(0);
        for (const s of plots) expect(s.display?.priceScale, s.title).toBe(false);
    });

    it('adds the label once the toggle is on, and removes it again', () => {
        const rsi = classicSpecs.find((s) => s.type === 'rsi')!;
        const on = emitOf(rsi, { [SCALE_LABELS_KEY]: true });
        for (const s of drawnSeries(on)) expect(s.display?.priceScale, s.title).toBe(true);
        const off = emitOf(rsi, { [SCALE_LABELS_KEY]: false });
        for (const s of drawnSeries(off)) expect(s.display?.priceScale, s.title).toBe(false);
    });

    it('keeps Stochastic price-scale labels independent of both legend switches', () => {
        const stochastic = classicSpecs.find((s) => s.type === 'stochastic')!;
        for (const showSettings of [true, false]) {
            for (const showValues of [true, false]) {
                for (const showScaleLabels of [true, false]) {
                    const out = emitOf(stochastic, {
                        [SCALE_LABELS_KEY]: showScaleLabels,
                        [LEGEND_SETTINGS_KEY]: showSettings,
                        [LEGEND_VALUES_KEY]: showValues,
                    });
                    for (const s of drawnSeries(out)) expect(s.display?.priceScale, s.title).toBe(showScaleLabels);
                }
            }
        }
    });

    it('never labels a fill anchor, whatever the toggle says', () => {
        const out = emitOf(classicSpecs.find((s) => s.type === 'rsi')!, { [SCALE_LABELS_KEY]: true });
        const anchors = (out.series ?? []).filter((s) => s.title.includes('Anchor'));
        expect(anchors.length).toBeGreaterThan(0);
        for (const a of anchors) {
            expect(a.display?.pane).toBe(false);
            expect(a.display?.priceScale).toBeUndefined(); // untouched, and pane-hidden anyway
        }
    });

    it('applies to every classic that draws a line', () => {
        for (const spec of classicSpecs) {
            const out = emitOf(spec);
            for (const s of drawnSeries(out)) expect(s.display?.priceScale, `${spec.type}:${s.title}`).toBe(false);
        }
    });
});
