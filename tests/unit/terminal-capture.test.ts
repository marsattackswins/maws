import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import {
  installTerminalCapture,
  terminalLogsSnapshot,
  resetTerminalCaptureForTests,
} from "@/lib/server/log/terminal-capture";

describe("terminal capture", () => {
  let stdoutSpy: ReturnType<typeof jest.spyOn>;
  let stderrSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    resetTerminalCaptureForTests();
  });

  afterEach(() => {
    stdoutSpy?.mockRestore();
    stderrSpy?.mockRestore();
    resetTerminalCaptureForTests();
  });

  test("mirrors stdout lines into the snapshot", () => {
    installTerminalCapture();
    process.stdout.write("hello from the server\n");
    const snapshot = terminalLogsSnapshot();
    expect(snapshot.total).toBe(1);
    expect(snapshot.lines[0].text).toBe("hello from the server");
    expect(snapshot.lines[0].stream).toBe("stdout");
  });

  test("captures stderr lines tagged as stderr", () => {
    installTerminalCapture();
    // Call-through spy: mocking the implementation would bypass the capture
    // wrapper installed on process.stderr.write.
    stderrSpy = jest.spyOn(process.stderr, "write");
    process.stderr.write("boom\n");
    const snapshot = terminalLogsSnapshot();
    expect(snapshot.lines[0].stream).toBe("stderr");
    expect(snapshot.lines[0].text).toBe("boom");
  });

  test("passes output through unchanged", () => {
    installTerminalCapture();
    stdoutSpy = jest.spyOn(process.stdout, "write");
    stdoutSpy.mockImplementation(() => true);
    process.stdout.write("passthrough\n");
    expect(stdoutSpy).toHaveBeenCalledWith("passthrough\n");
  });

  test("reassembles lines written across multiple chunks", () => {
    installTerminalCapture();
    process.stdout.write("par");
    process.stdout.write("tial ");
    process.stdout.write("line\n");
    const snapshot = terminalLogsSnapshot();
    expect(snapshot.total).toBe(1);
    expect(snapshot.lines[0].text).toBe("partial line");
  });

  test("evicts oldest lines beyond the ring buffer capacity", () => {
    installTerminalCapture();
    for (let i = 0; i < 1005; i += 1) {
      process.stdout.write(`line-${i}\n`);
    }
    const snapshot = terminalLogsSnapshot(2000);
    expect(snapshot.total).toBe(1005);
    expect(snapshot.lines).toHaveLength(1000);
    expect(snapshot.dropped).toBe(5);
    expect(snapshot.lines[0].text).toBe("line-5");
  });

  test("limit param bounds the returned lines to the newest ones", () => {
    installTerminalCapture();
    for (let i = 0; i < 10; i += 1) process.stdout.write(`n-${i}\n`);
    const snapshot = terminalLogsSnapshot(3);
    expect(snapshot.lines.map((l) => l.text)).toEqual(["n-7", "n-8", "n-9"]);
  });

  test("install is idempotent and does not duplicate lines", () => {
    installTerminalCapture();
    installTerminalCapture();
    process.stdout.write("once\n");
    expect(terminalLogsSnapshot().total).toBe(1);
  });

  test("reset unwraps the writers so later output is not captured", () => {
    installTerminalCapture();
    resetTerminalCaptureForTests();
    process.stdout.write("after reset\n");
    expect(terminalLogsSnapshot().total).toBe(0);
  });

  test("handles non-string chunks (Buffer)", () => {
    installTerminalCapture();
    process.stdout.write(Buffer.from("buffered line\n"));
    expect(terminalLogsSnapshot().lines[0].text).toBe("buffered line");
  });

  test("state is shared across separately-bundled module copies", () => {
    // Turbopack compiles instrumentation and route handlers as separate
    // bundles, each with their own copy of this module. State must live on
    // globalThis (Symbol.for) so both copies see the same buffer.
    const first = jest.requireActual<typeof import("@/lib/server/log/terminal-capture")>(
      "@/lib/server/log/terminal-capture",
    );
    // A fresh registry entry keyed the same way must resolve to the same state.
    const key = Symbol.for("maws.terminal-capture.state");
    const viaSymbol = (globalThis as unknown as Record<symbol, unknown>)[key];
    expect(viaSymbol).toBeDefined();

    installTerminalCapture();
    process.stdout.write("written by copy A\n");
    // Another "copy" (same module re-required) must observe the same lines.
    expect(first.terminalLogsSnapshot().lines.some((l) => l.text === "written by copy A")).toBe(true);
  });
});
