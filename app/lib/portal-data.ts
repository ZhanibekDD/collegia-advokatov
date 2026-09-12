export type Locale = "ru" | "kk";

export type AdvocateContact = {
  display: string;
  href?: string;
  needsReview?: boolean;
};

export type OfficialAdvocate = {
  id: string;
  sourceId: number;
  name: string;
  region: string;
  consultation: string;
  contacts: AdvocateContact[];
  ggup2026: boolean;
  ggupSourceId?: number;
};

export type LegalConsultation = {
  id: string;
  name: string;
  count: number;
};

export type AdvocateDirectory = {
  meta: {
    organization: string;
    region: string;
    asOf: string;
    sourceLabel: string;
    sourceFile: string;
    total: number;
    consultationCount: number;
    contactReviewCount: number;
    ggup: {
      asOf: string;
      sourceLabel: string;
      sourceFile: string;
      total: number;
    };
  };
  consultations: LegalConsultation[];
  advocates: OfficialAdvocate[];
};

export type NewsPost = {
  id: string;
  slug: string;
  kind: "news" | "event";
  status: "draft" | "published" | "archived";
  titleRu: string;
  titleKk: string;
  excerptRu: string;
  excerptKk: string;
  contentRu: string;
  contentKk: string;
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  eventDate: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const ADVOCATE_DATA_URL = "/api/directory";
export const NEWS_DATA_URL = "/api/news";

export const RKA_TERRITORIAL_ASSOCIATIONS_URL =
  "https://advokatura.kz/ru/territorial-nye-kollegii-advokatov";

export const ASSOCIATION = {
  domain: "KAOJ.KZ",
  name: {
    ru: "Коллегия адвокатов области Жетісу",
    kk: "Жетісу облыстық адвокаттар алқасы",
  },
  chair: {
    ru: "Мулазакирова Альфия Абдыкадыровна",
    kk: "Мулазакирова Альфия Абдықадырқызы",
  },
  address: {
    ru: "г. Талдыкорган, ул. Майстрюка, дом 2А",
    kk: "Талдықорған қ., Майстрюк көш., 2А үй",
  },
  phone: "8 (7282) 24-40-33",
  phoneHref: "+77282244033",
  email: "advokatura-tk@bk.ru",
  bin: "220640028571",
  directoryDate: "01.09.2026",
} as const;

const consultationNamesKk: Record<string, string> = {
  "ЮК г. Талдыкорган": "Талдықорған қ. заң консультациясы",
  "Ювенальная консультация": "Ювеналдық консультация",
  "г. Текели": "Текелі қ.",
  "ЮК Коксуского района": "Көксу ауданының заң консультациясы",
  "ЮК Каратальского района": "Қаратал ауданының заң консультациясы",
  "ЮК Кербулакского района": "Кербұлақ ауданының заң консультациясы",
  "ЮК Ескельдинского района": "Ескелді ауданының заң консультациясы",
  "ЮК Аксуского района": "Ақсу ауданының заң консультациясы",
  "ЮК Сарканского района": "Сарқан ауданының заң консультациясы",
  "ЮК Алакольского района №1": "Алакөл ауданының №1 заң консультациясы",
  "ЮК Алакольского района №2": "Алакөл ауданының №2 заң консультациясы",
  "ЮК Панфиловского района": "Панфилов ауданының заң консультациясы",
  "Индивидуалы": "Жеке практика",
};

const consultationNamesRu: Record<string, string> = {
  "ЮК г. Талдыкорган": "Юридическая консультация г. Талдыкорган",
  "г. Текели": "Юридическая консультация г. Текели",
  "ЮК Коксуского района": "Юридическая консультация Коксуского района",
  "ЮК Каратальского района": "Юридическая консультация Каратальского района",
  "ЮК Кербулакского района": "Юридическая консультация Кербулакского района",
  "ЮК Ескельдинского района": "Юридическая консультация Ескельдинского района",
  "ЮК Аксуского района": "Юридическая консультация Аксуского района",
  "ЮК Сарканского района": "Юридическая консультация Сарканского района",
  "ЮК Алакольского района №1": "Юридическая консультация Алакольского района №1",
  "ЮК Алакольского района №2": "Юридическая консультация Алакольского района №2",
  "ЮК Панфиловского района": "Юридическая консультация Панфиловского района",
  "Индивидуалы": "Индивидуально практикующие адвокаты",
};

export function consultationName(name: string, locale: Locale) {
  return locale === "kk" ? consultationNamesKk[name] ?? name : consultationNamesRu[name] ?? name;
}

export function advocateWord(count: number, locale: Locale) {
  if (locale === "kk") return "адвокат";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "адвокат";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "адвоката";
  return "адвокатов";
}

export function formatDirectoryDate(locale: Locale) {
  return locale === "kk" ? "2026 жылғы 1 қыркүйек" : "1 сентября 2026 года";
}
