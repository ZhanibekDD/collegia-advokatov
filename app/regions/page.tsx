"use client";

import { useMemo, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { PortalFooter, PortalHeader } from "../components/portal-shell";
import { advocates, allRegions, type Locale } from "../lib/portal-data";

export default function RegionsPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [query, setQuery] = useState("");
  const kk = locale === "kk";
  const activeRegions = useMemo(() => new Set(advocates.map((item) => item.region)), []);
  const filtered = useMemo(() => {
    const value = query.toLocaleLowerCase();
    return allRegions.filter(([ru, kz]) => `${ru} ${kz}`.toLocaleLowerCase().includes(value));
  }, [query]);

  return (
    <main className="portal-page regions-page">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="regions-hero">
        <div className="shell regions-hero-grid">
          <div>
            <div className="eyebrow light"><span />{kk ? "Өңірлік алқалар" : "Территориальная сеть"}</div>
            <h1>{kk ? "Қазақстанның барлық өңірлеріндегі құқықтық көмек" : "Правовая помощь во всех регионах Казахстана"}</h1>
          </div>
          <p>{kk ? "Қажетті өңірді таңдаңыз. Портал аумақтық алқа арқылы маман іздеуге немесе көмек бағытын дайындауға көмектеседі." : "Выберите нужный регион. Портал поможет перейти к поиску специалиста или подготовить маршрут помощи через территориальную коллегию."}</p>
        </div>
      </section>
      <section className="regions-content">
        <div className="shell">
          <label className="regions-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={kk ? "Өңірді іздеу" : "Поиск региона"} /></label>
          <div className="regions-grid">
            {filtered.map(([ru, kz]) => {
              const hasProfiles = activeRegions.has(ru) || activeRegions.has(`г. ${ru}`);
              const href = hasProfiles ? `/advokaty?region=${encodeURIComponent(activeRegions.has(ru) ? ru : `г. ${ru}`)}` : `/pomosh?region=${encodeURIComponent(ru)}`;
              return (
                <a className="region-card" href={href} key={ru}>
                  <span><MapPin /></span>
                  <div><h2>{kk ? kz : ru}</h2><p>{hasProfiles ? (kk ? "Профильдер қолжетімді" : "Профили доступны") : (kk ? "Көмек бағытын дайындау" : "Подготовить маршрут помощи")}</p></div>
                  <i><ArrowRight /></i>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
