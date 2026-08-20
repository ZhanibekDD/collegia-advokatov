export type Locale = "ru" | "kk";

export type OfficialAdvocate = {
  id: string;
  name: string;
  initials: string;
  region: string;
  licenseNumber: string;
  licenseIssuedAt: string;
  joinedAt: string;
  address: string;
  contacts: string;
};

export type AdvocateDirectory = {
  meta: {
    source: string;
    sourceOwner: string;
    dataset: string;
    version: string;
    sourceUpdatedAt: string;
    retrievedAt: string;
    sourceStatus: "requires_actualization";
    total: number;
  };
  advocates: OfficialAdvocate[];
};

export const ZHETISU_REGION = "область Жетісу";

export const practiceOptions = [
  { value: "all", ru: "Все направления", kk: "Барлық бағыттар" },
  { value: "Семейное право", ru: "Семейное право", kk: "Отбасы құқығы" },
  { value: "Уголовное право", ru: "Уголовное право", kk: "Қылмыстық құқық" },
  { value: "Гражданские споры", ru: "Гражданские споры", kk: "Азаматтық даулар" },
  { value: "Бизнес и налоги", ru: "Бизнес и налоги", kk: "Бизнес және салық" },
  { value: "Недвижимость", ru: "Недвижимость", kk: "Жылжымайтын мүлік" },
  { value: "Административное право", ru: "Административное право", kk: "Әкімшілік құқық" },
];

/**
 * Сайт предназначен для Жетісуской областной коллегии адвокатов,
 * поэтому пользовательский интерфейс не предлагает другие регионы Казахстана.
 */
export const regionOptions = [
  { value: "all", ru: "Область Жетісу", kk: "Жетісу облысы" },
];

export const allRegions: [string, string][] = [["Область Жетісу", "Жетісу облысы"]];
