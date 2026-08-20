"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useState } from "react";
import type { Locale } from "../lib/portal-data";
import { Database, ExternalLink, Menu, X } from "lucide-react";
import { ShanyrakMark } from "./shanyrak-mark";

const nav = {
  ru: [
    ["Адвокаты", "/advokaty"],
    ["Получить помощь", "/pomosh"],
    ["О коллегии", "/regions"],
    ["Главная", "/"],
  ],
  kk: [
    ["Адвокаттар", "/advokaty"],
    ["Көмек алу", "/pomosh"],
    ["Алқа туралы", "/regions"],
    ["Басты бет", "/"],
  ],
};

export function PortalHeader({ locale, onLocaleChange }: { locale: Locale; onLocaleChange: (locale: Locale) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="portal-header">
      <div className="shell portal-header-inner">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true"><ShanyrakMark /></span>
          <span className="brand-copy">
            <strong>{locale === "ru" ? "Коллегия адвокатов области Жетісу" : "Жетісу облыстық адвокаттар алқасы"}</strong>
            <small>{locale === "ru" ? "Область Жетісу · Республика Казахстан" : "Жетісу облысы · Қазақстан Республикасы"}</small>
          </span>
        </a>
        <nav className={menuOpen ? "portal-nav is-open" : "portal-nav"} aria-label="Навигация">
          {nav[locale].map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="portal-header-actions">
          <div className="language-switch">
            <button className={locale === "kk" ? "active" : ""} onClick={() => onLocaleChange("kk")}>ҚАЗ</button>
            <button className={locale === "ru" ? "active" : ""} onClick={() => onLocaleChange("ru")}>РУС</button>
          </div>
          <button
            className="portal-menu-button"
            type="button"
            aria-label={locale === "ru" ? "Открыть меню" : "Мәзірді ашу"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function PortalFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="portal-footer">
      <div className="shell portal-footer-inner">
        <div className="brand footer-logo">
          <span className="brand-mark" aria-hidden="true"><ShanyrakMark /></span>
          <span className="brand-copy">
            <strong>{locale === "ru" ? "Коллегия адвокатов области Жетісу" : "Жетісу облыстық адвокаттар алқасы"}</strong>
            <small>{locale === "ru" ? "Цифровой доступ к правовой помощи в области Жетісу" : "Жетісу облысындағы құқықтық көмекке цифрлық қолжетімділік"}</small>
          </span>
        </div>
        <div className="portal-footer-links">
          <a href="/advokaty">{locale === "ru" ? "Найти адвоката" : "Адвокат табу"}</a>
          <a href="/pomosh">{locale === "ru" ? "Получить помощь" : "Көмек алу"}</a>
          <a href="/regions">{locale === "ru" ? "О коллегии" : "Алқа туралы"}</a>
        </div>
      </div>
      <div className="shell portal-footer-bottom">
        <span>© 2026 · Жетісу</span>
        <a href="https://data.egov.kz/datasets/view?index=advokattar_tizimi14" target="_blank" rel="noreferrer">
          {locale === "ru" ? "Источник каталога: открытые данные Минюста РК · 08.07.2025" : "Каталог дереккөзі: ҚР Әділет министрлігінің ашық деректері · 08.07.2025"}<ExternalLink />
        </a>
      </div>
    </footer>
  );
}

export function DataSourceNotice({ locale, total }: { locale: Locale; total?: number }) {
  const count = typeof total === "number" ? total.toLocaleString("ru-RU") : null;

  return (
    <div className="data-source-notice" role="note">
      <span><Database /></span>
      <div>
        <strong>
          {locale === "ru"
            ? `${count ? `${count} · ` : ""}адвокаты области Жетісу в открытом наборе Минюста РК`
            : `${count ? `${count} · ` : ""}Жетісу облысының адвокаттары ҚР Әділет министрлігінің ашық деректерінде`}
        </strong>
        <p>{locale === "ru" ? "На сайте показываются только записи, относящиеся к области Жетісу. Источник обновлён 08.07.2025 и помечен владельцем как требующий актуализации, поэтому перед заключением соглашения дополнительно проверьте статус лицензии и членство в коллегии." : "Сайтта тек Жетісу облысына қатысты жазбалар көрсетіледі. Дереккөз 08.07.2025 жаңартылған және өзектендіруді қажет етеді деп белгіленген, сондықтан келісім жасамас бұрын лицензия мәртебесі мен алқаға мүшелікті қосымша тексеріңіз."}</p>
      </div>
      <a href="https://data.egov.kz/datasets/view?index=advokattar_tizimi14" target="_blank" rel="noreferrer">
        {locale === "ru" ? "Открыть источник" : "Дереккөзді ашу"}<ExternalLink />
      </a>
    </div>
  );
}
