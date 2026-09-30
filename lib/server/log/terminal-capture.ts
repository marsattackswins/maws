import "server-only";

/**
 * In-memory capture of the server's own terminal output.
 *
 * `npm start` runs the Next server in this same Node process, so everything
 * the process writes to stdout/stderr (the MAWS logger, Next internals,
 * uncaught errors) can be mirrored into a bounded ring buffer and shown on
 * the admin Operations Console — no log file or external process needed.
 *
 * Output is only observed, never swallowed: each write is passed through to
 * the original writer unchanged.
 *
 * Turbopack compiles instrumentation.js and every route handler as separate
 * bundles with separate module registries, so module-level state here would
 * be duplicated per bundle. All state therefore lives on the process's real
 * global object (via the shared symbol registry) — exactly one copy per
 * Node process, visible to instrumentation, route handlers, and workers.
 */

export type TerminalStream = "stdout" | "stderr";

export interface TerminalLogLine {
  /** Monotonic counter across both streams; also the stable display key. */
  seq: number;
  /** Epoch milliseconds for the moment the line was completed. */
  ts: number;
  stream: TerminalStream;
  text: string;
}

export interface TerminalLogsSnapshot {
  timestamp: number;
  /** Total completed lines since server start, including dropped ones. */
  total: number;
  /** Lines evicted from the ring buffer before this snapshot. */
  dropped: number;
  lines: TerminalLogLine[];
}

const MAX_LINES = 1000;
const MAX_LINE_LENGTH = 2000;

// Symbol.for registers in Node's cross-realm symbol registry, so every
// compiled copy of this module resolves the same key on globalThis.
const STATE_KEY = Symbol.for("maws.terminal-capture.state");
const WRAP_FLAG = Symbol.for("maws.terminal-capture.installed");

interface CaptureState {
  buffer: TerminalLogLine[];
  pending: Record<TerminalStream, string>;
  seqCounter: number;
  dropped: number;
  originalStdoutWrite: typeof process.stdout.write | null;
  originalStderrWrite: typeof process.stderr.write | null;
}

function globals(): Record<symbol, unknown> {
  return globalThis as unknown as Record<symbol, unknown>;
}

function state(): CaptureState {
  const existing = globals()[STATE_KEY] as CaptureState | undefined;
  if (existing) return existing;
  const fresh: CaptureState = {
    buffer: [],
    pending: { stdout: "", stderr: "" },
    seqCounter: 0,
    dropped: 0,
    originalStdoutWrite: null,
    originalStderrWrite: null,
  };
  globals()[STATE_KEY] = fresh;
  return fresh;
}

function pushLine(st: CaptureState, stream: TerminalStream, text: string): void {
  const trimmed = text.length > MAX_LINE_LENGTH ? `${text.slice(0, MAX_LINE_LENGTH)}…[truncated]` : text;
  st.seqCounter += 1;
  st.buffer.push({ seq: st.seqCounter, ts: Date.now(), stream, text: trimmed });
  if (st.buffer.length > MAX_LINES) {
    st.buffer.shift();
    st.dropped += 1;
  }
}

function ingest(st: CaptureState, stream: TerminalStream, chunk: string): void {
  // Chunks can arrive mid-line; hold the tail until its newline arrives so
  // lines written across multiple writes stay whole.
  const parts = (st.pending[stream] + chunk).split("\n");
  st.pending[stream] = parts.pop() ?? "";
  for (const line of parts) {
    pushLine(st, stream, line.endsWith("\r") ? line.slice(0, -1) : line);
  }
  // A pathological writer that never emits newlines must not grow unbounded.
  if (st.pending[stream].length > MAX_LINE_LENGTH) {
    pushLine(st, stream, st.pending[stream]);
    st.pending[stream] = "";
  }
}

function chunkToText(chunk: unknown): string {
  if (typeof chunk === "string") return chunk;
  if (Buffer.isBuffer(chunk)) return chunk.toString("utf8");
  return String(chunk);
}

function wrappedWrite(
  st: CaptureState,
  stream: TerminalStream,
  original: typeof process.stdout.write,
): typeof process.stdout.write {
  return ((chunk: unknown, ...rest: unknown[]) => {
    ingest(st, stream, chunkToText(chunk));
    return (original as unknown as (...args: unknown[]) => boolean)(chunk, ...rest);
  }) as typeof process.stdout.write;
}

/**
 * Wrap process.stdout.write / process.stderr.write so every line is mirrored
 * into the ring buffer. Idempotent per process; call once from instrumentation.
 */
export function installTerminalCapture(): void {
  if (globals()[WRAP_FLAG]) return;
  const st = state();
  st.originalStdoutWrite = process.stdout.write.bind(process.stdout);
  st.originalStderrWrite = process.stderr.write.bind(process.stderr);
  process.stdout.write = wrappedWrite(st, "stdout", st.originalStdoutWrite);
  process.stderr.write = wrappedWrite(st, "stderr", st.originalStderrWrite);
  globals()[WRAP_FLAG] = true;
}

export function terminalLogsSnapshot(limit = 200): TerminalLogsSnapshot {
  const st = state();
  const bounded = Math.max(1, Math.min(limit, MAX_LINES));
  return {
    timestamp: Date.now(),
    total: st.seqCounter,
    dropped: st.dropped,
    lines: st.buffer.slice(-bounded),
  };
}

/** Test-only: unwrap the writers and clear captured state. */
export function resetTerminalCaptureForTests(): void {
  const g = globals();
  const st = state();
  if (g[WRAP_FLAG] && st.originalStdoutWrite) process.stdout.write = st.originalStdoutWrite;
  if (g[WRAP_FLAG] && st.originalStderrWrite) process.stderr.write = st.originalStderrWrite;
  g[WRAP_FLAG] = false;
  st.originalStdoutWrite = null;
  st.originalStderrWrite = null;
  st.buffer.length = 0;
  st.pending.stdout = "";
  st.pending.stderr = "";
  st.seqCounter = 0;
  st.dropped = 0;
}
