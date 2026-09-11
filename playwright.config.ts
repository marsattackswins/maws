import { defineConfig } from "@playwright/test";

const FAKE_WS_PORT = 8787;

// Explicit allowlist: never inherit ambient secrets (MAWS_BINANCE_*,
// MAWS_OPERATOR_AUTH, ...) into the e2e webServer process.
const OS_PASSTHROUGH = [
  "PATH",
  "PATHEXT",
  "SystemRoot",
  "SystemDrive",
  "COMSPEC",
  "USERPROFILE",
  "HOMEDRIVE",
  "HOMEPATH",
  "LOCALAPPDATA",
  "APPDATA",
  "TEMP",
  "TMP",
  "HOME",
  "SHELL",
  "LANG",
  "NODE_EXTRA_CA_CERTS",
];

// Playwright merges `env` over process.env, so also blank every ambient
// MAWS_* variable (secrets included) so nothing leaks into e2e runs.
const webServerEnv: Record<string, string> = {};
for (const [name] of Object.entries(process.env)) {
  if (name.startsWith("MAWS_")) webServerEnv[name] = "";
}
Object.assign(webServerEnv, {
  MAWS_NEXT_DIST_DIR: ".next-e2e",
  NEXT_PUBLIC_BINANCE_FAPI_WS: `ws://127.0.0.1:${FAKE_WS_PORT}`,
  NEXT_PUBLIC_BINANCE_FAPI_WS_FALLBACK: `ws://127.0.0.1:${FAKE_WS_PORT}`,
});
for (const name of OS_PASSTHROUGH) {
  const value = process.env[name];
  if (value !== undefined) webServerEnv[name] = value;
}

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 10_000 },
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3001",
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: "npx next dev -p 3001",
    port: 3001,
    reuseExistingServer: false,
    timeout: 120_000,
    env: webServerEnv,
  },
});
