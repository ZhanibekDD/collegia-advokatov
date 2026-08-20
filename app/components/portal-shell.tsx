"use client";

import { useState } from "react";
import type { Locale } from "../lib/portal-data";
import { Database, ExternalLink, Menu, Scale, X } from "lucide-react";
import { ShanyrakMark } from "./shanyrak-mark";

const nav = {
  ru: [
    ["Главная", "/"],
    ["О коллегии", "/regions"],
    ["Адвокаты", "/advokaty"],
    ["Правовая помощь", "/pomosh"],
  ],
  kk: [
    ["Басты бет", "/"],
    ["Алқа туралы", "/regions"],
    ["Адвокаттар", "/advokaty"],
    ["Құқықтық көмек", "/pomosh"],
  ],
};

export function PortalHeader({ locale, onLocaleChange }: { locale: Locale; onLocaleChange: (locale: Locale) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="jp-header jp-inner-header">
      <div className="jp-shell jp-header-inner">
        <a className="jp-brand" href="/">
          <span className="jp-emblem"><ShanyrakMark /></span>
          <span className="jp-brand-text"><strong>ЖЕТІСУ ОБЛЫСТЫҚ АДВОКАТТАР АЛҚАСЫ</strong><small>{locale === "ru" ? "Коллегия адвокатов области Жетісу" : "Жетісу облыстық адвокаттар алқасы"}</small></span>
        </a>
        <nav className={menuOpen ? "jp-nav is-open" : "jp-nav"} aria-label="Навигация">
          {nav[locale].map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="jp-header-actions">
          <div className="jp-language"><button className={locale === "kk" ? "active" : ""} onClick={() => onLocaleChange("kk")}>ҚАЗ</button><span>/</span><button className={locale === "ru" ? "active" : ""} onClick={() => onLocaleChange("ru")}>РУС</button></div>
          <button className="jp-menu" type="button" aria-label={locale === "ru" ? "Открыть меню" : "Мәзірді ашу"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}

export function PortalFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="jp-footer jp-inner-footer">
      <div className="jp-shell jp-footer-grid">
        <div className="jp-footer-brand"><div className="jp-brand"><span className="jp-emblem"><ShanyrakMark /></span><span className="jp-brand-text"><strong>ЖЕТІСУ ОБЛЫСТЫҚ АДВОКАТТАР АЛҚАСЫ</strong><small>{locale === "ru" ? "Коллегия адвокатов области Жетісу" : "Жетісу облыстық адвокаттар алқасы"}</small></span></div><p>{locale === "ru" ? "Профессиональная правовая помощь в области Жетісу." : "Жетісу облысындағы кәсіби құқықтық көмек."}</p></div>
        <div className="jp-footer-col"><strong>{locale === "ru" ? "Коллегия" : "Алқа"}</strong><a href="/regions">{locale === "ru" ? "О коллегии" : "Алқа туралы"}</a><a href="/advokaty">{locale === "ru" ? "Адвокаты" : "Адвокаттар"}</a><a href="/pomosh">{locale === "ru" ? "Правовая помощь" : "Құқықтық көмек"}</a></div>
        <div className="jp-footer-col"><strong>{locale === "ru" ? "Контакты" : "Байланыс"}</strong><a href="tel:+77282244033">8 (7282) 24-40-33</a><a href="mailto:advokatura-tk@bk.ru">advokatura-tk@bk.ru</a><span>{locale === "ru" ? "Талдыкорган, Каблиса жырау, 69" : "Талдықорған, Қаблиса жырау, 69"}</span></div>
        <div className="jp-footer-col"><strong>{locale === "ru" ? "Источник" : "Дереккөз"}</strong><a href="https://data.egov.kz/datasets/view?index=advokattar_tizimi14" target="_blank" rel="noreferrer">{locale === "ru" ? "Открытые данные Минюста РК" : "ҚР Әділет министрлігінің ашық деректері"}</a></div>
        <div className="jp-footer-cta"><Scale /><strong>{locale === "ru" ? "Нужна юридическая помощь?" : "Құқықтық көмек қажет пе?"}</strong><a href="/pomosh">{locale === "ru" ? "Получить помощь" : "Көмек алу"}</a></div>
      </div>
      <div className="jp-shell jp-footer-bottom"><span>© 2026</span><span>{locale === "ru" ? "Коллегия адвокатов области Жетісу" : "Жетісу облыстық адвокаттар алқасы"}</span></div>
    </footer>
  );
}

export function DataSourceNotice({ locale, total }: { locale: Locale; total?: number }) {
  const count = typeof total === "number" ? total.toLocaleString("ru-RU") : null;
  return (
    <div className="data-source-notice" role="note">
      <span><Database /></span>
      <div><strong>{locale === "ru" ? `${count ? `${count} · ` : ""}адвокаты области Жетісу в открытом наборе Минюста РК` : `${count ? `${count} · ` : ""}Жетісу облысының адвокаттары ҚР Әділет министрлігінің ашық деректерінде`}</strong><p>{locale === "ru" ? "На сайте показываются только записи, относящиеся к области Жетісу. Перед заключением соглашения дополнительно проверьте текущий статус лицензии и членство в коллегии." : "Сайтта тек Жетісу облысына қатысты жазбалар көрсетіледі. Келісім жасамас бұрын лицензия мәртебесі мен алқаға мүшелікті қосымша тексеріңіз."}</p></div>
      <a href="https://data.egov.kz/datasets/view?index=advokattar_tizimi14" target="_blank" rel="noreferrer">{locale === "ru" ? "Открыть источник" : "Дереккөзді ашу"}<ExternalLink /></a>
    </div>
  );
}
