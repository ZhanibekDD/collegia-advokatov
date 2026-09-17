"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ChevronDown, Download, ExternalLink, FileCheck2, FileText, Gavel, Landmark, Mail, MapPin, Phone, Scale, ShieldCheck, UserRoundCheck, UsersRound, Vote } from "lucide-react";
import { DataSourceNotice, PortalFooter, PortalHeader } from "../components/portal-shell";
import { JetisuSignature } from "../components/portal-experience";
import { ShanyrakMark } from "../components/shanyrak-mark";
import { GOVERNANCE_GROUPS, REGIONAL_CONFERENCE_DELEGATES, REPUBLICAN_CONFERENCE_DELEGATES, REPUBLICAN_PRESIDIUM } from "../lib/association-structure";
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
    structureEyebrow: "Структура коллегии",
    structureTitle: "Органы управления и комиссии",
    structureLead: "Состав президиума, комиссий и делегатов опубликован по списку, переданному Коллегией адвокатов области Жетісу.",
    structureSource: "Переданный состав КАОЖ · дата утверждения в документе не указана",
    chairRole: "Председатель",
    membersLabel: "человек",
    representationEyebrow: "Представительство",
    representationTitle: "Республиканская и региональная конференции",
    republicanPresidium: "Президиум Республиканской коллегии адвокатов",
    republicanDelegates: "Делегаты конференции Республиканской коллегии адвокатов",
    regionalDelegates: "Делегаты конференции Коллегии адвокатов области Жетісу",
    showDelegates: "Открыть полный список из 28 делегатов",
    chair: "Председатель президиума",
    address: "Юридический адрес",
    bin: "БИН",
    phone: "Телефон приёмной",
    email: "Электронная почта",
    contactNote: "Отдельный номер для обращений и консультаций будет опубликован после согласования.",
    directory: "Перейти к списку адвокатов",
    groups: "Посмотреть юридические консультации",
    motto: "Семь потоков. Единое правовое пространство.",
    documentsEyebrow: "Учредительные документы",
    documentsTitle: "Устав и изменения к нему",
    documentsLead: "Оба документа доступны для просмотра и скачивания. Юридический адрес уточнён в изменениях 2024 года.",
    documents: [
      ["Устав коллегии · 2022", "Утверждён 5 июня 2022 года. Зарегистрированный устав на казахском и русском языках.", "PDF · 25 страниц · 1,6 МБ"],
      ["Изменения и дополнения · 2024", "Утверждены 8 ноября 2024 года. Юридический адрес: г. Талдыкорган, ул. Майстрюка, 2А.", "PDF · 2 страницы · 55 КБ"],
    ],
    openDocument: "Открыть PDF",
    downloadDocument: "Скачать",
    documentNewTab: "откроется в новой вкладке",
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
    structureEyebrow: "Алқа құрылымы",
    structureTitle: "Басқару органдары мен комиссиялар",
    structureLead: "Төралқа, комиссиялар мен делегаттар құрамы Жетісу облыстық адвокаттар алқасы берген тізім бойынша жарияланды.",
    structureSource: "ЖОАА берген құрам · құжатта бекітілген күні көрсетілмеген",
    chairRole: "Төраға",
    membersLabel: "адам",
    representationEyebrow: "Өкілдік",
    representationTitle: "Республикалық және өңірлік конференциялар",
    republicanPresidium: "Республикалық адвокаттар алқасының төралқасы",
    republicanDelegates: "Республикалық адвокаттар алқасы конференциясының делегаттары",
    regionalDelegates: "Жетісу облыстық адвокаттар алқасы конференциясының делегаттары",
    showDelegates: "28 делегаттың толық тізімін ашу",
    chair: "Төралқа төрағасы",
    address: "Заңды мекенжай",
    bin: "БСН",
    phone: "Қабылдау телефоны",
    email: "Электрондық пошта",
    contactNote: "Өтініштер мен консультацияларға арналған жеке нөмір келісілгеннен кейін жарияланады.",
    directory: "Адвокаттар тізіміне өту",
    groups: "Заң консультацияларын көру",
    motto: "Жеті ағын. Біртұтас құқықтық кеңістік.",
    documentsEyebrow: "Құрылтай құжаттары",
    documentsTitle: "Жарғы және оған енгізілген өзгерістер",
    documentsLead: "Екі құжатты да қарап, жүктеп алуға болады. Заңды мекенжай 2024 жылғы өзгерістерде нақтыланған.",
    documents: [
      ["Алқа жарғысы · 2022", "2022 жылғы 5 маусымда бекітілген. Қазақ және орыс тілдеріндегі тіркелген жарғы.", "PDF · 25 бет · 1,6 МБ"],
      ["Өзгерістер мен толықтырулар · 2024", "2024 жылғы 8 қарашада бекітілген. Заңды мекенжай: Талдықорған қаласы, Майстрюк көшесі, 2А.", "PDF · 2 бет · 55 КБ"],
    ],
    openDocument: "PDF ашу",
    downloadDocument: "Жүктеу",
    documentNewTab: "жаңа қойындыда ашылады",
  },
};

const principleIcons = [BadgeCheck, ShieldCheck, UsersRound];
const documentFiles = ["/documents/charter-2022.pdf", "/documents/charter-amendments-2024.pdf"];
const governanceIcons = {
  presidium: Landmark,
  disciplinary: Gavel,
  ethics: ShieldCheck,
  audit: FileCheck2,
  attestation: UserRoundCheck,
};

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
          <div className="association-identity" data-tilt>
            <div className="association-seal">
              <span className="association-seal-emblem"><ShanyrakMark /></span>
              <span className="association-seal-orbit" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</span>
              <Scale className="association-seal-scale" />
              <strong>{ASSOCIATION.domain}</strong>
              <small>{locale === "ru" ? "область Жетісу" : "Жетісу облысы"}</small>
            </div>
            <div className="association-motto"><span aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</span><p>{t.motto}</p></div>
          </div>
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

      <section className="section association-documents-section" id="documents" aria-labelledby="association-documents-title">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div className="eyebrow"><span />{t.documentsEyebrow}</div>
            <h2 id="association-documents-title">{t.documentsTitle}</h2>
            <p>{t.documentsLead}</p>
          </div>
          <div className="association-documents-grid">
            {t.documents.map(([title, description, details], index) => (
              <article className="association-document-card" key={documentFiles[index]} data-reveal>
                <div className="association-document-top"><span className="association-document-icon"><FileText aria-hidden="true" /></span><span>{details}</span></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="association-document-actions">
                  <a className="button button-dark" href={documentFiles[index]} target="_blank" rel="noopener noreferrer" aria-label={`${t.openDocument}: ${title}, ${t.documentNewTab}`}>{t.openDocument}<ExternalLink aria-hidden="true" /></a>
                  <a className="button button-outline-dark" href={documentFiles[index]} download aria-label={`${t.downloadDocument}: ${title}`}>{t.downloadDocument}<Download aria-hidden="true" /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section governance-section" id="organy">
        <div className="governance-streams" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => <i key={index} style={{ "--governance-stream": index } as React.CSSProperties} />)}
        </div>
        <div className="shell">
          <div className="section-heading split-heading governance-heading" data-reveal>
            <div>
              <div className="eyebrow"><span />{t.structureEyebrow}</div>
              <h2>{t.structureTitle}</h2>
              <p>{t.structureLead}</p>
            </div>
            <div className="governance-summary" aria-label={t.structureTitle}>
              <span><strong>07</strong>{locale === "ru" ? "членов президиума" : "төралқа мүшесі"}</span>
              <span><strong>04</strong>{locale === "ru" ? "комиссии" : "комиссия"}</span>
              <span><strong>28</strong>{locale === "ru" ? "делегатов конференции" : "конференция делегаты"}</span>
            </div>
          </div>

          <div className="governance-source" data-reveal><BadgeCheck /><span>{t.structureSource}</span></div>

          <div className="governance-grid">
            {GOVERNANCE_GROUPS.map((group, groupIndex) => {
              const Icon = governanceIcons[group.key];
              return (
                <article className={`governance-card ${group.key === "presidium" ? "featured" : ""} ${group.key === "disciplinary" ? "with-related" : ""}`} key={group.key} data-reveal style={{ "--reveal-delay": `${Math.min(groupIndex, 3) * 70}ms` } as React.CSSProperties}>
                  <header>
                    <span className="governance-card-icon"><Icon /></span>
                    <div><small>{String(groupIndex + 1).padStart(2, "0")}</small><h3>{group.title[locale]}</h3></div>
                    <em>{group.members.length} {t.membersLabel}</em>
                  </header>
                  <ol className="governance-members">
                    {group.members.map((member, index) => (
                      <li key={member.name}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{member.name}</strong>
                        {member.chair ? <small>{t.chairRole}</small> : null}
                      </li>
                    ))}
                  </ol>
                  {group.related ? (
                    <div className="governance-related">
                      {group.related.map((related) => (
                        <section key={related.title.ru}>
                          <h4>{related.title[locale]}</h4>
                          <ul>{related.members.map((member) => <li key={member.name}>{member.name}</li>)}</ul>
                        </section>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <section className="representation-panel" data-reveal>
            <header className="representation-heading">
              <span><Vote /></span>
              <div><small>{t.representationEyebrow}</small><h2>{t.representationTitle}</h2></div>
            </header>
            <div className="representation-grid">
              <article className="representation-card">
                <small>01</small>
                <h3>{t.republicanPresidium}</h3>
                <ol>{REPUBLICAN_PRESIDIUM.map((member) => <li key={member.name}>{member.name}</li>)}</ol>
              </article>
              <article className="representation-card">
                <small>02</small>
                <h3>{t.republicanDelegates}</h3>
                <ol>{REPUBLICAN_CONFERENCE_DELEGATES.map((member) => <li key={member.name}>{member.name}</li>)}</ol>
              </article>
            </div>
            <details className="delegate-drawer">
              <summary><span><strong>03</strong>{t.showDelegates}</span><ChevronDown /></summary>
              <div>
                <h3>{t.regionalDelegates}</h3>
                <ol>{REGIONAL_CONFERENCE_DELEGATES.map((member) => <li key={member.name}>{member.name}</li>)}</ol>
              </div>
            </details>
          </section>
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
