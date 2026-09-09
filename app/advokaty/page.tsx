"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, ListFilter, Search, ShieldCheck, X } from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../components/portal-shell";
import { JetisuSignature } from "../components/portal-experience";
import { consultationName } from "../lib/portal-data";
import { useDirectory } from "../lib/use-directory";
import { usePersistentLocale } from "../lib/use-persistent-locale";

const PAGE_SIZE = 24;

const text = {
  ru: {
    eyebrow: "Состав коллегии · 01.09.2026",
    title: "Адвокаты области Жетісу",
    lead: "Актуальный список, переданный коллегией. Ищите по ФИО или подразделению — без фотографий, рекламных рейтингов и неподтверждённых специализаций.",
    search: "Фамилия, имя или отчество",
    group: "Все подразделения",
    found: "Найдено",
    of: "из",
    advocates: "адвокатов",
    reset: "Сбросить",
    groupLabel: "Подразделение / форма практики",
    open: "Открыть запись",
    empty: "Совпадений не найдено",
    emptyText: "Попробуйте сократить запрос или выбрать другое подразделение.",
    loading: "Загружаем актуальный список…",
    error: "Не удалось загрузить список. Обновите страницу.",
    page: "Страница",
    back: "Назад",
    next: "Дальше",
    consultations: "Смотреть юридические консультации",
  },
  kk: {
    eyebrow: "Алқа құрамы · 01.09.2026",
    title: "Жетісу облысының адвокаттары",
    lead: "Алқа ұсынған өзекті тізім. Фотосуреттерсіз, жарнамалық рейтингтерсіз және расталмаған мамандануларсыз аты-жөні немесе бөлімшесі бойынша іздеңіз.",
    search: "Тегі, аты немесе әкесінің аты",
    group: "Барлық бөлімшелер",
    found: "Табылды",
    of: "барлығы",
    advocates: "адвокат",
    reset: "Тазарту",
    groupLabel: "Бөлімше / практика нысаны",
    open: "Жазбаны ашу",
    empty: "Сәйкестік табылмады",
    emptyText: "Сұрауды қысқартып немесе басқа бөлімшені таңдап көріңіз.",
    loading: "Өзекті тізім жүктелуде…",
    error: "Тізімді жүктеу мүмкін болмады. Бетті жаңартыңыз.",
    page: "Бет",
    back: "Артқа",
    next: "Келесі",
    consultations: "Заң консультацияларын көру",
  },
};

function DirectoryContent() {
  const searchParams = useSearchParams();
  const [locale, setLocale] = usePersistentLocale();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [consultation, setConsultation] = useState(searchParams.get("consultation") ?? "all");
  const [page, setPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  const { directory, failed } = useDirectory();
  const t = text[locale];

  const filtered = useMemo(() => {
    if (!directory) return [];
    const needle = deferredQuery.trim().toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU");
    return directory.advocates
      .filter((advocate) => consultation === "all" || advocate.consultation === consultation)
      .filter((advocate) => {
        if (!needle) return true;
        return `${advocate.name} ${advocate.consultation}`.toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU").includes(needle);
      })
      .sort((a, b) => a.name.localeCompare(b.name, locale === "kk" ? "kk" : "ru"));
  }, [consultation, deferredQuery, directory, locale]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function reset() {
    setQuery("");
    setConsultation("all");
    setPage(1);
  }

  return (
    <main id="main-content">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="page-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <JetisuSignature locale={locale} />
        <div className="shell page-hero-inner" data-reveal>
          <div className="eyebrow light"><span />{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
      </section>

      <section className="directory-section">
        <div className="shell">
          <div data-reveal><DataSourceNotice locale={locale} total={directory?.meta.total} /></div>

          <div className="directory-controls" data-reveal>
            <label className="search-field">
              <Search />
              <span className="sr-only">{t.search}</span>
              <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={t.search} />
              {query && <button type="button" aria-label={t.reset} onClick={() => { setQuery(""); setPage(1); }}><X /></button>}
            </label>
            <label className="select-field">
              <ListFilter />
              <span className="sr-only">{t.groupLabel}</span>
              <select value={consultation} onChange={(event) => { setConsultation(event.target.value); setPage(1); }}>
                <option value="all">{t.group}</option>
                {directory?.consultations.map((item) => (
                  <option value={item.name} key={item.id}>{consultationName(item.name, locale)} · {item.count}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="directory-summary">
            <p aria-live="polite"><strong>{t.found}: {filtered.length}</strong> {t.of} {directory?.meta.total ?? "—"} {t.advocates}</p>
            {(query || consultation !== "all") && <button type="button" onClick={reset}><X />{t.reset}</button>}
            <Link href="/konsultacii"><Building2 />{t.consultations}<ArrowRight /></Link>
          </div>

          {!directory && !failed && <div className="status-panel"><span className="spinner" />{t.loading}</div>}
          {failed && <div className="status-panel error"><ShieldCheck />{t.error}</div>}

          {directory && visible.length > 0 && (
            <div className="directory-list">
              {visible.map((advocate) => (
                <Link className="directory-row" href={`/advokaty/${advocate.id}`} key={advocate.id}>
                  <span className="directory-id">{String(advocate.sourceId).padStart(3, "0")}</span>
                  <span className="directory-person"><strong>{advocate.name}</strong><small>{locale === "ru" ? "Член Коллегии адвокатов области Жетісу" : "Жетісу облыстық адвокаттар алқасының мүшесі"}</small></span>
                  <span className="directory-group"><small>{t.groupLabel}</small><strong><Building2 />{consultationName(advocate.consultation, locale)}</strong></span>
                  <span className="round-arrow" aria-label={t.open}><ArrowRight /></span>
                </Link>
              ))}
            </div>
          )}

          {directory && visible.length === 0 && (
            <div className="empty-state"><Search /><h2>{t.empty}</h2><p>{t.emptyText}</p><button className="button button-dark" type="button" onClick={reset}>{t.reset}</button></div>
          )}

          {directory && pageCount > 1 && (
            <nav className="pagination" aria-label={t.page}>
              <button type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ArrowLeft />{t.back}</button>
              <span aria-current="page">{t.page} <strong>{safePage}</strong> / {pageCount}</span>
              <button type="button" disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>{t.next}<ArrowRight /></button>
            </nav>
          )}
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}

export default function AdvocatesPage() {
  return (
    <Suspense fallback={<div className="status-panel"><span className="spinner" /></div>}>
      <DirectoryContent />
    </Suspense>
  );
}
