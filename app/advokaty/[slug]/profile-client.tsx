"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useState } from "react";
import { ArrowLeft, ArrowUpRight, BadgeCheck } from "lucide-react";
import { DemoNotice, PortalFooter, PortalHeader } from "../../components/portal-shell";
import type { Advocate, Locale } from "../../lib/portal-data";

export default function ProfileClient({ advocate }: { advocate: Advocate }) {
  const [locale, setLocale] = useState<Locale>("ru");
  const kk = locale === "kk";
  return (
    <main className="portal-page profile-page">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <div className="profile-breadcrumb shell">
        <a href="/advokaty"><ArrowLeft /> {kk ? "Каталогқа оралу" : "Вернуться в каталог"}</a>
      </div>
      <section className="profile-hero">
        <div className="shell profile-hero-grid">
          <div className="profile-portrait">
            <span>{advocate.initials}</span>
            <small>DEMO PROFILE</small>
          </div>
          <div className="profile-main">
            <div className="verified-line"><span><BadgeCheck /></span>{kk ? "Мәртебе тексерілді" : "Статус проверен"}</div>
            <h1>{advocate.name}</h1>
            <p className="profile-practice">{kk ? advocate.practiceKk : advocate.practice}</p>
            <div className="profile-facts">
              <div><small>{kk ? "Өңір" : "Регион"}</small><strong>{kk ? advocate.regionKk : advocate.region}</strong></div>
              <div><small>{kk ? "Тәжірибе" : "Опыт"}</small><strong>{advocate.experience} {kk ? "жыл" : "лет"}</strong></div>
              <div><small>{kk ? "Жұмыс тілдері" : "Языки работы"}</small><strong>{advocate.languages.join(" · ")}</strong></div>
            </div>
          </div>
          <aside className="profile-action-card">
            <small>{kk ? "Келесі қадам" : "Следующий шаг"}</small>
            <h2>{kk ? "Алғашқы өтінішті дайындаңыз" : "Подготовьте первое обращение"}</h2>
            <p>{kk ? "Портал жағдайды нақтылауға және кеңеске қажетті ақпаратты жинауға көмектеседі." : "Портал поможет уточнить ситуацию и собрать информацию, необходимую для консультации."}</p>
            <a className="button button-primary" href={`/pomosh?practice=${encodeURIComponent(advocate.practice)}`}>
              {kk ? "Өтінішті дайындау" : "Подготовить обращение"}<ArrowUpRight />
            </a>
          </aside>
        </div>
      </section>
      <section className="profile-content">
        <div className="shell">
          <DemoNotice locale={locale} />
          <div className="profile-content-grid">
            <article>
              <div className="eyebrow"><span />{kk ? "Маман туралы" : "О специалисте"}</div>
              <h2>{kk ? "Кәсіби бағыт" : "Профессиональный фокус"}</h2>
              <p>{kk ? advocate.bioKk : advocate.bio}</p>
            </article>
            <article>
              <div className="eyebrow"><span />{kk ? "Қызметтер" : "Направления помощи"}</div>
              <ul>
                {(kk ? advocate.servicesKk : advocate.services).map((service, index) => (
                  <li key={service}><span>{String(index + 1).padStart(2, "0")}</span>{service}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
