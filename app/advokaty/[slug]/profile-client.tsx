"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, Check, Copy, Database, MapPin, Printer, ShieldCheck, UserRound } from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../../components/portal-shell";
import { consultationName, formatDirectoryDate, type OfficialAdvocate } from "../../lib/portal-data";
import { usePersistentLocale } from "../../lib/use-persistent-locale";

export default function ProfileClient({ advocate, total }: { advocate: OfficialAdvocate; total: number }) {
  const [locale, setLocale] = usePersistentLocale();
  const [copied, setCopied] = useState(false);
  const kk = locale === "kk";

  async function copyProfileLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main id="main-content">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="profile-hero">
        <div className="shell">
          <Link className="breadcrumb" href="/advokaty"><ArrowLeft />{kk ? "Тізімге оралу" : "Вернуться к списку"}</Link>
          <div className="profile-hero-grid">
            <div className="profile-number"><small>KAOJ · {formatDirectoryDate(locale)}</small><strong>{String(advocate.sourceId).padStart(3, "0")}</strong></div>
            <div className="profile-title">
              <div className="verified-label"><BadgeCheck />{kk ? "Алқаның өзекті тізіміндегі жазба" : "Запись в актуальном списке коллегии"}</div>
              <h1>{advocate.name}</h1>
              <p><MapPin />{kk ? "Жетісу облысы" : "Область Жетісу"}</p>
            </div>
            <div className="profile-actions">
              <button className="copy-button" type="button" aria-live="polite" onClick={copyProfileLink}>{copied ? <Check /> : <Copy />}{copied ? (kk ? "Көшірілді" : "Скопировано") : (kk ? "Сілтемені көшіру" : "Копировать ссылку")}</button>
              <button className="copy-button" type="button" onClick={() => window.print()}><Printer />{kk ? "Басып шығару" : "Распечатать"}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-content">
        <div className="shell">
          <DataSourceNotice locale={locale} total={total} />
          <div className="profile-content-grid">
            <article className="profile-card">
              <div className="eyebrow"><span />{kk ? "Алқа құрамы" : "Состав коллегии"}</div>
              <h2>{kk ? "Тізімдегі мәліметтер" : "Сведения из списка"}</h2>
              <dl className="detail-list">
                <div><dt><UserRound />{kk ? "Адвокат" : "Адвокат"}</dt><dd>{advocate.name}</dd></div>
                <div><dt><Building2 />{kk ? "Бөлімше / практика" : "Подразделение / форма практики"}</dt><dd>{consultationName(advocate.consultation, locale)}</dd></div>
                <div><dt><Database />{kk ? "Тізімдегі нөмір" : "Номер в списке"}</dt><dd>№ {advocate.sourceId}</dd></div>
                <div><dt><ShieldCheck />{kk ? "Тізімнің күні" : "Дата списка"}</dt><dd>{formatDirectoryDate(locale)}</dd></div>
              </dl>
            </article>

            <aside className="profile-note">
              <span><ShieldCheck /></span>
              <h2>{kk ? "Жеке мәліметтер жарияланбайды" : "Лишние персональные данные не публикуются"}</h2>
              <p>{kk ? "Алқа ұсынған тізімде фотосурет, телефон, лицензия нөмірі немесе мамандану жоқ. Сондықтан сайт оларды ойдан шығармайды. Мәліметтерді алқаның қабылдау бөлмесі арқылы нақтылауға болады." : "В переданном коллегией списке нет фотографии, телефона, номера лицензии или специализации. Поэтому сайт не додумывает эти сведения. Детали можно уточнить через приёмную коллегии."}</p>
              <Link className="button button-accent" href={`/advokaty?consultation=${encodeURIComponent(advocate.consultation)}`}>{kk ? "Осы бөлімшенің адвокаттары" : "Адвокаты этого подразделения"}<ArrowRight /></Link>
              <Link className="plain-link" href="/regions">{kk ? "Алқаның байланыстары" : "Контакты коллегии"}<ArrowRight /></Link>
            </aside>
          </div>
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
