/**
 * sync-pyodide.mjs — copies Python's runtime into public/ so we can serve it.
 *
 * Run it with:  npm run sync:pyodide   (the build does this automatically)
 *
 * WHY COPY RATHER THAN BUNDLE
 *
 * Pyodide fetches its own WebAssembly and standard library at runtime, by URL.
 * A bundler cannot follow that, so the files have to sit somewhere they can be
 * served from — which is what public/ is for.
 *
 * WHY NOT JUST USE THE CDN
 *
 * Because then the site would only work if someone else's server is up, and
 * our Content Security Policy would have to trust a third-party domain to send
 * us executable code. Self-hosting costs disk and keeps both problems away.
 *
 * Only the four files Pyodide needs to start are copied — the rest of the
 * package is type definitions, source maps and a demo console.
 */

import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const from = join(here, "..", "node_modules", "pyodide");
const to = join(here, "..", "public", "pyodide");

/** Exactly what loadPyodide asks for, and nothing else. */
const NEEDED = [
  "pyodide.mjs",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

await mkdir(to, { recursive: true });

let total = 0;

for (const name of NEEDED) {
  const source = join(from, name);
  const target = join(to, name);

  const { size } = await stat(source);
  total += size;

  await copyFile(source, target);
  console.log(`  ${name.padEnd(22)} ${(size / 1048576).toFixed(1)} MB`);
}

console.log(`\n  ${NEEDED.length} files, ${(total / 1048576).toFixed(1)} MB into public/pyodide/\n`);
