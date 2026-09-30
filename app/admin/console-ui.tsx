"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import type { StatusTone } from "./types";

export function toneText(tone: StatusTone): string {
  if (tone === "healthy") return "text-[#089981]";
  if (tone === "warning") return "text-[#f7931a]";
  if (tone === "danger") return "text-[#f23645]";
  return "text-[#d1d4dc]";
}

export function toneDot(tone: StatusTone): string {
  if (tone === "healthy") return "bg-[#089981]";
  if (tone === "warning") return "bg-[#f7931a]";
  if (tone === "danger") return "bg-[#f23645]";
  return "bg-[#787b86]";
}

export function StatusDot({ tone }: { tone: StatusTone }) {
  return <span className={`h-2 w-2 shrink-0 rounded-full ${toneDot(tone)}`} aria-hidden="true" />;
}

export function Chevron({ open }: { open: boolean }) {
  return <ChevronDown size={15} className={`shrink-0 text-[#787b86] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />;
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-[#787b86]">{label}</span>
      <span className="text-right text-[#d1d4dc]">{value}</span>
    </div>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return <div className="border-t border-[#2a2e39] pt-3 text-xs text-[#787b86]">{children}</div>;
}

export function formatTime(timestamp: number | null | undefined): string {
  return timestamp == null ? "N/A" : new Date(timestamp).toLocaleTimeString();
}

export function formatDateTime(timestamp: number | null | undefined): string {
  return timestamp == null ? "N/A" : new Date(timestamp).toLocaleString();
}

export function age(milliseconds: number | null): string {
  if (milliseconds == null) return "N/A";
  if (milliseconds < 1000) return "Just now";
  return `${Math.floor(milliseconds / 1000)}s ago`;
}

export function latency(value: number | string | undefined | null): string {
  return value == null ? "N/A" : `${value}ms`;
}

export function formatEnvironment(env: string | null): string {
  if (env === "local") return "Chart Only";
  if (env === "testnet") return "Binance Testnet";
  if (env === "production") return "Binance Production";
  return env ?? "Environment unavailable";
}

export function formatManagerStatus(status: string | null): string {
  if (status === "ready") return "Ready";
  if (status === "idle") return "Not running";
  if (status === "degraded") return "Degraded";
  return status ?? "Unavailable";
}

export function formatStreamStatus(status: string): string {
  if (status === "open") return "Healthy";
  if (status === "reconnecting") return "Reconnecting";
  if (status === "closed") return "Offline";
  return "Unavailable";
}
