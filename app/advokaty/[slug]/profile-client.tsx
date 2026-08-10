"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Copy,
  Database,
  ExternalLink,
  IdCard,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
} from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../../components/portal-shell";
import type { Locale, OfficialAdvocate } from "../../lib/portal-data";

function readableDate(value: string, fallback: string) {
  if (!value) return fallback;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
  }
  return value;
}

function extractPhone(value: string) {
  const match = value.match(/(?:\+?7|8)[\s()\-]*\d{3}[\s()\-]*\d{3}[\s()\-]*\d{2}[\s()\-]*\d{2}/);
  if (!match) return null;
  let digits = match[0].replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  return digits.length === 11 && digits.startsWith("7") ? digits : null;
}

export default function ProfileClient({ advocate, total }: { advocate: OfficialAdvocate; total: number }) {
  const [locale, setLocale] = useState<Locale>("ru");
  const [copied, setCopied] = useState(false);
  const kk = locale === "kk";
  const noValue = kk ? "Дереккөзде көрсетілмеген" : "Не указано в источнике";
  const phone = extractPhone(advocate.contacts);

  async function copyProfileLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const temporary = document.createElement("textarea");
      temporary.value = window.location.href;
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();
      document.execCommand("copy");
      temporary.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="portal-page profile-page">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <div className="profile-breadcrumb shell">
        <a href="/advokaty"><ArrowLeft /> {kk ? "Каталогқа оралу" : "Вернуться в каталог"}</a>
      </div>
      <section className="profile-hero official-profile-hero">
        <div className="shell profile-hero-grid">
          <div className="profile-portrait official-portrait">
            <span>{advocate.initials || "KZ"}</span>
            <small>OPEN DATA · #{advocate.id}</small>
          </div>
          <div className="profile-main">
            <div className="verified-line"><span><BadgeCheck /></span>{kk ? "Ашық деректердегі жазба" : "Запись из открытых данных"}</div>
            <h1>{advocate.name}</h1>
            <p className="profile-practice"><MapPin />{advocate.region}</p>
            <div className="profile-facts">
              <div><small>{kk ? "Лицензия" : "Лицензия"}</small><strong>№ {advocate.licenseNumber || noValue}</strong></div>
              <div><small>{kk ? "Берілген күні" : "Дата выдачи"}</small><strong>{readableDate(advocate.licenseIssuedAt, noValue)}</strong></div>
              <div><small>{kk ? "Алқаға кіру" : "Вступление в коллегию"}</small><strong>{readableDate(advocate.joinedAt, noValue)}</strong></div>
            </div>
          </div>
          <aside className="profile-action-card official-action-card">
            <small>{kk ? "Ресми тексеру" : "Официальная проверка"}</small>
            <h2>{kk ? "Келісімге дейін мәліметтерді салыстырыңыз" : "Сверьте сведения до заключения соглашения"}</h2>
            <p>{kk ? "Ашық жиын ағымдағы лицензия мәртебесін көрсетпейді. Лицензияны және аумақтық алқаға мүшелікті қосымша тексеріңіз." : "Открытый набор не содержит текущий статус лицензии. Дополнительно проверьте лицензию и членство в территориальной коллегии."}</p>
            <a className="button button-primary" href="https://data.egov.kz/datasets/view?index=advokattar_tizimi14" target="_blank" rel="noreferrer">
              {kk ? "Дереккөзді ашу" : "Открыть источник"}<ExternalLink />
            </a>
            <div className="profile-contact-actions">
              {phone && <a href={`tel:+${phone}`}><PhoneCall />{kk ? "Қоңырау шалу" : "Позвонить"}</a>}
              {phone && <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a>}
              <button type="button" onClick={copyProfileLink}>{copied ? <Check /> : <Copy />}{copied ? (kk ? "Көшірілді" : "Скопировано") : (kk ? "Сілтемені көшіру" : "Копировать ссылку")}</button>
            </div>
          </aside>
        </div>
      </section>
      <section className="profile-content">
        <div className="shell">
          <DataSourceNotice locale={locale} total={total} />
          <div className="profile-warning"><AlertTriangle /><p>{kk ? "Бұл карточка мамандану, тәжірибе, рейтинг немесе лицензияның ағымдағы мәртебесі туралы қорытынды жасамайды." : "Эта карточка не делает выводов о специализации, опыте, рейтинге или текущем статусе лицензии."}</p></div>
          <div className="profile-content-grid official-profile-grid">
            <article>
              <div className="eyebrow"><span />{kk ? "Дереккөздегі мәліметтер" : "Сведения источника"}</div>
              <h2>{kk ? "Кәсіби жазба" : "Профессиональная запись"}</h2>
              <ul className="official-detail-list">
                <li><span><IdCard /></span><div><small>{kk ? "Лицензия нөмірі" : "Номер лицензии"}</small><strong>{advocate.licenseNumber || noValue}</strong></div></li>
                <li><span><CalendarDays /></span><div><small>{kk ? "Лицензия берілген күн" : "Дата выдачи лицензии"}</small><strong>{readableDate(advocate.licenseIssuedAt, noValue)}</strong></div></li>
                <li><span><Database /></span><div><small>{kk ? "Алқаға кіру күні" : "Дата вступления в коллегию"}</small><strong>{readableDate(advocate.joinedAt, noValue)}</strong></div></li>
              </ul>
            </article>
            <article>
              <div className="eyebrow"><span />{kk ? "Байланыс" : "Контактные данные"}</div>
              <h2>{kk ? "Мекенжай және байланыс" : "Адрес и контакты"}</h2>
              <ul className="official-detail-list">
                <li><span><MapPin /></span><div><small>{kk ? "Өңір" : "Регион"}</small><strong>{advocate.region}</strong></div></li>
                <li><span><MapPin /></span><div><small>{kk ? "Мекенжай" : "Адрес"}</small><strong>{advocate.address || noValue}</strong></div></li>
                <li><span><Phone /></span><div><small>{kk ? "Байланыс" : "Контакты"}</small><strong>{advocate.contacts || noValue}</strong></div></li>
              </ul>
              <a className="profile-help-link" href="/pomosh">{kk ? "Өтінішті дайындау" : "Подготовить обращение"}<ArrowUpRight /></a>
            </article>
          </div>
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
