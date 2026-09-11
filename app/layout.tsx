import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MAWS, MAWS_FULL_NAME } from "@/lib/maws/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: MAWS,
  description: MAWS_FULL_NAME,
  applicationName: MAWS,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // applyAppTheme() writes CSS custom properties onto <html> at runtime, so the
    // client attribute set can never match the server-rendered one.
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}
