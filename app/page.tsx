"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Clock3,
  FileCheck2,
  Gavel,
  Globe2,
  Handshake,
  Home,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Scale,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { ShanyrakMark } from "./components/shanyrak-mark";
import {
  ZHETISU_REGION,
  type AdvocateDirectory,
  type Locale,
  type OfficialAdvocate,
} from "./lib/portal-data";

const serviceIcons = [Gavel, UsersRound, BriefcaseBusiness, Handshake, Home];

const copy = {
  ru: {
    name: "Коллегия адвокатов области Жетісу",
    nameKk: "ЖЕТІСУ ОБЛЫСТЫҚ АДВОКАТТАР АЛҚАСЫ",
    nav: [
      ["Главная", "#top"],
      ["О коллегии", "#about"],
      ["Адвокаты", "#advocates"],
      ["Правовая помощь", "#help"],
      ["Новости", "#resources"],
      ["Документы", "#resources"],
      ["Контакты", "#contacts"],
    ],
    heroTitleA: "Профессиональная",
    heroTitleB: "правовая помощь",
    heroTitleC: "в области Жетісу",
    heroLead:
      "Найдите своего адвоката среди профессионалов региона и получите квалифицированную юридическую помощь в любых правовых вопросах.",
    findLawyer: "Найти адвоката",
    getHelp: "Получить помощь",
    searchTitle: "Поиск адвоката",
    searchLead: "Найдите адвоката по имени, фамилии или номеру лицензии",
    advanced: "Расширенный поиск",
    namePlaceholder: "Фамилия, имя или отчество",
    licensePlaceholder: "Номер лицензии",
    cityPlaceholder: "Город",
    find: "Найти",
    stats: [
      ["адвокатов", "в области Жетісу"],
      ["Официальные данные", "из открытого набора Минюста РК"],
      ["Двуязычная поддержка", "қазақша / русский"],
      ["Вся область Жетісу", "города и районы"],
    ],
    advocatesTitle: "Адвокаты области Жетісу",
    allLawyers: "Смотреть всех адвокатов",
    license: "Лицензия",
    source: "Открытые данные",
    profile: "Профиль",
    call: "Позвонить",
    write: "Написать",
    helpTitle: "Правовая помощь",
    services: [
      ["Уголовное право", "Защита на всех стадиях уголовного процесса"],
      ["Семейное право", "Развод, алименты, раздел имущества, опека"],
      ["Бизнес и налоги", "Сопровождение бизнеса и экономических споров"],
      ["Гражданские споры", "Защита прав и законных интересов в суде"],
      ["Недвижимость", "Сделки, споры и регистрация прав"],
    ],
    aboutTitle: "О коллегии",
    aboutText:
      "Коллегия адвокатов области Жетісу — профессиональное объединение адвокатов региона, созданное для защиты прав и законных интересов граждан и организаций.",
    aboutText2:
      "Портал помогает быстро найти адвоката, проверить опубликованные сведения и перейти к удобному способу связи.",
    more: "Подробнее о коллегии",
    contactsTitle: "Контакты",
    address: "г. Талдыкорган, ул. Каблиса жырау, 69",
    hours: "Пн – Пт: 09:00 – 18:00",
    resourcesTitle: "Полезно знать",
    resources: [
      "Как выбрать адвоката",
      "Что делать при задержании",
      "Как подготовиться к консультации",
    ],
    footerCols: [
      ["Коллегия", "О коллегии", "Руководство", "Структура", "Контакты"],
      ["Адвокатам", "Каталог адвокатов", "Документы", "Этические принципы", "Открытые данные"],
      ["Полезное", "Правовая помощь", "Вопросы и ответы", "Новости", "Материалы"],
    ],
    needHelp: "Нужна юридическая помощь?",
    consultation: "Получить консультацию",
    rights: "© 2026 Коллегия адвокатов области Жетісу",
  },
  kk: {
    name: "Жетісу облыстық адвокаттар алқасы",
    nameKk: "ЖЕТІСУ ОБЛЫСТЫҚ АДВОКАТТАР АЛҚАСЫ",
    nav: [
      ["Басты бет", "#top"],
      ["Алқа туралы", "#about"],
      ["Адвокаттар", "#advocates"],
      ["Құқықтық көмек", "#help"],
      ["Жаңалықтар", "#resources"],
      ["Құжаттар", "#resources"],
      ["Байланыс", "#contacts"],
    ],
    heroTitleA: "Кәсіби",
    heroTitleB: "құқықтық көмек",
    heroTitleC: "Жетісу облысында",
    heroLead:
      "Өңірдің кәсіби адвокаттарының арасынан қажетті маманды тауып, кез келген құқықтық мәселе бойынша білікті көмек алыңыз.",
    findLawyer: "Адвокат табу",
    getHelp: "Көмек алу",
    searchTitle: "Адвокат іздеу",
    searchLead: "Адвокатты аты-жөні немесе лицензия нөмірі бойынша табыңыз",
    advanced: "Кеңейтілген іздеу",
    namePlaceholder: "Тегі, аты, әкесінің аты",
    licensePlaceholder: "Лицензия нөмірі",
    cityPlaceholder: "Қала",
    find: "Табу",
    stats: [
      ["адвокат", "Жетісу облысында"],
      ["Ресми деректер", "ҚР Әділет министрлігінің ашық деректері"],
      ["Екі тілде қолдау", "қазақша / русский"],
      ["Бүкіл Жетісу облысы", "қалалар мен аудандар"],
    ],
    advocatesTitle: "Жетісу облысының адвокаттары",
    allLawyers: "Барлық адвокаттарды көру",
    license: "Лицензия",
    source: "Ашық деректер",
    profile: "Профиль",
    call: "Қоңырау",
    write: "Жазу",
    helpTitle: "Құқықтық көмек",
    services: [
      ["Қылмыстық құқық", "Қылмыстық процестің барлық сатысында қорғау"],
      ["Отбасы құқығы", "Ажырасу, алимент, мүлік бөлу, қамқоршылық"],
      ["Бизнес және салық", "Бизнесті және экономикалық дауларды сүйемелдеу"],
      ["Азаматтық даулар", "Сотта құқықтар мен заңды мүдделерді қорғау"],
      ["Жылжымайтын мүлік", "Мәмілелер, даулар және құқықтарды тіркеу"],
    ],
    aboutTitle: "Алқа туралы",
    aboutText:
      "Жетісу облыстық адвокаттар алқасы — азаматтар мен ұйымдардың құқықтары мен заңды мүдделерін қорғау үшін құрылған өңір адвокаттарының кәсіби бірлестігі.",
    aboutText2:
      "Портал адвокатты жылдам табуға, жарияланған мәліметтерді тексеруге және қолайлы байланыс тәсіліне өтуге көмектеседі.",
    more: "Алқа туралы толығырақ",
    contactsTitle: "Байланыс",
    address: "Талдықорған қ., Қаблиса жырау көш., 69",
    hours: "Дс – Жм: 09:00 – 18:00",
    resourcesTitle: "Пайдалы ақпарат",
    resources: [
      "Адвокатты қалай таңдау керек",
      "Ұстау кезінде не істеу керек",
      "Кеңеске қалай дайындалу керек",
    ],
    footerCols: [
      ["Алқа", "Алқа туралы", "Басшылық", "Құрылым", "Байланыс"],
      ["Адвокаттарға", "Адвокаттар каталогы", "Құжаттар", "Әдеп қағидаттары", "Ашық деректер"],
      ["Пайдалы", "Құқықтық көмек", "Сұрақтар мен жауаптар", "Жаңалықтар", "Материалдар"],
    ],
    needHelp: "Құқықтық көмек қажет пе?",
    consultation: "Кеңес алу",
    rights: "© 2026 Жетісу облыстық адвокаттар алқасы",
  },
};

function extractPhone(value: string) {
  const match = value.match(/(?:\+?7|8)[\s()\-]*\d{3}[\s()\-]*\d{3}[\s()\-]*\d{2}[\s()\-]*\d{2}/);
  if (!match) return null;
  let digits = match[0].replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  return digits.length === 11 && digits.startsWith("7") ? digits : null;
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [advocates, setAdvocates] = useState<OfficialAdvocate[]>([]);
  const [nameQuery, setNameQuery] = useState("");
  const [licenseQuery, setLicenseQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const t = copy[locale];

  useEffect(() => {
    let active = true;
    fetch("/data/advocates.json")
      .then((response) => response.json() as Promise<AdvocateDirectory>)
      .then((result) => {
        if (!active) return;
        const scoped = result.advocates
          .filter((item) => item.region === ZHETISU_REGION)
          .sort((a, b) => a.name.localeCompare(b.name, "ru"));
        setAdvocates(scoped);
      })
      .catch(() => setAdvocates([]));
    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(() => advocates.slice(0, 3), [advocates]);
  const cityOptions = useMemo(() => {
    const cities = new Set<string>();
    for (const advocate of advocates) {
      const match = advocate.address.match(/(?:г\.|город\s+)([А-ЯA-ZӘІҢҒҮҰҚӨҺЁа-яa-zәіңғүұқөһё-]+)/i);
      if (match?.[1]) cities.add(match[1]);
    }
    return [...cities].sort((a, b) => a.localeCompare(b, "ru")).slice(0, 20);
  }, [advocates]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const q = nameQuery.trim() || licenseQuery.trim() || cityQuery.trim();
    if (q) params.set("q", q);
    window.location.assign(`/advokaty${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <main className="jetisu-premium" id="top">
      <header className="jp-header">
        <div className="jp-shell jp-header-inner">
          <a className="jp-brand" href="#top" aria-label={t.name}>
            <span className="jp-emblem"><ShanyrakMark /></span>
            <span className="jp-brand-text">
              <strong>{t.nameKk}</strong>
              <small>{t.name}</small>
            </span>
          </a>

          <nav className={menuOpen ? "jp-nav is-open" : "jp-nav"} aria-label="Навигация">
            {t.nav.map(([label, href], index) => (
              <a className={index === 0 ? "active" : ""} href={href} key={label} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
          </nav>

          <div className="jp-header-actions">
            <div className="jp-language">
              <button onClick={() => setLocale("kk")} className={locale === "kk" ? "active" : ""}>ҚАЗ</button>
              <span>/</span>
              <button onClick={() => setLocale("ru")} className={locale === "ru" ? "active" : ""}>РУС</button>
            </div>
            <button className="jp-menu" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Открыть меню" aria-expanded={menuOpen}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <section className="jp-hero">
        <div className="jp-hero-pattern" aria-hidden="true" />
        <div className="jp-hero-art" aria-hidden="true" />
        <div className="jp-shell jp-hero-inner">
          <div className="jp-hero-copy">
            <span className="jp-kicker">{locale === "ru" ? "Профессиональная адвокатура региона" : "Өңірдің кәсіби адвокатурасы"}</span>
            <h1>{t.heroTitleA}<br />{t.heroTitleB}<br /><em>{t.heroTitleC}</em></h1>
            <p>{t.heroLead}</p>
            <div className="jp-hero-actions">
              <a className="jp-button jp-button-gold" href="#search"><UserRound />{t.findLawyer}</a>
              <a className="jp-button jp-button-outline" href="/pomosh"><ShieldCheck />{t.getHelp}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="jp-search-wrap" id="search">
        <div className="jp-shell">
          <form className="jp-search-card" onSubmit={submitSearch}>
            <div className="jp-search-head">
              <div><h2>{t.searchTitle}</h2><p>{t.searchLead}</p></div>
              <a href="/advokaty"><Search />{t.advanced}</a>
            </div>
            <div className="jp-search-grid">
              <label><UserRound /><input value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} placeholder={t.namePlaceholder} /></label>
              <label><ShieldCheck /><input value={licenseQuery} onChange={(e) => setLicenseQuery(e.target.value)} placeholder={t.licensePlaceholder} /></label>
              <label><MapPin /><select value={cityQuery} onChange={(e) => setCityQuery(e.target.value)}><option value="">{t.cityPlaceholder}</option>{cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}</select><ChevronDown className="jp-select-arrow" /></label>
              <button type="submit" className="jp-search-button"><Search />{t.find}</button>
            </div>
          </form>
        </div>
      </section>

      <section className="jp-stats">
        <div className="jp-shell jp-stats-grid">
          <div className="jp-stat"><UsersRound /><div><strong>{advocates.length || "—"}</strong><span>{t.stats[0][0]}</span><small>{t.stats[0][1]}</small></div></div>
          <div className="jp-stat"><Building2 /><div><strong>{t.stats[1][0]}</strong><small>{t.stats[1][1]}</small></div></div>
          <div className="jp-stat"><Globe2 /><div><strong>{t.stats[2][0]}</strong><small>{t.stats[2][1]}</small></div></div>
          <div className="jp-stat"><MapPin /><div><strong>{t.stats[3][0]}</strong><small>{t.stats[3][1]}</small></div></div>
        </div>
      </section>

      <section className="jp-section jp-advocates" id="advocates">
        <div className="jp-shell">
          <div className="jp-section-head"><div><span className="jp-section-rule" /><h2>{t.advocatesTitle}</h2></div><a href="/advokaty">{t.allLawyers}<ArrowRight /></a></div>
          <div className="jp-advocate-grid">
            {featured.map((advocate, index) => {
              const phone = extractPhone(advocate.contacts);
              return (
                <article className="jp-advocate-card" key={advocate.id}>
                  <div className={`jp-portrait portrait-${index + 1}`}><span>{advocate.initials || "JE"}</span><small>{t.source}</small></div>
                  <div className="jp-advocate-info">
                    <h3>{advocate.name}</h3>
                    <p>{t.license} № {advocate.licenseNumber || "—"}</p>
                    <span className="jp-location"><MapPin />{advocate.address || (locale === "ru" ? "Область Жетісу" : "Жетісу облысы")}</span>
                    <div className="jp-tags"><span><BadgeCheck />{locale === "ru" ? "Запись Минюста РК" : "ҚР Әділет министрлігі"}</span><span><FileCheck2 />{locale === "ru" ? "Членство в коллегии" : "Алқа мүшелігі"}</span></div>
                  </div>
                  <div className="jp-card-actions"><a href={`/advokaty/${advocate.id}`}><UserRound />{t.profile}</a>{phone && <a href={`tel:+${phone}`}><Phone />{t.call}</a>}{phone && <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer"><Mail />{t.write}</a>}</div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="jp-section jp-help" id="help">
        <div className="jp-shell">
          <div className="jp-section-head"><div><span className="jp-section-rule" /><h2>{t.helpTitle}</h2></div></div>
          <div className="jp-service-grid">
            {t.services.map(([title, description], index) => {
              const Icon = serviceIcons[index];
              return <a className="jp-service-card" href="/pomosh" key={title}><Icon /><h3>{title}</h3><p>{description}</p><ArrowRight className="jp-service-arrow" /></a>;
            })}
          </div>
        </div>
      </section>

      <section className="jp-info-section" id="about">
        <div className="jp-shell jp-info-grid">
          <article className="jp-about-card"><div className="jp-ornament" aria-hidden="true">✦</div><span className="jp-section-rule" /><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p><p>{t.aboutText2}</p><a className="jp-dark-cta" href="/regions">{t.more}<ArrowRight /></a></article>
          <article className="jp-contact-card" id="contacts"><span className="jp-section-rule" /><h2>{t.contactsTitle}</h2><ul><li><MapPin /><span>{t.address}</span></li><li><Phone /><a href="tel:+77282244033">8 (7282) 24-40-33</a></li><li><Mail /><a href="mailto:advokatura-tk@bk.ru">advokatura-tk@bk.ru</a></li><li><Clock3 /><span>{t.hours}</span></li></ul></article>
          <div className="jp-building-card" aria-label={locale === "ru" ? "Декоративная визуализация административного здания" : "Әкімшілік ғимараттың декоративтік визуализациясы"}><div className="jp-building-label">{locale === "ru" ? "Контакты коллегии" : "Алқа байланыстары"}</div></div>
        </div>
      </section>

      <section className="jp-resources" id="resources">
        <div className="jp-shell">
          <div className="jp-section-head"><div><span className="jp-section-rule" /><h2>{t.resourcesTitle}</h2></div></div>
          <div className="jp-resource-grid">{t.resources.map((item, index) => <a href="/pomosh" key={item}><span>0{index + 1}</span><strong>{item}</strong><ArrowRight /></a>)}</div>
        </div>
      </section>

      <footer className="jp-footer">
        <div className="jp-shell jp-footer-grid">
          <div className="jp-footer-brand"><div className="jp-brand"><span className="jp-emblem"><ShanyrakMark /></span><span className="jp-brand-text"><strong>{t.nameKk}</strong><small>{t.name}</small></span></div><p>{locale === "ru" ? "Профессиональная правовая помощь в области Жетісу." : "Жетісу облысындағы кәсіби құқықтық көмек."}</p></div>
          {t.footerCols.map(([heading, ...links]) => <div className="jp-footer-col" key={heading}><strong>{heading}</strong>{links.map((link) => <a href="#top" key={link}>{link}</a>)}</div>)}
          <div className="jp-footer-cta"><Scale /><strong>{t.needHelp}</strong><a href="/pomosh">{t.consultation}</a></div>
        </div>
        <div className="jp-shell jp-footer-bottom"><span>{t.rights}</span><span>{locale === "ru" ? "Открытые данные · Минюст РК" : "Ашық деректер · ҚР Әділет министрлігі"}</span></div>
      </footer>
    </main>
  );
}
