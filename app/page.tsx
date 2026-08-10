"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { FormEvent, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faDatabase as faDatabaseSolid,
  faFileCircleCheck,
  faHandcuffs,
  faHandshake,
  faHouse,
  faLanguage,
  faLock,
  faPeopleRoof,
  faShieldHalved,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CirclePlay,
  Clock3,
  Database,
  ExternalLink,
  LockKeyhole,
  Minus,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { regionOptions as regions, type Locale } from "./lib/portal-data";
import { ShanyrakMark } from "./components/shanyrak-mark";

const helpIcons = [faHandcuffs, faPeopleRoof, faBriefcase, faHouse, faHandshake, faShieldHalved];
const valueIcons = [faShieldHalved, faLock, faDatabaseSolid, faLanguage];
const materialIcons = [faHandcuffs, faUserCheck, faFileCircleCheck];

const copy = {
  ru: {
    portal: "Единый портал коллегий адвокатов",
    country: "Республика Казахстан",
    nav: ["Найти адвоката", "Правовая помощь", "О коллегиях", "Материалы"],
    navHref: ["/advokaty", "/pomosh", "/regions", "#materials"],
    cabinet: "Личный кабинет",
    eyebrow: "Защита прав по всей стране",
    titleA: "Право должно быть",
    titleAccent: "понятным.",
    titleB: "Защита — доступной.",
    lead: "Найдите адвоката по ФИО, номеру лицензии и региону. В каталоге — 6 005 записей из открытого набора Министерства юстиции РК.",
    primary: "Найти адвоката",
    secondary: "Как получить помощь",
    trust: ["Открытые данные Минюста", "Поиск по лицензии", "Все 20 регионов РК"],
    searchLabel: "Поиск по единому каталогу",
    searchTitle: "Кому доверить защиту?",
    region: "Регион",
    practice: "ФИО или номер лицензии",
    queryPlaceholder: "Например, Ахметов или 2100…",
    show: "Открыть каталог",
    hint: "Поиск займёт меньше минуты",
    statOne: "6 005 записей",
    statOneText: "официальная открытая выгрузка",
    statTwo: "20 регионов",
    statTwoText: "весь Казахстан",
    statThree: "08.07.2025",
    statThreeText: "дата обновления источника",
    helpEyebrow: "С чего начать",
    helpTitle: "Выберите ситуацию — мы покажем маршрут",
    helpLead: "Не нужно разбираться в юридических терминах. Начните с того, что произошло.",
    helpCards: [
      ["§", "Уголовное дело", "Задержание, допрос, обвинение или защита потерпевшего"],
      ["01", "Семья и дети", "Развод, алименты, место жительства ребёнка, наследство"],
      ["₸", "Бизнес", "Договоры, налоги, проверки и экономические споры"],
      ["⌂", "Имущество", "Недвижимость, земельные и жилищные вопросы"],
      ["✓", "Гражданский спор", "Долги, ущерб, защита потребителей и судебные дела"],
      ["24", "Срочная помощь", "Если человек задержан или требуется защита без промедления"],
    ],
    route: "Открыть маршрут",
    registryEyebrow: "Единый каталог",
    registryTitle: "Найдите специалиста под вашу задачу",
    registryLead: "Фильтруйте 6 005 записей по региону, ФИО, лицензии, адресу и контактам. Каталог не добавляет сведения, которых нет в источнике.",
    verified: "Данные опубликованы Министерством юстиции РК",
    privacy: "Ваш запрос не публикуется и не передаётся третьим лицам",
    resultTitle: "Маршрут поиска подготовлен",
    resultText: "Поиск работает по полной официальной выгрузке. Актуальный статус лицензии нужно дополнительно сверить с территориальной коллегией.",
    resultButton: "Перейти к результатам",
    processEyebrow: "Понятный процесс",
    processTitle: "От вопроса до защиты — три простых шага",
    processLead: "Портал помогает быстро сориентироваться, выбрать специалиста и начать работу без лишней бюрократии.",
    processSteps: [
      ["01", "Начните с поиска", "Укажите регион, ФИО или номер лицензии. Персональные детали для поиска не нужны."],
      ["02", "Сверьте запись", "Сравните номер лицензии, дату выдачи, адрес и контакты из официальной выгрузки."],
      ["03", "Свяжитесь напрямую", "Выберите удобный способ связи и договоритесь о консультации или срочной защите."],
    ],
    aboutEyebrow: "Профессиональные гарантии",
    aboutTitle: "Система, в центре которой — доверие человека",
    aboutLead: "Цифровой портал объединяет доступ к региональным коллегиям, понятные стандарты профессии и безопасный поиск правовой помощи.",
    values: [
      ["01", "Независимость", "Адвокат защищает права и законные интересы доверителя независимо и профессионально."],
      ["02", "Конфиденциальность", "Обращение и содержание консультации защищены принципом адвокатской тайны."],
      ["03", "Проверяемость", "Профиль показывает источник, номер лицензии и дату обновления набора без выдуманных оценок."],
      ["04", "Равный доступ", "Понятный интерфейс на казахском и русском языках для жителей всех регионов страны."],
    ],
    materialsEyebrow: "Полезные материалы",
    materialsTitle: "Разобраться до консультации",
    materialsLead: "Короткие памятки без сложных формулировок — чтобы понимать свои права и действовать спокойно.",
    materialsCards: [
      ["Памятка", "Что делать при задержании", "Первые действия, право на защитника и важные правила общения."],
      ["Разъяснение", "Как выбрать адвоката", "На что смотреть в профиле, какие вопросы задать до заключения соглашения."],
      ["Практика", "Подготовка к первой консультации", "Какие документы собрать и как сформулировать задачу, чтобы сэкономить время."],
    ],
    read: "Читать материал",
    faqEyebrow: "Ответы на вопросы",
    faqTitle: "Коротко о главном",
    faqs: [
      ["Как проверить, что специалист действительно является адвокатом?", "Каталог показывает запись из открытого набора Минюста РК. Поскольку набор не содержит текущий статус лицензии, перед соглашением сверьте лицензию и членство в территориальной коллегии."],
      ["Можно ли получить бесплатную юридическую помощь?", "В предусмотренных законом случаях помощь может оказываться за счёт государства. Портал поможет определить подходящий маршрут и найти специалиста в вашем регионе."],
      ["Что делать, если помощь нужна срочно?", "Выберите раздел «Срочная помощь», укажите регион и направление. Для ситуаций с задержанием важно обратиться за защитой без промедления."],
      ["Публикуется ли мой запрос на сайте?", "Нет. Поисковый запрос не является публичным. Контактные и фактические данные передаются только при осознанном обращении к выбранному специалисту."],
    ],
    ctaEyebrow: "Начните с первого шага",
    ctaTitle: "Нужна профессиональная защита?",
    ctaText: "Выберите регион и задачу — портал подскажет понятный путь к адвокату.",
    ctaButton: "Подобрать адвоката",
    footerTitle: "Коллегии адвокатов Республики Казахстан",
    footerText: "Современный цифровой доступ к профессиональной юридической помощи.",
    footerCols: ["Гражданам", "Адвокатам", "Информация"],
    footerLinks: [
      ["Найти адвоката", "Бесплатная помощь", "Проверить статус"],
      ["Личный кабинет", "Стандарты профессии", "Документы"],
      ["О портале", "Новости", "Контакты"],
    ],
    rights: "© 2026 Единый портал коллегий адвокатов Казахстана",
    demo: "Каталог: открытые данные Минюста РК · источник обновлён 08.07.2025",
  },
  kk: {
    portal: "Адвокаттар алқаларының бірыңғай порталы",
    country: "Қазақстан Республикасы",
    nav: ["Адвокат табу", "Құқықтық көмек", "Алқалар туралы", "Материалдар"],
    navHref: ["/advokaty", "/pomosh", "/regions", "#materials"],
    cabinet: "Жеке кабинет",
    eyebrow: "Бүкіл ел бойынша құқықтарды қорғау",
    titleA: "Құқық түсінікті",
    titleAccent: "болуы тиіс.",
    titleB: "Қорғау — қолжетімді.",
    lead: "Адвокатты аты-жөні, лицензия нөмірі және өңірі бойынша табыңыз. Каталогта ҚР Әділет министрлігінің ашық жиынынан 6 005 жазба бар.",
    primary: "Адвокат табу",
    secondary: "Көмекті қалай алуға болады",
    trust: ["Әділет министрлігінің ашық деректері", "Лицензия бойынша іздеу", "ҚР барлық 20 өңірі"],
    searchLabel: "Бірыңғай каталог бойынша іздеу",
    searchTitle: "Қорғауды кімге сеніп тапсыру керек?",
    region: "Өңір",
    practice: "Аты-жөні немесе лицензия нөмірі",
    queryPlaceholder: "Мысалы, Ахметов немесе 2100…",
    show: "Каталогты ашу",
    hint: "Іздеу бір минуттан аз уақыт алады",
    statOne: "6 005 жазба",
    statOneText: "ресми ашық жүктеме",
    statTwo: "20 өңір",
    statTwoText: "бүкіл Қазақстан",
    statThree: "08.07.2025",
    statThreeText: "дереккөздің жаңартылған күні",
    helpEyebrow: "Неден бастау керек",
    helpTitle: "Жағдайды таңдаңыз — біз бағытты көрсетеміз",
    helpLead: "Заң терминдерін түсінудің қажеті жоқ. Не болғанынан бастаңыз.",
    helpCards: [
      ["§", "Қылмыстық іс", "Ұстау, жауап алу, айыптау немесе жәбірленушіні қорғау"],
      ["01", "Отбасы және балалар", "Ажырасу, алимент, баланың тұрғылықты жері, мұрагерлік"],
      ["₸", "Бизнес", "Шарттар, салықтар, тексерулер және экономикалық даулар"],
      ["⌂", "Мүлік", "Жылжымайтын мүлік, жер және тұрғын үй мәселелері"],
      ["✓", "Азаматтық дау", "Қарыздар, залал, тұтынушыларды қорғау және сот істері"],
      ["24", "Жедел көмек", "Адам ұсталғанда немесе дереу қорғау қажет болғанда"],
    ],
    route: "Бағытты ашу",
    registryEyebrow: "Бірыңғай каталог",
    registryTitle: "Міндетіңізге сай маманды табыңыз",
    registryLead: "6 005 жазбаны өңір, аты-жөні, лицензия, мекенжай және байланыс бойынша сүзгілеңіз. Каталог дереккөзде жоқ мәліметті қоспайды.",
    verified: "Деректерді ҚР Әділет министрлігі жариялаған",
    privacy: "Сұрауыңыз жарияланбайды және үшінші тұлғаларға берілмейді",
    resultTitle: "Іздеу бағыты дайындалды",
    resultText: "Іздеу толық ресми жүктеме бойынша жұмыс істейді. Лицензияның өзекті мәртебесін аумақтық алқадан қосымша тексеру қажет.",
    resultButton: "Нәтижелерге өту",
    processEyebrow: "Түсінікті үдеріс",
    processTitle: "Сұрақтан қорғауға дейін — үш қарапайым қадам",
    processLead: "Портал жағдайды тез бағалауға, маман таңдауға және артық бюрократиясыз жұмысты бастауға көмектеседі.",
    processSteps: [
      ["01", "Іздеуден бастаңыз", "Өңірді, аты-жөнін немесе лицензия нөмірін көрсетіңіз. Іздеу үшін жеке мәліметтер қажет емес."],
      ["02", "Жазбаны салыстырыңыз", "Ресми жүктемедегі лицензия нөмірін, берілген күнін, мекенжайы мен байланысын тексеріңіз."],
      ["03", "Тікелей байланысыңыз", "Қолайлы байланыс тәсілін таңдап, кеңес немесе жедел қорғау туралы келісіңіз."],
    ],
    aboutEyebrow: "Кәсіби кепілдіктер",
    aboutTitle: "Орталығында адам сенімі тұрған жүйе",
    aboutLead: "Цифрлық портал өңірлік алқаларға қолжетімділікті, кәсіптің түсінікті стандарттарын және құқықтық көмекті қауіпсіз іздеуді біріктіреді.",
    values: [
      ["01", "Тәуелсіздік", "Адвокат сенім білдірушінің құқықтары мен заңды мүдделерін тәуелсіз әрі кәсіби қорғайды."],
      ["02", "Құпиялылық", "Өтініш пен кеңес мазмұны адвокаттық құпия қағидатымен қорғалады."],
      ["03", "Тексерілу мүмкіндігі", "Профиль ойдан шығарылған бағаларсыз дереккөзді, лицензия нөмірін және жиынның жаңартылған күнін көрсетеді."],
      ["04", "Тең қолжетімділік", "Елдің барлық өңіріндегі тұрғындарға қазақ және орыс тілдеріндегі түсінікті интерфейс."],
    ],
    materialsEyebrow: "Пайдалы материалдар",
    materialsTitle: "Кеңеске дейін түсініп алыңыз",
    materialsLead: "Құқықтарыңызды түсініп, байыппен әрекет етуге көмектесетін күрделі тұжырымдарсыз қысқа жадынамалар.",
    materialsCards: [
      ["Жадынама", "Ұстау кезінде не істеу керек", "Алғашқы әрекеттер, қорғаушыға құқық және қарым-қатынастың маңызды ережелері."],
      ["Түсіндірме", "Адвокатты қалай таңдау керек", "Профильде неге назар аудару және келісім жасалғанға дейін қандай сұрақтар қою керек."],
      ["Тәжірибе", "Алғашқы кеңеске дайындық", "Уақытты үнемдеу үшін қандай құжаттар жинау және міндетті қалай тұжырымдау керек."],
    ],
    read: "Материалды оқу",
    faqEyebrow: "Сұрақтарға жауаптар",
    faqTitle: "Ең маңыздысы қысқаша",
    faqs: [
      ["Маманның шынымен адвокат екенін қалай тексеруге болады?", "Каталог ҚР Әділет министрлігінің ашық жиынындағы жазбаны көрсетеді. Жиында лицензияның ағымдағы мәртебесі жоқ, сондықтан келісімге дейін лицензия мен аумақтық алқаға мүшелікті салыстырыңыз."],
      ["Тегін заң көмегін алуға бола ма?", "Заңда көзделген жағдайларда көмек мемлекет есебінен көрсетілуі мүмкін. Портал қолайлы бағытты анықтап, өңіріңізден маман табуға көмектеседі."],
      ["Көмек шұғыл қажет болса не істеу керек?", "«Жедел көмек» бөлімін таңдап, өңір мен бағытты көрсетіңіз. Ұстау жағдайында қорғауға кідіріссіз жүгіну маңызды."],
      ["Менің сұрауым сайтта жариялана ма?", "Жоқ. Іздеу сұрауы жария емес. Байланыс және нақты деректер тек таңдалған маманға саналы түрде жүгінгенде беріледі."],
    ],
    ctaEyebrow: "Алғашқы қадамнан бастаңыз",
    ctaTitle: "Кәсіби қорғау қажет пе?",
    ctaText: "Өңір мен міндетті таңдаңыз — портал адвокатқа апаратын түсінікті жолды көрсетеді.",
    ctaButton: "Адвокат таңдау",
    footerTitle: "Қазақстан Республикасының адвокаттар алқалары",
    footerText: "Кәсіби заң көмегіне заманауи цифрлық қолжетімділік.",
    footerCols: ["Азаматтарға", "Адвокаттарға", "Ақпарат"],
    footerLinks: [
      ["Адвокат табу", "Тегін көмек", "Мәртебені тексеру"],
      ["Жеке кабинет", "Кәсіптік стандарттар", "Құжаттар"],
      ["Портал туралы", "Жаңалықтар", "Байланыстар"],
    ],
    rights: "© 2026 Қазақстан адвокаттар алқаларының бірыңғай порталы",
    demo: "Каталог: ҚР Әділет министрлігінің ашық деректері · 08.07.2025",
  },
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const t = copy[locale];

  const selectedRegion = useMemo(
    () => regions.find((item) => item.value === region)?.[locale],
    [locale, region],
  );

  const selectedQuery = query.trim() || (locale === "ru" ? "Любое ФИО" : "Кез келген аты-жөні");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearched(true);
    const params = new URLSearchParams();
    if (region !== "all") params.set("region", region);
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
            <span className="brand-mark" aria-hidden="true">
              <ShanyrakMark />
            </span>
            <span className="brand-copy">
              <strong>{t.portal}</strong>
              <small>{t.country}</small>
            </span>
          </a>

          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Главная навигация">
            {t.nav.map((item, index) => (
              <a key={item} href={t.navHref[index]} onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="language-switch" aria-label="Выбор языка">
              <button className={locale === "kk" ? "active" : ""} onClick={() => changeLocale("kk")}>
                ҚАЗ
              </button>
              <button className={locale === "ru" ? "active" : ""} onClick={() => changeLocale("ru")}>
                РУС
              </button>
            </div>
            <a className="cabinet-button" href="/advokaty">{t.cabinet}</a>
            <button
              className={menuOpen ? "menu-button is-open" : "menu-button"}
              aria-label="Открыть меню"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span />
              <span />
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
              <strong>QAZAQSTAN</strong>
              <small>{locale === "ru" ? "20 регионов · единое правовое пространство" : "20 өңір · бірыңғай құқықтық кеңістік"}</small>
            </div>
            <div className="eyebrow light"><span />{t.eyebrow}</div>
            <h1>
              {t.titleA} <em>{t.titleAccent}</em>
              <br />
              {t.titleB}
            </h1>
            <p>{t.lead}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/advokaty">
                {t.primary}<ArrowUpRight aria-hidden="true" />
              </a>
              <a className="text-link" href="#help">
                <span className="play-icon" aria-hidden="true"><CirclePlay /></span>{t.secondary}
              </a>
            </div>
            <ul className="trust-list">
              {t.trust.map((item) => <li key={item}><span><ShieldCheck /></span>{item}</li>)}
            </ul>
          </div>

          <form className="search-card" onSubmit={submitSearch}>
            <div className="search-card-top">
              <span>{t.searchLabel}</span>
              <span className="status-dot">ONLINE</span>
            </div>
            <h2>{t.searchTitle}</h2>
            <label>
              <span>{t.region}</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                {regions.map((item) => <option key={item.value} value={item.value}>{item[locale]}</option>)}
              </select>
            </label>
            <label>
              <span>{t.practice}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.queryPlaceholder} />
            </label>
            <button className="search-submit" type="submit">
              <Search className="search-icon" aria-hidden="true" />{t.show}<ArrowRight aria-hidden="true" />
            </button>
            <p className="form-hint"><Clock3 />{t.hint}</p>
            {searched && (
              <div className="search-feedback" role="status">
                <strong>{t.resultTitle}</strong>
                <span>{selectedRegion} · {selectedQuery}</span>
              </div>
            )}
          </form>
        </div>

        <div className="shell hero-stats">
          <div><strong>{t.statOne}</strong><span>{t.statOneText}</span></div>
          <div><strong>{t.statTwo}</strong><span>{t.statTwoText}</span></div>
          <div><strong>{t.statThree}</strong><span>{t.statThreeText}</span></div>
          <div className="hero-seal" aria-hidden="true"><span>6K+</span><small>OPEN DATA</small></div>
        </div>
      </section>

      <section className="section help-section" id="help">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <div className="eyebrow"><span />{t.helpEyebrow}</div>
              <h2>{t.helpTitle}</h2>
            </div>
            <p>{t.helpLead}</p>
          </div>
          <div className="help-grid">
            {t.helpCards.map(([, title, description], index) => {
              return (
              <a className={index === 5 ? "help-card urgent" : "help-card"} href="/pomosh" key={title}>
                <div className={`help-icon help-icon-${index + 1}`} aria-hidden="true">
                  <span className="icon-kz-pattern" />
                  <FontAwesomeIcon icon={helpIcons[index]} />
                </div>
                <div className="help-card-copy">
                  <span className="help-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="card-link">{t.route}<ArrowRight /></span>
                </div>
              </a>
            )})}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="shell">
          <div className="section-heading process-heading">
            <div className="eyebrow"><span />{t.processEyebrow}</div>
            <h2>{t.processTitle}</h2>
            <p>{t.processLead}</p>
          </div>
          <div className="process-grid">
            {t.processSteps.map(([number, title, description], index) => (
              <article className="process-step" key={number}>
                <div className="step-top">
                  <span>{number}</span>
                  {index < t.processSteps.length - 1 && <i aria-hidden="true">→</i>}
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
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
            <h2>{t.registryTitle}</h2>
            <p>{t.registryLead}</p>
            <div className="registry-points">
              <div><span><BadgeCheck /></span>{t.verified}</div>
              <div><span><LockKeyhole /></span>{t.privacy}</div>
            </div>
          </div>
          <div className="registry-panel">
            <div className="registry-panel-head">
              <span className="directory-icon"><Search /></span>
              <div><small>{t.searchLabel}</small><strong>{selectedRegion}</strong></div>
            </div>
            <div className="filter-row">
              <label>
                <span>{t.region}</span>
                <select value={region} onChange={(event) => setRegion(event.target.value)}>
                  {regions.map((item) => <option key={item.value} value={item.value}>{item[locale]}</option>)}
                </select>
              </label>
              <label>
                <span>{t.practice}</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.queryPlaceholder} />
              </label>
            </div>
            <div className="result-preview">
              <div className="result-badge"><Check /></div>
              <div><strong>{t.resultTitle}</strong><p>{t.resultText}</p></div>
            </div>
            <a className="button button-dark" href="/advokaty">{t.resultButton}<ArrowRight /></a>
          </div>
        </div>
      </section>

      <section className="values-section" id="about">
        <div className="shell values-layout">
          <div className="values-intro">
            <div className="eyebrow light"><span />{t.aboutEyebrow}</div>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutLead}</p>
            <div className="values-emblem values-data-card" aria-hidden="true">
              <Database />
              <span>6 005</span>
              <small>OPEN DATA · 08.07.2025</small>
            </div>
          </div>
          <div className="values-grid">
            {t.values.map(([number, title, description], index) => (
              <article className="value-card" key={number}>
                <div className="value-card-top">
                  <span>{number}</span>
                  <i aria-hidden="true"><FontAwesomeIcon icon={valueIcons[index]} /></i>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="materials-section" id="materials">
        <div className="shell">
          <div className="section-heading split-heading materials-heading">
            <div>
              <div className="eyebrow"><span />{t.materialsEyebrow}</div>
              <h2>{t.materialsTitle}</h2>
            </div>
            <p>{t.materialsLead}</p>
          </div>
          <div className="materials-grid">
            {t.materialsCards.map(([tag, title, description], index) => (
              <article className="material-card" key={title}>
                <div className={`material-art art-${index + 1}`} aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i><FontAwesomeIcon icon={materialIcons[index]} /></i>
                </div>
                <div className="material-content">
                  <span className="material-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <a href="/pomosh">{t.read}<ExternalLink /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="shell faq-layout">
          <div className="faq-title">
            <div className="eyebrow"><span />{t.faqEyebrow}</div>
            <h2>{t.faqTitle}</h2>
            <div className="faq-monogram" aria-hidden="true">?</div>
          </div>
          <div className="faq-list">
            {t.faqs.map(([question, answer], index) => (
              <article className={openFaq === index ? "faq-item is-open" : "faq-item"} key={question}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{question}</strong>
                  <i>{openFaq === index ? <Minus /> : <Plus />}</i>
                </button>
                <div className="faq-answer"><p>{answer}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-orbit" aria-hidden="true" />
        <div className="shell cta-inner">
          <div>
            <div className="eyebrow light"><span />{t.ctaEyebrow}</div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
          </div>
          <a className="button button-primary" href="/advokaty">{t.ctaButton}<ArrowUpRight /></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <div className="brand footer-logo">
              <span className="brand-mark" aria-hidden="true"><ShanyrakMark /></span>
              <span className="brand-copy"><strong>{t.footerTitle}</strong><small>{t.country}</small></span>
            </div>
            <p>{t.footerText}</p>
          </div>
          {t.footerCols.map((column, index) => (
            <div className="footer-column" key={column}>
              <strong>{column}</strong>
              {t.footerLinks[index].map((link) => <a key={link} href="#top">{link}</a>)}
            </div>
          ))}
        </div>
        <div className="shell footer-bottom"><span>{t.rights}</span><span>{t.demo}</span></div>
      </footer>
    </main>
  );
}
