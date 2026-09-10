"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Landmark, Mail, MapPin, Phone, Scale, ShieldCheck, UsersRound } from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../components/portal-shell";
import { JetisuSignature } from "../components/portal-experience";
import { ASSOCIATION } from "../lib/portal-data";
import { useDirectory } from "../lib/use-directory";
import { usePersistentLocale } from "../lib/use-persistent-locale";

const text = {
  ru: {
    eyebrow: "О коллегии",
    title: "Коллегия адвокатов области Жетісу",
    lead: "Профессиональная организация адвокатов региона. На сайте собраны актуальный состав, юридические консультации и официальные контакты коллегии.",
    missionEyebrow: "Назначение портала",
    missionTitle: "Понятная официальная информация",
    missionText: "Сайт помогает жителям области проверить членство адвоката в актуальном составе коллегии, найти подразделение и связаться с приёмной. Он не заменяет юридическую консультацию и не публикует непроверенные сведения.",
    principles: [
      ["Актуальность", "Состав обновлён по списку коллегии на 1 сентября 2026 года."],
      ["Достоверность", "Показываются только поля, которые есть в переданном реестре."],
      ["Доступность", "Крупный текст, ясная навигация и интерфейс на двух языках."],
    ],
    legalEyebrow: "Руководство и реквизиты",
    legalTitle: "Официальные сведения",
    chair: "Председатель президиума",
    address: "Юридический адрес",
    bin: "БИН",
    phone: "Телефон приёмной",
    email: "Электронная почта",
    contactNote: "Отдельный номер для обращений и консультаций будет опубликован после согласования.",
    directory: "Перейти к списку адвокатов",
    groups: "Посмотреть юридические консультации",
  },
  kk: {
    eyebrow: "Алқа туралы",
    title: "Жетісу облыстық адвокаттар алқасы",
    lead: "Өңір адвокаттарының кәсіби ұйымы. Сайтта алқаның өзекті құрамы, заң консультациялары және ресми байланыстары жинақталған.",
    missionEyebrow: "Порталдың мақсаты",
    missionTitle: "Түсінікті ресми ақпарат",
    missionText: "Сайт Жетісу облысының тұрғындарына адвокаттың алқаның өзекті құрамындағы мүшелігін тексеруге, бөлімшені табуға және қабылдаумен байланысуға көмектеседі. Ол заң консультациясын алмастырмайды және тексерілмеген мәліметтерді жарияламайды.",
    principles: [
      ["Өзектілік", "Құрам алқаның 2026 жылғы 1 қыркүйектегі тізімі бойынша жаңартылды."],
      ["Дәлдік", "Тек берілген тізілімде бар өрістер көрсетіледі."],
      ["Қолжетімділік", "Ірі мәтін, түсінікті навигация және екі тілдегі интерфейс."],
    ],
    legalEyebrow: "Басшылық және деректемелер",
    legalTitle: "Ресми мәліметтер",
    chair: "Төралқа төрағасы",
    address: "Заңды мекенжай",
    bin: "БСН",
    phone: "Қабылдау телефоны",
    email: "Электрондық пошта",
    contactNote: "Өтініштер мен консультацияларға арналған жеке нөмір келісілгеннен кейін жарияланады.",
    directory: "Адвокаттар тізіміне өту",
    groups: "Заң консультацияларын көру",
  },
};

const principleIcons = [BadgeCheck, ShieldCheck, UsersRound];

export default function AboutPage() {
  const [locale, setLocale] = usePersistentLocale();
  const { directory } = useDirectory();
  const t = text[locale];

  return (
    <main id="main-content">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="page-hero about-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <JetisuSignature locale={locale} />
        <div className="shell page-hero-split" data-reveal>
          <div>
            <div className="eyebrow light"><span />{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.lead}</p>
          </div>
          <div className="association-seal"><Scale /><strong>{ASSOCIATION.domain}</strong><small>{locale === "ru" ? "область Жетісу" : "Жетісу облысы"}</small></div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div data-reveal><DataSourceNotice locale={locale} total={directory?.meta.total} ggupTotal={directory?.meta.ggup.total} /></div>
          <div className="mission-grid" data-reveal>
            <div className="mission-copy">
              <div className="eyebrow"><span />{t.missionEyebrow}</div>
              <h2>{t.missionTitle}</h2>
              <p>{t.missionText}</p>
            </div>
            <div className="principle-grid">
              {t.principles.map(([title, description], index) => {
                const Icon = principleIcons[index];
                return <article key={title}><span className="center-icon"><Icon /></span><h3>{title}</h3><p>{description}</p></article>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft legal-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div className="eyebrow"><span />{t.legalEyebrow}</div>
            <h2>{t.legalTitle}</h2>
          </div>
          <div className="legal-details-grid" data-reveal>
            <article className="leadership-card">
              <span className="center-icon"><Scale /></span>
              <small>{t.chair}</small>
              <h3>{ASSOCIATION.chair[locale]}</h3>
              <p>{ASSOCIATION.name[locale]}</p>
            </article>
            <dl className="legal-list">
              <div><dt><MapPin />{t.address}</dt><dd>{ASSOCIATION.address[locale]}</dd></div>
              <div><dt><Landmark />{t.bin}</dt><dd>{ASSOCIATION.bin}</dd></div>
              <div><dt><Phone />{t.phone}</dt><dd><a href={`tel:${ASSOCIATION.phoneHref}`}>{ASSOCIATION.phone}</a></dd></div>
              <div><dt><Mail />{t.email}</dt><dd><a href={`mailto:${ASSOCIATION.email}`}>{ASSOCIATION.email}</a></dd></div>
            </dl>
          </div>
          <div className="contact-note"><ShieldCheck /><p>{t.contactNote}</p></div>
          <div className="about-actions">
            <Link className="button button-dark" href="/advokaty">{t.directory}<ArrowRight /></Link>
            <Link className="button button-outline-dark" href="/konsultacii">{t.groups}<Building2 /></Link>
          </div>
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
