"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ArrowUp, Building2, Gavel, Landmark, Newspaper, Search, Sparkles, UserRoundSearch, X } from "lucide-react";
import { consultationName, type Locale } from "../lib/portal-data";
import { useDirectory } from "../lib/use-directory";

const portalRoutes = {
  ru: [
    ["Найти адвоката", "Поиск по официальному списку коллегии", "/advokaty", UserRoundSearch],
    ["Юридические консультации", "Городские и районные подразделения", "/konsultacii", Building2],
    ["Новости и мероприятия", "Официальные публикации коллегии", "/novosti", Newspaper],
    ["Правовая помощь", "Как подготовиться к обращению", "/pomosh", Gavel],
    ["О коллегии", "Контакты, руководство и реквизиты", "/regions", Landmark],
  ],
  kk: [
    ["Адвокат табу", "Алқаның ресми тізімі бойынша іздеу", "/advokaty", UserRoundSearch],
    ["Заң консультациялары", "Қалалық және аудандық бөлімшелер", "/konsultacii", Building2],
    ["Жаңалықтар мен іс-шаралар", "Алқаның ресми жарияланымдары", "/novosti", Newspaper],
    ["Құқықтық көмек", "Өтінішке қалай дайындалуға болады", "/pomosh", Gavel],
    ["Алқа туралы", "Байланыс, басшылық және деректемелер", "/regions", Landmark],
  ],
} as const;

export function RouteTransition() {
  const pathname = usePathname();
  return (
    <div className="route-transition" key={pathname} aria-hidden="true">
      <span />
    </div>
  );
}

export function PortalAtmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let frame = 0;

    const updateScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const progress = available > 0 ? window.scrollY / available : 0;
      root.style.setProperty("--page-progress", `${Math.min(1, Math.max(0, progress))}`);
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
        root.style.setProperty("--pointer-shift-x", `${(event.clientX / window.innerWidth - 0.5) * 14}px`);
        root.style.setProperty("--pointer-shift-y", `${(event.clientY / window.innerHeight - 0.5) * 10}px`);
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    if (!reducedMotion && !coarsePointer) window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      if (!reducedMotion && !coarsePointer) window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return (
    <div className="portal-atmosphere" aria-hidden="true">
      <div className="portal-progress" />
      <div className="pointer-aura" />
      <div className="seven-streams">
        {Array.from({ length: 7 }, (_, index) => <span style={{ "--stream": index } as React.CSSProperties} key={index} />)}
      </div>
    </div>
  );
}

export function PortalCommand({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { directory } = useDirectory();
  const routes = portalRoutes[locale];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        if (open) {
          setOpen(false);
          setQuery("");
          window.setTimeout(() => triggerRef.current?.focus(), 0);
        } else {
          setOpen(true);
        }
      }
      if (event.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
        window.setTimeout(() => triggerRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const advocateMatches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU");
    if (needle.length < 2 || !directory) return [];
    return directory.advocates
      .filter((advocate) => `${advocate.name} ${advocate.consultation}`.toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU").includes(needle))
      .slice(0, 6);
  }, [directory, locale, query]);

  const routeMatches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU");
    if (!needle) return routes;
    return routes.filter(([title, description]) => `${title} ${description}`.toLocaleLowerCase(locale === "kk" ? "kk-KZ" : "ru-RU").includes(needle));
  }, [locale, query, routes]);

  const close = () => {
    setOpen(false);
    setQuery("");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const trapFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, input, a[href], [tabindex]:not([tabindex="-1"])'));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        className="command-trigger"
        type="button"
        aria-controls="portal-command"
        aria-expanded={open}
        aria-label={locale === "ru" ? "Быстрый поиск по порталу" : "Портал бойынша жылдам іздеу"}
        title={locale === "ru" ? "Быстрый поиск — Ctrl + K" : "Жылдам іздеу — Ctrl + K"}
        onClick={() => setOpen(true)}
      >
        <Search />
        <kbd>Ctrl K</kbd>
      </button>

      {open && createPortal(
        <div className="command-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="command-panel" id="portal-command" role="dialog" aria-modal="true" aria-label={locale === "ru" ? "Навигация и поиск" : "Навигация және іздеу"} onKeyDown={trapFocus}>
            <header className="command-head">
              <span><Sparkles /></span>
              <div>
                <strong>KAOJ<span>.KZ</span></strong>
                <small>{locale === "ru" ? "Центр быстрого доступа" : "Жылдам қол жеткізу орталығы"}</small>
              </div>
              <button type="button" aria-label={locale === "ru" ? "Закрыть" : "Жабу"} onClick={close}><X /></button>
            </header>

            <label className="command-search">
              <Search />
              <span className="sr-only">{locale === "ru" ? "Найти адвоката или раздел" : "Адвокат немесе бөлім табу"}</span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={locale === "ru" ? "Фамилия адвоката или нужный раздел…" : "Адвокаттың тегі немесе қажетті бөлім…"}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="portal-command-results"
                aria-expanded="true"
              />
              <kbd>ESC</kbd>
            </label>

            <div className="command-results" id="portal-command-results" aria-live="polite">
              {routeMatches.length > 0 && (
                <div className="command-group">
                  <p>{locale === "ru" ? "Разделы портала" : "Портал бөлімдері"}</p>
                  <div className="command-route-grid">
                    {routeMatches.map(([title, description, href, Icon], index) => (
                      <Link href={href} onClick={close} key={href}>
                        <span><Icon /></span><div><strong>{title}</strong><small>{description}</small></div><em>0{index + 1}</em>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {query.trim().length >= 2 && (
                <div className="command-group command-advocates">
                  <p>{locale === "ru" ? "Адвокаты" : "Адвокаттар"}<span>{advocateMatches.length}</span></p>
                  {advocateMatches.map((advocate) => (
                    <Link href={`/advokaty/${advocate.id}`} onClick={close} key={advocate.id}>
                      <em>№ {advocate.sourceId}</em>
                      <div><strong>{advocate.name}</strong><small>{consultationName(advocate.consultation, locale)}</small></div>
                      <ArrowRight />
                    </Link>
                  ))}
                  {advocateMatches.length === 0 && (
                    <Link className="command-full-search" href={`/advokaty?q=${encodeURIComponent(query.trim())}`} onClick={close}>
                      <Search /><span>{locale === "ru" ? "Открыть полный поиск по реестру" : "Тізілім бойынша толық іздеуді ашу"}</span><ArrowRight />
                    </Link>
                  )}
                </div>
              )}
            </div>

            <footer className="command-footer">
              <span><i />{locale === "ru" ? "Официальный список · 01.09.2026" : "Ресми тізім · 01.09.2026"}</span>
              <span>{locale === "ru" ? "Быстрая навигация" : "Жылдам навигация"}<ArrowRight /></span>
            </footer>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

export function BackToTop({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 520);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      className={visible ? "back-to-top is-visible" : "back-to-top"}
      type="button"
      aria-label={locale === "ru" ? "Наверх страницы" : "Беттің басына"}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp />
    </button>
  );
}

export function JetisuSignature({ locale }: { locale: Locale }) {
  return (
    <div className="jetisu-signature" aria-hidden="true">
      <div className="jetisu-signature-streams">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
      <span>{locale === "ru" ? "СЕМЬ ПОТОКОВ · ЕДИНОЕ ПРАВОВОЕ ПРОСТРАНСТВО" : "ЖЕТІ АҒЫН · БІРТҰТАС ҚҰҚЫҚТЫҚ КЕҢІСТІК"}</span>
    </div>
  );
}
