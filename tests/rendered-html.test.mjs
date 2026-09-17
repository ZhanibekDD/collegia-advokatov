import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  let worker;

  try {
    ({ default: worker } = await import(workerUrl.href));
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ERR_UNSUPPORTED_ESM_URL_SCHEME") throw error;

    // Node cannot load Cloudflare's `cloudflare:` runtime imports. In that
    // environment, verify the same metadata survived compilation into the
    // Worker bundle; the live Wrangler integration check covers rendering.
    const source = await readFile(workerUrl, "utf8");
    assert.match(source, /["']codex-preview["']\s*:\s*["']development["']/i);
    return;
  }

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});
