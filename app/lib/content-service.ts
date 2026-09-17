import { and, asc, count, desc, eq, max } from "drizzle-orm";
import directoryData from "../../public/data/advocates-september-2026.json";
import { getDb } from "../../db";
import { advocates, auditLog, newsPosts } from "../../db/schema";
import type { AdvocateContact, AdvocateDirectory, NewsPost, OfficialAdvocate } from "./portal-data";

const fallbackDirectory = directoryData as AdvocateDirectory;
type Database = ReturnType<typeof getDb>;

export type ChangeActor = {
  type: "admin" | "telegram";
  id: string;
};

export type AdvocateInput = {
  name: string;
  consultation: string;
  contacts: AdvocateContact[];
  ggup2026: boolean;
  ggupSourceId?: number | null;
  region?: string;
};

export type AdvocateUpdate = Partial<AdvocateInput> & {
  active?: boolean;
};

export type NewsInput = {
  kind: "news" | "event";
  status: "draft" | "published";
  titleRu: string;
  titleKk?: string;
  excerptRu?: string;
  excerptKk?: string;
  contentRu?: string;
  contentKk?: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  eventDate?: string | null;
};

const INITIAL_NEWS: Array<typeof newsPosts.$inferInsert> = [
  {
    id: "jetisu-open-doors-2026-09-09",
    slug: "den-otkrytyh-dverey-pravovaya-pomoshch-2026",
    kind: "event",
    status: "published",
    titleRu: "День открытых дверей: правовая помощь пострадавшим от бытового насилия",
    titleKk: "Ашық есік күні: тұрмыстық зорлық-зомбылықтан зардап шеккендерге құқықтық көмек",
    excerptRu: "Представители Коллегии адвокатов области Жетісу приняли участие в выездной консультации. Правовую помощь получили семь граждан.",
    excerptKk: "Жетісу облысы адвокаттар алқасының өкілдері көшпелі консультацияға қатысты. Жеті азаматқа құқықтық көмек көрсетілді.",
    contentRu: "9 сентября 2026 года в Центре оказания социальной помощи жертвам бытового насилия состоялся день открытых дверей в рамках принципа «Закон и порядок». В мероприятии участвовали представители Департамента юстиции области Жетісу, региональной палаты частных судебных исполнителей, Коллегии адвокатов области Жетісу и подразделения полиции по противодействию семейно-бытовому насилию.\n\nУчастницам встречи разъяснили их права и возможные способы защиты законных интересов. Специалисты ответили на индивидуальные вопросы и помогли сориентироваться в дальнейших юридических действиях.\n\nПо официальным данным, по итогам встречи правовые консультации получили семь граждан. Материал подготовлен по сообщению Департамента юстиции области Жетісу.",
    contentKk: "2026 жылғы 9 қыркүйекте «Заң мен тәртіп» қағидаты аясында Тұрмыстық зорлық-зомбылық құрбандарына әлеуметтік көмек көрсету орталығында ашық есік күні өтті. Іс-шараға Жетісу облысы Әділет департаментінің, жеке сот орындаушылары өңірлік палатасының, Жетісу облысы адвокаттар алқасының және полицияның отбасылық-тұрмыстық зорлық-зомбылыққа қарсы күрес бөлімшесінің өкілдері қатысты.\n\nКездесуге қатысушыларға олардың құқықтары мен заңды мүдделерін қорғаудың қолжетімді жолдары түсіндірілді. Мамандар жеке сұрақтарға жауап беріп, келесі құқықтық қадамдарды айқындауға көмектесті.\n\nРесми мәлімет бойынша, іс-шара қорытындысында жеті азаматқа құқықтық консультация берілді. Материал Жетісу облысы Әділет департаментінің ақпараты негізінде дайындалды.",
    imageUrl: "/images/news/open-doors-support-center.webp",
    sourceUrl: "https://www.gov.kz/memleket/entities/adilet-zhetysu/press/news/details/1288641",
    sourceLabel: "Департамент юстиции области Жетісу · GOV.KZ",
    eventDate: "2026-09-09",
    publishedAt: "2026-09-09T12:00:00.000Z",
    createdAt: "2026-09-09T12:00:00.000Z",
    updatedAt: "2026-09-09T12:00:00.000Z",
  },
  {
    id: "jetisu-advocates-list-2026-07-08",
    slug: "spisok-advokatov-jetisu-iyul-2026",
    kind: "news",
    status: "published",
    titleRu: "Опубликован список адвокатов области Жетісу за июль 2026 года",
    titleKk: "Жетісу облысының 2026 жылғы шілде айына арналған адвокаттар тізімі жарияланды",
    excerptRu: "Департамент юстиции разместил обновлённый перечень адвокатов региона. На нашем портале поиск дополнен данными общего списка на 1 сентября 2026 года.",
    excerptKk: "Әділет департаменті өңір адвокаттарының жаңартылған тізімін жариялады. Біздің порталда іздеу 2026 жылғы 1 қыркүйектегі жалпы тізім деректерімен толықтырылған.",
    contentRu: "8 июля 2026 года Департамент юстиции области Жетісу опубликовал официальный список адвокатов региона за июль. Такой перечень помогает гражданам проверить, входит ли выбранный специалист в действующий состав адвокатуры области.\n\nНа портале KAOJ.KZ используется более поздний общий список коллегии по состоянию на 1 сентября 2026 года. Для удобства поиска записи сгруппированы по юридическим консультациям и районам, а номера показаны как номера строк в исходном официальном списке.\n\nПеред заключением соглашения рекомендуется дополнительно сверить сведения об адвокате в официальных источниках и уточнить актуальные контакты в приёмной коллегии.",
    contentKk: "2026 жылғы 8 шілдеде Жетісу облысының Әділет департаменті өңір адвокаттарының шілде айына арналған ресми тізімін жариялады. Мұндай тізім азаматтарға таңдалған маманның облыс адвокатурасының қолданыстағы құрамына кіретінін тексеруге көмектеседі.\n\nKAOJ.KZ порталында 2026 жылғы 1 қыркүйектегі алқаның кейінгі жалпы тізімі пайдаланылады. Іздеуді жеңілдету үшін жазбалар заң консультациялары мен аудандар бойынша топтастырылған, ал нөмірлер бастапқы ресми тізімдегі жол нөмірі ретінде түсіндірілген.\n\nКелісім жасамас бұрын адвокат туралы мәліметті ресми дереккөздерден қосымша тексеріп, өзекті байланыстарды алқа қабылдау бөлімінен нақтылау ұсынылады.",
    imageUrl: "/images/news/advocates-register-july-2026.webp",
    sourceUrl: "https://www.gov.kz/memleket/entities/adilet-zhetysu/documents/details/1039619?lang=kk",
    sourceLabel: "Департамент юстиции области Жетісу · GOV.KZ",
    eventDate: "2026-07-08",
    publishedAt: "2026-07-08T12:00:00.000Z",
    createdAt: "2026-07-08T12:00:00.000Z",
    updatedAt: "2026-07-08T12:00:00.000Z",
  },
  {
    id: "jetisu-justice-board-2026-01-28",
    slug: "itogi-2025-i-zadachi-2026",
    kind: "event",
    status: "published",
    titleRu: "Итоги 2025 года и приоритеты юридической помощи на 2026 год",
    titleKk: "2025 жылдың қорытындысы және 2026 жылға арналған заң көмегінің басымдықтары",
    excerptRu: "Руководство Коллегии адвокатов области Жетісу приняло участие в заседании Департамента юстиции по итогам года и задачам на первое полугодие.",
    excerptKk: "Жетісу облысы адвокаттар алқасының басшылығы Әділет департаментінің жыл қорытындысы мен бірінші жартыжылдық міндеттеріне арналған отырысына қатысты.",
    contentRu: "28 января 2026 года в Департаменте юстиции области Жетісу прошло заседание, посвящённое итогам работы за 2025 год и приоритетным задачам на первое полугодие 2026 года.\n\nВ обсуждении участвовали руководители Коллегии адвокатов области Жетісу, нотариальной палаты, палаты юридических консультантов Алматинской области и региональной палаты частных судебных исполнителей. Такой формат позволяет согласовывать практические вопросы оказания юридической помощи и взаимодействия профессиональных организаций.\n\nПо итогам рассмотрения основных направлений работы участникам были даны конкретные поручения. Материал подготовлен по официальному сообщению Департамента юстиции области Жетісу.",
    contentKk: "2026 жылғы 28 қаңтарда Жетісу облысы Әділет департаментінде 2025 жылғы жұмыс қорытындысы және 2026 жылдың бірінші жартыжылдығына арналған басым міндеттер талқыланған алқа отырысы өтті.\n\nТалқылауға Жетісу облысы адвокаттар алқасының, нотариаттық палатаның, Алматы облысы заң консультанттары палатасының және жеке сот орындаушыларының өңірлік палатасының басшылары қатысты. Мұндай формат заң көмегін көрсету мен кәсіби ұйымдардың өзара іс-қимылына қатысты практикалық мәселелерді келісуге мүмкіндік береді.\n\nНегізгі жұмыс бағыттарын қарау қорытындысында нақты тапсырмалар берілді. Материал Жетісу облысы Әділет департаментінің ресми хабарламасы негізінде дайындалды.",
    imageUrl: "/images/news/justice-board-2026.webp",
    sourceUrl: "https://www.gov.kz/memleket/entities/adilet-zhetysu/press/news/details/1149727",
    sourceLabel: "Департамент юстиции области Жетісу · GOV.KZ",
    eventDate: "2026-01-28",
    publishedAt: "2026-01-28T12:00:00.000Z",
    createdAt: "2026-01-28T12:00:00.000Z",
    updatedAt: "2026-01-28T12:00:00.000Z",
  },
];

function clean(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanContacts(contacts: AdvocateContact[]): AdvocateContact[] {
  return contacts.slice(0, 12).flatMap((contact) => {
    const display = clean(contact.display, 80);
    if (!display) return [];
    const href = contact.href ? clean(contact.href, 40) : undefined;
    return [{ display, ...(href ? { href } : {}), ...(contact.needsReview ? { needsReview: true } : {}) }];
  });
}

function normalizedEventDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = value.trim();
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error("Дата события должна быть в формате ГГГГ-ММ-ДД");
  }
  return date;
}

function normalizedWebUrl(value: string | undefined, allowLocal = false): string {
  const url = clean(value ?? "", 1000);
  if (!url) return "";
  if (allowLocal && /^\/[a-z0-9/_\-.]+$/i.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:") return parsed.toString();
  } catch {
    // The validation error below is intentionally user-facing.
  }
  throw new Error("Укажите корректную HTTPS-ссылку");
}

function consultationId(name: string): string {
  const normalized = name
    .toLocaleLowerCase("ru-RU")
    .normalize("NFKD")
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return `custom-${normalized || "podrazdelenie"}`;
}

function now(): string {
  return new Date().toISOString();
}

function safeContacts(value: string): AdvocateContact[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item): AdvocateContact[] => {
      if (!item || typeof item !== "object" || !("display" in item) || typeof item.display !== "string") return [];
      const contact: AdvocateContact = { display: item.display };
      if ("href" in item && typeof item.href === "string") contact.href = item.href;
      if ("needsReview" in item && item.needsReview === true) contact.needsReview = true;
      return [contact];
    });
  } catch {
    return [];
  }
}

function toOfficialAdvocate(row: typeof advocates.$inferSelect): OfficialAdvocate {
  return {
    id: row.id,
    sourceId: row.sourceId,
    name: row.name,
    region: row.region,
    consultation: row.consultation,
    contacts: safeContacts(row.contactsJson),
    ggup2026: row.ggup2026,
    ...(row.ggupSourceId == null ? {} : { ggupSourceId: row.ggupSourceId }),
  };
}

function toNewsPost(row: typeof newsPosts.$inferSelect): NewsPost {
  return { ...row };
}

function buildDirectory(rows: Array<typeof advocates.$inferSelect>): AdvocateDirectory {
  const publicRows = rows.filter((row) => row.active).map(toOfficialAdvocate);
  const counts = new Map<string, number>();
  for (const advocate of publicRows) {
    counts.set(advocate.consultation, (counts.get(advocate.consultation) ?? 0) + 1);
  }

  const known = fallbackDirectory.consultations.map((item) => item.name);
  const extra = [...counts.keys()].filter((name) => !known.includes(name)).sort((a, b) => a.localeCompare(b, "ru"));
  const order = [...known, ...extra].filter((name) => counts.has(name));
  const consultations = order.map((name) => ({
    id: fallbackDirectory.consultations.find((item) => item.name === name)?.id ?? consultationId(name),
    name,
    count: counts.get(name) ?? 0,
  }));
  const ggupTotal = publicRows.filter((item) => item.ggup2026).length;
  const contactReviewCount = publicRows.filter((item) => item.contacts.some((contact) => contact.needsReview)).length;

  return {
    meta: {
      ...fallbackDirectory.meta,
      total: publicRows.length,
      consultationCount: consultations.length,
      contactReviewCount,
      ggup: { ...fallbackDirectory.meta.ggup, total: ggupTotal },
    },
    consultations,
    advocates: publicRows,
  };
}

async function writeAudit(
  db: Database,
  actor: ChangeActor,
  action: string,
  entityType: "advocate" | "news",
  entityId: string,
  payload: object,
) {
  await db.insert(auditLog).values({
    id: crypto.randomUUID(),
    actorType: actor.type,
    actorId: actor.id,
    action,
    entityType,
    entityId,
    payloadJson: JSON.stringify(payload),
  });
}

export async function ensureAdvocatesSeeded(db: Database = getDb()): Promise<void> {
  const [result] = await db.select({ value: count() }).from(advocates);
  if ((result?.value ?? 0) > 0) return;

  const seedRows: Array<typeof advocates.$inferInsert> = fallbackDirectory.advocates.map((advocate) => ({
    id: advocate.id,
    sourceId: advocate.sourceId,
    name: advocate.name,
    region: advocate.region,
    consultation: advocate.consultation,
    contactsJson: JSON.stringify(advocate.contacts),
    ggup2026: advocate.ggup2026,
    ggupSourceId: advocate.ggupSourceId ?? null,
    active: true,
  }));

  for (let index = 0; index < seedRows.length; index += 8) {
    await db.insert(advocates).values(seedRows.slice(index, index + 8)).onConflictDoNothing();
  }
}

export async function ensureNewsSeeded(db: Database = getDb()): Promise<void> {
  const [result] = await db.select({ value: count() }).from(newsPosts);
  if ((result?.value ?? 0) > 0) return;
  await db.insert(newsPosts).values(INITIAL_NEWS).onConflictDoNothing();
}

export async function getPublicDirectory(): Promise<AdvocateDirectory> {
  try {
    const db = getDb();
    const rows = await db.select().from(advocates).where(eq(advocates.active, true)).orderBy(asc(advocates.sourceId));
    return rows.length ? buildDirectory(rows) : fallbackDirectory;
  } catch (error) {
    console.error(JSON.stringify({
      message: "directory_database_unavailable",
      error: error instanceof Error ? error.message : String(error),
    }));
    return fallbackDirectory;
  }
}

export async function listAdminAdvocates() {
  const db = getDb();
  await ensureAdvocatesSeeded(db);
  const rows = await db.select().from(advocates).orderBy(asc(advocates.sourceId));
  return rows.map((row) => ({ ...toOfficialAdvocate(row), active: row.active, updatedAt: row.updatedAt }));
}

export async function createAdvocate(input: AdvocateInput, actor: ChangeActor) {
  const db = getDb();
  await ensureAdvocatesSeeded(db);
  const name = clean(input.name, 180);
  const consultation = clean(input.consultation, 180);
  if (!name || !consultation) throw new Error("Укажите ФИО и подразделение");

  const [source] = await db.select({ value: max(advocates.sourceId) }).from(advocates);
  const sourceId = (source?.value ?? 0) + 1;
  const id = `${sourceId}-advokat-${crypto.randomUUID().slice(0, 8)}`;
  const timestamp = now();
  const [created] = await db.insert(advocates).values({
    id,
    sourceId,
    name,
    region: clean(input.region ?? "область Жетісу", 120),
    consultation,
    contactsJson: JSON.stringify(cleanContacts(input.contacts)),
    ggup2026: input.ggup2026,
    ggupSourceId: input.ggup2026 ? input.ggupSourceId ?? null : null,
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }).returning();
  await writeAudit(db, actor, "create", "advocate", id, { sourceId, name });
  return { ...toOfficialAdvocate(created), active: created.active, updatedAt: created.updatedAt };
}

export async function updateAdvocate(id: string, input: AdvocateUpdate, actor: ChangeActor) {
  const db = getDb();
  await ensureAdvocatesSeeded(db);
  const values: Partial<typeof advocates.$inferInsert> = { updatedAt: now() };
  if (input.name !== undefined) {
    values.name = clean(input.name, 180);
    if (!values.name) throw new Error("ФИО не может быть пустым");
  }
  if (input.consultation !== undefined) {
    values.consultation = clean(input.consultation, 180);
    if (!values.consultation) throw new Error("Подразделение не может быть пустым");
  }
  if (input.region !== undefined) values.region = clean(input.region, 120);
  if (input.contacts !== undefined) values.contactsJson = JSON.stringify(cleanContacts(input.contacts));
  if (input.ggup2026 !== undefined) values.ggup2026 = input.ggup2026;
  if (input.ggupSourceId !== undefined) values.ggupSourceId = input.ggupSourceId;
  if (input.active !== undefined) values.active = input.active;
  if (input.ggup2026 === false) values.ggupSourceId = null;

  const [updated] = await db.update(advocates).set(values).where(eq(advocates.id, id)).returning();
  if (!updated) throw new Error("Адвокат не найден");
  await writeAudit(db, actor, "update", "advocate", id, values);
  return { ...toOfficialAdvocate(updated), active: updated.active, updatedAt: updated.updatedAt };
}

export async function listPublishedNews(slug?: string): Promise<NewsPost[]> {
  try {
    const db = getDb();
    await ensureNewsSeeded(db);
    const predicate = slug
      ? and(eq(newsPosts.status, "published"), eq(newsPosts.slug, slug))
      : eq(newsPosts.status, "published");
    const rows = await db.select().from(newsPosts).where(predicate).orderBy(desc(newsPosts.publishedAt), desc(newsPosts.createdAt)).limit(slug ? 1 : 100);
    return rows.map(toNewsPost);
  } catch (error) {
    console.error(JSON.stringify({
      message: "news_database_unavailable",
      error: error instanceof Error ? error.message : String(error),
    }));
    return [];
  }
}

export async function listAdminNews(): Promise<NewsPost[]> {
  const db = getDb();
  await ensureNewsSeeded(db);
  const rows = await db.select().from(newsPosts).orderBy(desc(newsPosts.updatedAt)).limit(200);
  return rows.map(toNewsPost);
}

function newsSlug(title: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const ascii = title.toLocaleLowerCase("ru-RU")
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${date}-${ascii || "publikaciya"}-${crypto.randomUUID().slice(0, 6)}`;
}

export async function createNews(input: NewsInput, actor: ChangeActor) {
  const db = getDb();
  const titleRu = clean(input.titleRu, 220);
  if (!titleRu) throw new Error("Укажите заголовок публикации");
  const timestamp = now();
  const id = crypto.randomUUID();
  const [created] = await db.insert(newsPosts).values({
    id,
    slug: newsSlug(titleRu),
    kind: input.kind,
    status: input.status,
    titleRu,
    titleKk: clean(input.titleKk ?? "", 220),
    excerptRu: clean(input.excerptRu ?? "", 600),
    excerptKk: clean(input.excerptKk ?? "", 600),
    contentRu: (input.contentRu ?? "").trim().slice(0, 20_000),
    contentKk: (input.contentKk ?? "").trim().slice(0, 20_000),
    imageUrl: normalizedWebUrl(input.imageUrl, true),
    sourceUrl: normalizedWebUrl(input.sourceUrl),
    sourceLabel: clean(input.sourceLabel ?? "", 160),
    eventDate: normalizedEventDate(input.eventDate),
    publishedAt: input.status === "published" ? timestamp : null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }).returning();
  await writeAudit(db, actor, "create", "news", id, { titleRu, status: input.status });
  return toNewsPost(created);
}

export async function updateNews(id: string, input: Partial<NewsInput> & { status?: "draft" | "published" | "archived" }, actor: ChangeActor) {
  const db = getDb();
  const values: Partial<typeof newsPosts.$inferInsert> = { updatedAt: now() };
  if (input.kind !== undefined) values.kind = input.kind;
  if (input.status !== undefined) {
    values.status = input.status;
    if (input.status === "published") values.publishedAt = now();
  }
  if (input.titleRu !== undefined) values.titleRu = clean(input.titleRu, 220);
  if (input.titleKk !== undefined) values.titleKk = clean(input.titleKk, 220);
  if (input.excerptRu !== undefined) values.excerptRu = clean(input.excerptRu, 600);
  if (input.excerptKk !== undefined) values.excerptKk = clean(input.excerptKk, 600);
  if (input.contentRu !== undefined) values.contentRu = input.contentRu.trim().slice(0, 20_000);
  if (input.contentKk !== undefined) values.contentKk = input.contentKk.trim().slice(0, 20_000);
  if (input.imageUrl !== undefined) values.imageUrl = normalizedWebUrl(input.imageUrl, true);
  if (input.sourceUrl !== undefined) values.sourceUrl = normalizedWebUrl(input.sourceUrl);
  if (input.sourceLabel !== undefined) values.sourceLabel = clean(input.sourceLabel, 160);
  if (input.eventDate !== undefined) values.eventDate = normalizedEventDate(input.eventDate);

  const [updated] = await db.update(newsPosts).set(values).where(eq(newsPosts.id, id)).returning();
  if (!updated) throw new Error("Публикация не найдена");
  await writeAudit(db, actor, "update", "news", id, values);
  return toNewsPost(updated);
}

export async function getContentStats() {
  const db = getDb();
  await ensureAdvocatesSeeded(db);
  await ensureNewsSeeded(db);
  const [advocateCount] = await db.select({ value: count() }).from(advocates).where(eq(advocates.active, true));
  const [newsCount] = await db.select({ value: count() }).from(newsPosts).where(eq(newsPosts.status, "published"));
  const [draftCount] = await db.select({ value: count() }).from(newsPosts).where(eq(newsPosts.status, "draft"));
  return {
    advocates: advocateCount?.value ?? 0,
    publishedNews: newsCount?.value ?? 0,
    drafts: draftCount?.value ?? 0,
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_WEBHOOK_SECRET && process.env.TELEGRAM_ADMIN_IDS),
  };
}

export function parseContactsInput(value: string): AdvocateContact[] {
  return value.split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean).map((display) => {
    const digits = display.replace(/\D/g, "");
    if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
      const national = digits.slice(1);
      return {
        display: `+7 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6, 8)}-${national.slice(8)}`,
        href: `+7${national}`,
      };
    }
    return { display, needsReview: digits.length > 0 && digits.length !== 6 };
  });
}
