import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the e2e webServer run a second dev instance in its own directory
  // (Next allows one dev server per distDir). Default stays ".next".
  distDir: process.env.MAWS_NEXT_DIST_DIR ?? ".next",
  allowedDevOrigins: ["127.0.0.1"],
  // Native SQLite binding must not be bundled into the server build.
  serverExternalPackages: ["better-sqlite3"],
  output: "standalone",
  logging: {
    incomingRequests: false,
  },
  // Hide the floating Next.js dev-tools badge (bottom-left, overlaps the
  // chart corner). Dev-only; production builds never show it.
  devIndicators: false,
};

export default nextConfig;
