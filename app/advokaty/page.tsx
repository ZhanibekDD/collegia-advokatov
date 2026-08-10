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
import type { AdvocateDirectory, Locale, OfficialAdvocate } from "../lib/portal-data";

const PAGE_SIZE = 24;

const copy = {
  ru: {
    eyebrow: "Открытые данные Министерства юстиции РК",
    title: "Все адвокаты Казахстана — в одном каталоге",
    lead: "Ищите по ФИО, номеру лицензии, региону или адресу. Мы показываем только поля официальной открытой выгрузки — без выдуманных рейтингов и специализаций.",
    search: "ФИО, лицензия, адрес или телефон",
    region: "Регион",
    allRegions: "Весь Казахстан",
    sort: "Сортировка",
    sortName: "По фамилии А—Я",
    sortNameDesc: "По фамилии Я—А",
    sortRegion: "По региону",
    found: "Найдено записей",
    shown: "Показано",
    reset: "Сбросить фильтры",
    source: "Запись из открытых данных",
    license: "Лицензия",
    issued: "Дата выдачи",
    joined: "Вступление в коллегию",
    profile: "Открыть карточку",
    noValue: "Не указано в источнике",
    empty: "По запросу ничего не найдено",
    emptyText: "Проверьте написание ФИО или сбросьте один из фильтров.",
    loading: "Загружаем официальный каталог",
    loadError: "Не удалось загрузить каталог",
    retry: "Попробовать ещё раз",
    previous: "Назад",
    next: "Дальше",
    page: "Страница",
    limitation: "Специализация и текущий статус лицензии в этом наборе не публикуются.",
    popular: "Популярные регионы",
    call: "Позвонить",
    whatsapp: "Написать в WhatsApp",
  },
  kk: {
    eyebrow: "ҚР Әділет министрлігінің ашық деректері",
    title: "Қазақстанның барлық адвокаттары бір каталогта",
    lead: "Аты-жөні, лицензия нөмірі, өңірі немесе мекенжайы бойынша іздеңіз. Біз рейтингтер мен мамандануды ойдан қоспай, ресми ашық жүктемедегі өрістерді ғана көрсетеміз.",
    search: "Аты-жөні, лицензия, мекенжай немесе телефон",
    region: "Өңір",
    allRegions: "Бүкіл Қазақстан",
    sort: "Сұрыптау",
    sortName: "Тегі бойынша А—Я",
    sortNameDesc: "Тегі бойынша Я—А",
    sortRegion: "Өңір бойынша",
    found: "Табылған жазбалар",
    shown: "Көрсетілді",
    reset: "Сүзгілерді тазарту",
    source: "Ашық деректердегі жазба",
    license: "Лицензия",
    issued: "Берілген күні",
    joined: "Алқаға кіру",
    profile: "Карточканы ашу",
    noValue: "Дереккөзде көрсетілмеген",
    empty: "Сұрау бойынша ештеңе табылмады",
    emptyText: "Аты-жөнінің жазылуын тексеріңіз немесе сүзгілердің бірін тазалаңыз.",
    loading: "Ресми каталог жүктелуде",
    loadError: "Каталогты жүктеу мүмкін болмады",
    retry: "Қайталап көру",
    previous: "Артқа",
    next: "Келесі",
    page: "Бет",
    limitation: "Бұл жиында мамандану мен лицензияның ағымдағы мәртебесі жарияланбайды.",
    popular: "Танымал өңірлер",
    call: "Қоңырау шалу",
    whatsapp: "WhatsApp-қа жазу",
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

export default function AdvocatesPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [directory, setDirectory] = useState<AdvocateDirectory | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [filtersReady, setFiltersReady] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const t = copy[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setRegion(params.get("region") ?? "all");
      setFiltersReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!filtersReady) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (region !== "all") params.set("region", region);
    if (sort !== "name-asc") params.set("sort", sort);
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [filtersReady, query, region, sort]);

  useEffect(() => {
    let active = true;
    fetch("/data/advocates.json")
      .then((response) => {
        if (!response.ok) throw new Error("Directory request failed");
        return response.json() as Promise<AdvocateDirectory>;
      })
      .then((result) => {
        if (active) setDirectory(result);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const regions = useMemo(() => {
    if (!directory) return [];
    return [...new Set(directory.advocates.map((advocate) => advocate.region))]
      .filter((item) => item !== "Регион не указан")
      .sort((a, b) => a.localeCompare(b, "ru"));
  }, [directory]);

  const popularRegions = useMemo(() => {
    if (!directory) return [];
    const counts = new Map<string, number>();
    for (const advocate of directory.advocates) {
      if (advocate.region !== "Регион не указан") counts.set(advocate.region, (counts.get(advocate.region) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [directory]);

  const filtered = useMemo(() => {
    if (!directory) return [];
    const normalized = deferredQuery.trim().toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU");
    const result = directory.advocates.filter((advocate) => {
      const regionMatch = region === "all" || advocate.region === region;
      if (!regionMatch) return false;
      if (!normalized) return true;
      return [advocate.name, advocate.licenseNumber, advocate.region, advocate.address, advocate.contacts]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalized);
    });

    const collator = new Intl.Collator(locale === "kk" ? "kk" : "ru", { sensitivity: "base" });
    return result.sort((a, b) => {
      if (sort === "name-desc") return collator.compare(b.name, a.name);
      if (sort === "region") return collator.compare(a.region, b.region) || collator.compare(a.name, b.name);
      return collator.compare(a.name, b.name);
    });
  }, [deferredQuery, directory, locale, region, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateRegion(value: string) {
    setRegion(value);
    setPage(1);
  }

  function resetFilters() {
    setQuery("");
    setRegion("all");
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
            <span><Database />6 005 {locale === "ru" ? "записей" : "жазба"}</span>
            <span><MapPin />20 {locale === "ru" ? "регионов" : "өңір"}</span>
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
              <small>{t.region}</small>
              <select value={region} onChange={(event) => updateRegion(event.target.value)}>
                <option value="all">{t.allRegions}</option>
                {regions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="directory-select">
              <small>{t.sort}</small>
              <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
                <option value="name-asc">{t.sortName}</option>
                <option value="name-desc">{t.sortNameDesc}</option>
                <option value="region">{t.sortRegion}</option>
              </select>
            </label>
          </div>

          {popularRegions.length > 0 && (
            <div className="popular-regions" aria-label={t.popular}>
              <span>{t.popular}</span>
              <button className={region === "all" ? "active" : ""} onClick={() => updateRegion("all")}>{t.allRegions}</button>
              {popularRegions.map(([item, count]) => (
                <button className={region === item ? "active" : ""} onClick={() => updateRegion(item)} key={item}>
                  {item}<small>{count.toLocaleString("ru-RU")}</small>
                </button>
              ))}
            </div>
          )}

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
                      <span>{advocate.initials || "KZ"}</span>
                      <small>#{advocate.id}</small>
                    </div>
                    <div className="advocate-card-body">
                      <div className="verified-line"><span><BadgeCheck /></span>{t.source}</div>
                      <h2>{advocate.name}</h2>
                      <p className="official-region"><MapPin />{advocate.region}</p>
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
                )})}
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
