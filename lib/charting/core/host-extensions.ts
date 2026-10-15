// Host-extension registry — additively grafts HOST-CONTRIBUTED settings sections
// into every chart's settings dialog, on top of the cell's built-in tabs, without
// the engine importing the host application (same decoupling pattern as the
// palette modules).
//
// The contribution is a FUNCTION so the merge re-runs on every rebuild (rows
// read live state at render time). A section with `placement: 'end'` lands
// after the built-in tabs; `'symbol'`-style merging follows the dialog's normal
// rail semantics.
export type HostExtensionSettingsSection = {
    title: string;
    rows: readonly unknown[];
    placement?: 'after-symbol' | 'end' | 'symbol' | 'scales';
    id?: string;
    /** Hide a previously-grafted section with the same title/id (merge-time pruning). */
    replace?: boolean;
};

type SettingsSectionsProvider = () => readonly HostExtensionSettingsSection[];

let providers: SettingsSectionsProvider[] = [];

/** Register a provider — returns an un-register fn (idempotent re-registers dedupe by fn identity). */
export function registerHostSettingsSections(fn: SettingsSectionsProvider): () => void {
    if (!providers.includes(fn)) providers = [...providers, fn];
    return () => {
        providers = providers.filter((p) => p !== fn);
    };
}

/** Snapshot of the current host-contributed sections (merged, in registration order). */
export function hostSettingsSections(): HostExtensionSettingsSection[] {
    const merged: HostExtensionSettingsSection[] = [];
    for (const p of providers) {
        try {
            merged.push(...p());
        } catch {
            /* a broken provider must never break the dialog */
        }
    }
    return merged;
}
