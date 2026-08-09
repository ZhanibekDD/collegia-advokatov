"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CirclePlay,
  Clock3,
  ExternalLink,
  Gavel,
  HeartHandshake,
  House,
  LockKeyhole,
  Minus,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  Siren,
} from "lucide-react";

type Locale = "ru" | "kk";

const regions = [
  { value: "all", ru: "Весь Казахстан", kk: "Бүкіл Қазақстан" },
  { value: "astana", ru: "Астана", kk: "Астана" },
  { value: "almaty", ru: "Алматы", kk: "Алматы" },
  { value: "shymkent", ru: "Шымкент", kk: "Шымкент" },
  { value: "jetisu", ru: "Область Жетісу", kk: "Жетісу облысы" },
  { value: "karaganda", ru: "Карагандинская область", kk: "Қарағанды облысы" },
  { value: "turkistan", ru: "Туркестанская область", kk: "Түркістан облысы" },
];

const practices = [
  { value: "all", ru: "Любая специализация", kk: "Кез келген мамандану" },
  { value: "criminal", ru: "Уголовное право", kk: "Қылмыстық құқық" },
  { value: "family", ru: "Семейное право", kk: "Отбасы құқығы" },
  { value: "business", ru: "Бизнес и налоги", kk: "Бизнес және салық" },
  { value: "civil", ru: "Гражданские споры", kk: "Азаматтық даулар" },
  { value: "property", ru: "Недвижимость", kk: "Жылжымайтын мүлік" },
];

const helpIcons = [Gavel, HeartHandshake, BriefcaseBusiness, House, Scale, Siren];

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
    lead: "Найдите адвоката по специализации и региону, проверьте его статус и получите понятный маршрут правовой помощи.",
    primary: "Найти адвоката",
    secondary: "Как получить помощь",
    trust: ["Конфиденциально", "Проверяемый статус", "Все регионы РК"],
    searchLabel: "Поиск по единому каталогу",
    searchTitle: "Кому доверить защиту?",
    region: "Регион",
    practice: "Направление права",
    show: "Показать подходящих адвокатов",
    hint: "Поиск займёт меньше минуты",
    statOne: "17 регионов",
    statOneText: "единая точка доступа",
    statTwo: "2 языка",
    statTwoText: "қазақша и русский",
    statThree: "3 шага",
    statThreeText: "до обращения",
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
    registryLead: "Фильтруйте по региону и направлению. В профиле будут указаны статус, опыт, языки и контакты.",
    verified: "Статус проверяется по реестру",
    privacy: "Ваш запрос не публикуется и не передаётся третьим лицам",
    resultTitle: "Маршрут поиска подготовлен",
    resultText: "Показываем специалистов по выбранному региону и направлению. Каталог готов к подключению реальных данных коллегии.",
    resultButton: "Перейти к результатам",
    processEyebrow: "Понятный процесс",
    processTitle: "От вопроса до защиты — три простых шага",
    processLead: "Портал помогает быстро сориентироваться, выбрать специалиста и начать работу без лишней бюрократии.",
    processSteps: [
      ["01", "Опишите ситуацию", "Выберите регион и направление права. Персональные детали на первом шаге не нужны."],
      ["02", "Сравните специалистов", "Проверьте специализацию, опыт, языки работы и актуальный статус адвоката."],
      ["03", "Свяжитесь напрямую", "Выберите удобный способ связи и договоритесь о консультации или срочной защите."],
    ],
    aboutEyebrow: "Профессиональные гарантии",
    aboutTitle: "Система, в центре которой — доверие человека",
    aboutLead: "Цифровой портал объединяет доступ к региональным коллегиям, понятные стандарты профессии и безопасный поиск правовой помощи.",
    values: [
      ["01", "Независимость", "Адвокат защищает права и законные интересы доверителя независимо и профессионально."],
      ["02", "Конфиденциальность", "Обращение и содержание консультации защищены принципом адвокатской тайны."],
      ["03", "Проверяемость", "Профиль позволяет увидеть специализацию и проверить актуальность профессионального статуса."],
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
      ["Как проверить, что специалист действительно является адвокатом?", "В профиле специалиста отображается профессиональный статус. Перед заключением соглашения его можно дополнительно сверить с данными соответствующей территориальной коллегии."],
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
    demo: "Демонстрационная версия интерфейса",
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
    lead: "Мамандану мен аймақ бойынша адвокат табыңыз, мәртебесін тексеріңіз және құқықтық көмектің түсінікті бағытын алыңыз.",
    primary: "Адвокат табу",
    secondary: "Көмекті қалай алуға болады",
    trust: ["Құпия", "Тексерілетін мәртебе", "ҚР барлық өңірлері"],
    searchLabel: "Бірыңғай каталог бойынша іздеу",
    searchTitle: "Қорғауды кімге сеніп тапсыру керек?",
    region: "Өңір",
    practice: "Құқық саласы",
    show: "Сәйкес адвокаттарды көрсету",
    hint: "Іздеу бір минуттан аз уақыт алады",
    statOne: "17 өңір",
    statOneText: "бірыңғай қолжетімділік нүктесі",
    statTwo: "2 тіл",
    statTwoText: "қазақша және орысша",
    statThree: "3 қадам",
    statThreeText: "өтінішке дейін",
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
    registryLead: "Өңір мен бағыт бойынша сүзгілеңіз. Профильде мәртебе, тәжірибе, тілдер мен байланыстар көрсетіледі.",
    verified: "Мәртебе тізілім бойынша тексеріледі",
    privacy: "Сұрауыңыз жарияланбайды және үшінші тұлғаларға берілмейді",
    resultTitle: "Іздеу бағыты дайындалды",
    resultText: "Таңдалған өңір мен бағыт бойынша мамандарды көрсетеміз. Каталог алқаның нақты деректерін қосуға дайын.",
    resultButton: "Нәтижелерге өту",
    processEyebrow: "Түсінікті үдеріс",
    processTitle: "Сұрақтан қорғауға дейін — үш қарапайым қадам",
    processLead: "Портал жағдайды тез бағалауға, маман таңдауға және артық бюрократиясыз жұмысты бастауға көмектеседі.",
    processSteps: [
      ["01", "Жағдайды сипаттаңыз", "Өңір мен құқық саласын таңдаңыз. Бірінші қадамда жеке мәліметтер қажет емес."],
      ["02", "Мамандарды салыстырыңыз", "Мамандануын, тәжірибесін, жұмыс тілдерін және адвокаттың өзекті мәртебесін тексеріңіз."],
      ["03", "Тікелей байланысыңыз", "Қолайлы байланыс тәсілін таңдап, кеңес немесе жедел қорғау туралы келісіңіз."],
    ],
    aboutEyebrow: "Кәсіби кепілдіктер",
    aboutTitle: "Орталығында адам сенімі тұрған жүйе",
    aboutLead: "Цифрлық портал өңірлік алқаларға қолжетімділікті, кәсіптің түсінікті стандарттарын және құқықтық көмекті қауіпсіз іздеуді біріктіреді.",
    values: [
      ["01", "Тәуелсіздік", "Адвокат сенім білдірушінің құқықтары мен заңды мүдделерін тәуелсіз әрі кәсіби қорғайды."],
      ["02", "Құпиялылық", "Өтініш пен кеңес мазмұны адвокаттық құпия қағидатымен қорғалады."],
      ["03", "Тексерілу мүмкіндігі", "Профиль мамандануды көруге және кәсіби мәртебенің өзектілігін тексеруге мүмкіндік береді."],
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
      ["Маманның шынымен адвокат екенін қалай тексеруге болады?", "Маман профилінде кәсіби мәртебе көрсетіледі. Келісім жасамас бұрын оны тиісті аумақтық алқаның деректерімен қосымша салыстыруға болады."],
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
    demo: "Интерфейстің демонстрациялық нұсқасы",
  },
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [region, setRegion] = useState("all");
  const [practice, setPractice] = useState("all");
  const [searched, setSearched] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const t = copy[locale];

  const selectedRegion = useMemo(
    () => regions.find((item) => item.value === region)?.[locale],
    [locale, region],
  );

  const selectedPractice = useMemo(
    () => practices.find((item) => item.value === practice)?.[locale],
    [locale, practice],
  );

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearched(true);
    const params = new URLSearchParams();
    const regionMap: Record<string, string> = {
      astana: "г. Астана",
      almaty: "г. Алматы",
      shymkent: "г. Шымкент",
      jetisu: "Область Жетісу",
      karaganda: "Карагандинская область",
      turkistan: "Туркестанская область",
    };
    const practiceMap: Record<string, string> = {
      criminal: "Уголовное право",
      family: "Семейное право",
      business: "Бизнес и налоги",
      civil: "Гражданские споры",
      property: "Недвижимость",
    };
    if (region !== "all") params.set("region", regionMap[region] ?? region);
    if (practice !== "all") params.set("practice", practiceMap[practice] ?? practice);
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
              <span>Қ</span>
              <i />
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
              <select value={practice} onChange={(event) => setPractice(event.target.value)}>
                {practices.map((item) => <option key={item.value} value={item.value}>{item[locale]}</option>)}
              </select>
            </label>
            <button className="search-submit" type="submit">
              <Search className="search-icon" aria-hidden="true" />{t.show}<ArrowRight aria-hidden="true" />
            </button>
            <p className="form-hint"><Clock3 />{t.hint}</p>
            {searched && (
              <div className="search-feedback" role="status">
                <strong>{t.resultTitle}</strong>
                <span>{selectedRegion} · {selectedPractice}</span>
              </div>
            )}
          </form>
        </div>

        <div className="shell hero-stats">
          <div><strong>{t.statOne}</strong><span>{t.statOneText}</span></div>
          <div><strong>{t.statTwo}</strong><span>{t.statTwoText}</span></div>
          <div><strong>{t.statThree}</strong><span>{t.statThreeText}</span></div>
          <div className="hero-seal" aria-hidden="true"><span>ҚА</span><small>KZ</small></div>
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
              const HelpIcon = helpIcons[index];
              return (
              <a className={index === 5 ? "help-card urgent" : "help-card"} href="/pomosh" key={title}>
                <div className="help-icon"><HelpIcon /></div>
                <div>
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
                <select value={practice} onChange={(event) => setPractice(event.target.value)}>
                  {practices.map((item) => <option key={item.value} value={item.value}>{item[locale]}</option>)}
                </select>
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
            <div className="values-emblem" aria-hidden="true">
              <span>ҚА</span>
              <small>ADVOKATURA · KAZAKHSTAN</small>
            </div>
          </div>
          <div className="values-grid">
            {t.values.map(([number, title, description]) => (
              <article className="value-card" key={number}>
                <span>{number}</span>
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
                  <i>§</i>
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
              <span className="brand-mark"><span>Қ</span><i /></span>
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
