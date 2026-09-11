"use client";

import { useState, type FormEvent } from "react";

type LoginErrorBody = { error?: { code?: string } };

function errorMessage(status: number, body: LoginErrorBody | null): string {
  if (status === 429) return "Too many attempts. Wait a while and try again.";
  if (body?.error?.code === "env_local") return "Sign-in is not used in local mode. Return to the chart.";
  if (status === 401 || body?.error?.code === "bad_credentials") return "Invalid operator password.";
  return "Sign-in is unavailable. Try again later.";
}

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        // Full page load boots the app under the fresh HttpOnly session cookie.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/";
        return;
      }
      const body = (await response.json().catch(() => null)) as LoginErrorBody | null;
      setError(errorMessage(response.status, body));
    } catch {
      setError("Sign-in is unavailable. Try again later.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center"
      style={{ background: "var(--maws-bg)", color: "var(--maws-text)" }}
    >
      <form
        onSubmit={submit}
        className="w-[340px] rounded-[10px] border p-6"
        style={{ borderColor: "var(--maws-border)", background: "var(--maws-elevated)" }}
      >
        <div className="mb-1 text-[15px] font-semibold">MAWS operator sign-in</div>
        <div className="mb-4 text-[12px] text-[var(--maws-muted)]">
          Trading endpoints require the operator credential.
        </div>
        <label className="mb-1 block text-[12px] text-[var(--maws-muted)]" htmlFor="op-password">
          Password
        </label>
        <input
          id="op-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-3 h-9 w-full rounded-[6px] border px-3 text-[13px] outline-none"
          style={{
            borderColor: "var(--maws-border)",
            background: "var(--maws-bg)",
            color: "var(--maws-text)",
          }}
        />
        {error ? (
          <div role="alert" className="mb-3 text-[12px] text-[#f23645]">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="h-9 w-full rounded-[6px] text-[13px] font-semibold disabled:opacity-60"
          style={{ background: "#2962ff", color: "#fff" }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
