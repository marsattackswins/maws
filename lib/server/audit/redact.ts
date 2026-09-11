import "server-only";

const SENSITIVE_KEY =
  /key|secret|token|signature|sign|password|authorization|listenkey|cookie|x-mbx/i;

const VALUE_LIMIT = 2000;

/**
 * Recursively redacts sensitive fields from arbitrary values before they are
 * persisted to the audit log or emitted in server logs. Raw secrets, listen
 * keys, signatures, and credentials must never reach durable storage.
 */
export function redact<T>(value: T): T {
  return redactInner(value, 0) as T;
}

function redactInner(value: unknown, depth: number): unknown {
  if (depth > 8) return "[deep]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value.length > VALUE_LIMIT ? `${value.slice(0, VALUE_LIMIT)}…[truncated]` : value;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    return value.length > 500 ? value.slice(0, 500).map((v) => redactInner(v, depth + 1)) : value.map((v) => redactInner(v, depth + 1));
  }
  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY.test(k)) {
        out[k] = "[redacted]";
      } else {
        out[k] = redactInner(v, depth + 1);
      }
    }
    return out;
  }
  return String(value);
}

/** Deterministic JSON for audit rows. */
export function redactJson(value: unknown): string {
  return JSON.stringify(redact(value)) ?? "null";
}
