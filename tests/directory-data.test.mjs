import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = JSON.parse(
  await readFile(new URL("../public/data/advocates-september-2026.json", import.meta.url), "utf8"),
);

test("publishes a consistent September 2026 directory", () => {
  assert.equal(directory.meta.asOf, "2026-09-01");
  assert.equal(directory.meta.total, 138);
  assert.equal(directory.advocates.length, directory.meta.total);
  assert.equal(directory.consultations.length, directory.meta.consultationCount);
  assert.equal(
    directory.consultations.reduce((sum, item) => sum + item.count, 0),
    directory.meta.total,
  );

  assert.equal(new Set(directory.advocates.map((item) => item.id)).size, directory.meta.total);
  assert.equal(new Set(directory.advocates.map((item) => item.name)).size, directory.meta.total);

  for (const advocate of directory.advocates) {
    assert.ok(advocate.id);
    assert.ok(advocate.name);
    assert.equal(advocate.region, "область Жетісу");
    assert.ok(advocate.consultation);
  }
});
