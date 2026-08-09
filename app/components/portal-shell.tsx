"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import type { Locale } from "../lib/portal-data";
import { Database, ExternalLink, Scale } from "lucide-react";

const nav = {
  ru: [
    ["Адвокаты", "/advokaty"],
    ["Получить помощь", "/pomosh"],
    ["Регионы", "/regions"],
    ["Главная", "/"],
  ],
  kk: [
    ["Адвокаттар", "/advokaty"],
    ["Көмек алу", "/pomosh"],
    ["Өңірлер", "/regions"],
    ["Басты бет", "/"],
  ],
};

export function PortalHeader({ locale, onLocaleChange }: { locale: Locale; onLocaleChange: (locale: Locale) => void }) {
  return (
    <header className="portal-header">
      <div className="shell portal-header-inner">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true"><Scale /></span>
          <span className="brand-copy">
            <strong>{locale === "ru" ? "Единый портал коллегий адвокатов" : "Адвокаттар алқаларының бірыңғай порталы"}</strong>
            <small>{locale === "ru" ? "Республика Казахстан" : "Қазақстан Республикасы"}</small>
          </span>
        </a>
        <nav className="portal-nav" aria-label={locale === "ru" ? "Навигация" : "Навигация"}>
          {nav[locale].map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <div className="language-switch">
          <button className={locale === "kk" ? "active" : ""} onClick={() => onLocaleChange("kk")}>ҚАЗ</button>
          <button className={locale === "ru" ? "active" : ""} onClick={() => onLocaleChange("ru")}>РУС</button>
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
          <span className="brand-mark" aria-hidden="true"><Scale /></span>
          <span className="brand-copy">
            <strong>{locale === "ru" ? "Коллегии адвокатов Республики Казахстан" : "Қазақстан Республикасының адвокаттар алқалары"}</strong>
            <small>{locale === "ru" ? "Цифровой доступ к правовой помощи" : "Құқықтық көмекке цифрлық қолжетімділік"}</small>
          </span>
        </div>
        <div className="portal-footer-links">
          <a href="/advokaty">{locale === "ru" ? "Найти адвоката" : "Адвокат табу"}</a>
          <a href="/pomosh">{locale === "ru" ? "Получить помощь" : "Көмек алу"}</a>
          <a href="/regions">{locale === "ru" ? "Региональные коллегии" : "Өңірлік алқалар"}</a>
        </div>
      </div>
      <div className="shell portal-footer-bottom">
        <span>© 2026</span>
        <a href="https://data.egov.kz/datasets/view?index=advokattar_tizimi14" target="_blank" rel="noreferrer">
          {locale === "ru" ? "Источник: открытые данные Минюста РК · 08.07.2025" : "Дереккөз: ҚР Әділет министрлігінің ашық деректері · 08.07.2025"}<ExternalLink />
        </a>
      </div>
    </footer>
  );
}

export function DataSourceNotice({ locale, total = 6005 }: { locale: Locale; total?: number }) {
  return (
    <div className="data-source-notice" role="note">
      <span><Database /></span>
      <div>
        <strong>{locale === "ru" ? `${total.toLocaleString("ru-RU")} записей из открытого набора Минюста РК` : `ҚР Әділет министрлігінің ашық деректерінен ${total.toLocaleString("ru-RU")} жазба`}</strong>
        <p>{locale === "ru" ? "Источник обновлён 08.07.2025 и помечен владельцем как требующий актуализации. Перед заключением соглашения дополнительно проверьте лицензию и членство в территориальной коллегии." : "Дереккөз 08.07.2025 жаңартылған және иесі өзектендіруді қажет етеді деп белгілеген. Келісім жасамас бұрын лицензияны және аумақтық алқаға мүшелікті қосымша тексеріңіз."}</p>
      </div>
      <a href="https://data.egov.kz/datasets/view?index=advokattar_tizimi14" target="_blank" rel="noreferrer">
        {locale === "ru" ? "Открыть источник" : "Дереккөзді ашу"}<ExternalLink />
      </a>
    </div>
  );
}
