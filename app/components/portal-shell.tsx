"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import type { Locale } from "../lib/portal-data";
import { Info } from "lucide-react";

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
          <span className="brand-mark"><span>Қ</span><i /></span>
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
          <span className="brand-mark"><span>Қ</span><i /></span>
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
        <span>{locale === "ru" ? "Демонстрационные данные отмечены на страницах" : "Демонстрациялық деректер беттерде белгіленген"}</span>
      </div>
    </footer>
  );
}

export function DemoNotice({ locale }: { locale: Locale }) {
  return (
    <div className="demo-notice" role="note">
      <span><Info /></span>
      <p>{locale === "ru" ? "Сейчас используются демонстрационные профили для проверки интерфейса. Перед запуском они будут заменены официальной выгрузкой коллегии." : "Қазір интерфейсті тексеру үшін демонстрациялық профильдер қолданылады. Іске қосар алдында олар алқаның ресми деректерімен ауыстырылады."}</p>
    </div>
  );
}
