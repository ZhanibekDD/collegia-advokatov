"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CalendarCheck2,
  ExternalLink,
  FileSearch,
  Gavel,
  Landmark,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Scale,
  Search,
  ShieldCheck,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import { AnimatedNumber, CivicMotionStage } from "./components/motion-stage";
import { DataSourceNotice, PortalFooter, PortalHeader } from "./components/portal-shell";
import {
  ASSOCIATION,
  NEWS_DATA_URL,
  RKA_TERRITORIAL_ASSOCIATIONS_URL,
  advocateWord,
  consultationName,
  formatDirectoryDate,
  type NewsPost,
} from "./lib/portal-data";
import { useDirectory } from "./lib/use-directory";
import { usePersistentLocale } from "./lib/use-persistent-locale";

const text = {
  ru: {
    eyebrow: "Официальный список адвокатов области Жетісу",
    title: "Нужна юридическая помощь?",
    titleAccent: "Найдите адвоката рядом с вами.",
    lead: "Введите фамилию или район. Сайт покажет адвокатов, их подразделения и контакты из официального списка.",
    searchLabel: "Поиск по официальному списку",
    placeholder: "Например: Иванов или Коксу…",
    search: "Найти",
    suggestions: "Подходящие адвокаты",
    noMatches: "Точных совпадений пока нет — посмотреть полный поиск",
    quick: ["По фамилии", "По району", "Юрконсультации"],
    sourceTitle: "Реестр обновлён коллегией",
    registryState: "Состояние официального реестра",
    members: "адвокатов в реестре",
    groups: "подразделений и форм практики",
    updated: "список обновлён",
    languages: "языка на сайте",
    routesEyebrow: "Выберите действие",
    routesTitle: "Что вам нужно?",
    routesLead: "Нажмите на подходящий вариант — всё важное открывается сразу, без сложных меню.",
    regionEyebrow: "Регион присутствия",
    regionTitle: "Правовая помощь — рядом с жителями Жетісу",
    regionText: "Коллегия объединяет адвокатов Талдыкоргана и районов области. Выберите ближайшую юридическую консультацию или найдите специалиста по фамилии.",
    regionCta: "Открыть консультации",
    regionMembers: "адвокатов",
    regionGroups: "подразделений",
    newsEyebrow: "Официальная лента",
    newsTitle: "Новости и мероприятия коллегии",
    newsLead: "Решения, встречи и важные объявления — в единой официальной ленте.",
    newsAll: "Все публикации",
    newsRead: "Открыть публикацию",
    newsEmptyTitle: "Первая публикация готовится",
    newsEmptyText: "Новости и сведения о мероприятиях появятся здесь после публикации коллегией.",
    newsLabel: "Новость",
    eventLabel: "Мероприятие",
    routes: [
      ["Найти адвоката", "Поиск по ФИО и подразделению в полном составе коллегии."],
      ["Выбрать консультацию", "Городские, районные и ювенальная юридические консультации."],
      ["Разобраться с помощью", "Короткий маршрут по основным направлениям правовой помощи."],
      ["Проверить сведения", "Переход к официальному ресурсу Республиканской коллегии адвокатов."],
    ],
    membersEyebrow: "Состав коллегии",
    membersTitle: "Адвокаты из официального списка",
    membersLead: "В каждой записи указаны ФИО, подразделение и доступные контакты. Номер рядом с именем — это номер строки в исходном списке коллегии.",
    openProfile: "Открыть запись",
    viewAll: "Смотреть всех 139",
    groupsEyebrow: "География помощи",
    groupsTitle: "Юридические консультации региона",
    groupsLead: "От Талдыкоргана до районных подразделений — выберите удобную консультацию и посмотрите её состав.",
    viewGroups: "Все 13 подразделений",
    aboutEyebrow: "О коллегии",
    aboutTitle: "Профессиональное объединение адвокатов области Жетісу",
    aboutText: "Портал даёт понятный доступ к актуальному составу коллегии, её структуре и официальным контактам. Данные об организации сверены с подписанным договором.",
    chair: "Председатель президиума",
    address: "Юридический адрес",
    details: "Открыть сведения о коллегии",
    contactEyebrow: "Официальная связь",
    contactTitle: "Приёмная коллегии",
    contactText: "Телефон и электронная почта указаны по подписанному договору. Отдельный номер для обращений добавим после согласования.",
    office: "Телефон приёмной",
    email: "Электронная почта",
    scroll: "Листайте дальше",
  },
  kk: {
    eyebrow: "Жетісу облысы адвокатурасының ресми порталы",
    title: "Адвокатты табыңыз.",
    titleAccent: "Жылдам және ресми тізім бойынша.",
    lead: "Алқаның өзекті құрамы, өңірдің заң консультациялары және тексерілген байланыс деректері — бір жерде.",
    searchLabel: "Тізілім бойынша іздеу",
    placeholder: "Тегін немесе ауданын енгізіңіз…",
    search: "Табу",
    suggestions: "Сәйкес адвокаттар",
    noMatches: "Дәл сәйкестік жоқ — толық іздеуді ашу",
    quick: ["Тегі бойынша", "Аудан бойынша", "Заң консультациялары"],
    sourceTitle: "Тізілімді алқа жаңартты",
    registryState: "Ресми тізілімнің жағдайы",
    members: "тізілімдегі адвокат",
    groups: "бөлімше және практика нысаны",
    updated: "тізімнің өзектілігі",
    languages: "интерфейс тілі",
    routesEyebrow: "Әрекетті таңдаңыз",
    routesTitle: "Сізге не қажет?",
    routesLead: "Сәйкес нұсқаны басыңыз — маңызды ақпарат күрделі мәзірсіз бірден ашылады.",
    regionEyebrow: "Қызмет көрсету өңірі",
    regionTitle: "Құқықтық көмек — Жетісу тұрғындарына жақын",
    regionText: "Алқа Талдықорған қаласы мен облыс аудандарындағы адвокаттарды біріктіреді. Жақын заң консультациясын таңдаңыз немесе адвокатты тегі бойынша табыңыз.",
    regionCta: "Консультацияларды ашу",
    regionMembers: "адвокат",
    regionGroups: "бөлімше",
    newsEyebrow: "Ресми лента",
    newsTitle: "Алқа жаңалықтары мен іс-шаралары",
    newsLead: "Шешімдер, кездесулер және маңызды хабарландырулар — бірыңғай ресми лентада.",
    newsAll: "Барлық жарияланымдар",
    newsRead: "Жарияланымды ашу",
    newsEmptyTitle: "Алғашқы жарияланым дайындалуда",
    newsEmptyText: "Алқа жариялағаннан кейін жаңалықтар мен іс-шаралар туралы ақпарат осында шығады.",
    newsLabel: "Жаңалық",
    eventLabel: "Іс-шара",
    routes: [
      ["Адвокат табу", "Алқаның толық құрамынан аты-жөні және бөлімшесі бойынша іздеу."],
      ["Консультация таңдау", "Қалалық, аудандық және ювеналдық заң консультациялары."],
      ["Көмек бағытын түсіну", "Құқықтық көмектің негізгі бағыттары бойынша қысқа бағдар."],
      ["Мәліметті тексеру", "Республикалық адвокаттар алқасының ресми ресурсына өту."],
    ],
    membersEyebrow: "Алқа құрамы",
    membersTitle: "Жарнамалық анкетасыз адвокаттар",
    membersLead: "Карточкаларда аты-жөні, бөлімше, жалпы тізімдегі байланыстар және 2026 жылғы МКБЗК қатысу белгісі бар. Ойдан шығарылған рейтинг, мамандану немесе фотосурет жоқ.",
    openProfile: "Жазбаны ашу",
    viewAll: "Барлық 139 адвокат",
    groupsEyebrow: "Көмек географиясы",
    groupsTitle: "Өңірдің заң консультациялары",
    groupsLead: "Талдықорғаннан аудандық бөлімшелерге дейін — ыңғайлы консультацияны таңдап, оның құрамын қараңыз.",
    viewGroups: "Барлық 13 бөлімше",
    aboutEyebrow: "Алқа туралы",
    aboutTitle: "Жетісу облысы адвокаттарының кәсіби бірлестігі",
    aboutText: "Портал алқаның өзекті құрамына, құрылымына және ресми байланыстарына түсінікті қол жеткізуді қамтамасыз етеді. Ұйым деректері қол қойылған шартпен салыстырылды.",
    chair: "Төралқа төрағасы",
    address: "Заңды мекенжай",
    details: "Алқа туралы мәліметтер",
    contactEyebrow: "Ресми байланыс",
    contactTitle: "Алқа қабылдауы",
    contactText: "Телефон мен электрондық пошта қол қойылған шарт бойынша көрсетілді. Өтініштерге арналған жеке нөмір келісілгеннен кейін қосылады.",
    office: "Қабылдау телефоны",
    email: "Электрондық пошта",
    scroll: "Төмен қарай",
  },
};

const routeIcons = [UserRoundSearch, Building2, Gavel, FileSearch];
const routeHrefs = ["/advokaty", "/konsultacii", "/pomosh", RKA_TERRITORIAL_ASSOCIATIONS_URL];

function formatNewsDate(value: string | null, locale: "ru" | "kk") {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "kk-KZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function HomePage() {
  const [locale, setLocale] = usePersistentLocale();
  const [query, setQuery] = useState("");
  const [news, setNews] = useState<NewsPost[]>([]);
  const [newsState, setNewsState] = useState<"loading" | "ready">("loading");
  const { directory } = useDirectory();
  const t = text[locale];

  const featured = useMemo(() => directory?.advocates.slice(0, 6) ?? [], [directory]);
  const featuredConsultations = useMemo(
    () => directory?.consultations.filter((item) => item.name !== "Индивидуалы").slice(0, 6) ?? [],
    [directory],
  );
  const suggestions = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU");
    if (needle.length < 2 || !directory) return [];
    return directory.advocates
      .filter((advocate) => `${advocate.name} ${advocate.consultation}`.toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU").includes(needle))
      .slice(0, 5);
  }, [directory, locale, query]);
  const latestNews = useMemo(() => news.slice(0, 3), [news]);

  useEffect(() => {
    let active = true;
    fetch(NEWS_DATA_URL)
      .then((response) => response.ok ? response.json() as Promise<{ posts: NewsPost[] }> : Promise.reject())
      .then((result) => { if (active) setNews(result.posts); })
      .catch(() => { if (active) setNews([]); })
      .finally(() => { if (active) setNewsState("ready"); });
    return () => { active = false; };
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    window.location.assign(`/advokaty${value ? `?q=${encodeURIComponent(value)}` : ""}`);
  }

  return (
    <main id="main-content" className="home-page-v2">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />

      <section className="home-hero home-hero-v2" id="home-top">
        <div className="hero-aurora hero-aurora-one" aria-hidden="true" />
        <div className="hero-aurora hero-aurora-two" aria-hidden="true" />
        <div className="shell hero-v2-grid">
          <div className="hero-v2-copy" data-reveal>
            <div className="hero-status"><span className="live-dot" />{t.eyebrow}</div>
            <h1>{t.title}<span>{t.titleAccent}</span></h1>
            <p>{t.lead}</p>

            <form className="hero-search-v2" onSubmit={submitSearch}>
              <div className="hero-search-label"><ShieldCheck />{t.searchLabel}<span>01.09.2026</span></div>
              <div className="hero-search-control">
                <Search />
                <label className="sr-only" htmlFor="home-directory-search">{t.placeholder}</label>
                <input id="home-directory-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.placeholder} autoComplete="off" role="combobox" aria-autocomplete="list" aria-controls={query.trim().length >= 2 ? "home-search-suggestions" : undefined} aria-expanded={query.trim().length >= 2} />
                <button type="submit">{t.search}<ArrowRight /></button>
              </div>

              {query.trim().length >= 2 && (
                <div className="hero-search-suggestions" id="home-search-suggestions" role="listbox" aria-label={t.suggestions}>
                  <div className="suggestions-title">{t.suggestions}<span>{suggestions.length}</span></div>
                  {suggestions.map((advocate) => (
                    <Link href={`/advokaty/${advocate.id}`} role="option" aria-selected="false" key={advocate.id}>
                      <span>{advocate.sourceId}</span>
                      <div><strong>{advocate.name}</strong><small>{consultationName(advocate.consultation, locale)}</small></div>
                      <ArrowRight />
                    </Link>
                  ))}
                  {suggestions.length === 0 && (
                    <Link className="no-suggestion" href={`/advokaty?q=${encodeURIComponent(query.trim())}`}><Search />{t.noMatches}<ArrowRight /></Link>
                  )}
                </div>
              )}
            </form>

            <div className="hero-quick-links">
              <span>{locale === "ru" ? "Быстрый поиск:" : "Жылдам іздеу:"}</span>
              <Link href="/advokaty">{t.quick[0]}</Link><Link href="/advokaty">{t.quick[1]}</Link><Link href="/konsultacii">{t.quick[2]}</Link>
            </div>
            <div className="hero-trust"><BadgeCheck />{t.sourceTitle} · {formatDirectoryDate(locale)}</div>
          </div>

          <div data-reveal style={{ "--reveal-delay": "140ms" } as React.CSSProperties}>
            <CivicMotionStage locale={locale} total={directory?.meta.total} consultations={directory?.meta.consultationCount} />
          </div>
        </div>
        <a className="hero-scroll-cue" href="#quick-routes"><span>{t.scroll}</span><ArrowDown /></a>
      </section>

      <section className="registry-stats registry-stats-v2" aria-label={locale === "ru" ? "Статистика списка" : "Тізім статистикасы"}>
        <div className="shell stats-dock-v3">
          <div className="stats-dock-label"><span>{t.registryState}</span><div aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i style={{ "--dock-stream": index } as React.CSSProperties} key={index} />)}</div></div>
          <div className="stats-grid stats-grid-v2">
            <div><div className="stat-value"><UsersRound /><strong><AnimatedNumber value={directory?.meta.total} fallback="139" /></strong></div><span>{t.members}</span></div>
            <div><div className="stat-value"><Landmark /><strong><AnimatedNumber value={directory?.meta.consultationCount} fallback="13" /></strong></div><span>{t.groups}</span></div>
            <div><div className="stat-value"><CalendarCheck2 /><strong>01.09.2026</strong></div><span>{t.updated}</span></div>
            <div><div className="stat-value"><ShieldCheck /><strong>2</strong></div><span>{t.languages}</span></div>
          </div>
        </div>
      </section>

      <section className="section quick-routes-section" id="quick-routes">
        <div className="shell">
          <div className="section-heading route-heading" data-reveal><div><div className="eyebrow"><span />{t.routesEyebrow}</div><h2>{t.routesTitle}</h2></div><p>{t.routesLead}</p></div>
          <div className="route-grid-v2">
            {t.routes.map(([title, description], index) => {
              const Icon = routeIcons[index];
              // The source asset is already an optimized, responsive-safe WebP; Vinext's image endpoint is not available in this static Worker build.
              // eslint-disable-next-line @next/next/no-img-element
              const content = <>{index === 0 && <img className="route-card-image" src="/images/legal-architecture-v1.webp" alt="" loading="lazy" aria-hidden="true" />}<span className="surface-glow" aria-hidden="true" /><div className="route-card-top"><span className="route-icon"><Icon /></span></div><h3>{title}</h3><p>{description}</p><span className="route-card-action">{locale === "ru" ? "Открыть" : "Ашу"}<ArrowRight />{index === 3 && <ExternalLink />}</span></>;
              const className = `route-card-v2 route-card-${index + 1}`;
              const style = { "--reveal-delay": `${index * 80}ms` } as React.CSSProperties;
              return index === 3 ? <a className={className} style={style} data-reveal data-tilt href={routeHrefs[index]} target="_blank" rel="noreferrer" key={title}>{content}</a> : <Link className={className} style={style} data-reveal data-tilt href={routeHrefs[index]} key={title}>{content}</Link>;
            })}
          </div>
        </div>
      </section>

      <section className="region-story" id="region-story" aria-labelledby="region-story-title">
        {/* This decorative WebP is pre-compressed and intentionally bypasses Vinext's unavailable runtime image endpoint. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="region-story-image" src="/images/jetisu-panorama-v1.webp" alt="" loading="lazy" aria-hidden="true" />
        <div className="region-story-shade" aria-hidden="true" />
        <div className="shell region-story-inner">
          <div className="region-story-copy" data-reveal>
            <div className="eyebrow light"><span />{t.regionEyebrow}</div>
            <h2 id="region-story-title">{t.regionTitle}</h2>
            <p>{t.regionText}</p>
            <div className="region-story-actions">
              <Link className="button region-story-button" href="/konsultacii">{t.regionCta}<ArrowRight /></Link>
              <div className="region-story-facts" aria-label={locale === "ru" ? "Охват коллегии" : "Алқаның қамтуы"}>
                <span><strong>{directory?.meta.total ?? 139}</strong>{t.regionMembers}</span>
                <span><strong>{directory?.meta.consultationCount ?? 13}</strong>{t.regionGroups}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-news-v3" id="home-news">
        <div className="home-news-streams" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i style={{ "--news-stream": index } as React.CSSProperties} key={index} />)}</div>
        <div className="shell">
          <div className="section-heading split-heading home-news-heading" data-reveal>
            <div><div className="eyebrow"><span />{t.newsEyebrow}</div><h2>{t.newsTitle}</h2><p>{t.newsLead}</p></div>
            <Link className="arrow-link" href="/novosti">{t.newsAll}<ArrowRight /></Link>
          </div>

          {newsState === "loading" && (
            <div className="home-news-grid" aria-label={locale === "ru" ? "Загрузка новостей" : "Жаңалықтар жүктелуде"}>
              {Array.from({ length: 3 }, (_, index) => <div className="home-news-card home-news-skeleton" key={index}><span /><strong /><p /></div>)}
            </div>
          )}

          {newsState === "ready" && latestNews.length === 0 && (
            <div className="home-news-empty" data-reveal>
              <span className="home-news-empty-icon"><Newspaper /></span>
              <div><small>KAOJ.KZ / NEWSROOM</small><h3>{t.newsEmptyTitle}</h3><p>{t.newsEmptyText}</p></div>
              <Link href="/novosti">{t.newsAll}<ArrowRight /></Link>
            </div>
          )}

          {latestNews.length > 0 && (
            <div className="home-news-grid">
              {latestNews.map((post, index) => {
                const title = locale === "kk" && post.titleKk ? post.titleKk : post.titleRu;
                const excerpt = locale === "kk" && post.excerptKk ? post.excerptKk : post.excerptRu;
                const date = post.eventDate ?? post.publishedAt;
                return (
                  <Link className="home-news-card" href={`/novosti/${post.slug}`} data-reveal data-tilt style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties} key={post.id}>
                    <span className="surface-glow" aria-hidden="true" />
                    {post.imageUrl && <img className="home-news-image" src={post.imageUrl} alt="" width="1200" height="675" loading={index === 0 ? "eager" : "lazy"} aria-hidden="true" />}
                    <div className="home-news-meta"><span>{post.kind === "event" ? <CalendarDays /> : <Newspaper />}{post.kind === "event" ? t.eventLabel : t.newsLabel}</span><time dateTime={date ?? undefined}>{formatNewsDate(date, locale)}</time></div>
                    <h3>{title}</h3>
                    {excerpt && <p>{excerpt}</p>}
                    <span className="home-news-action">{t.newsRead}<ArrowRight /></span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section members-section-v2" id="advocates">
        <div className="shell">
          <div className="section-heading split-heading" data-reveal><div><div className="eyebrow"><span />{t.membersEyebrow}</div><h2>{t.membersTitle}</h2><p>{t.membersLead}</p></div><Link className="arrow-link" href="/advokaty">{t.viewAll}<ArrowRight /></Link></div>
          <div data-reveal><DataSourceNotice locale={locale} total={directory?.meta.total} ggupTotal={directory?.meta.ggup.total} /></div>
          <div className="member-preview-grid member-preview-v2" data-reveal>
            {featured.map((advocate, index) => <Link className="member-row" href={`/advokaty/${advocate.id}`} style={{ "--member-order": index } as React.CSSProperties} key={advocate.id}><span className="member-index" aria-label={locale === "ru" ? `Номер ${advocate.sourceId} в списке` : `Тізімдегі ${advocate.sourceId} нөмір`}><strong>{advocate.sourceId}</strong></span><span><strong>{advocate.name}</strong><small>{consultationName(advocate.consultation, locale)}</small></span><span className="round-arrow" aria-label={t.openProfile}><ArrowRight /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="section section-ink consultations-v2" id="consultations">
        <div className="consultation-beam" aria-hidden="true" />
        <div className="shell">
          <div className="section-heading split-heading light-heading" data-reveal><div><div className="eyebrow light"><span />{t.groupsEyebrow}</div><h2>{t.groupsTitle}</h2><p>{t.groupsLead}</p></div><Link className="arrow-link light-link" href="/konsultacii">{t.viewGroups}<ArrowRight /></Link></div>
          <div className="consultation-preview-grid consultation-preview-v2">
            {featuredConsultations.map((consultation, index) => <Link className="consultation-card" data-reveal data-tilt style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties} href={`/konsultacii#${consultation.id}`} key={consultation.id}><span className="surface-glow" aria-hidden="true" /><Building2 /><h3>{consultationName(consultation.name, locale)}</h3><p>{consultation.count} {advocateWord(consultation.count, locale)}</p><ArrowRight className="consultation-arrow" /></Link>)}
          </div>
        </div>
      </section>

      <section className="section about-section about-v2" id="about">
        <div className="shell about-grid">
          <div className="about-copy" data-reveal><div className="eyebrow"><span />{t.aboutEyebrow}</div><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p><Link className="button button-dark" href="/regions">{t.details}<ArrowRight /></Link></div>
          <div className="official-facts official-facts-v2" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><div><span><Scale /></span><small>{t.chair}</small><strong>{ASSOCIATION.chair[locale]}</strong></div><div><span><MapPin /></span><small>{t.address}</small><strong>{ASSOCIATION.address[locale]}</strong></div><div><span><BadgeCheck /></span><small>{locale === "ru" ? "БИН" : "БСН"}</small><strong>{ASSOCIATION.bin}</strong></div></div>
        </div>
      </section>

      <section className="contact-band contact-band-v2" id="contacts">
        <div className="shell contact-band-grid"><div data-reveal><div className="eyebrow light"><span />{t.contactEyebrow}</div><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><div className="contact-links" data-reveal><a href={`tel:${ASSOCIATION.phoneHref}`}><span><Phone /></span><small>{t.office}</small><strong>{ASSOCIATION.phone}</strong></a><a href={`mailto:${ASSOCIATION.email}`}><span><Mail /></span><small>{t.email}</small><strong>{ASSOCIATION.email}</strong></a></div></div>
      </section>

      <PortalFooter locale={locale} />
    </main>
  );
}
