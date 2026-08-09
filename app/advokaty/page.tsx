"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Languages, MapPin, Search, X } from "lucide-react";
import { DemoNotice, PortalFooter, PortalHeader } from "../components/portal-shell";
import { advocates, type Locale, practiceOptions, regionOptions } from "../lib/portal-data";

const copy = {
  ru: {
    eyebrow: "Единый каталог",
    title: "Найдите адвоката под вашу задачу",
    lead: "Сравните специализацию, опыт, регион и языки работы. Профиль помогает сделать осознанный выбор до первого обращения.",
    search: "Поиск по имени или направлению",
    region: "Регион",
    practice: "Специализация",
    found: "Профилей найдено",
    reset: "Сбросить фильтры",
    verified: "Статус проверен",
    years: "лет практики",
    profile: "Открыть профиль",
    empty: "По выбранным параметрам профилей пока нет",
    emptyText: "Сбросьте один из фильтров или оставьте запрос через раздел помощи.",
    help: "Получить маршрут помощи",
  },
  kk: {
    eyebrow: "Бірыңғай каталог",
    title: "Міндетіңізге сай адвокатты табыңыз",
    lead: "Мамандану, тәжірибе, өңір және жұмыс тілдерін салыстырыңыз. Профиль алғашқы өтінішке дейін саналы таңдау жасауға көмектеседі.",
    search: "Аты немесе бағыт бойынша іздеу",
    region: "Өңір",
    practice: "Мамандану",
    found: "Табылған профильдер",
    reset: "Сүзгілерді тазарту",
    verified: "Мәртебе тексерілді",
    years: "жыл тәжірибе",
    profile: "Профильді ашу",
    empty: "Таңдалған параметрлер бойынша профильдер әзірге жоқ",
    emptyText: "Сүзгілердің бірін тазалаңыз немесе көмек бөлімінде сұрау қалдырыңыз.",
    help: "Көмек бағытын алу",
  },
};

export default function AdvocatesPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [practice, setPractice] = useState("all");
  const t = copy[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const nextRegion = params.get("region");
      const nextPractice = params.get("practice");
      if (nextRegion && regionOptions.some((item) => item.value === nextRegion)) setRegion(nextRegion);
      if (nextPractice && practiceOptions.some((item) => item.value === nextPractice)) setPractice(nextPractice);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU");
    return advocates.filter((advocate) => {
      const regionMatch = region === "all" || advocate.region === region;
      const practiceMatch = practice === "all" || advocate.practice === practice;
      const haystack = [advocate.name, advocate.practice, advocate.practiceKk, advocate.city, advocate.cityKk].join(" ").toLocaleLowerCase();
      return regionMatch && practiceMatch && (!normalized || haystack.includes(normalized));
    });
  }, [locale, practice, query, region]);

  function resetFilters() {
    setQuery("");
    setRegion("all");
    setPractice("all");
  }

  return (
    <main className="portal-page">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="directory-hero">
        <div className="directory-orbit" aria-hidden="true" />
        <div className="shell directory-hero-inner">
          <div className="eyebrow light"><span />{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
      </section>

      <section className="directory-content">
        <div className="shell">
          <DemoNotice locale={locale} />
          <div className="directory-filters">
            <label className="directory-search">
              <Search aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} />
            </label>
            <label className="directory-select">
              <small>{t.region}</small>
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                {regionOptions.map((item) => <option key={item.value} value={item.value}>{item[locale]}</option>)}
              </select>
            </label>
            <label className="directory-select">
              <small>{t.practice}</small>
              <select value={practice} onChange={(event) => setPractice(event.target.value)}>
                {practiceOptions.map((item) => <option key={item.value} value={item.value}>{item[locale]}</option>)}
              </select>
            </label>
          </div>

          <div className="directory-toolbar">
            <p>{t.found}: <strong>{filtered.length}</strong></p>
            <button onClick={resetFilters}>{t.reset}<X /></button>
          </div>

          {filtered.length > 0 ? (
            <div className="advocate-grid">
              {filtered.map((advocate, index) => (
                <article className="advocate-card" key={advocate.slug}>
                  <div className={`advocate-avatar avatar-${(index % 3) + 1}`}>
                    <span>{advocate.initials}</span>
                    <small>#{String(index + 1).padStart(2, "0")}</small>
                  </div>
                  <div className="advocate-card-body">
                    <div className="verified-line"><span><BadgeCheck /></span>{t.verified}</div>
                    <h2>{advocate.name}</h2>
                    <p className="advocate-practice">{locale === "ru" ? advocate.practice : advocate.practiceKk}</p>
                    <div className="advocate-meta">
                      <span><MapPin /> {locale === "ru" ? advocate.city : advocate.cityKk}</span>
                      <span>{advocate.experience} {t.years}</span>
                    </div>
                    <div className="language-tags">
                      <Languages aria-hidden="true" />
                      {advocate.languages.map((language) => <span key={language}>{language}</span>)}
                    </div>
                    <a href={`/advokaty/${advocate.slug}`}>{t.profile}<ArrowRight /></a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="directory-empty">
              <Search />
              <h2>{t.empty}</h2>
              <p>{t.emptyText}</p>
              <a className="button button-dark" href="/pomosh">{t.help}<ArrowRight /></a>
            </div>
          )}
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
