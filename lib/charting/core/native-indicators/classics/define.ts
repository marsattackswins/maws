import type { OHLCV } from '../../model/ohlcv';
import type { InputSchema, InputValue } from '../../model/inputs';
import { scaleLabelsInput, scaleLabelsOn, withScaleLabels } from '../scale-labels';
import { legendSettingsInput, legendTitle, legendValuesInput } from '../legend-settings';
import type { LineLikeKind, LineStyle, MarkerPoint, SeriesDisplay, SeriesPoint, SeriesSpec } from '../../model/series';
import type { Fill, FillGradientStop, PriceLine } from '../../model/scene';
import type { DrawingPolyline } from '../../model/drawings';
import { stableSeriesId } from '../../model/identity';
import type { NativeIndicator, NativeIndicatorContext, NativeIndicatorDescriptor } from '../NativeIndicator';

/**
 * The classic-indicator adapter: each catalog entry is metadata plus a PURE
 * `compute(bars, inputs)` returning bar-aligned value arrays, and this module
 * wraps it into a {@link NativeIndicatorDescriptor} — lifecycle, stable ids,
 * SeriesPoint conversion and fills all handled once. Keeping the computes pure
 * is what makes the whole catalog testable without a chart.
 */

/** One plotted value series; `values` align to bars by index, NaN = whitespace. */
export interface ClassicPlot {
    /** Stable identity of the plot within the indicator (drives the series id). */
    key: string;
    title: string;
    /** Series kind; default `'line'`. */
    kind?: LineLikeKind;
    values: readonly number[];
    color: string;
    width?: number;
    lineStyle?: LineStyle;
    /** Baseline for histogram/area kinds. */
    base?: number;
    /** Per-bar color override, aligned to bars by index. */
    colors?: ReadonlyArray<string | null>;
    /** Render on the price pane even when the indicator owns a study pane. */
    overlay?: boolean;
    /**
     * Per-surface visibility. A plot shown nowhere still anchors a {@link ClassicBand} —
     * that is how a zone shaded against a constant (an overbought level, the 0/100 rails)
     * is expressed without a line in the pane or a row in the legend.
     */
    display?: SeriesDisplay;
}

/** A soft band filled between two plots (referenced by plot key). */
export interface ClassicBand {
    key: string;
    from: string;
    to: string;
    color: string;
    /** Per-bar solid color, aligned to bars by index; overrides {@link color} where set. */
    colors?: ReadonlyArray<string | null>;
    /** Per-bar vertical gradient (a two-tone wash across the band), aligned by index. */
    gradient?: ReadonlyArray<FillGradientStop | null>;
}

/** A fixed horizontal level on the indicator's pane. */
export interface ClassicLevel {
    key: string;
    price: number;
    color?: string;
    lineStyle?: LineStyle;
    title?: string;
}

/** What one compute pass yields. */
export interface ClassicOutput {
    plots: ClassicPlot[];
    bands?: ClassicBand[];
    levels?: ClassicLevel[];
    markers?: MarkerPoint[];
    /** Free-form paths (e.g. a zigzag's pivot-to-pivot legs). */
    polylines?: Array<Omit<DrawingPolyline, 'id' | 'paneId'> & { key: string }>;
}

/** A catalog entry: metadata + input schema + the pure compute. */
export interface ClassicIndicatorSpec {
    type: string;
    title: string;
    shortTitle?: string;
    /** true = draws over the price candles; false = its own pane below. */
    overlay: boolean;
    /** Offers the "Labels on price scale" switch (default true). A study that draws only
     *  markers or segments — no value line — sets this false: it has no latest value to
     *  put on the scale, so the toggle would be a switch that does nothing. */
    scaleLabels?: boolean;
    inputs: InputSchema[];
    compute(bars: readonly OHLCV[], inputs: Record<string, InputValue>): ClassicOutput;
}

export function num(inputs: Record<string, InputValue>, key: string, fallback: number): number {
    const v = inputs[key];
    return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

export function str(inputs: Record<string, InputValue>, key: string, fallback: string): string {
    const v = inputs[key];
    return typeof v === 'string' && v !== '' ? v : fallback;
}

export function bool(inputs: Record<string, InputValue>, key: string, fallback: boolean): boolean {
    const v = inputs[key];
    return typeof v === 'boolean' ? v : fallback;
}

function toPoints(bars: readonly OHLCV[], values: readonly number[], colors?: ReadonlyArray<string | null>): SeriesPoint[] {
    const pts = new Array<SeriesPoint>(bars.length);
    for (let i = 0; i < bars.length; i++) {
        const v = values[i];
        const p: SeriesPoint = { time: bars[i]!.time, value: v != null && Number.isFinite(v) ? v : null };
        const c = colors?.[i];
        if (c != null) p.color = c;
        pts[i] = p;
    }
    return pts;
}

class ClassicIndicator implements NativeIndicator {
    /** Null until start() — a pre-start setInputs must record without computing. */
    private ctx: NativeIndicatorContext | null = null;
    private inputs: Record<string, InputValue> = {};

    constructor(private readonly spec: ClassicIndicatorSpec) {}

    start(ctx: NativeIndicatorContext, inputs: Record<string, InputValue>): void {
        this.ctx = ctx;
        this.inputs = inputs;
        this.recompute();
    }

    onBars(): void {
        this.recompute();
    }

    onViewport(): void {}

    setInputs(inputs: Record<string, InputValue>): void {
        this.inputs = inputs;
        // Pre-start edits (a workspace restore applies stored inputs the moment the
        // handle exists) just record: `ctx` lands at start(), which recomputes with
        // the orchestrator's replayed values — computing here would read no bars.
        if (!this.ctx) return;
        this.recompute();
    }

    /** Nothing to free — the compute reads the live bar accessor on demand. */
    suspend(): void {}

    resume(): void {
        this.recompute();
    }

    stop(): void {}

    private recompute(): void {
        if (!this.ctx) return;
        const bars = this.ctx.bars();
        const out = this.spec.compute(bars, this.inputs);
        const instanceId = this.spec.type;
        const series: SeriesSpec[] = [];
        const idsByKey = new Map<string, string>();
        // The "Labels on price scale" toggle decides the price-scale surface for every
        // drawn plot — OFF unless the user asks for the chip (lib/charting/README.md).
        const labelsOn = scaleLabelsOn(this.inputs);
        out.plots.forEach((plot, ordinal) => {
            const kind = plot.kind ?? 'line';
            const id = stableSeriesId({ instanceId, kind, title: plot.title, ordinal });
            idsByKey.set(plot.key, id);
            const display = withScaleLabels(plot.display, labelsOn);
            series.push({
                id,
                title: plot.title,
                paneId: '', // stamped by the orchestrator
                kind,
                points: toPoints(bars, plot.values, plot.colors),
                style: {
                    color: plot.color,
                    width: plot.width ?? 1,
                    lineStyle: plot.lineStyle ?? 'solid',
                    ...(plot.base != null ? { base: plot.base } : {}),
                },
                ...(plot.overlay ? { overlay: true } : {}),
                ...(display ? { display } : {}),
            });
        });
        if (out.markers && out.markers.length > 0) {
            series.push({
                id: stableSeriesId({ instanceId, kind: 'markers', title: 'markers', ordinal: 0 }),
                title: this.spec.shortTitle ?? this.spec.title,
                paneId: '',
                kind: 'markers',
                markers: out.markers,
            });
        }
        const fills: Fill[] = (out.bands ?? []).flatMap((band, ordinal) => {
            const from = idsByKey.get(band.from);
            const to = idsByKey.get(band.to);
            if (!from || !to) return [];
            return [
                {
                    id: stableSeriesId({ instanceId, kind: 'fill', title: band.key, ordinal }),
                    paneId: '',
                    fromSeriesId: from,
                    toSeriesId: to,
                    color: band.color,
                    ...(band.colors ? { colors: [...band.colors] } : {}),
                    ...(band.gradient ? { gradient: [...band.gradient] } : {}),
                },
            ];
        });
        const priceLines: PriceLine[] = (out.levels ?? []).map((level, ordinal) => ({
            id: stableSeriesId({ instanceId, kind: 'hline', title: level.key, ordinal }),
            paneId: '',
            price: level.price,
            ...(level.color != null ? { color: level.color } : {}),
            lineStyle: level.lineStyle ?? 'dashed',
            width: 1,
            ...(level.title != null ? { title: level.title } : {}),
        }));
        const polylines: DrawingPolyline[] = (out.polylines ?? []).map((poly, ordinal) => {
            const { key, ...rest } = poly;
            return {
                id: stableSeriesId({ instanceId, kind: 'polyline', title: key, ordinal }),
                paneId: '',
                ...rest,
            };
        });
        this.ctx.emit({ series, fills, priceLines, polylines });
        this.ctx.setStatus('idle');
    }
}

/**
 * The schema a classic publishes: its own declarations plus the shared output-surface
 * controls, appended so they land with the look rows of the tab the spec ends on (the
 * Stochastic's Style tab).
 *
 * "Show settings in legend" and "Show values in legend" come first — every
 * classic names its instances after their calculation inputs (`Stoch 14 1 3`), so every
 * classic offers both switches. "Labels on price scale" follows, and stays absent on a
 * draw-only study that has no value to put on the scale.
 */
function classicInputs(spec: ClassicIndicatorSpec): InputSchema[] {
    const last = spec.inputs[spec.inputs.length - 1];
    const legend = legendSettingsInput({ tab: last?.tab });
    const values = legendValuesInput({ tab: last?.tab });
    if (spec.scaleLabels === false) return [...spec.inputs, legend, values];
    return [...spec.inputs, legend, values, scaleLabelsInput({ tab: last?.tab })];
}

/** Wrap a catalog entry into a registrable native-indicator descriptor. */
export function classicDescriptor(spec: ClassicIndicatorSpec): NativeIndicatorDescriptor {
    // One schema per descriptor: the dialog and the legend name read the same declarations.
    const schema = classicInputs(spec);
    const base = spec.shortTitle ?? spec.title;
    return {
        type: spec.type,
        title: spec.title,
        ...(spec.shortTitle != null ? { shortTitle: spec.shortTitle } : {}),
        // The on-chart chip names the INSTANCE (`Stoch 14 1 3`, `EMA 20 Close`) instead of
        // carrying the value at the crosshair. Recomputed per emit, so an edit follows
        // live; the toggle in the settings dialog drops back to the plain name.
        titleFor: (inputs) => legendTitle(base, schema, inputs),
        paneHint: spec.overlay ? 'price' : 'new',
        overlay: spec.overlay,
        // Studies stack (a 20 and a 200 moving average side by side) — unlike the layer-backed natives.
        multiInstance: true,
        inputsSchema: () => [...schema],
        defaultInputs: () => Object.fromEntries(schema.map((i) => [i.key, i.defval])),
        create: () => new ClassicIndicator(spec),
    };
}
