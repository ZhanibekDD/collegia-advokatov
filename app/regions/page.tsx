"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Database, MapPin, Search } from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../components/portal-shell";
import { regionOptions, type AdvocateDirectory, type Locale } from "../lib/portal-data";

export default function RegionsPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [query, setQuery] = useState("");
  const [directory, setDirectory] = useState<AdvocateDirectory | null>(null);
  const kk = locale === "kk";

  useEffect(() => {
    let active = true;
    fetch("/data/advocates.json")
      .then((response) => response.json() as Promise<AdvocateDirectory>)
      .then((result) => {
        if (active) setDirectory(result);
      })
      .catch(() => {
        if (active) setDirectory(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    const result = new Map<string, number>();
    for (const advocate of directory?.advocates ?? []) {
      result.set(advocate.region, (result.get(advocate.region) ?? 0) + 1);
    }
    return result;
  }, [directory]);

  const filtered = useMemo(() => {
    const value = query.toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU");
    return regionOptions
      .filter((item) => item.value !== "all")
      .filter((item) => `${item.ru} ${item.kk}`.toLocaleLowerCase().includes(value));
  }, [locale, query]);

  return (
    <main className="portal-page regions-page">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="regions-hero">
        <div className="shell regions-hero-grid">
          <div>
            <div className="eyebrow light"><span />{kk ? "Өңірлік каталог" : "Территориальный каталог"}</div>
            <h1>{kk ? "Қазақстанның 20 өңіріндегі адвокаттар" : "Адвокаты во всех 20 регионах Казахстана"}</h1>
          </div>
          <p>{kk ? "Әр өңір бойынша ашық жиындағы жазбалардың нақты санын көрсетеміз. Өңірді таңдап, аты-жөні немесе лицензия нөмірі бойынша іздеуді жалғастырыңыз." : "Показываем фактическое число записей открытого набора по каждому региону. Выберите регион и продолжите поиск по ФИО или номеру лицензии."}</p>
        </div>
      </section>
      <section className="regions-content">
        <div className="shell">
          <DataSourceNotice locale={locale} total={directory?.meta.total} />
          <label className="regions-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={kk ? "Өңірді іздеу" : "Поиск региона"} /></label>
          {!directory && <div className="regions-loading"><Database />{kk ? "Өңірлік деректер жүктелуде" : "Загружаем региональные данные"}</div>}
          <div className="regions-grid">
            {filtered.map((item) => {
              const count = counts.get(item.value) ?? 0;
              return (
                <a className="region-card" href={`/advokaty?region=${encodeURIComponent(item.value)}`} key={item.value}>
                  <span><MapPin /></span>
                  <div>
                    <h2>{item[locale]}</h2>
                    <p>{count.toLocaleString("ru-RU")} {kk ? "жазба" : count === 1 ? "запись" : "записей"}</p>
                  </div>
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
