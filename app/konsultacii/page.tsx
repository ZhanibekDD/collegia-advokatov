"use client";

import Link from "next/link";
import { ArrowRight, Building2, ChevronDown, MapPinned, Scale, UsersRound } from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../components/portal-shell";
import { JetisuSignature } from "../components/portal-experience";
import { advocateWord, consultationName } from "../lib/portal-data";
import { useDirectory } from "../lib/use-directory";
import { usePersistentLocale } from "../lib/use-persistent-locale";

const text = {
  ru: {
    eyebrow: "Структура коллегии",
    title: "Юридические консультации",
    lead: "Городские, районные и ювенальная консультации, а также адвокаты, работающие индивидуально. Состав сформирован строго по сентябрьскому списку коллегии.",
    total: "подразделений и форм практики",
    advocates: "адвокатов в составе",
    members: "Состав подразделения",
    open: "Показать фамилии",
    directory: "Открыть в списке адвокатов",
    loading: "Загружаем структуру коллегии…",
  },
  kk: {
    eyebrow: "Алқа құрылымы",
    title: "Заң консультациялары",
    lead: "Қалалық, аудандық және ювеналдық консультациялар, сондай-ақ жеке жұмыс істейтін адвокаттар. Құрам алқаның қыркүйек тізімі бойынша жасалды.",
    total: "бөлімше және практика нысаны",
    advocates: "құрамдағы адвокат",
    members: "Бөлімше құрамы",
    open: "Аты-жөндерін көрсету",
    directory: "Адвокаттар тізімінде ашу",
    loading: "Алқа құрылымы жүктелуде…",
  },
};

export default function ConsultationsPage() {
  const [locale, setLocale] = usePersistentLocale();
  const { directory } = useDirectory();
  const t = text[locale];

  return (
    <main>
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="page-hero consultations-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <JetisuSignature locale={locale} />
        <div className="shell page-hero-split" data-reveal>
          <div>
            <div className="eyebrow light"><span />{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.lead}</p>
          </div>
          <div className="page-hero-stat"><Building2 /><strong>{directory?.meta.consultationCount ?? "—"}</strong><span>{t.total}</span></div>
        </div>
      </section>

      <section className="consultations-section">
        <div className="shell">
          <div data-reveal><DataSourceNotice locale={locale} total={directory?.meta.total} /></div>
          {!directory && <div className="status-panel"><span className="spinner" />{t.loading}</div>}
          <div className="consultations-directory">
            {directory?.consultations.map((consultation, index) => {
              const members = directory.advocates.filter((advocate) => advocate.consultation === consultation.name);
              const Icon = consultation.name === "Индивидуалы" ? Scale : consultation.name.includes("Ювенал") ? UsersRound : MapPinned;
              return (
                <article className="consultation-directory-card" id={consultation.id} data-reveal style={{ "--reveal-delay": `${(index % 2) * 80}ms` } as React.CSSProperties} key={consultation.id}>
                  <header>
                    <span className="consultation-card-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="center-icon"><Icon /></span>
                    <div><h2>{consultationName(consultation.name, locale)}</h2><p><strong>{consultation.count}</strong> {advocateWord(consultation.count, locale)}</p></div>
                    <Link className="round-arrow" href={`/advokaty?consultation=${encodeURIComponent(consultation.name)}`} aria-label={t.directory}><ArrowRight /></Link>
                  </header>
                  <details>
                    <summary>{t.open}<ChevronDown /></summary>
                    <div className="consultation-members">
                      <h3>{t.members}</h3>
                      <ol>
                        {members.map((advocate) => (
                          <li key={advocate.id}><span>{String(advocate.sourceId).padStart(3, "0")}</span><Link href={`/advokaty/${advocate.id}`}>{advocate.name}<ArrowRight /></Link></li>
                        ))}
                      </ol>
                      <Link className="plain-link" href={`/advokaty?consultation=${encodeURIComponent(consultation.name)}`}>{t.directory}<ArrowRight /></Link>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
