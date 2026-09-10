"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Database, ExternalLink, Mail, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import {
  ASSOCIATION,
  RKA_TERRITORIAL_ASSOCIATIONS_URL,
  formatDirectoryDate,
  type Locale,
} from "../lib/portal-data";
import { ShanyrakMark } from "./shanyrak-mark";
import { BackToTop, PortalAtmosphere, PortalCommand, RouteTransition, SectionNavigator } from "./portal-experience";
import { MotionController } from "./motion-stage";

const nav = {
  ru: [
    ["Главная", "/"],
    ["Адвокаты", "/advokaty"],
    ["Юр. консультации", "/konsultacii"],
    ["Новости", "/novosti"],
    ["Правовая помощь", "/pomosh"],
    ["О коллегии", "/regions"],
  ],
  kk: [
    ["Басты бет", "/"],
    ["Адвокаттар", "/advokaty"],
    ["Заң консультациялары", "/konsultacii"],
    ["Жаңалықтар", "/novosti"],
    ["Құқықтық көмек", "/pomosh"],
    ["Алқа туралы", "/regions"],
  ],
};

function AssociationBrand({ locale }: { locale: Locale }) {
  return (
    <span className="brand-lockup">
      <span className="logo-slot" data-logo-slot="replace-with-approved-logo">
        <ShanyrakMark />
      </span>
      <span className="brand-copy">
        <strong>{ASSOCIATION.domain}</strong>
        <small>{ASSOCIATION.name[locale]}</small>
      </span>
    </span>
  );
}

export function PortalHeader({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">{locale === "ru" ? "Перейти к содержанию" : "Мазмұнға өту"}</a>
      <MotionController />
      <RouteTransition />
      <PortalAtmosphere />
      <BackToTop locale={locale} />
      {pathname === "/" && <SectionNavigator locale={locale} />}
      <div className="service-bar">
        <div className="shell service-bar-inner">
          <span><ShieldCheck />{locale === "ru" ? "Региональный портал адвокатуры" : "Өңірлік адвокатура порталы"}</span>
          <span>{locale === "ru" ? "Область Жетісу" : "Жетісу облысы"}</span>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Link className="site-brand" href="/" aria-label={ASSOCIATION.name[locale]} onClick={() => setMenuOpen(false)}>
            <AssociationBrand locale={locale} />
          </Link>

          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label={locale === "ru" ? "Основная навигация" : "Негізгі навигация"}>
            {nav[locale].map(([label, href]) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link className={active ? "active" : ""} href={href} key={href} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <PortalCommand locale={locale} />
            <div className="language-switch" aria-label={locale === "ru" ? "Выбор языка" : "Тілді таңдау"}>
              <button type="button" className={locale === "kk" ? "active" : ""} aria-pressed={locale === "kk"} onClick={() => onLocaleChange("kk")}>ҚАЗ</button>
              <button type="button" className={locale === "ru" ? "active" : ""} aria-pressed={locale === "ru"} onClick={() => onLocaleChange("ru")}>РУС</button>
            </div>
            <button className="menu-button" type="button" aria-label={menuOpen ? (locale === "ru" ? "Закрыть меню" : "Мәзірді жабу") : (locale === "ru" ? "Открыть меню" : "Мәзірді ашу")} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export function DataSourceNotice({ locale, total, ggupTotal }: { locale: Locale; total?: number; ggupTotal?: number }) {
  const count = typeof total === "number" ? total.toLocaleString("ru-RU") : "—";
  const ggupCount = typeof ggupTotal === "number" ? ggupTotal.toLocaleString("ru-RU") : "—";
  return (
    <aside className="source-notice" aria-label={locale === "ru" ? "Источник списка" : "Тізім дереккөзі"}>
      <span className="source-icon"><Database /></span>
      <div>
        <strong>
          {locale === "ru"
            ? `${count} адвокатов · ${ggupCount} участников ГГЮП 2026`
            : `${count} адвокат · 2026 жылғы МКБЗК-ға ${ggupCount} қатысушы`}
        </strong>
        <p>
          {locale === "ru"
            ? `ФИО и контакты — из общего списка КАОЖ на ${formatDirectoryDate(locale)}; отметка ГГЮП — из списка за январь 2026 года. Лицензию рекомендуется дополнительно проверить в официальных источниках.`
            : `Аты-жөні мен байланыстар — ${formatDirectoryDate(locale)} күнгі КАОЖ жалпы тізімінен; МКБЗК белгісі — 2026 жылғы қаңтар тізімінен. Лицензияны ресми дереккөздерден қосымша тексеру ұсынылады.`}
        </p>
      </div>
      <a href={RKA_TERRITORIAL_ASSOCIATIONS_URL} target="_blank" rel="noreferrer">
        {locale === "ru" ? "Проверить в РКА" : "РАА-да тексеру"}<ExternalLink />
      </a>
    </aside>
  );
}

export function PortalFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <AssociationBrand locale={locale} />
          <p>{locale === "ru" ? "Официальная информация, актуальный состав и подразделения коллегии." : "Алқаның ресми ақпараты, өзекті құрамы және бөлімшелері."}</p>
        </div>
        <div className="footer-column">
          <strong>{locale === "ru" ? "Разделы" : "Бөлімдер"}</strong>
          <Link href="/advokaty">{locale === "ru" ? "Список адвокатов" : "Адвокаттар тізімі"}</Link>
          <Link href="/konsultacii">{locale === "ru" ? "Юридические консультации" : "Заң консультациялары"}</Link>
          <Link href="/novosti">{locale === "ru" ? "Новости и мероприятия" : "Жаңалықтар мен іс-шаралар"}</Link>
          <Link href="/regions">{locale === "ru" ? "О коллегии" : "Алқа туралы"}</Link>
        </div>
        <div className="footer-column footer-contacts">
          <strong>{locale === "ru" ? "Приёмная коллегии" : "Алқа қабылдауы"}</strong>
          <span><MapPin />{ASSOCIATION.address[locale]}</span>
          <a href={`tel:${ASSOCIATION.phoneHref}`}><Phone />{ASSOCIATION.phone}</a>
          <a href={`mailto:${ASSOCIATION.email}`}><Mail />{ASSOCIATION.email}</a>
        </div>
        <div className="footer-domain">
          <small>{locale === "ru" ? "Будущий адрес сайта" : "Сайттың болашақ мекенжайы"}</small>
          <strong>{ASSOCIATION.domain}</strong>
          <p>{locale === "ru" ? "Отдельный номер для обращений будет добавлен после согласования." : "Өтініштерге арналған жеке нөмір келісілгеннен кейін қосылады."}</p>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 {ASSOCIATION.name[locale]}</span>
        <span>{locale === "ru" ? `БИН ${ASSOCIATION.bin}` : `БСН ${ASSOCIATION.bin}`}</span>
      </div>
    </footer>
  );
}
