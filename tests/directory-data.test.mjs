import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = JSON.parse(
  await readFile(new URL("../public/data/advocates-september-2026.json", import.meta.url), "utf8"),
);

test("publishes consistent September and GGUP 2026 directories", () => {
  assert.equal(directory.meta.asOf, "2026-09-01");
  assert.equal(directory.meta.total, 139);
  assert.equal(directory.meta.sourceFile, "общий список 139.xlsx");
  assert.equal(directory.meta.ggup.asOf, "2026-01");
  assert.equal(directory.meta.ggup.total, 50);
  assert.equal(directory.meta.ggup.sourceFile, "список ГГЮП 2026 г. Жетісу январь.xlsx");
  assert.equal(directory.meta.contactReviewCount, 2);
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
    assert.ok(Array.isArray(advocate.contacts));
    assert.ok(advocate.contacts.length > 0);
    assert.equal(typeof advocate.ggup2026, "boolean");
  }

  assert.deepEqual(directory.advocates.map((item) => item.sourceId), Array.from({ length: 139 }, (_, index) => index + 1));
  assert.equal(directory.advocates.filter((item) => item.ggup2026).length, 50);
  assert.equal(directory.advocates.find((item) => item.name === "Амантай Турлубек Жанзакұлы")?.sourceId, 98);
  assert.equal(directory.consultations.find((item) => item.name === "Индивидуалы")?.count, 44);
});
