import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const dataset = "advokattar_tizimi14";
const sourcePage = `https://data.egov.kz/datasets/view?index=${dataset}`;
const outputPath = resolve("public/data/advocates.json");
const pageSize = 100;
const concurrency = 3;

const regionNames = new Map([
  ["Алматы", "г. Алматы"],
  ["Астана", "г. Астана"],
  ["Дю г. Шымкент", "г. Шымкент"],
  ["Алматинкая область", "Алматинская область"],
  ["ВКО", "Восточно-Казахстанская область"],
  ["ДЮ Жамбыл", "Жамбылская область"],
  ["ЗКО", "Западно-Казахстанская область"],
  ["ДЮ Мангистау", "Мангистауская область"],
  ["СКО", "Северо-Казахстанская область"],
  ["Абай", "Абайская область"],
  ["Қызылорда облысы", "Кызылординская область"],
  ["Область Жетісу", "область Жетісу"],
  ["Область Ұлытау", "область Ұлытау"],
  ["область Ұлытау", "область Ұлытау"],
]);

function clean(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excelDateToIso(value) {
  const normalized = clean(value);
  if (!/^\d{5}$/.test(normalized)) return normalized;

  const serial = Number(normalized);
  const milliseconds = Math.round((serial - 25569) * 86400 * 1000);
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) return normalized;
  return date.toISOString().slice(0, 10);
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("ru-RU");
}

function normalizeRegion(value) {
  const sourceRegion = clean(value);
  if (!sourceRegion) return "Регион не указан";
  return regionNames.get(sourceRegion) ?? sourceRegion;
}

if (process.argv.includes("--normalize-existing")) {
  const existing = JSON.parse(await readFile(outputPath, "utf8"));
  existing.advocates = existing.advocates.map((advocate) => ({
    ...advocate,
    region: normalizeRegion(advocate.region),
  }));
  await writeFile(outputPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
  process.stdout.write(`Normalized ${existing.advocates.length} existing records\n`);
  process.exit(0);
}

async function fetchJson(url, sessionCookie) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        cookie: sessionCookie,
        referer: sourcePage,
        "x-requested-with": "XMLHttpRequest",
      },
    });

    if (response.ok) return response.json();
    if (response.status < 500 && response.status !== 429) {
      throw new Error(`Open Data request failed: ${response.status} ${response.statusText}`);
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 600));
  }
  throw new Error("Open Data request failed after five retries");
}

const viewResponse = await fetch(sourcePage);
if (!viewResponse.ok) throw new Error(`Dataset page failed: ${viewResponse.status}`);

const setCookie = viewResponse.headers.get("set-cookie") ?? "";
const sessionCookie = setCookie.match(/OPENDATA_PORTAL_SESSION=[^;]+/)?.[0];
if (!sessionCookie) throw new Error("Open Data session cookie was not returned");

const pageHtml = await viewResponse.text();
const version = pageHtml.match(/var currentVersion = '([^']+)'/)?.[1];
if (!version) throw new Error("Could not determine the current dataset version");
const sourceUpdatedAt = pageHtml
  .match(/id="modifiedDate">\s*([0-9]{2}\.[0-9]{2}\.[0-9]{4})/)?.[1]
  ?.split(".")
  .reverse()
  .join("-");
if (!sourceUpdatedAt) throw new Error("Could not determine the dataset update date");

const makeUrl = (page) => {
  const params = new URLSearchParams({
    index: dataset,
    version,
    page: String(page),
    count: String(pageSize),
    text: "",
    column: "",
    order: "",
  });
  return `https://data.egov.kz/datasets/getdata?${params}`;
};

const firstPage = await fetchJson(makeUrl(1), sessionCookie);
const totalPages = Number(firstPage.totalPages);
const expectedTotal = Number(firstPage.totalCount);
const pages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
const records = [...firstPage.elements];

for (let cursor = 0; cursor < pages.length; cursor += concurrency) {
  const batch = pages.slice(cursor, cursor + concurrency);
  const results = await Promise.all(batch.map((page) => fetchJson(makeUrl(page), sessionCookie)));
  for (const result of results) records.push(...result.elements);
  process.stdout.write(`\rImported ${Math.min(records.length, expectedTotal)} / ${expectedTotal}`);
}

const advocates = records.map((record) => {
  const name = clean(record.fio);
  return {
    id: clean(record.id),
    name,
    initials: initials(name),
    region: normalizeRegion(record.region),
    licenseNumber: clean(record.nomerlitsenzii).replace(/^№\s*/, ""),
    licenseIssuedAt: excelDateToIso(record.datavydachilitsenzii),
    joinedAt: excelDateToIso(record.datavstupleniyavкоllegiyu),
    address: clean(record.adress),
    contacts: clean(record.kontakty),
  };
});

if (advocates.length !== expectedTotal) {
  throw new Error(`Expected ${expectedTotal} records, received ${advocates.length}`);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      meta: {
        source: sourcePage,
        sourceOwner: "Министерство юстиции Республики Казахстан",
        dataset,
        version,
        sourceUpdatedAt,
        retrievedAt: new Date().toISOString(),
        sourceStatus: "requires_actualization",
        total: advocates.length,
      },
      advocates,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

process.stdout.write(`\nSaved ${advocates.length} records to ${outputPath}\n`);
