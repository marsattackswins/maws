import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Lets the e2e webServer run a second dev instance in its own directory
  // (Next allows one dev server per distDir). Default stays ".next".
  distDir: process.env.MAWS_NEXT_DIST_DIR ?? ".next",
  allowedDevOrigins: ["127.0.0.1"],
  // Native SQLite binding must not be bundled into the server build.
  serverExternalPackages: ["better-sqlite3"],
  output: "standalone",
  turbopack: {
    root: path.join(__dirname),
  },
  logging: {
    incomingRequests: false,
  },
};

export default nextConfig;
