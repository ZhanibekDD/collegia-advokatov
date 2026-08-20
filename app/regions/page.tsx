"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Database, Languages, Mail, MapPin, Phone, Search, ShieldCheck, UserRound } from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../components/portal-shell";
import { ZHETISU_REGION, type AdvocateDirectory, type Locale } from "../lib/portal-data";

export default function RegionsPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [directory, setDirectory] = useState<AdvocateDirectory | null>(null);
  const kk = locale === "kk";

  useEffect(() => {
    let active = true;
    fetch("/data/advocates.json")
      .then((response) => response.json() as Promise<AdvocateDirectory>)
      .then((result) => {
        if (!active) return;
        const advocates = result.advocates.filter((advocate) => advocate.region === ZHETISU_REGION);
        setDirectory({ ...result, meta: { ...result.meta, total: advocates.length }, advocates });
      })
      .catch(() => {
        if (active) setDirectory(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const cityCount = useMemo(() => {
    if (!directory) return 0;
    return new Set(directory.advocates.map((advocate) => advocate.address).filter(Boolean)).size;
  }, [directory]);

  const cards = kk
    ? [
        [MapPin, "Жетісу облысы", "Сайттың каталогы тек Жетісу облысына жататын адвокаттарды көрсетеді."],
        [Search, "Адвокатты жылдам іздеу", "Аты-жөні, лицензия нөмірі, мекенжайы немесе байланыс деректері бойынша іздеу."],
        [ShieldCheck, "Тексерілетін деректер", "Карточкалар ҚР Әділет министрлігінің ашық деректеріне сүйенеді."],
        [Languages, "Қазақша және орысша", "Негізгі бөлімдер екі тілде қолжетімді және мобильді құрылғыларға бейімделген."],
      ]
    : [
        [MapPin, "Область Жетісу", "Каталог сайта показывает только адвокатов, относящихся к области Жетісу."],
        [Search, "Быстрый поиск адвоката", "Поиск по ФИО, номеру лицензии, адресу или опубликованным контактам."],
        [ShieldCheck, "Проверяемые сведения", "Карточки основаны на открытых данных Министерства юстиции Республики Казахстан."],
        [Languages, "Русский и казахский", "Ключевые разделы доступны на двух языках и адаптированы для мобильных устройств."],
      ];

  return (
    <main className="portal-page regions-page">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />

      <section className="regions-hero">
        <div className="shell regions-hero-grid">
          <div>
            <div className="eyebrow light"><span />{kk ? "Алқа туралы" : "О коллегии"}</div>
            <h1>{kk ? "Жетісу облыстық адвокаттар алқасының цифрлық порталы" : "Цифровой портал Коллегии адвокатов области Жетісу"}</h1>
          </div>
          <p>{kk ? "Портал Жетісу облысының тұрғындарына адвокат табуға, лицензия туралы ашық мәліметтерді көруге және құқықтық көмекке жүгіну бағытын түсінуге көмектеседі." : "Портал помогает жителям области Жетісу найти адвоката, посмотреть опубликованные сведения о лицензии и понять, как начать обращение за правовой помощью."}</p>
        </div>
      </section>

      <section className="regions-content">
        <div className="shell">
          <DataSourceNotice locale={locale} total={directory?.meta.total} />

          <div className="regions-grid">
            {cards.map(([Icon, title, description]) => {
              const CardIcon = Icon as typeof MapPin;
              return (
                <article className="region-card" key={String(title)}>
                  <span><CardIcon /></span>
                  <div>
                    <h2>{String(title)}</h2>
                    <p>{String(description)}</p>
                  </div>
                  <i><BadgeCheck /></i>
                </article>
              );
            })}
          </div>

          <div className="flow-result">
            <div className="eyebrow"><span />{kk ? "Ресми байланыстар" : "Официальные контакты"}</div>
            <h2>{kk ? "Жетісу облыстық адвокаттар алқасы" : "Коллегия адвокатов области Жетісу"}</h2>
            <p>{kk ? "Төмендегі мәліметтер Республикалық адвокаттар алқасының аумақтық алқалар тізіміндегі ашық ақпаратқа негізделген." : "Контактные сведения взяты из открытой карточки территориальной коллегии на сайте Республиканской коллегии адвокатов."}</p>
            <div className="result-summary">
              <div><small>{kk ? "Төраға" : "Председатель"}</small><strong><UserRound /> Адильбекова Данипа Медетовна</strong></div>
              <div><small>{kk ? "Мекенжай" : "Адрес"}</small><strong><MapPin /> г. Талдыкорган, ул. Каблиса жырау, д. 69</strong></div>
              <div><small>{kk ? "Телефон" : "Телефон"}</small><strong><Phone /> 8 (7282) 24-40-33</strong></div>
              <div><small>Email</small><strong><Mail /> advokatura-tk@bk.ru</strong></div>
            </div>
            <div className="flow-result-actions">
              <a className="button button-primary" href="tel:+77282244033">{kk ? "Қоңырау шалу" : "Позвонить"}<Phone /></a>
              <a href="mailto:advokatura-tk@bk.ru">{kk ? "Хат жазу" : "Написать на email"}<Mail /></a>
            </div>
          </div>

          <div className="directory-toolbar">
            <div>
              <p>{kk ? "Каталогтағы адвокаттар" : "Адвокатов в каталоге"}: <strong>{directory ? directory.meta.total.toLocaleString("ru-RU") : "—"}</strong></p>
              <span>{kk ? "Өңірлік сүзгі сайт деңгейінде бекітілген — басқа облыстар көрсетілмейді." : "Региональный фильтр закреплён на уровне сайта — адвокаты других областей не показываются."}</span>
            </div>
            <span>{directory ? `${cityCount.toLocaleString("ru-RU")} ${kk ? "мекенжай жазбасы" : "адресных записей"}` : <Database />}</span>
          </div>

          <div className="flow-result">
            <div className="eyebrow"><span />{kk ? "Келесі қадам" : "Следующий шаг"}</div>
            <h2>{kk ? "Қажетті адвокатты табыңыз" : "Найдите нужного адвоката"}</h2>
            <p>{kk ? "Каталогты ашып, аты-жөні немесе лицензия нөмірі бойынша іздеңіз. Егер қай бағыттан бастау керегін білмесеңіз, құқықтық көмек навигаторын пайдаланыңыз." : "Откройте каталог и найдите специалиста по ФИО или номеру лицензии. Если не знаете, с чего начать, используйте навигатор правовой помощи."}</p>
            <div className="flow-result-actions">
              <a className="button button-primary" href="/advokaty">{kk ? "Адвокаттар каталогы" : "Каталог адвокатов"}<ArrowRight /></a>
              <a href="/pomosh">{kk ? "Көмек бағытын таңдау" : "Подобрать маршрут помощи"}<ArrowRight /></a>
            </div>
          </div>
        </div>
      </section>

      <PortalFooter locale={locale} />
    </main>
  );
}
