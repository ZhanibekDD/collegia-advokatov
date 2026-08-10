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
import { type Locale, practiceOptions, regionOptions } from "../lib/portal-data";

const issues = [
  { value: "Уголовное право", icon: "§", ru: "Уголовное дело", kk: "Қылмыстық іс", ruText: "Задержание, допрос, обвинение или защита потерпевшего", kkText: "Ұстау, жауап алу, айыптау немесе жәбірленушіні қорғау" },
  { value: "Семейное право", icon: "01", ru: "Семья и дети", kk: "Отбасы және балалар", ruText: "Развод, алименты, дети или наследство", kkText: "Ажырасу, алимент, балалар немесе мұрагерлік" },
  { value: "Бизнес и налоги", icon: "₸", ru: "Бизнес", kk: "Бизнес", ruText: "Договоры, налоги, проверки и корпоративные споры", kkText: "Шарттар, салықтар, тексерулер және корпоративтік даулар" },
  { value: "Гражданские споры", icon: "✓", ru: "Гражданский спор", kk: "Азаматтық дау", ruText: "Долги, ущерб, обязательства и судебные дела", kkText: "Қарыздар, залал, міндеттемелер және сот істері" },
  { value: "Недвижимость", icon: "⌂", ru: "Имущество", kk: "Мүлік", ruText: "Недвижимость, земля и жилищные вопросы", kkText: "Жылжымайтын мүлік, жер және тұрғын үй мәселелері" },
];

const urgency = [
  { value: "urgent", ru: "Нужна помощь сейчас", kk: "Көмек қазір қажет", ruText: "Человек задержан, идёт следственное действие или есть срочный риск", kkText: "Адам ұсталды, тергеу әрекеті жүріп жатыр немесе шұғыл қауіп бар" },
  { value: "soon", ru: "В течение 1–3 дней", kk: "1–3 күн ішінде", ruText: "Есть срок, заседание, проверка или важный документ", kkText: "Мерзім, отырыс, тексеру немесе маңызды құжат бар" },
  { value: "planned", ru: "Плановая консультация", kk: "Жоспарлы кеңес", ruText: "Хочу спокойно оценить ситуацию и выбрать стратегию", kkText: "Жағдайды байыппен бағалап, стратегияны таңдағым келеді" },
];

const issueIcons = [Gavel, HeartHandshake, BriefcaseBusiness, Scale, House];

const text = {
  ru: {
    eyebrow: "Навигатор правовой помощи", title: "Получите понятный маршрут за три шага", lead: "Ответьте на несколько простых вопросов. Мы определим подходящее направление и подготовим переход к каталогу — без передачи персональных данных.",
    steps: ["Ситуация", "Срочность", "Регион"], question1: "Что произошло?", question2: "Насколько срочно нужна помощь?", question3: "В каком регионе нужна помощь?", back: "Назад", next: "Продолжить", resultEyebrow: "Ваш маршрут готов", resultTitle: "Подходящее направление найдено", resultText: "Мы подготовили фильтр каталога по вашему запросу. Перед обращением проверьте статус, опыт и условия работы выбранного адвоката.", open: "Показать подходящих адвокатов", restart: "Начать заново", privacy: "Ответы используются только для формирования маршрута на этом устройстве и никуда не отправляются.", selected: "Вы выбрали", priority: "Приоритет", location: "Регион",
  },
  kk: {
    eyebrow: "Құқықтық көмек навигаторы", title: "Үш қадамда түсінікті бағыт алыңыз", lead: "Бірнеше қарапайым сұраққа жауап беріңіз. Біз қолайлы бағытты анықтап, жеке деректерді бермей-ақ каталогқа өтуді дайындаймыз.",
    steps: ["Жағдай", "Жеделдік", "Өңір"], question1: "Не болды?", question2: "Көмек қаншалықты жедел қажет?", question3: "Көмек қай өңірде қажет?", back: "Артқа", next: "Жалғастыру", resultEyebrow: "Бағытыңыз дайын", resultTitle: "Сәйкес бағыт табылды", resultText: "Сұрауыңыз бойынша каталог сүзгісін дайындадық. Өтініш жасамас бұрын таңдалған адвокаттың мәртебесін, тәжірибесін және жұмыс шарттарын тексеріңіз.", open: "Сәйкес адвокаттарды көрсету", restart: "Қайта бастау", privacy: "Жауаптар тек осы құрылғыда бағыт құру үшін пайдаланылады және ешқайда жіберілмейді.", selected: "Сіз таңдадыңыз", priority: "Басымдық", location: "Өңір",
  },
};

export default function HelpPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("");
  const [region, setRegion] = useState("all");
  const t = text[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const suggestedPractice = params.get("practice");
      const suggestedRegion = params.get("region");
      if (suggestedPractice && practiceOptions.some((item) => item.value === suggestedPractice)) setIssue(suggestedPractice);
      if (suggestedRegion && regionOptions.some((item) => item.value === suggestedRegion)) setRegion(suggestedRegion);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedIssue = useMemo(() => issues.find((item) => item.value === issue), [issue]);
  const selectedUrgency = useMemo(() => urgency.find((item) => item.value === priority), [priority]);
  const selectedRegion = useMemo(() => regionOptions.find((item) => item.value === region), [region]);
  const canContinue = step === 0 ? Boolean(issue) : step === 1 ? Boolean(priority) : true;
  const resultUrl = `/advokaty?practice=${encodeURIComponent(issue)}${region !== "all" ? `&region=${encodeURIComponent(region)}` : ""}`;

  function restart() {
    setStep(0); setIssue(""); setPriority(""); setRegion("all");
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
              <div className="flow-question"><small>01 / 03</small><h2>{t.question1}</h2></div>
              <div className="issue-options">
                {issues.map((item, index) => {
                  const IssueIcon = issueIcons[index];
                  return (
                  <button className={issue === item.value ? "is-selected" : ""} onClick={() => setIssue(item.value)} key={item.value}>
                    <span><IssueIcon /></span><div><strong>{item[locale]}</strong><p>{locale === "ru" ? item.ruText : item.kkText}</p></div><i><Check /></i>
                  </button>
                )})}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flow-stage">
              <div className="flow-question"><small>02 / 03</small><h2>{t.question2}</h2></div>
              <div className="urgency-options">
                {urgency.map((item, index) => (
                  <button className={priority === item.value ? "is-selected" : ""} onClick={() => setPriority(item.value)} key={item.value}>
                    <span>{item.value === "urgent" ? <ShieldCheck /> : String(index + 1).padStart(2, "0")}</span><strong>{item[locale]}</strong><p>{locale === "ru" ? item.ruText : item.kkText}</p><i><Check /></i>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flow-stage">
              <div className="flow-question"><small>03 / 03</small><h2>{t.question3}</h2></div>
              <div className="region-choice-grid">
                {regionOptions.map((item) => (
                  <button className={region === item.value ? "is-selected" : ""} onClick={() => setRegion(item.value)} key={item.value}>
                    <span><MapPin /></span><strong>{item[locale]}</strong><i><Check /></i>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="flow-actions">
              <button className="flow-back" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft /> {t.back}</button>
              <button className="button button-dark" disabled={!canContinue} onClick={() => setStep((value) => value + 1)}>{t.next}<ArrowRight /></button>
            </div>
          )}

          {step === 3 && (
            <div className="flow-result">
              <div className="result-seal"><span><ShieldCheck /></span><small>ROUTE READY</small></div>
              <div className="eyebrow"><span />{t.resultEyebrow}</div>
              <h2>{t.resultTitle}</h2>
              <p>{t.resultText}</p>
              <div className="result-summary">
                <div><small>{t.selected}</small><strong>{locale === "ru" ? selectedIssue?.ru : selectedIssue?.kk}</strong></div>
                <div><small>{t.priority}</small><strong>{locale === "ru" ? selectedUrgency?.ru : selectedUrgency?.kk}</strong></div>
                <div><small>{t.location}</small><strong>{selectedRegion?.[locale]}</strong></div>
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
