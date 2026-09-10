"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, FileCheck2, Gavel, HeartHandshake, Home, Scale, Search, ShieldAlert } from "lucide-react";
import { PortalFooter, PortalHeader } from "../components/portal-shell";
import { JetisuSignature } from "../components/portal-experience";
import { usePersistentLocale } from "../lib/use-persistent-locale";

const text = {
  ru: {
    eyebrow: "Правовая помощь",
    title: "С чего начать обращение к адвокату",
    lead: "Определите тему вопроса, подготовьте основные документы и выберите адвоката из актуального состава коллегии.",
    topicsEyebrow: "Частые вопросы",
    topicsTitle: "Выберите направление ситуации",
    topics: [
      ["Уголовные дела", "Задержание, допрос, обвинение, защита подозреваемого или потерпевшего."],
      ["Семья и дети", "Расторжение брака, алименты, место жительства детей, наследство."],
      ["Гражданские споры", "Долги, ущерб, обязательства, защита прав в судебном процессе."],
      ["Бизнес", "Договоры, проверки, корпоративные и экономические споры."],
      ["Имущество", "Недвижимость, земля, жильё и регистрация прав."],
    ],
    note: "Список коллегии не содержит специализации адвокатов. Направления ниже помогают сформулировать вопрос, но не являются рейтингом или рекомендацией конкретного специалиста.",
    stepsEyebrow: "Перед обращением",
    stepsTitle: "Три практических шага",
    steps: [
      ["Кратко опишите ситуацию", "Зафиксируйте ключевые события, даты, участников и желаемый результат."],
      ["Соберите документы", "Подготовьте договоры, уведомления, судебные документы и переписку по делу."],
      ["Выберите адвоката", "Найдите фамилию в актуальном списке или откройте юридическую консультацию своего района."],
    ],
    directory: "Открыть список адвокатов",
    consultations: "Юридические консультации",
    ggupEyebrow: "Государственная гарантия",
    ggupTitle: "Гарантированная государством юридическая помощь",
    ggupText: "В январском списке 2026 года отмечены 50 адвокатов коллегии, участвующих в оказании ГГЮП.",
    ggupAction: "Открыть участников ГГЮП",
  },
  kk: {
    eyebrow: "Құқықтық көмек",
    title: "Адвокатқа жүгінуді неден бастау керек",
    lead: "Сұрақтың тақырыбын анықтап, негізгі құжаттарды дайындаңыз және алқаның өзекті құрамынан адвокатты таңдаңыз.",
    topicsEyebrow: "Жиі кездесетін сұрақтар",
    topicsTitle: "Жағдайдың бағытын таңдаңыз",
    topics: [
      ["Қылмыстық істер", "Ұстау, жауап алу, айыптау, күдіктіні немесе жәбірленушіні қорғау."],
      ["Отбасы және балалар", "Некені бұзу, алимент, балалардың тұрғылықты жері, мұрагерлік."],
      ["Азаматтық даулар", "Қарыздар, залал, міндеттемелер, сот процесінде құқықтарды қорғау."],
      ["Бизнес", "Шарттар, тексерулер, корпоративтік және экономикалық даулар."],
      ["Мүлік", "Жылжымайтын мүлік, жер, тұрғын үй және құқықтарды тіркеу."],
    ],
    note: "Алқа тізімінде адвокаттардың мамандануы жоқ. Төмендегі бағыттар сұрақты тұжырымдауға көмектеседі, бірақ нақты маманның рейтингі немесе ұсынысы емес.",
    stepsEyebrow: "Жүгінер алдында",
    stepsTitle: "Үш практикалық қадам",
    steps: [
      ["Жағдайды қысқаша сипаттаңыз", "Негізгі оқиғаларды, күндерді, қатысушыларды және қалаған нәтижені белгілеңіз."],
      ["Құжаттарды жинаңыз", "Шарттарды, хабарламаларды, сот құжаттарын және іс бойынша хат алмасуды дайындаңыз."],
      ["Адвокатты таңдаңыз", "Өзекті тізімнен тегін табыңыз немесе ауданыңыздың заң консультациясын ашыңыз."],
    ],
    directory: "Адвокаттар тізімін ашу",
    consultations: "Заң консультациялары",
    ggupEyebrow: "Мемлекеттік кепілдік",
    ggupTitle: "Мемлекет кепілдік берген заң көмегі",
    ggupText: "2026 жылғы қаңтар тізімінде МКБЗК көрсетуге қатысатын 50 алқа адвокаты белгіленген.",
    ggupAction: "МКБЗК қатысушыларын ашу",
  },
};

const topicIcons = [Gavel, HeartHandshake, Scale, BriefcaseBusiness, Home];
const stepIcons = [Search, FileCheck2, Building2];

export default function HelpPage() {
  const [locale, setLocale] = usePersistentLocale();
  const t = text[locale];

  return (
    <main id="main-content">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="page-hero help-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <JetisuSignature locale={locale} />
        <div className="shell page-hero-inner" data-reveal>
          <div className="eyebrow light"><span />{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="guidance-note" data-reveal><ShieldAlert /><p>{t.note}</p></div>
          <article className="ggup-feature" data-reveal>
            <span className="ggup-feature-icon"><Scale /></span>
            <div>
              <small>{t.ggupEyebrow}</small>
              <h2>{t.ggupTitle}</h2>
              <p>{t.ggupText}</p>
            </div>
            <Link className="button button-accent" href="/advokaty?ggup=1">{t.ggupAction}<ArrowRight /></Link>
          </article>
          <div className="section-heading centered" data-reveal>
            <div className="eyebrow"><span />{t.topicsEyebrow}<span /></div>
            <h2>{t.topicsTitle}</h2>
          </div>
          <div className="topic-grid">
            {t.topics.map(([title, description], index) => {
              const Icon = topicIcons[index];
              return <article className="topic-card" data-reveal key={title}><span className="center-icon"><Icon /></span><h3>{title}</h3><p>{description}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div className="eyebrow"><span />{t.stepsEyebrow}</div>
            <h2>{t.stepsTitle}</h2>
          </div>
          <div className="steps-list">
            {t.steps.map(([title, description], index) => {
              const Icon = stepIcons[index];
              return <article data-reveal key={title}><span className="step-number">0{index + 1}</span><span className="center-icon"><Icon /></span><div><h3>{title}</h3><p>{description}</p></div></article>;
            })}
          </div>
          <div className="help-actions">
            <Link className="button button-dark" href="/advokaty">{t.directory}<ArrowRight /></Link>
            <Link className="button button-outline-dark" href="/konsultacii">{t.consultations}<Building2 /></Link>
          </div>
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
