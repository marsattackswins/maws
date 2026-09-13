import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");

const copies = [
  [path.join(root, ".next", "static"), path.join(standalone, ".next", "static")],
  [path.join(root, "public"), path.join(standalone, "public")],
];

await mkdir(path.join(standalone, ".next"), { recursive: true });

for (const [source, destination] of copies) {
  await cp(source, destination, { recursive: true, force: true });
  console.log(`Copied ${path.relative(root, source)} → ${path.relative(root, destination)}`);
}
