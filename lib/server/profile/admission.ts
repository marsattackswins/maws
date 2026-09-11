import "server-only";

export type ProfileMutationBlockReason = "profile_switch_in_progress" | "profile_runtime_unavailable";

let normalMutationBlockReason: ProfileMutationBlockReason | null = null;

export function blockNormalMutations(reason: ProfileMutationBlockReason): void {
  normalMutationBlockReason = reason;
}

export function allowNormalMutations(): void {
  normalMutationBlockReason = null;
}

export function normalMutationBlock(): ProfileMutationBlockReason | null {
  return normalMutationBlockReason;
}

export function resetProfileAdmissionForTests(): void {
  normalMutationBlockReason = null;
}
