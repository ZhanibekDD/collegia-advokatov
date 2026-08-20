"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Database,
  IdCard,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../components/portal-shell";
import { ZHETISU_REGION, type AdvocateDirectory, type Locale, type OfficialAdvocate } from "../lib/portal-data";

const PAGE_SIZE = 24;

const copy = {
  ru: {
    eyebrow: "Каталог адвокатов области Жетісу",
    title: "Найдите адвоката Жетісу по официальным данным",
    lead: "Поиск работает только по адвокатам области Жетісу. Ищите по ФИО, номеру лицензии, адресу или телефону — без выдуманных рейтингов и специализаций.",
    search: "ФИО, лицензия, адрес или телефон",
    sort: "Сортировка",
    sortName: "По фамилии А—Я",
    sortNameDesc: "По фамилии Я—А",
    found: "Найдено адвокатов",
    reset: "Сбросить поиск",
    source: "Запись из открытых данных",
    license: "Лицензия",
    issued: "Дата выдачи",
    profile: "Открыть карточку",
    noValue: "Не указано в источнике",
    empty: "По запросу ничего не найдено",
    emptyText: "Проверьте написание ФИО, номер лицензии или очистите строку поиска.",
    loading: "Загружаем каталог адвокатов Жетісу",
    loadError: "Не удалось загрузить каталог",
    retry: "Попробовать ещё раз",
    previous: "Назад",
    next: "Дальше",
    page: "Страница",
    limitation: "Каталог ограничен областью Жетісу. Текущий статус лицензии необходимо дополнительно проверять перед заключением соглашения.",
    call: "Позвонить",
    whatsapp: "Написать в WhatsApp",
    regionFact: "область Жетісу",
    sourceFact: "открытые данные Минюста РК",
  },
  kk: {
    eyebrow: "Жетісу облысы адвокаттарының каталогы",
    title: "Ресми деректер бойынша Жетісу адвокатын табыңыз",
    lead: "Іздеу тек Жетісу облысының адвокаттары бойынша жұмыс істейді. Аты-жөні, лицензия нөмірі, мекенжайы немесе телефоны бойынша іздеңіз — ойдан шығарылған рейтингтер мен маманданусыз.",
    search: "Аты-жөні, лицензия, мекенжай немесе телефон",
    sort: "Сұрыптау",
    sortName: "Тегі бойынша А—Я",
    sortNameDesc: "Тегі бойынша Я—А",
    found: "Табылған адвокаттар",
    reset: "Іздеуді тазарту",
    source: "Ашық деректердегі жазба",
    license: "Лицензия",
    issued: "Берілген күні",
    profile: "Карточканы ашу",
    noValue: "Дереккөзде көрсетілмеген",
    empty: "Сұрау бойынша ештеңе табылмады",
    emptyText: "Аты-жөнінің жазылуын, лицензия нөмірін тексеріңіз немесе іздеу жолын тазалаңыз.",
    loading: "Жетісу адвокаттарының каталогы жүктелуде",
    loadError: "Каталогты жүктеу мүмкін болмады",
    retry: "Қайталап көру",
    previous: "Артқа",
    next: "Келесі",
    page: "Бет",
    limitation: "Каталог Жетісу облысымен шектелген. Келісім жасамас бұрын лицензияның ағымдағы мәртебесін қосымша тексеру қажет.",
    call: "Қоңырау шалу",
    whatsapp: "WhatsApp-қа жазу",
    regionFact: "Жетісу облысы",
    sourceFact: "ҚР Әділет министрлігінің ашық деректері",
  },
};

function readableDate(value: string, fallback: string) {
  if (!value) return fallback;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
  }
  return value;
}

function extractPhone(value: string) {
  const match = value.match(/(?:\+?7|8)[\s()\-]*\d{3}[\s()\-]*\d{3}[\s()\-]*\d{2}[\s()\-]*\d{2}/);
  if (!match) return null;
  let digits = match[0].replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  return digits.length === 11 && digits.startsWith("7") ? digits : null;
}

function scopeDirectory(result: AdvocateDirectory): AdvocateDirectory {
  const advocates = result.advocates.filter((advocate) => advocate.region === ZHETISU_REGION);
  return {
    ...result,
    meta: { ...result.meta, total: advocates.length },
    advocates,
  };
}

export default function AdvocatesPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [directory, setDirectory] = useState<AdvocateDirectory | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [filtersReady, setFiltersReady] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const t = copy[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setSort(params.get("sort") ?? "name-asc");
      setFiltersReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!filtersReady) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (sort !== "name-asc") params.set("sort", sort);
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [filtersReady, query, sort]);

  useEffect(() => {
    let active = true;
    setLoadFailed(false);
    fetch("/data/advocates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Directory request failed");
        return response.json() as Promise<AdvocateDirectory>;
      })
      .then((result) => {
        if (active) setDirectory(scopeDirectory(result));
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const filtered = useMemo(() => {
    if (!directory) return [];
    const normalized = deferredQuery.trim().toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU");
    const result = directory.advocates.filter((advocate) => {
      if (!normalized) return true;
      return [advocate.name, advocate.licenseNumber, advocate.address, advocate.contacts]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalized);
    });

    const collator = new Intl.Collator(locale === "kk" ? "kk" : "ru", { sensitivity: "base" });
    return result.sort((a, b) => sort === "name-desc" ? collator.compare(b.name, a.name) : collator.compare(a.name, b.name));
  }, [deferredQuery, directory, locale, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function resetFilters() {
    setQuery("");
    setSort("name-asc");
    setPage(1);
  }

  function changePage(nextPage: number) {
    setPage(Math.min(pageCount, Math.max(1, nextPage)));
    window.scrollTo({ top: 520, behavior: "smooth" });
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
          <div className="directory-hero-facts">
            <span><Database />{directory ? directory.meta.total.toLocaleString("ru-RU") : "—"} {locale === "ru" ? "адвокатов" : "адвокат"}</span>
            <span><MapPin />{t.regionFact}</span>
            <span><CalendarDays />08.07.2025</span>
          </div>
        </div>
      </section>

      <section className="directory-content">
        <div className="shell">
          <DataSourceNotice locale={locale} total={directory?.meta.total} />

          <div className="directory-filters">
            <label className="directory-search">
              <Search aria-hidden="true" />
              <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder={t.search} />
              {query && <button onClick={() => updateQuery("")} aria-label={t.reset}><X /></button>}
            </label>
            <label className="directory-select">
              <small>{t.sort}</small>
              <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
                <option value="name-asc">{t.sortName}</option>
                <option value="name-desc">{t.sortNameDesc}</option>
              </select>
            </label>
          </div>

          <div className="directory-toolbar">
            <div>
              <p>{t.found}: <strong>{filtered.length.toLocaleString("ru-RU")}</strong></p>
              <span>{t.limitation}</span>
            </div>
            <button onClick={resetFilters}>{t.reset}<SlidersHorizontal /></button>
          </div>

          {!directory && !loadFailed && (
            <div className="directory-loading" role="status"><Database /><span>{t.loading}</span></div>
          )}

          {loadFailed && (
            <div className="directory-empty">
              <Database />
              <h2>{t.loadError}</h2>
              <button className="button button-dark" onClick={() => { setLoadFailed(false); setReloadKey((value) => value + 1); }}>{t.retry}<ArrowRight /></button>
            </div>
          )}

          {directory && visible.length > 0 && (
            <>
              <div className="advocate-grid official-grid">
                {visible.map((advocate: OfficialAdvocate, index) => {
                  const phone = extractPhone(advocate.contacts);
                  return (
                    <article className="advocate-card official-card" key={advocate.id}>
                      <div className={`advocate-avatar avatar-${(index % 3) + 1}`}>
                        <span>{advocate.initials || "JE"}</span>
                        <small>#{advocate.id}</small>
                      </div>
                      <div className="advocate-card-body">
                        <div className="verified-line"><span><BadgeCheck /></span>{t.source}</div>
                        <h2>{advocate.name}</h2>
                        <p className="official-region"><MapPin />{locale === "ru" ? "Область Жетісу" : "Жетісу облысы"}</p>
                        <div className="official-facts">
                          <div><span><IdCard />{t.license}</span><strong>{advocate.licenseNumber || t.noValue}</strong></div>
                          <div><span><CalendarDays />{t.issued}</span><strong>{readableDate(advocate.licenseIssuedAt, t.noValue)}</strong></div>
                        </div>
                        {advocate.address && <p className="official-address"><MapPin />{advocate.address}</p>}
                        {advocate.contacts && <p className="official-contact"><Phone />{advocate.contacts}</p>}
                        <div className="advocate-card-actions">
                          <a className="card-profile-link" href={`/advokaty/${advocate.id}`}>{t.profile}<ArrowRight /></a>
                          {phone && (
                            <div className="card-contact-buttons">
                              <a href={`tel:+${phone}`} aria-label={t.call} title={t.call}><PhoneCall /></a>
                              <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" aria-label={t.whatsapp} title={t.whatsapp}><MessageCircle /></a>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <nav className="directory-pagination" aria-label={t.page}>
                <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}><ArrowLeft />{t.previous}</button>
                <span>{t.page} <strong>{currentPage}</strong> / {pageCount}</span>
                <button disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>{t.next}<ArrowRight /></button>
              </nav>
            </>
          )}

          {directory && visible.length === 0 && (
            <div className="directory-empty">
              <Search />
              <h2>{t.empty}</h2>
              <p>{t.emptyText}</p>
              <button className="button button-dark" onClick={resetFilters}>{t.reset}<X /></button>
            </div>
          )}
        </div>
      </section>

      <PortalFooter locale={locale} />
    </main>
  );
}
