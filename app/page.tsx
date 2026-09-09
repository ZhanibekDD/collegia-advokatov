"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck2,
  FileSearch,
  Gavel,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Scale,
  Search,
  ShieldCheck,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "./components/portal-shell";
import { ASSOCIATION, advocateWord, consultationName, formatDirectoryDate } from "./lib/portal-data";
import { useDirectory } from "./lib/use-directory";
import { usePersistentLocale } from "./lib/use-persistent-locale";

const text = {
  ru: {
    eyebrow: "Коллегия адвокатов области Жетісу",
    title: "Правовая помощь начинается с проверенной информации",
    lead: "Найдите действующего члена коллегии или юридическую консультацию региона в актуальном списке на 1 сентября 2026 года.",
    find: "Найти адвоката",
    consultations: "Юридические консультации",
    registry: "Актуальный реестр",
    searchTitle: "Поиск по списку коллегии",
    searchLead: "Введите фамилию, имя или название юридической консультации.",
    placeholder: "Например, Абдуллаев или Панфиловский район",
    search: "Искать",
    all: "Открыть полный список",
    members: "адвокатов",
    groups: "подразделений и форм практики",
    updated: "состояние списка",
    languages: "русский / қазақша",
    tasksEyebrow: "Главное — без лишних шагов",
    tasksTitle: "Что можно сделать на сайте",
    tasks: [
      ["Найти адвоката", "Поиск по ФИО в составе коллегии на сентябрь 2026 года."],
      ["Выбрать подразделение", "Городские, районные и ювенальная юридические консультации."],
      ["Понять маршрут", "Короткая памятка по выбору направления правовой помощи."],
      ["Проверить сведения", "Дата списка и источник всегда показаны рядом с данными."],
    ],
    membersEyebrow: "Состав коллегии",
    membersTitle: "Адвокаты без лишних анкет",
    membersLead: "Только сведения из переданного списка: ФИО, регион и подразделение. Фотографии, рейтинги и специализации не выдумываются.",
    openProfile: "Открыть запись",
    viewAll: "Все 138 адвокатов",
    groupsEyebrow: "Структура коллегии",
    groupsTitle: "Юридические консультации",
    groupsLead: "Отдельный каталог для городских, районных подразделений и индивидуально практикующих адвокатов.",
    viewGroups: "Все подразделения",
    person: "адвокат",
    aboutEyebrow: "О коллегии",
    aboutTitle: "Профессиональное объединение адвокатов региона",
    aboutText: "Коллегия объединяет адвокатов области Жетісу и организует работу юридических консультаций. Портал создан для понятного доступа к составу коллегии и официальным контактам.",
    chair: "Председатель президиума",
    address: "Юридический адрес",
    details: "Реквизиты и сведения",
    contactEyebrow: "Связь с коллегией",
    contactTitle: "Официальные контакты",
    contactText: "Телефон приёмной и электронная почта указаны по подписанному договору. Отдельный номер для обращений появится после согласования.",
    office: "Приёмная",
    email: "Электронная почта",
    sourceTitle: "Список обновлён коллегией",
  },
  kk: {
    eyebrow: "Жетісу облыстық адвокаттар алқасы",
    title: "Құқықтық көмек тексерілген ақпараттан басталады",
    lead: "2026 жылғы 1 қыркүйектегі өзекті тізімнен алқа мүшесін немесе өңірдің заң консультациясын табыңыз.",
    find: "Адвокат табу",
    consultations: "Заң консультациялары",
    registry: "Өзекті тізілім",
    searchTitle: "Алқа тізімі бойынша іздеу",
    searchLead: "Тегін, атын немесе заң консультациясының атауын енгізіңіз.",
    placeholder: "Мысалы, Абдуллаев немесе Панфилов ауданы",
    search: "Іздеу",
    all: "Толық тізімді ашу",
    members: "адвокат",
    groups: "бөлімше және практика нысаны",
    updated: "тізімнің жағдайы",
    languages: "қазақша / русский",
    tasksEyebrow: "Қажеттісі — артық қадамсыз",
    tasksTitle: "Сайтта не істеуге болады",
    tasks: [
      ["Адвокат табу", "2026 жылғы қыркүйектегі алқа құрамынан аты-жөні бойынша іздеу."],
      ["Бөлімшені таңдау", "Қалалық, аудандық және ювеналдық заң консультациялары."],
      ["Бағытты түсіну", "Құқықтық көмек бағытын таңдауға арналған қысқа нұсқаулық."],
      ["Мәліметті тексеру", "Тізімнің күні мен дереккөзі әрқашан деректердің жанында көрсетіледі."],
    ],
    membersEyebrow: "Алқа құрамы",
    membersTitle: "Артық анкетасыз адвокаттар",
    membersLead: "Тек берілген тізімдегі мәліметтер: аты-жөні, өңірі және бөлімшесі. Фотосуреттер, рейтингтер мен мамандану ойдан шығарылмайды.",
    openProfile: "Жазбаны ашу",
    viewAll: "Барлық 138 адвокат",
    groupsEyebrow: "Алқа құрылымы",
    groupsTitle: "Заң консультациялары",
    groupsLead: "Қалалық, аудандық бөлімшелер мен жеке практикадағы адвокаттарға арналған жеке каталог.",
    viewGroups: "Барлық бөлімшелер",
    person: "адвокат",
    aboutEyebrow: "Алқа туралы",
    aboutTitle: "Өңір адвокаттарының кәсіби бірлестігі",
    aboutText: "Алқа Жетісу облысының адвокаттарын біріктіреді және заң консультацияларының жұмысын ұйымдастырады. Портал алқа құрамы мен ресми байланыстарға түсінікті қол жеткізу үшін жасалған.",
    chair: "Төралқа төрағасы",
    address: "Заңды мекенжай",
    details: "Деректемелер мен мәліметтер",
    contactEyebrow: "Алқамен байланыс",
    contactTitle: "Ресми байланыстар",
    contactText: "Қабылдау телефоны мен электрондық пошта қол қойылған шарт бойынша көрсетілді. Өтініштерге арналған жеке нөмір келісілгеннен кейін пайда болады.",
    office: "Қабылдау",
    email: "Электрондық пошта",
    sourceTitle: "Тізімді алқа жаңартты",
  },
};

const taskIcons = [UserRoundSearch, Building2, Gavel, FileSearch];

export default function HomePage() {
  const [locale, setLocale] = usePersistentLocale();
  const [query, setQuery] = useState("");
  const { directory } = useDirectory();
  const t = text[locale];

  const featured = useMemo(
    () => directory?.advocates.slice(0, 6) ?? [],
    [directory],
  );
  const featuredConsultations = useMemo(
    () => directory?.consultations.filter((item) => item.name !== "Индивидуалы").slice(0, 6) ?? [],
    [directory],
  );

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    window.location.assign(`/advokaty${value ? `?q=${encodeURIComponent(value)}` : ""}`);
  }

  return (
    <main id="top">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />

      <section className="home-hero">
        <div className="hero-orbit" aria-hidden="true"><Scale /><span /><span /></div>
        <div className="shell home-hero-grid">
          <div className="hero-copy reveal">
            <div className="eyebrow light"><span />{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.lead}</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/advokaty">{t.find}<ArrowRight /></Link>
              <Link className="button button-ghost" href="/konsultacii">{t.consultations}</Link>
            </div>
            <div className="hero-trust"><BadgeCheck />{t.sourceTitle} · {formatDirectoryDate(locale)}</div>
          </div>

          <form className="registry-search-card reveal delay-1" onSubmit={submitSearch}>
            <div className="registry-card-top"><span><ShieldCheck />{t.registry}</span><strong>{ASSOCIATION.domain}</strong></div>
            <h2>{t.searchTitle}</h2>
            <p>{t.searchLead}</p>
            <label>
              <Search />
              <span className="sr-only">{t.placeholder}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.placeholder} />
            </label>
            <button className="button button-accent" type="submit">{t.search}<ArrowRight /></button>
            <Link className="card-text-link" href="/advokaty">{t.all}<ArrowRight /></Link>
          </form>
        </div>
      </section>

      <section className="registry-stats" aria-label={locale === "ru" ? "Статистика списка" : "Тізім статистикасы"}>
        <div className="shell stats-grid">
          <div><UsersRound /><strong>{directory?.meta.total ?? "—"}</strong><span>{t.members}</span></div>
          <div><Landmark /><strong>{directory?.meta.consultationCount ?? "—"}</strong><span>{t.groups}</span></div>
          <div><CalendarCheck2 /><strong>01.09.2026</strong><span>{t.updated}</span></div>
          <div><ShieldCheck /><strong>2</strong><span>{t.languages}</span></div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <div className="section-heading centered reveal">
            <div className="eyebrow"><span />{t.tasksEyebrow}<span /></div>
            <h2>{t.tasksTitle}</h2>
          </div>
          <div className="task-grid">
            {t.tasks.map(([title, description], index) => {
              const Icon = taskIcons[index];
              return (
                <article className="task-card reveal" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties} key={title}>
                  <span className="center-icon"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="advocates">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <div className="eyebrow"><span />{t.membersEyebrow}</div>
              <h2>{t.membersTitle}</h2>
              <p>{t.membersLead}</p>
            </div>
            <Link className="arrow-link" href="/advokaty">{t.viewAll}<ArrowRight /></Link>
          </div>
          <DataSourceNotice locale={locale} total={directory?.meta.total} />
          <div className="member-preview-grid">
            {featured.map((advocate) => (
              <Link className="member-row" href={`/advokaty/${advocate.id}`} key={advocate.id}>
                <span className="member-index">{String(advocate.sourceId).padStart(3, "0")}</span>
                <span><strong>{advocate.name}</strong><small>{consultationName(advocate.consultation, locale)}</small></span>
                <span className="round-arrow" aria-label={t.openProfile}><ArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-ink" id="consultations">
        <div className="shell">
          <div className="section-heading split-heading light-heading">
            <div>
              <div className="eyebrow light"><span />{t.groupsEyebrow}</div>
              <h2>{t.groupsTitle}</h2>
              <p>{t.groupsLead}</p>
            </div>
            <Link className="arrow-link light-link" href="/konsultacii">{t.viewGroups}<ArrowRight /></Link>
          </div>
          <div className="consultation-preview-grid">
            {featuredConsultations.map((consultation, index) => (
              <Link className="consultation-card" href={`/konsultacii#${consultation.id}`} key={consultation.id}>
                <span className="consultation-number">{String(index + 1).padStart(2, "0")}</span>
                <Building2 />
                <h3>{consultationName(consultation.name, locale)}</h3>
                <p>{consultation.count} {advocateWord(consultation.count, locale)}</p>
                <ArrowRight className="consultation-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="shell about-grid">
          <div className="about-copy">
            <div className="eyebrow"><span />{t.aboutEyebrow}</div>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutText}</p>
            <Link className="button button-dark" href="/regions">{t.details}<ArrowRight /></Link>
          </div>
          <div className="official-facts">
            <div><span><Scale /></span><small>{t.chair}</small><strong>{ASSOCIATION.chair[locale]}</strong></div>
            <div><span><MapPin /></span><small>{t.address}</small><strong>{ASSOCIATION.address[locale]}</strong></div>
            <div><span><BadgeCheck /></span><small>{locale === "ru" ? "БИН" : "БСН"}</small><strong>{ASSOCIATION.bin}</strong></div>
          </div>
        </div>
      </section>

      <section className="contact-band" id="contacts">
        <div className="shell contact-band-grid">
          <div>
            <div className="eyebrow light"><span />{t.contactEyebrow}</div>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactText}</p>
          </div>
          <div className="contact-links">
            <a href={`tel:${ASSOCIATION.phoneHref}`}><span><Phone /></span><small>{t.office}</small><strong>{ASSOCIATION.phone}</strong></a>
            <a href={`mailto:${ASSOCIATION.email}`}><span><Mail /></span><small>{t.email}</small><strong>{ASSOCIATION.email}</strong></a>
          </div>
        </div>
      </section>

      <PortalFooter locale={locale} />
    </main>
  );
}
