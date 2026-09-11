"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  label?: string;
  children: ReactNode;
};

export function ToolbarBtn({
  active,
  label,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`toolbar-btn ${active ? "is-active" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
