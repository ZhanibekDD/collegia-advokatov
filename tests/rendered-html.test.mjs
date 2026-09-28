import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("renders development preview metadata", async () => {
  const standaloneServer = new URL("../dist/standalone/server.js", import.meta.url);
  const applicationBundle = new URL("../dist/standalone/dist/server/index.js", import.meta.url);
  await access(standaloneServer);
  const source = await readFile(applicationBundle, "utf8");
  assert.match(source, /["']codex-preview["']\s*:\s*["']development["']/i);
});
