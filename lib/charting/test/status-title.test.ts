// Every indicator's legend chip names the INSTANCE after its settings (`Stoch 14 1 3`,
// `RSI 14 Close`, `PMO 35 20 10 Close`) instead of carrying the live value at the
// crosshair. The generic seam is `NativeIndicatorDescriptor.titleFor` fed by
// `legendSettingsText()`; here we cover the catalog side (the declarations every
// classic publishes, the flagged inputs, and the toggle that turns the name off).
import { describe, it, expect, afterAll } from 'vitest';
import { classicSpecs, classicDescriptor } from '../core/native-indicators/classics';
import type { ClassicIndicatorSpec } from '../core/native-indicators/classics';
import type { InputValue } from '../core/model/inputs';
import { unregisterNativeIndicator } from '../core/native-indicators/NativeIndicator';
import {
    LEGEND_VALUES_DEFAULT,
    LEGEND_VALUES_KEY,
    LEGEND_VALUES_TITLE,
    LEGEND_SETTINGS_DEFAULT,
    LEGEND_SETTINGS_KEY,
    LEGEND_SETTINGS_TITLE,
    legendValuesInput,
    legendValuesOn,
    legendSettingsInput,
    legendSettingsOn,
    legendSettingsText,
    legendTitle,
} from '../core/native-indicators/legend-settings';

const specOf = (type: string): ClassicIndicatorSpec => classicSpecs.find((s) => s.type === type)!;
const titleOf = (type: string, edit: Record<string, InputValue> = {}): string => {
    const desc = classicDescriptor(specOf(type));
    return desc.titleFor!({ ...desc.defaultInputs(), ...edit });
};

afterAll(() => {
    for (const spec of classicSpecs) unregisterNativeIndicator(spec.type);
});

describe('legendSettingsText / legendTitle', () => {
    it('joins the flagged inputs in declaration order, numbers trimmed', () => {
        const schema = [
            { key: 'a', title: 'A', type: 'int' as const, defval: 14, legend: true },
            { key: 'b', title: 'B', type: 'float' as const, defval: 2.5, legend: true },
            { key: 'c', title: 'C', type: 'float' as const, defval: 2, legend: true },
        ];
        expect(legendSettingsText(schema, {})).toBe('14 2.5 2');
        expect(legendTitle('Thing', schema, { a: 40 })).toBe('Thing 40 2.5 2');
    });

    it('ignores look-only inputs, switches, colors and pickers', () => {
        const schema = [
            { key: 'len', title: 'Length', type: 'int' as const, defval: 20, legend: true },
            { key: 'width', title: 'Width', type: 'int' as const, defval: 3 },
            { key: 'on', title: 'On', type: 'bool' as const, defval: true, legend: true },
            { key: 'ink', title: 'Color', type: 'color' as const, defval: '#fff', legend: true },
        ];
        expect(legendSettingsText(schema, {})).toBe('20');
    });

    it('honours an input’s `when` gate, like the settings dialog', () => {
        const schema = [
            { key: 'mode', title: 'Mode', type: 'string' as const, defval: 'EMA', options: ['EMA', 'SMA'], legend: true },
            { key: 'smooth', title: 'Smooth', type: 'int' as const, defval: 9, legend: true, when: { key: 'mode', equals: 'SMA' } },
        ];
        expect(legendSettingsText(schema, {})).toBe('EMA');
        expect(legendSettingsText(schema, { mode: 'SMA' })).toBe('SMA 9');
    });

    it('is empty while the toggle is off — the plain name is used', () => {
        const schema = [{ key: 'len', title: 'Length', type: 'int' as const, defval: 14, legend: true }];
        const off = { len: 14, [LEGEND_SETTINGS_KEY]: false };
        expect(legendSettingsOn(off)).toBe(false);
        expect(legendSettingsText(schema, off)).toBe('');
        expect(legendTitle('Stoch', schema, off)).toBe('Stoch');
    });

    it('declares one shared switch, ON by default', () => {
        const decl = legendSettingsInput();
        expect(decl.key).toBe(LEGEND_SETTINGS_KEY);
        expect(decl.title).toBe(LEGEND_SETTINGS_TITLE);
        expect(decl.type).toBe('bool');
        expect(decl.defval).toBe(true);
        expect(LEGEND_SETTINGS_DEFAULT).toBe(true);
        expect(legendSettingsInput({ tab: 'Style' }).tab).toBe('Style');
        expect(legendSettingsOn({})).toBe(true);
        expect(legendSettingsOn({ [LEGEND_SETTINGS_KEY]: 'off' })).toBe(true); // wrong type → default
    });

    it('declares a live-value visibility switch, ON by default', () => {
        const decl = legendValuesInput();
        expect(decl.key).toBe(LEGEND_VALUES_KEY);
        expect(decl.title).toBe(LEGEND_VALUES_TITLE);
        expect(decl.type).toBe('bool');
        expect(decl.defval).toBe(true);
        expect(LEGEND_VALUES_DEFAULT).toBe(true);
        expect(legendValuesInput({ tab: 'Style' }).tab).toBe('Style');
        expect(legendValuesOn({})).toBe(true);
        expect(legendValuesOn({ [LEGEND_VALUES_KEY]: false })).toBe(false);
        expect(legendValuesOn({ [LEGEND_VALUES_KEY]: 'off' })).toBe(true);
    });
});

describe('classic legend names', () => {
    it('names the Stochastic after its three lengths', () => {
        expect(titleOf('stochastic')).toBe('Stoch 14 1 3');
        expect(titleOf('stochastic', { kLength: 40 })).toBe('Stoch 40 1 3');
        expect(titleOf('stochastic', { kSmoothing: 3, dLength: 5 })).toBe('Stoch 14 3 5');
    });

    it('falls back to the plain name when "Show settings in legend" is off', () => {
        expect(titleOf('stochastic', { [LEGEND_SETTINGS_KEY]: false })).toBe('Stoch');
        expect(titleOf('macd', { [LEGEND_SETTINGS_KEY]: false })).toBe('MACD');
    });

    it('keeps thresholds out of the name', () => {
        // The RSI's overbought/oversold levels are settings, but not its identity.
        expect(titleOf('rsi')).toBe('RSI 14 Close');
        expect(titleOf('rsi', { overbought: 80, oversold: 20 })).toBe('RSI 14 Close');
    });

    it('carries decimals only where the setting has them', () => {
        expect(titleOf('bollinger-bands')).toBe('BB 20 Close 2');
        expect(titleOf('bollinger-bands', { mult: 2.5 })).toBe('BB 20 Close 2.5');
        // An offset is how the line is drawn, not what the study is.
        expect(titleOf('sma')).toBe('SMA 20 Close');
        expect(titleOf('sma', { offset: 3 })).toBe('SMA 20 Close');
    });

    it('gives every classic one switch, ON, and a name that follows its inputs', () => {
        expect(classicSpecs.length).toBeGreaterThan(40);
        for (const spec of classicSpecs) {
            const desc = classicDescriptor(spec);
            const schema = desc.inputsSchema();
            const defaults = desc.defaultInputs();
            const switches = schema.filter((i) => i.key === LEGEND_SETTINGS_KEY);
            expect(switches, spec.type).toHaveLength(1);
            expect(defaults[LEGEND_SETTINGS_KEY], spec.type).toBe(true);
            const valueSwitches = schema.filter((i) => i.key === LEGEND_VALUES_KEY);
            expect(valueSwitches, spec.type).toHaveLength(1);
            expect(defaults[LEGEND_VALUES_KEY], spec.type).toBe(true);
            const base = spec.shortTitle ?? spec.title;
            const name = desc.titleFor!(defaults);
            expect(name, spec.type).toBe(`${base} ${legendSettingsText(schema, defaults)}`.trim());
            // …and turning the switch off leaves only the base name.
            expect(desc.titleFor!({ ...defaults, [LEGEND_SETTINGS_KEY]: false }), spec.type).toBe(base);
        }
    });
});
