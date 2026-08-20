"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Gavel,
  HeartHandshake,
  House,
  LockKeyhole,
  MapPin,
  RotateCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { PortalFooter, PortalHeader } from "../components/portal-shell";
import { type Locale, practiceOptions } from "../lib/portal-data";

const issues = [
  { value: "Уголовное право", ru: "Уголовное дело", kk: "Қылмыстық іс", ruText: "Задержание, допрос, обвинение или защита потерпевшего", kkText: "Ұстау, жауап алу, айыптау немесе жәбірленушіні қорғау" },
  { value: "Семейное право", ru: "Семья и дети", kk: "Отбасы және балалар", ruText: "Развод, алименты, дети или наследство", kkText: "Ажырасу, алимент, балалар немесе мұрагерлік" },
  { value: "Бизнес и налоги", ru: "Бизнес", kk: "Бизнес", ruText: "Договоры, налоги, проверки и корпоративные споры", kkText: "Шарттар, салықтар, тексерулер және корпоративтік даулар" },
  { value: "Гражданские споры", ru: "Гражданский спор", kk: "Азаматтық дау", ruText: "Долги, ущерб, обязательства и судебные дела", kkText: "Қарыздар, залал, міндеттемелер және сот істері" },
  { value: "Недвижимость", ru: "Имущество", kk: "Мүлік", ruText: "Недвижимость, земля и жилищные вопросы", kkText: "Жылжымайтын мүлік, жер және тұрғын үй мәселелері" },
];

const urgency = [
  { value: "urgent", ru: "Нужна помощь сейчас", kk: "Көмек қазір қажет", ruText: "Человек задержан, идёт следственное действие или есть срочный риск", kkText: "Адам ұсталды, тергеу әрекеті жүріп жатыр немесе шұғыл қауіп бар" },
  { value: "soon", ru: "В течение 1–3 дней", kk: "1–3 күн ішінде", ruText: "Есть срок, заседание, проверка или важный документ", kkText: "Мерзім, отырыс, тексеру немесе маңызды құжат бар" },
  { value: "planned", ru: "Плановая консультация", kk: "Жоспарлы кеңес", ruText: "Хочу спокойно оценить ситуацию и выбрать стратегию", kkText: "Жағдайды байыппен бағалап, стратегияны таңдағым келеді" },
];

const issueIcons = [Gavel, HeartHandshake, BriefcaseBusiness, Scale, House];

const text = {
  ru: {
    eyebrow: "Навигатор правовой помощи",
    title: "Понятный маршрут за два шага",
    lead: "Выберите ситуацию и срочность. Мы подготовим переход к региональному каталогу адвокатов области Жетісу — без передачи персональных данных.",
    steps: ["Ситуация", "Срочность"],
    question1: "Что произошло?",
    question2: "Насколько срочно нужна помощь?",
    back: "Назад",
    next: "Продолжить",
    resultEyebrow: "Ваш маршрут готов",
    resultTitle: "Перейдите к адвокатам области Жетісу",
    resultText: "Каталог ограничен областью Жетісу. Перед заключением соглашения дополнительно проверьте текущий статус лицензии и условия работы выбранного адвоката.",
    open: "Открыть каталог адвокатов",
    restart: "Начать заново",
    privacy: "Ответы используются только для формирования маршрута на этом устройстве и никуда не отправляются.",
    selected: "Ситуация",
    priority: "Срочность",
    location: "Регион",
    locationValue: "Область Жетісу",
  },
  kk: {
    eyebrow: "Құқықтық көмек навигаторы",
    title: "Екі қадамда түсінікті бағыт алыңыз",
    lead: "Жағдай мен жеделдікті таңдаңыз. Біз жеке деректерді бермей-ақ Жетісу облысы адвокаттарының өңірлік каталогына өтуді дайындаймыз.",
    steps: ["Жағдай", "Жеделдік"],
    question1: "Не болды?",
    question2: "Көмек қаншалықты жедел қажет?",
    back: "Артқа",
    next: "Жалғастыру",
    resultEyebrow: "Бағытыңыз дайын",
    resultTitle: "Жетісу облысының адвокаттарына өтіңіз",
    resultText: "Каталог Жетісу облысымен шектелген. Келісім жасамас бұрын таңдалған адвокаттың лицензиясының ағымдағы мәртебесін және жұмыс шарттарын қосымша тексеріңіз.",
    open: "Адвокаттар каталогын ашу",
    restart: "Қайта бастау",
    privacy: "Жауаптар тек осы құрылғыда бағыт құру үшін пайдаланылады және ешқайда жіберілмейді.",
    selected: "Жағдай",
    priority: "Жеделдік",
    location: "Өңір",
    locationValue: "Жетісу облысы",
  },
};

export default function HelpPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("");
  const t = text[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const suggestedPractice = params.get("practice");
      if (suggestedPractice && practiceOptions.some((item) => item.value === suggestedPractice)) setIssue(suggestedPractice);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedIssue = useMemo(() => issues.find((item) => item.value === issue), [issue]);
  const selectedUrgency = useMemo(() => urgency.find((item) => item.value === priority), [priority]);
  const canContinue = step === 0 ? Boolean(issue) : Boolean(priority);
  const resultUrl = "/advokaty";

  function restart() {
    setStep(0);
    setIssue("");
    setPriority("");
  }

  return (
    <main className="portal-page help-flow-page">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />

      <section className="flow-hero">
        <div className="shell flow-hero-grid">
          <div>
            <div className="eyebrow light"><span />{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.lead}</p>
          </div>
          <div className="flow-privacy"><span><LockKeyhole /></span><p>{t.privacy}</p></div>
        </div>
      </section>

      <section className="flow-content">
        <div className="shell flow-shell">
          <div className="flow-progress">
            {t.steps.map((label, index) => (
              <div className={step >= index ? "is-active" : ""} key={label}>
                <span>{index + 1}</span><strong>{label}</strong>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="flow-stage">
              <div className="flow-question"><small>01 / 02</small><h2>{t.question1}</h2></div>
              <div className="issue-options">
                {issues.map((item, index) => {
                  const IssueIcon = issueIcons[index];
                  return (
                    <button className={issue === item.value ? "is-selected" : ""} onClick={() => setIssue(item.value)} key={item.value}>
                      <span><IssueIcon /></span>
                      <div><strong>{item[locale]}</strong><p>{locale === "ru" ? item.ruText : item.kkText}</p></div>
                      <i><Check /></i>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flow-stage">
              <div className="flow-question"><small>02 / 02</small><h2>{t.question2}</h2></div>
              <div className="urgency-options">
                {urgency.map((item, index) => (
                  <button className={priority === item.value ? "is-selected" : ""} onClick={() => setPriority(item.value)} key={item.value}>
                    <span>{item.value === "urgent" ? <ShieldCheck /> : String(index + 1).padStart(2, "0")}</span>
                    <strong>{item[locale]}</strong>
                    <p>{locale === "ru" ? item.ruText : item.kkText}</p>
                    <i><Check /></i>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step < 2 && (
            <div className="flow-actions">
              <button className="flow-back" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft /> {t.back}</button>
              <button className="button button-dark" disabled={!canContinue} onClick={() => setStep((value) => value + 1)}>{t.next}<ArrowRight /></button>
            </div>
          )}

          {step === 2 && (
            <div className="flow-result">
              <div className="result-seal"><span><ShieldCheck /></span><small>JETISU</small></div>
              <div className="eyebrow"><span />{t.resultEyebrow}</div>
              <h2>{t.resultTitle}</h2>
              <p>{t.resultText}</p>
              <div className="result-summary">
                <div><small>{t.selected}</small><strong>{locale === "ru" ? selectedIssue?.ru : selectedIssue?.kk}</strong></div>
                <div><small>{t.priority}</small><strong>{locale === "ru" ? selectedUrgency?.ru : selectedUrgency?.kk}</strong></div>
                <div><small>{t.location}</small><strong><MapPin /> {t.locationValue}</strong></div>
              </div>
              <div className="flow-result-actions">
                <a className="button button-primary" href={resultUrl}>{t.open}<ArrowUpRight /></a>
                <button onClick={restart}><RotateCcw />{t.restart}</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <PortalFooter locale={locale} />
    </main>
  );
}
