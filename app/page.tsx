"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  CirclePlay,
  Database,
  Gavel,
  HeartHandshake,
  Home,
  Languages,
  LockKeyhole,
  MapPin,
  Search,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { ShanyrakMark } from "./components/shanyrak-mark";
import { ZHETISU_REGION, type AdvocateDirectory, type Locale } from "./lib/portal-data";

const helpIcons = [Gavel, HeartHandshake, BriefcaseBusiness, Home, Scale];

const copy = {
  ru: {
    portal: "Коллегия адвокатов области Жетісу",
    country: "Область Жетісу · Республика Казахстан",
    nav: ["Адвокаты", "Получить помощь", "О коллегии", "Материалы"],
    navHref: ["/advokaty", "/pomosh", "/regions", "#materials"],
    eyebrow: "Коллегия адвокатов области Жетісу",
    titleA: "Профессиональная защита.",
    titleAccent: "Ближе к людям.",
    lead: "Найдите адвоката области Жетісу по ФИО или номеру лицензии, проверьте опубликованные сведения и выберите понятный маршрут к правовой помощи.",
    primary: "Найти адвоката",
    secondary: "Как получить помощь",
    trust: ["Только область Жетісу", "Поиск по лицензии", "Русский · Қазақша"],
    searchLabel: "Каталог адвокатов Жетісу",
    searchTitle: "Кого вы ищете?",
    practice: "ФИО или номер лицензии",
    queryPlaceholder: "Например, Ахметов или 2100…",
    show: "Найти в каталоге",
    hint: "Поиск работает по опубликованным данным Минюста РК",
    statOne: "Область Жетісу",
    statOneText: "территория каталога",
    statTwo: "Открытые данные",
    statTwoText: "проверяемый источник",
    statThree: "ҚАЗ · РУС",
    statThreeText: "два языка интерфейса",
    helpEyebrow: "С чего начать",
    helpTitle: "Выберите ситуацию — сайт покажет следующий шаг",
    helpLead: "Не нужно заранее знать юридический термин. Начните с вашей ситуации и перейдите к подходящему разделу.",
    helpCards: [
      ["Уголовное дело", "Задержание, допрос, обвинение или защита потерпевшего"],
      ["Семья и дети", "Развод, алименты, место жительства ребёнка и наследство"],
      ["Бизнес", "Договоры, проверки, налоги и экономические споры"],
      ["Имущество", "Недвижимость, земля и жилищные вопросы"],
      ["Гражданский спор", "Долги, ущерб, обязательства и судебные дела"],
    ],
    route: "Открыть маршрут",
    processEyebrow: "Понятный процесс",
    processTitle: "От вопроса до обращения — три шага",
    processLead: "Сайт помогает быстро сориентироваться и перейти от общей проблемы к конкретному адвокату.",
    processSteps: [
      ["01", "Опишите задачу", "Выберите ситуацию или сразу откройте каталог адвокатов области Жетісу."],
      ["02", "Сверьте сведения", "Проверьте ФИО, номер лицензии, дату выдачи и опубликованные контакты."],
      ["03", "Свяжитесь напрямую", "Откройте карточку адвоката и используйте доступный способ связи."],
    ],
    registryEyebrow: "Региональный каталог",
    registryTitle: "Адвокаты области Жетісу — в одном месте",
    registryLead: "В каталоге отображаются только записи, относящиеся к области Жетісу. Адвокаты других регионов Казахстана на сайте не показываются.",
    verified: "Источник — открытый набор Министерства юстиции РК",
    privacy: "Поисковый запрос не публикуется",
    openDirectory: "Открыть каталог",
    valuesEyebrow: "Принципы портала",
    valuesTitle: "Современно, понятно и без лишнего шума",
    valuesLead: "Региональный сайт должен не перегружать человека, а быстро давать проверяемую информацию и понятный следующий шаг.",
    values: [
      ["01", "Региональный фокус", "Весь интерфейс и каталог ориентированы на область Жетісу."],
      ["02", "Проверяемость", "В карточках показываются поля опубликованного набора без выдуманных рейтингов."],
      ["03", "Конфиденциальность", "Поиск выполняется без публикации запроса пользователя."],
      ["04", "Доступность", "Русская и казахская версии, адаптивная вёрстка для телефона и компьютера."],
    ],
    materialsEyebrow: "Полезные разделы",
    materialsTitle: "Главное — под рукой",
    materialsLead: "Три сценария, которые чаще всего нужны посетителю сайта коллегии.",
    materials: [
      ["Каталог", "Найти адвоката", "Поиск по ФИО, лицензии, адресу и опубликованным контактам.", "/advokaty"],
      ["Навигатор", "Получить помощь", "Пошаговый выбор ситуации, срочности и маршрута обращения.", "/pomosh"],
      ["О коллегии", "Узнать о портале", "Региональная направленность, источник данных и принципы работы сайта.", "/regions"],
    ],
    ctaEyebrow: "Начните с поиска",
    ctaTitle: "Нужна профессиональная правовая помощь?",
    ctaText: "Откройте каталог адвокатов области Жетісу и найдите специалиста по официально опубликованным данным.",
    ctaButton: "Найти адвоката",
    rights: "© 2026 Коллегия адвокатов области Жетісу",
    demo: "Каталог: открытые данные Минюста РК · источник обновлён 08.07.2025",
  },
  kk: {
    portal: "Жетісу облыстық адвокаттар алқасы",
    country: "Жетісу облысы · Қазақстан Республикасы",
    nav: ["Адвокаттар", "Көмек алу", "Алқа туралы", "Материалдар"],
    navHref: ["/advokaty", "/pomosh", "/regions", "#materials"],
    eyebrow: "Жетісу облыстық адвокаттар алқасы",
    titleA: "Кәсіби қорғау.",
    titleAccent: "Адамдарға жақын.",
    lead: "Жетісу облысының адвокатын аты-жөні немесе лицензия нөмірі бойынша табыңыз, жарияланған мәліметтерді тексеріп, құқықтық көмекке апаратын түсінікті бағытты таңдаңыз.",
    primary: "Адвокат табу",
    secondary: "Көмекті қалай алуға болады",
    trust: ["Тек Жетісу облысы", "Лицензия бойынша іздеу", "Қазақша · Русский"],
    searchLabel: "Жетісу адвокаттарының каталогы",
    searchTitle: "Кімді іздеп жүрсіз?",
    practice: "Аты-жөні немесе лицензия нөмірі",
    queryPlaceholder: "Мысалы, Ахметов немесе 2100…",
    show: "Каталогтан табу",
    hint: "Іздеу ҚР Әділет министрлігінің жарияланған деректері бойынша жұмыс істейді",
    statOne: "Жетісу облысы",
    statOneText: "каталог аумағы",
    statTwo: "Ашық деректер",
    statTwoText: "тексерілетін дереккөз",
    statThree: "ҚАЗ · РУС",
    statThreeText: "интерфейстің екі тілі",
    helpEyebrow: "Неден бастау керек",
    helpTitle: "Жағдайды таңдаңыз — сайт келесі қадамды көрсетеді",
    helpLead: "Заң терминін алдын ала білу қажет емес. Өз жағдайыңыздан бастап, тиісті бөлімге өтіңіз.",
    helpCards: [
      ["Қылмыстық іс", "Ұстау, жауап алу, айыптау немесе жәбірленушіні қорғау"],
      ["Отбасы және балалар", "Ажырасу, алимент, баланың тұрғылықты жері және мұрагерлік"],
      ["Бизнес", "Шарттар, тексерулер, салықтар және экономикалық даулар"],
      ["Мүлік", "Жылжымайтын мүлік, жер және тұрғын үй мәселелері"],
      ["Азаматтық дау", "Қарыздар, залал, міндеттемелер және сот істері"],
    ],
    route: "Бағытты ашу",
    processEyebrow: "Түсінікті үдеріс",
    processTitle: "Сұрақтан өтінішке дейін — үш қадам",
    processLead: "Сайт жағдайды тез бағалап, жалпы мәселеден нақты адвокатқа өтуге көмектеседі.",
    processSteps: [
      ["01", "Мәселені таңдаңыз", "Жағдайды таңдаңыз немесе Жетісу облысы адвокаттарының каталогын бірден ашыңыз."],
      ["02", "Мәліметтерді салыстырыңыз", "Аты-жөнін, лицензия нөмірін, берілген күнін және жарияланған байланыстарды тексеріңіз."],
      ["03", "Тікелей байланысыңыз", "Адвокат карточкасын ашып, қолжетімді байланыс тәсілін пайдаланыңыз."],
    ],
    registryEyebrow: "Өңірлік каталог",
    registryTitle: "Жетісу облысының адвокаттары — бір жерде",
    registryLead: "Каталогта тек Жетісу облысына қатысты жазбалар көрсетіледі. Қазақстанның басқа өңірлерінің адвокаттары сайтта көрсетілмейді.",
    verified: "Дереккөз — ҚР Әділет министрлігінің ашық деректер жиыны",
    privacy: "Іздеу сұрауы жарияланбайды",
    openDirectory: "Каталогты ашу",
    valuesEyebrow: "Портал қағидаттары",
    valuesTitle: "Заманауи, түсінікті және артық ақпаратсыз",
    valuesLead: "Өңірлік сайт адамды артық ақпаратпен жүктемей, тексерілетін мәлімет пен түсінікті келесі қадамды жылдам беруі керек.",
    values: [
      ["01", "Өңірлік фокус", "Бүкіл интерфейс пен каталог Жетісу облысына бағытталған."],
      ["02", "Тексерілу мүмкіндігі", "Карточкаларда ойдан шығарылған рейтингтерсіз жарияланған деректер көрсетіледі."],
      ["03", "Құпиялылық", "Іздеу пайдаланушы сұрауын жарияламай орындалады."],
      ["04", "Қолжетімділік", "Қазақша және орысша нұсқалар, телефон мен компьютерге бейімделген дизайн."],
    ],
    materialsEyebrow: "Пайдалы бөлімдер",
    materialsTitle: "Ең керектісі — қол астында",
    materialsLead: "Алқа сайтының келушісіне жиі қажет болатын үш сценарий.",
    materials: [
      ["Каталог", "Адвокат табу", "Аты-жөні, лицензия, мекенжай және жарияланған байланыстар бойынша іздеу.", "/advokaty"],
      ["Навигатор", "Көмек алу", "Жағдайды, жеделдікті және өтініш бағытын қадамдап таңдау.", "/pomosh"],
      ["Алқа туралы", "Портал туралы білу", "Өңірлік бағыт, дереккөз және сайт жұмысының қағидаттары.", "/regions"],
    ],
    ctaEyebrow: "Іздеуден бастаңыз",
    ctaTitle: "Кәсіби құқықтық көмек қажет пе?",
    ctaText: "Жетісу облысы адвокаттарының каталогын ашып, ресми жарияланған деректер бойынша маманды табыңыз.",
    ctaButton: "Адвокат табу",
    rights: "© 2026 Жетісу облыстық адвокаттар алқасы",
    demo: "Каталог: ҚР Әділет министрлігінің ашық деректері · 08.07.2025",
  },
};

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [directoryCount, setDirectoryCount] = useState<number | null>(null);
  const t = copy[locale];

  useEffect(() => {
    let active = true;
    fetch("/data/advocates.json")
      .then((response) => response.json() as Promise<AdvocateDirectory>)
      .then((result) => {
        if (active) setDirectoryCount(result.advocates.filter((advocate) => advocate.region === ZHETISU_REGION).length);
      })
      .catch(() => {
        if (active) setDirectoryCount(null);
      });
    return () => {
      active = false;
    };
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    window.location.assign(`/advokaty${params.size ? `?${params.toString()}` : ""}`);
  }

  function changeLocale(next: Locale) {
    setLocale(next);
    document.documentElement.lang = next;
  }

  return (
    <main>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label={t.portal}>
            <span className="brand-mark" aria-hidden="true"><ShanyrakMark /></span>
            <span className="brand-copy"><strong>{t.portal}</strong><small>{t.country}</small></span>
          </a>

          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Главная навигация">
            {t.nav.map((item, index) => <a key={item} href={t.navHref[index]} onClick={() => setMenuOpen(false)}>{item}</a>)}
          </nav>

          <div className="header-actions">
            <div className="language-switch" aria-label="Выбор языка">
              <button className={locale === "kk" ? "active" : ""} onClick={() => changeLocale("kk")}>ҚАЗ</button>
              <button className={locale === "ru" ? "active" : ""} onClick={() => changeLocale("ru")}>РУС</button>
            </div>
            <a className="cabinet-button" href="/advokaty">{locale === "ru" ? "Каталог" : "Каталог"}</a>
            <button className={menuOpen ? "menu-button is-open" : "menu-button"} aria-label="Открыть меню" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="shell hero-layout">
          <div className="hero-copy">
            <div className="identity-line">
              <span className="identity-mark" aria-hidden="true"><ShanyrakMark /></span>
              <strong>JETISU</strong>
              <small>{locale === "ru" ? "Талдыкорган · региональный правовой портал" : "Талдықорған · өңірлік құқықтық портал"}</small>
            </div>
            <div className="eyebrow light"><span />{t.eyebrow}</div>
            <h1>{t.titleA}<br /><em>{t.titleAccent}</em></h1>
            <p>{t.lead}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/advokaty">{t.primary}<ArrowUpRight aria-hidden="true" /></a>
              <a className="text-link" href="/pomosh"><span className="play-icon" aria-hidden="true"><CirclePlay /></span>{t.secondary}</a>
            </div>
            <ul className="trust-list">
              {t.trust.map((item) => <li key={item}><span><ShieldCheck /></span>{item}</li>)}
            </ul>
          </div>

          <form className="search-card" onSubmit={submitSearch}>
            <div className="search-card-top"><span>{t.searchLabel}</span><span className="status-dot">JETISU</span></div>
            <h2>{t.searchTitle}</h2>
            <label>
              <span>{t.practice}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.queryPlaceholder} />
            </label>
            <button className="search-submit" type="submit"><Search className="search-icon" aria-hidden="true" />{t.show}<ArrowRight aria-hidden="true" /></button>
            <p className="form-hint"><Database />{t.hint}</p>
          </form>
        </div>

        <div className="shell hero-stats">
          <div><strong>{directoryCount ? directoryCount.toLocaleString("ru-RU") : t.statOne}</strong><span>{directoryCount ? (locale === "ru" ? "адвокатов области Жетісу" : "Жетісу облысының адвокаттары") : t.statOneText}</span></div>
          <div><strong>{t.statTwo}</strong><span>{t.statTwoText}</span></div>
          <div><strong>{t.statThree}</strong><span>{t.statThreeText}</span></div>
          <div className="hero-seal" aria-hidden="true"><span>JE</span><small>JETISU</small></div>
        </div>
      </section>

      <section className="section help-section" id="help">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><div className="eyebrow"><span />{t.helpEyebrow}</div><h2>{t.helpTitle}</h2></div>
            <p>{t.helpLead}</p>
          </div>
          <div className="help-grid">
            {t.helpCards.map(([title, description], index) => {
              const Icon = helpIcons[index];
              return (
                <a className="help-card" href="/pomosh" key={title}>
                  <div className={`help-icon help-icon-${index + 1}`} aria-hidden="true"><span className="icon-kz-pattern" /><Icon /></div>
                  <div className="help-card-copy">
                    <span className="help-index">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{title}</h3><p>{description}</p>
                    <span className="card-link">{t.route}<ArrowRight /></span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="shell">
          <div className="section-heading process-heading">
            <div className="eyebrow"><span />{t.processEyebrow}</div><h2>{t.processTitle}</h2><p>{t.processLead}</p>
          </div>
          <div className="process-grid">
            {t.processSteps.map(([number, title, description], index) => (
              <article className="process-step" key={number}>
                <div className="step-top"><span>{number}</span>{index < t.processSteps.length - 1 && <i aria-hidden="true">→</i>}</div>
                <h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="registry-section" id="registry">
        <div className="registry-accent" aria-hidden="true" />
        <div className="shell registry-layout">
          <div className="registry-copy">
            <div className="eyebrow light"><span />{t.registryEyebrow}</div>
            <h2>{t.registryTitle}</h2><p>{t.registryLead}</p>
            <div className="registry-points">
              <div><span><BadgeCheck /></span>{t.verified}</div>
              <div><span><LockKeyhole /></span>{t.privacy}</div>
            </div>
          </div>
          <div className="registry-panel">
            <div className="registry-panel-head"><span className="directory-icon"><MapPin /></span><div><small>{locale === "ru" ? "Территория каталога" : "Каталог аумағы"}</small><strong>{locale === "ru" ? "Область Жетісу" : "Жетісу облысы"}</strong></div></div>
            <div className="result-preview"><div className="result-badge"><BadgeCheck /></div><div><strong>{directoryCount ? directoryCount.toLocaleString("ru-RU") : "—"}</strong><p>{locale === "ru" ? "адвокатов в региональной выборке" : "өңірлік іріктеудегі адвокат"}</p></div></div>
            <a className="button button-dark" href="/advokaty">{t.openDirectory}<ArrowRight /></a>
          </div>
        </div>
      </section>

      <section className="values-section" id="about">
        <div className="shell values-layout">
          <div className="values-intro">
            <div className="eyebrow light"><span />{t.valuesEyebrow}</div><h2>{t.valuesTitle}</h2><p>{t.valuesLead}</p>
            <div className="values-emblem values-data-card" aria-hidden="true"><MapPin /><span>JETISU</span><small>TALDYQORĞAN · 2026</small></div>
          </div>
          <div className="values-grid">
            {t.values.map(([number, title, description], index) => (
              <article className="value-card" key={number}>
                <div className="value-card-top"><span>{number}</span><i aria-hidden="true">{index === 0 ? <MapPin /> : index === 1 ? <BadgeCheck /> : index === 2 ? <ShieldCheck /> : <Languages />}</i></div>
                <h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="materials-section" id="materials">
        <div className="shell">
          <div className="section-heading split-heading materials-heading">
            <div><div className="eyebrow"><span />{t.materialsEyebrow}</div><h2>{t.materialsTitle}</h2></div><p>{t.materialsLead}</p>
          </div>
          <div className="materials-grid">
            {t.materials.map(([tag, title, description, href], index) => (
              <article className="material-card" key={title}>
                <div className={`material-art art-${index + 1}`} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><i>{index === 0 ? <Search /> : index === 1 ? <ShieldCheck /> : <MapPin />}</i></div>
                <div className="material-content"><span className="material-tag">{tag}</span><h3>{title}</h3><p>{description}</p><a href={href}>{locale === "ru" ? "Открыть" : "Ашу"}<ArrowRight /></a></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-orbit" aria-hidden="true" />
        <div className="shell cta-inner">
          <div><div className="eyebrow light"><span />{t.ctaEyebrow}</div><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div>
          <a className="button button-primary" href="/advokaty">{t.ctaButton}<ArrowUpRight /></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <div className="brand footer-logo"><span className="brand-mark" aria-hidden="true"><ShanyrakMark /></span><span className="brand-copy"><strong>{t.portal}</strong><small>{t.country}</small></span></div>
            <p>{locale === "ru" ? "Региональный цифровой доступ к профессиональной правовой помощи." : "Кәсіби құқықтық көмекке өңірлік цифрлық қолжетімділік."}</p>
          </div>
          <div className="footer-column"><strong>{locale === "ru" ? "Гражданам" : "Азаматтарға"}</strong><a href="/advokaty">{t.primary}</a><a href="/pomosh">{t.secondary}</a></div>
          <div className="footer-column"><strong>{locale === "ru" ? "Коллегия" : "Алқа"}</strong><a href="/regions">{locale === "ru" ? "О коллегии" : "Алқа туралы"}</a><a href="#materials">{locale === "ru" ? "Материалы" : "Материалдар"}</a></div>
          <div className="footer-column"><strong>{locale === "ru" ? "Данные" : "Деректер"}</strong><a href="https://data.egov.kz/datasets/view?index=advokattar_tizimi14" target="_blank" rel="noreferrer">{locale === "ru" ? "Источник Минюста" : "Әділет министрлігінің дереккөзі"}</a></div>
        </div>
        <div className="shell footer-bottom"><span>{t.rights}</span><span>{t.demo}</span></div>
      </footer>
    </main>
  );
}
