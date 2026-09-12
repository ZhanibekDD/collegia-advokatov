"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Newspaper, Sparkles } from "lucide-react";
import { PortalFooter, PortalHeader } from "../components/portal-shell";
import { JetisuSignature } from "../components/portal-experience";
import type { NewsPost } from "../lib/portal-data";
import { usePersistentLocale } from "../lib/use-persistent-locale";

const text = {
  ru: {
    eyebrow: "Новости коллегии",
    title: "События, решения и важные объявления",
    lead: "Официальная лента Коллегии адвокатов области Жетісу: проведённые мероприятия, предстоящие встречи и новости адвокатского сообщества.",
    all: "Все публикации",
    news: "Новости",
    events: "Мероприятия",
    read: "Читать публикацию",
    empty: "Публикаций пока нет",
    emptyText: "Новости и сведения о мероприятиях появятся здесь после публикации коллегией.",
    newsLabel: "Новость",
    eventLabel: "Мероприятие",
  },
  kk: {
    eyebrow: "Алқа жаңалықтары",
    title: "Оқиғалар, шешімдер және маңызды хабарландырулар",
    lead: "Жетісу облыстық адвокаттар алқасының ресми лентасы: өткен іс-шаралар, алдағы кездесулер және адвокаттар қауымдастығының жаңалықтары.",
    all: "Барлық жарияланымдар",
    news: "Жаңалықтар",
    events: "Іс-шаралар",
    read: "Жарияланымды оқу",
    empty: "Әзірге жарияланым жоқ",
    emptyText: "Алқа жариялағаннан кейін жаңалықтар мен іс-шаралар туралы ақпарат осында шығады.",
    newsLabel: "Жаңалық",
    eventLabel: "Іс-шара",
  },
};

function formatDate(value: string | null, locale: "ru" | "kk") {
  if (!value) return locale === "ru" ? "Дата не указана" : "Күні көрсетілмеген";
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "kk-KZ", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export default function NewsPageClient({ initialPosts }: { initialPosts: NewsPost[] }) {
  const [locale, setLocale] = usePersistentLocale();
  const [filter, setFilter] = useState<"all" | "news" | "event">("all");
  const t = text[locale];
  const visible = useMemo(() => initialPosts.filter((post) => filter === "all" || post.kind === filter), [filter, initialPosts]);

  return (
    <main id="main-content">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="page-hero news-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <JetisuSignature locale={locale} />
        <div className="shell page-hero-inner" data-reveal>
          <div className="eyebrow light"><span />{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
      </section>

      <section className="news-section">
        <div className="shell">
          <div className="news-filter" data-reveal aria-label={locale === "ru" ? "Фильтр публикаций" : "Жарияланым сүзгісі"}>
            {(["all", "news", "event"] as const).map((value) => (
              <button type="button" className={filter === value ? "active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)} key={value}>
                {value === "all" ? <Sparkles /> : value === "news" ? <Newspaper /> : <CalendarDays />}
                {value === "all" ? t.all : value === "news" ? t.news : t.events}
                <strong>{value === "all" ? initialPosts.length : initialPosts.filter((post) => post.kind === value).length}</strong>
              </button>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="news-empty"><span><Newspaper /></span><h2>{t.empty}</h2><p>{t.emptyText}</p></div>
          )}
          {visible.length > 0 && (
            <div className="news-grid">
              {visible.map((post) => {
                const title = locale === "kk" && post.titleKk ? post.titleKk : post.titleRu;
                const excerpt = locale === "kk" && post.excerptKk ? post.excerptKk : post.excerptRu;
                return (
                  <article className="news-card" data-reveal key={post.id}>
                    {post.imageUrl && <img className="news-card-image" src={post.imageUrl} alt={title} width="1200" height="675" loading="lazy" />}
                    <div className="news-card-content">
                      <div className="news-card-meta">
                        <span>{post.kind === "event" ? <CalendarDays /> : <Newspaper />}{post.kind === "event" ? t.eventLabel : t.newsLabel}</span>
                        <time dateTime={post.eventDate ?? post.publishedAt ?? undefined}>{formatDate(post.eventDate ?? post.publishedAt, locale)}</time>
                      </div>
                      <h2>{title}</h2>
                      {excerpt && <p>{excerpt}</p>}
                      <Link href={`/novosti/${post.slug}`}>{t.read}<ArrowRight /></Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
