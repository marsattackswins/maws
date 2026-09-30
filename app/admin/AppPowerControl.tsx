"use client";

import { Power, Play, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type PowerStatus = {
  running: boolean;
  desired: "on" | "off";
  timestamp: number;
};

const CONTROL_BUTTON = "inline-flex items-center gap-2 rounded border border-[#2a2e39] px-3 py-2 text-sm text-[#d1d4dc] transition-colors hover:border-[#f23645] hover:text-[#f23645] disabled:cursor-not-allowed disabled:opacity-50";

/**
 * "App power" control for the Operations Console.
 *
 * Stop = write desired=off for the supervisor, then gracefully shut the app
 * down (same path as Ctrl+C). While the app is down, the supervisor binds the
 * app port itself, so this component polls the same origin and renders a
 * stopped screen with a Start button once the supervisor answers. Starting
 * hands the port back to the real app and the page reloads into /admin.
 */
export default function AppPowerControl({ className }: { className?: string }) {
  const [status, setStatus] = useState<PowerStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [stoppedScreen, setStoppedScreen] = useState(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/power", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<PowerStatus>) : null))
      .then((data) => {
        if (!cancelled && data) setStatus(data);
      })
      .catch(() => {
        // Panel stays inert when the endpoint is unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const start = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      // Only call /start when the SUPERVISOR is answering this origin. If the
      // app itself is still up (desired flip failed, bare start, takeover port
      // busy), /start would 404 on the app. running=true => the app is already
      // back; just reload. refused => no supervisor holding the port either;
      // tell the operator to start from the terminal.
      const probe = await fetch("/api/admin/power", { cache: "no-store" })
        .then((r) => (r.ok ? (r.json() as Promise<PowerStatus>) : null))
        .catch(() => null);
      if (probe?.running === true) {
        window.location.reload();
        return;
      }
      if (!probe) {
        throw new Error(
          "Nothing is serving this URL — start the app from the terminal (npm start) or via the supervisor control page on port 3001.",
        );
      }
      const res = await fetch("/start", { method: "POST" });
      if (!res.ok) throw new Error(`Start failed (${res.status})`);
      // The takeover listener closes while the app boots, so connections are
      // refused for a few seconds; poll until the real app answers.
      const deadline = Date.now() + 90_000;
      const poll = async () => {
        try {
          const s = await fetch("/api/admin/power", { cache: "no-store" }).then(
            (r) => (r.ok ? (r.json() as Promise<PowerStatus>) : null),
          );
          if (s?.running === true) {
            window.location.reload();
            return;
          }
        } catch {
          // Expected while the port changes owners.
        }
        if (Date.now() < deadline) {
          pollRef.current = window.setTimeout(poll, 1_000);
        } else {
          setError("The app did not come back within 90 seconds — check the server terminal.");
          setBusy(false);
        }
      };
      pollRef.current = window.setTimeout(poll, 1_000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Start failed");
      setBusy(false);
    }
  }, []);

  useEffect(() => () => {
    if (pollRef.current !== null) window.clearTimeout(pollRef.current);
  }, []);

  const stop = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      // Non-local modes require the per-session CSRF header on mutations.
      let csrf: string | null = null;
      try {
        const session = await fetch("/api/auth/session", { cache: "no-store" }).then(
          (res) => (res.ok ? (res.json() as Promise<{ csrf?: string }>) : null),
        );
        csrf = session?.csrf ?? null;
      } catch {
        // Local mode needs no CSRF; non-local will fail below with 403.
      }

      const res = await fetch("/api/admin/power", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(csrf ? { "x-maws-csrf": csrf } : {}),
        },
        credentials: "same-origin",
        body: JSON.stringify({ confirm: "STOP" }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? `Stop failed (${res.status})`);
      }
      // The app is going down. The supervisor's takeover listener will answer
      // this origin shortly; poll until it does, then show the power screen.
      // If the origin stops answering entirely (bare start, no supervisor),
      // still show the screen — it explains how to start again.
      setStoppedScreen(true);
      const deadline = Date.now() + 30_000;
      const poll = async () => {
        try {
          const s = await fetch("/api/admin/power", { cache: "no-store" }).then(
            (r) => (r.ok ? (r.json() as Promise<PowerStatus>) : null),
          );
          if (s && s.running === false) {
            setBusy(false);
            setConfirming(false);
            return;
          }
        } catch {
          // App not down yet, or the port is mid-handover.
        }
        if (Date.now() < deadline) {
          pollRef.current = window.setTimeout(poll, 1000);
        } else {
          setBusy(false);
        }
      };
      pollRef.current = window.setTimeout(poll, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stop failed");
      setBusy(false);
      setConfirming(false);
    }
  }, []);

  if (stoppedScreen) {
    return (
      <div className="rounded-lg border border-[#f7931a]/40 bg-[#131722] p-6 text-center">
        <div className="text-lg font-semibold text-[#f7931a]">App stopped</div>
        <p className="mt-1 text-sm text-[#787b86]">
          The server shut down gracefully. Press start to bring it back — the page reloads into the console when the app is healthy again.
        </p>
        <button
          type="button"
          onClick={() => void start()}
          disabled={busy}
          className="mt-4 inline-flex items-center gap-2 rounded bg-[#2962ff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e4fd6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={14} />
          {busy ? "Starting…" : "Start app"}
        </button>
        {error && <p className="mt-3 text-xs text-[#f23645]">{error}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      {confirming ? (
        <div className="flex flex-wrap items-center gap-2 rounded border border-[#5b2028] bg-[#211518] px-3 py-2">
          <TriangleAlert size={15} className="text-[#f23645]" />
          <span className="text-sm text-[#d1d4dc]">Stop the app and release the broker stream lease?</span>
          <button
            type="button"
            onClick={() => void stop()}
            disabled={busy}
            className="rounded border border-[#f23645] px-3 py-1.5 text-sm text-[#f23645] transition-colors hover:bg-[#f23645]/10 disabled:opacity-50"
          >
            {busy ? "Stopping…" : "Confirm stop"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={busy}
            className="rounded border border-[#2a2e39] px-3 py-1.5 text-sm text-[#787b86] transition-colors hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={busy || status?.desired === "off"}
          className={CONTROL_BUTTON}
          title="Gracefully stop the MAWS app (the supervisor keeps running and can start it again)"
        >
          <Power size={14} />
          {busy ? "Stopping…" : "Stop app"}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-[#f23645]">{error}</p>}
    </div>
  );
}
