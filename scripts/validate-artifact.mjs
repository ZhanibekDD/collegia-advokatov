import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const workerPath = resolve("dist/server/index.js");
const hostingPath = resolve("dist/.openai/hosting.json");

await Promise.all([access(workerPath), access(hostingPath)]);
JSON.parse(await readFile(hostingPath, "utf8"));

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("sites-validation", `${process.pid}-${Date.now()}`);

try {
  const worker = await import(workerUrl.href);
  if (!worker.default || typeof worker.default.fetch !== "function") {
    throw new Error("dist/server/index.js must have an ESM default export with fetch(request, env, ctx)");
  }
} catch (error) {
  if (!(error instanceof Error) || !("code" in error) || error.code !== "ERR_UNSUPPORTED_ESM_URL_SCHEME") throw error;
  const source = await readFile(workerPath, "utf8");
  const hasDefaultExport = /export\s*\{[^}]+\bas\s+default\s*\}/s.test(source) || /export\s+default\s+/s.test(source);
  const hasFetchHandler = /\bfetch\s*\(\s*request\s*,\s*env\s*,\s*ctx\s*\)/s.test(source);
  if (!hasDefaultExport || !hasFetchHandler) {
    throw new Error("dist/server/index.js must have an ESM default export with fetch(request, env, ctx)");
  }
}

console.log("Validated Sites artifact: Worker default.fetch and hosting manifest are present.");
