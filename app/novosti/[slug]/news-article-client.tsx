"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, Newspaper } from "lucide-react";
import { PortalFooter, PortalHeader } from "../../components/portal-shell";
import { NEWS_DATA_URL, type NewsPost } from "../../lib/portal-data";
import { usePersistentLocale } from "../../lib/use-persistent-locale";

export default function NewsArticleClient({ slug }: { slug: string }) {
  const [locale, setLocale] = usePersistentLocale();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${NEWS_DATA_URL}?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.json() as Promise<{ posts: NewsPost[] }>)
      .then((result) => { if (active) { setPost(result.posts[0] ?? null); setReady(true); } })
      .catch(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [slug]);

  const kk = locale === "kk";
  const title = post ? (kk && post.titleKk ? post.titleKk : post.titleRu) : "";
  const content = post ? (kk && post.contentKk ? post.contentKk : post.contentRu) : "";
  const date = post?.eventDate ?? post?.publishedAt;

  return (
    <main id="main-content">
      <PortalHeader locale={locale} onLocaleChange={setLocale} />
      <section className="article-section">
        <div className="shell article-shell">
          <Link className="article-back" href="/novosti"><ArrowLeft />{kk ? "Жаңалықтарға оралу" : "Вернуться к новостям"}</Link>
          {!ready && <div className="status-panel"><span className="spinner" />{kk ? "Жарияланым жүктелуде…" : "Загружаем публикацию…"}</div>}
          {ready && !post && <div className="news-empty"><span><Newspaper /></span><h1>{kk ? "Жарияланым табылмады" : "Публикация не найдена"}</h1></div>}
          {post && (
            <article className="news-article">
              {post.imageUrl && <img className="news-article-image" src={post.imageUrl} alt={title} width="1200" height="675" />}
              <div className="news-article-content">
              <div className="news-card-meta">
                <span>{post.kind === "event" ? <CalendarDays /> : <Newspaper />}{post.kind === "event" ? (kk ? "Іс-шара" : "Мероприятие") : (kk ? "Жаңалық" : "Новость")}</span>
                {date && <time dateTime={date}>{new Intl.DateTimeFormat(kk ? "kk-KZ" : "ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date))}</time>}
              </div>
              <h1>{title}</h1>
              <div className="article-body">{content.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              {post.sourceUrl && <a className="article-source" href={post.sourceUrl} target="_blank" rel="noreferrer"><span><small>{kk ? "Дереккөз" : "Источник"}</small><strong>{post.sourceLabel || "Официальная публикация"}</strong></span><ExternalLink /></a>}
              </div>
            </article>
          )}
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}
