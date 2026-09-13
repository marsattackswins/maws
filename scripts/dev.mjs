import { exec, spawn } from "node:child_process";
import { platform } from "node:os";

const port = process.env.PORT ?? "3000";
const url = `http://localhost:${port}`;
const probe = `http://127.0.0.1:${port}`;

const cyan = "\x1b[36m";
const bold = "\x1b[1m";
const dim = "\x1b[2m";
const reset = "\x1b[0m";

console.log(`
${cyan}${bold}  ████╗   ████╗   ██████╗   ██╗     ██╗ ███████╗
  █████╗ █████║  ██╔════██╗ ██║     ██║ ██╔════╝
  ██╔█████╔██║  ██████████║ ██║  █╗ ██║ ███████╗
  ██║╚███╔╝██║  ██╔═════██║ ██║ ███╗██║ ╚════██║
  ██║ ╚═╝  ██║  ██║     ██║ ╚███╔███╔╝  ███████║
  ╚═╝      ╚═╝  ╚═╝     ╚═╝  ╚══╝╚══╝   ╚══════╝${reset}
  ${dim}Market Analysis & Workflow System • Dev Server${reset}
`);

const child = spawn("next", ["dev", "-p", port], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      await fetch(probe, { redirect: "manual" });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return false;
}

function openBrowser() {
  const cmd =
    platform() === "win32"
      ? `cmd /c start "" "${url}"`
      : platform() === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
}

waitForServer().then((ok) => {
  if (ok) openBrowser();
});
