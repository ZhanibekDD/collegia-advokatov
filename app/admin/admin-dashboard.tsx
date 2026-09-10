"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Archive,
  ArrowLeft,
  Bot,
  CheckCircle2,
  CircleOff,
  FilePenLine,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import type { NewsPost, OfficialAdvocate } from "../lib/portal-data";

type AdminAdvocate = OfficialAdvocate & { active: boolean; updatedAt: string };
type Stats = { advocates: number; publishedNews: number; drafts: number; telegramConfigured: boolean };
type Tab = "advocates" | "news" | "system";

const emptyAdvocate = {
  id: "",
  name: "",
  region: "область Жетісу",
  consultation: "",
  contacts: "",
  ggup2026: false,
  ggupSourceId: "",
};
const emptyNews = {
  id: "",
  titleRu: "",
  titleKk: "",
  excerptRu: "",
  excerptKk: "",
  contentRu: "",
  contentKk: "",
  eventDate: "",
  kind: "news" as "news" | "event",
  status: "draft" as "draft" | "published",
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const result = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(result.error ?? "Операция не выполнена");
  return result;
}

async function loadDashboardData() {
  return Promise.all([
    api<{ advocates: AdminAdvocate[] }>("/api/admin/advocates"),
    api<{ posts: NewsPost[] }>("/api/admin/news"),
    api<Stats>("/api/admin/status"),
  ]);
}

export default function AdminDashboard({ userName, signOutPath }: { userName: string; signOutPath: string }) {
  const [tab, setTab] = useState<Tab>("advocates");
  const [advocates, setAdvocates] = useState<AdminAdvocate[]>([]);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [query, setQuery] = useState("");
  const [advocateForm, setAdvocateForm] = useState(emptyAdvocate);
  const [newsForm, setNewsForm] = useState(emptyNews);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function reload() {
    setLoading(true);
    try {
      const [advocateResult, newsResult, statusResult] = await loadDashboardData();
      setAdvocates(advocateResult.advocates);
      setPosts(newsResult.posts);
      setStats(statusResult);
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Не удалось загрузить данные" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    void loadDashboardData()
      .then(([advocateResult, newsResult, statusResult]) => {
        if (!active) return;
        setAdvocates(advocateResult.advocates);
        setPosts(newsResult.posts);
        setStats(statusResult);
      })
      .catch((error) => {
        if (!active) return;
        setNotice({ type: "error", text: error instanceof Error ? error.message : "Не удалось загрузить данные" });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const visibleAdvocates = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ru-RU");
    return advocates.filter((item) => !needle || `${item.name} ${item.consultation} ${item.sourceId}`.toLocaleLowerCase("ru-RU").includes(needle));
  }, [advocates, query]);

  function editAdvocate(item: AdminAdvocate) {
    setAdvocateForm({
      id: item.id,
      name: item.name,
      region: item.region,
      consultation: item.consultation,
      contacts: item.contacts.map((contact) => contact.display).join(", "),
      ggup2026: item.ggup2026,
      ggupSourceId: item.ggupSourceId ? String(item.ggupSourceId) : "",
    });
    document.getElementById("advocate-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitAdvocate(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const editing = Boolean(advocateForm.id);
      await api("/api/admin/advocates", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(advocateForm),
      });
      setAdvocateForm(emptyAdvocate);
      setNotice({ type: "ok", text: editing ? "Данные адвоката обновлены" : "Адвокат добавлен" });
      await reload();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Ошибка сохранения" });
    } finally {
      setBusy(false);
    }
  }

  async function setAdvocateActive(item: AdminAdvocate, active: boolean) {
    setBusy(true);
    try {
      await api("/api/admin/advocates", { method: "PATCH", body: JSON.stringify({ id: item.id, active }) });
      setNotice({ type: "ok", text: active ? "Запись восстановлена" : "Адвокат скрыт с публичного сайта" });
      await reload();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Ошибка изменения" });
    } finally {
      setBusy(false);
    }
  }

  function editNews(post: NewsPost) {
    setNewsForm({
      id: post.id,
      titleRu: post.titleRu,
      titleKk: post.titleKk,
      excerptRu: post.excerptRu,
      excerptKk: post.excerptKk,
      contentRu: post.contentRu,
      contentKk: post.contentKk,
      eventDate: post.eventDate ?? "",
      kind: post.kind,
      status: post.status === "published" ? "published" : "draft",
    });
    document.getElementById("news-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitNews(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const editing = Boolean(newsForm.id);
      await api("/api/admin/news", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(newsForm),
      });
      setNewsForm(emptyNews);
      setNotice({ type: "ok", text: newsForm.status === "published" ? "Новость опубликована" : "Черновик сохранён" });
      await reload();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Ошибка публикации" });
    } finally {
      setBusy(false);
    }
  }

  async function setNewsStatus(post: NewsPost, status: "draft" | "published" | "archived") {
    setBusy(true);
    try {
      await api("/api/admin/news", { method: "PATCH", body: JSON.stringify({ id: post.id, ...post, status }) });
      setNotice({ type: "ok", text: status === "published" ? "Публикация размещена" : status === "archived" ? "Публикация в архиве" : "Публикация возвращена в черновики" });
      await reload();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Ошибка изменения" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span><ShieldCheck /></span><div><strong>KAOJ.KZ</strong><small>Центр управления</small></div></div>
        <nav>
          <button className={tab === "advocates" ? "active" : ""} onClick={() => setTab("advocates")}><UsersRound />Адвокаты<strong>{stats?.advocates ?? "—"}</strong></button>
          <button className={tab === "news" ? "active" : ""} onClick={() => setTab("news")}><Newspaper />Новости<strong>{stats?.publishedNews ?? "—"}</strong></button>
          <button className={tab === "system" ? "active" : ""} onClick={() => setTab("system")}><Bot />Telegram</button>
        </nav>
        <div className="admin-sidebar-foot"><small>Вы вошли как</small><strong>{userName}</strong><a href={signOutPath}><LogOut />Выйти</a></div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div><LayoutDashboard /><span>Управление официальными данными</span></div>
          <div><Link href="/"><ArrowLeft />На сайт</Link><button type="button" disabled={loading} onClick={() => void reload()}><RefreshCw className={loading ? "spin" : ""} />Обновить</button></div>
        </header>

        <div className="admin-content">
          {notice && <div className={`admin-notice ${notice.type}`} role="status">{notice.type === "ok" ? <CheckCircle2 /> : <CircleOff />}<span>{notice.text}</span><button onClick={() => setNotice(null)}><X /></button></div>}
          {loading && <div className="admin-loading"><span className="spinner" />Загружаем рабочее пространство…</div>}

          {!loading && tab === "advocates" && (
            <>
              <div className="admin-heading"><div><small>Реестр коллегии</small><h1>Управление адвокатами</h1><p>Изменения сразу отражаются в публичном списке. Завершивших деятельность безопасно скрывайте — запись останется доступной для восстановления.</p></div><button className="admin-primary" onClick={() => setAdvocateForm(emptyAdvocate)}><Plus />Добавить адвоката</button></div>
              <div className="admin-grid">
                <section className="admin-panel admin-list-panel">
                  <label className="admin-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ФИО, подразделение или номер" /></label>
                  <div className="admin-list">
                    {visibleAdvocates.map((item) => (
                      <article className={!item.active ? "inactive" : ""} key={item.id}>
                        <span className="admin-index">{String(item.sourceId).padStart(3, "0")}</span>
                        <div><strong>{item.name}</strong><small>{item.consultation}</small><em>{item.active ? "На сайте" : "Скрыт"}{item.ggup2026 ? " · ГГЮП 2026" : ""}</em></div>
                        <button title="Редактировать" onClick={() => editAdvocate(item)}><FilePenLine /></button>
                        <button title={item.active ? "Скрыть" : "Восстановить"} disabled={busy} onClick={() => void setAdvocateActive(item, !item.active)}>{item.active ? <Archive /> : <RefreshCw />}</button>
                      </article>
                    ))}
                  </div>
                </section>

                <form className="admin-panel admin-form" id="advocate-editor" onSubmit={submitAdvocate}>
                  <header><span><UsersRound /></span><div><small>{advocateForm.id ? "Редактирование" : "Новая запись"}</small><h2>{advocateForm.id ? "Данные адвоката" : "Добавить адвоката"}</h2></div></header>
                  <label><span>ФИО</span><input required value={advocateForm.name} onChange={(event) => setAdvocateForm({ ...advocateForm, name: event.target.value })} /></label>
                  <label><span>Регион</span><input required value={advocateForm.region} onChange={(event) => setAdvocateForm({ ...advocateForm, region: event.target.value })} /></label>
                  <label><span>Подразделение / форма практики</span><input required value={advocateForm.consultation} onChange={(event) => setAdvocateForm({ ...advocateForm, consultation: event.target.value })} /></label>
                  <label><span>Контакты</span><textarea required rows={3} value={advocateForm.contacts} onChange={(event) => setAdvocateForm({ ...advocateForm, contacts: event.target.value })} placeholder="Разделяйте номера запятой" /></label>
                  <label className="admin-check"><input type="checkbox" checked={advocateForm.ggup2026} onChange={(event) => setAdvocateForm({ ...advocateForm, ggup2026: event.target.checked })} /><span><strong>Участник ГГЮП 2026</strong><small>Показывать отметку в публичной карточке</small></span></label>
                  <label><span>Номер в списке ГГЮП</span><input type="number" min="1" disabled={!advocateForm.ggup2026} value={advocateForm.ggupSourceId} onChange={(event) => setAdvocateForm({ ...advocateForm, ggupSourceId: event.target.value })} placeholder="Если указан" /></label>
                  <div className="admin-form-actions"><button type="button" onClick={() => setAdvocateForm(emptyAdvocate)}>Очистить</button><button className="admin-primary" disabled={busy} type="submit"><Save />{advocateForm.id ? "Сохранить" : "Добавить"}</button></div>
                </form>
              </div>
            </>
          )}

          {!loading && tab === "news" && (
            <>
              <div className="admin-heading"><div><small>Редакция сайта</small><h1>Новости и мероприятия</h1><p>Создавайте черновики, публикуйте официальные сообщения и отправляйте завершённые материалы в архив.</p></div><button className="admin-primary" onClick={() => setNewsForm(emptyNews)}><Plus />Новая публикация</button></div>
              <div className="admin-grid">
                <section className="admin-panel admin-list-panel">
                  <div className="admin-list news-admin-list">
                    {posts.length === 0 && <div className="admin-empty"><Newspaper /><strong>Публикаций пока нет</strong><span>Создайте первую новость или мероприятие.</span></div>}
                    {posts.map((post) => (
                      <article className={post.status === "archived" ? "inactive" : ""} key={post.id}>
                        <span className="admin-index">{post.kind === "event" ? "СБ" : "НОВ"}</span>
                        <div><strong>{post.titleRu}</strong><small>{post.eventDate || "Дата не указана"}</small><em>{post.status === "published" ? "Опубликовано" : post.status === "draft" ? "Черновик" : "Архив"}</em></div>
                        <button title="Редактировать" onClick={() => editNews(post)}><FilePenLine /></button>
                        {post.status !== "published" && <button title="Опубликовать" disabled={busy} onClick={() => void setNewsStatus(post, "published")}><Send /></button>}
                        {post.status !== "archived" && <button title="В архив" disabled={busy} onClick={() => void setNewsStatus(post, "archived")}><Archive /></button>}
                      </article>
                    ))}
                  </div>
                </section>

                <form className="admin-panel admin-form" id="news-editor" onSubmit={submitNews}>
                  <header><span><Newspaper /></span><div><small>{newsForm.id ? "Редактирование" : "Новая публикация"}</small><h2>{newsForm.id ? "Материал" : "Создать материал"}</h2></div></header>
                  <div className="admin-form-row"><label><span>Тип</span><select value={newsForm.kind} onChange={(event) => setNewsForm({ ...newsForm, kind: event.target.value === "event" ? "event" : "news" })}><option value="news">Новость</option><option value="event">Мероприятие</option></select></label><label><span>Дата события</span><input type="date" value={newsForm.eventDate} onChange={(event) => setNewsForm({ ...newsForm, eventDate: event.target.value })} /></label></div>
                  <label><span>Заголовок на русском</span><input required value={newsForm.titleRu} onChange={(event) => setNewsForm({ ...newsForm, titleRu: event.target.value })} /></label>
                  <label><span>Қазақша тақырып</span><input value={newsForm.titleKk} onChange={(event) => setNewsForm({ ...newsForm, titleKk: event.target.value })} /></label>
                  <label><span>Краткий анонс</span><textarea rows={2} value={newsForm.excerptRu} onChange={(event) => setNewsForm({ ...newsForm, excerptRu: event.target.value })} /></label>
                  <label><span>Полный текст</span><textarea rows={7} value={newsForm.contentRu} onChange={(event) => setNewsForm({ ...newsForm, contentRu: event.target.value })} /></label>
                  <label><span>Қазақша қысқаша мәтін</span><textarea rows={2} value={newsForm.excerptKk} onChange={(event) => setNewsForm({ ...newsForm, excerptKk: event.target.value })} /></label>
                  <label><span>Қазақша толық мәтін</span><textarea rows={5} value={newsForm.contentKk} onChange={(event) => setNewsForm({ ...newsForm, contentKk: event.target.value })} /></label>
                  <label><span>После сохранения</span><select value={newsForm.status} onChange={(event) => setNewsForm({ ...newsForm, status: event.target.value === "published" ? "published" : "draft" })}><option value="draft">Сохранить черновик</option><option value="published">Опубликовать на сайте</option></select></label>
                  <div className="admin-form-actions"><button type="button" onClick={() => setNewsForm(emptyNews)}>Очистить</button><button className="admin-primary" disabled={busy} type="submit"><Save />Сохранить</button></div>
                </form>
              </div>
            </>
          )}

          {!loading && tab === "system" && (
            <>
              <div className="admin-heading"><div><small>Удалённое управление</small><h1>Telegram-бот</h1><p>Бот использует те же операции и базу данных, что и эта панель. Каждое изменение записывается в журнал действий.</p></div></div>
              <div className="telegram-admin-grid">
                <section className="admin-panel telegram-status"><span className={stats?.telegramConfigured ? "ready" : "pending"}><Bot /></span><small>Состояние подключения</small><h2>{stats?.telegramConfigured ? "Бот настроен" : "Нужны данные Telegram"}</h2><p>{stats?.telegramConfigured ? "Webhook и список администраторов заданы. Бот готов принимать команды после регистрации webhook." : "Для запуска нужны токен от BotFather и числовые Telegram ID людей, которым разрешено изменять сайт."}</p></section>
                <section className="admin-panel telegram-commands"><h2>Основные команды</h2><dl><div><dt>/find ФИО</dt><dd>Найти адвоката</dd></div><div><dt>/advocate_add</dt><dd>Добавить адвоката</dd></div><div><dt>/advocate_update</dt><dd>Изменить данные</dd></div><div><dt>/advocate_delete</dt><dd>Скрыть запись</dd></div><div><dt>/news_publish</dt><dd>Опубликовать новость</dd></div><div><dt>/news_update</dt><dd>Изменить публикацию</dd></div><div><dt>/news_delete</dt><dd>Перенести в архив</dd></div></dl></section>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
