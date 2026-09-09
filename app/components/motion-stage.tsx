"use client";

import { useEffect, useRef } from "react";
import { BadgeCheck, Building2, Scale, ShieldCheck } from "lucide-react";
import type { Locale } from "../lib/portal-data";
import { ShanyrakMark } from "./shanyrak-mark";

export function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-enabled");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    const observeItems = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-motion-observed])").forEach((item) => {
        item.dataset.motionObserved = "true";
        observer.observe(item);
      });
    };
    observeItems();
    const mutations = new MutationObserver(observeItems);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("motion-enabled");
    };
  }, []);

  return null;
}

export function AnimatedNumber({ value, fallback = "—" }: { value?: number; fallback?: string }) {
  return <span className="animated-number">{typeof value === "number" ? value : fallback}</span>;
}

export function CivicMotionStage({
  locale,
  total,
  consultations,
}: {
  locale: Locale;
  total?: number;
  consultations?: number;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--shift-x", `${x * 18}px`);
    stage.style.setProperty("--shift-y", `${y * 18}px`);
    stage.style.setProperty("--shift-x-reverse", `${x * -12}px`);
    stage.style.setProperty("--shift-y-reverse", `${y * -12}px`);
  }

  function reset() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--shift-x", "0px");
    stage.style.setProperty("--shift-y", "0px");
    stage.style.setProperty("--shift-x-reverse", "0px");
    stage.style.setProperty("--shift-y-reverse", "0px");
  }

  return (
    <div className="motion-stage" ref={stageRef} onPointerMove={move} onPointerLeave={reset} aria-hidden="true">
      <div className="stage-glow" />
      <div className="stage-streams">
        {Array.from({ length: 7 }, (_, index) => <i style={{ "--stream": index } as React.CSSProperties} key={index} />)}
      </div>
      <div className="stage-orbit stage-orbit-outer"><span /><span /><span /></div>
      <div className="stage-orbit stage-orbit-inner"><span /><span /></div>

      <div className="stage-core">
        <div className="stage-core-pulse" />
        <div className="stage-emblem"><ShanyrakMark /></div>
        <strong>KAOJ.KZ</strong>
        <small>{locale === "ru" ? "ЖЕТІСУ · АДВОКАТУРА" : "ЖЕТІСУ · АДВОКАТУРА"}</small>
      </div>

      <div className="stage-float stage-float-members">
        <span><Scale /></span>
        <div><strong><AnimatedNumber value={total} fallback="138" /></strong><small>{locale === "ru" ? "адвокатов" : "адвокат"}</small></div>
      </div>
      <div className="stage-float stage-float-groups">
        <span><Building2 /></span>
        <div><strong><AnimatedNumber value={consultations} fallback="13" /></strong><small>{locale === "ru" ? "подразделений" : "бөлімше"}</small></div>
      </div>
      <div className="stage-float stage-float-verified">
        <BadgeCheck />
        <span>{locale === "ru" ? "Список проверен" : "Тізім тексерілді"}</span>
      </div>
      <div className="stage-status"><ShieldCheck /><span>{locale === "ru" ? "Официальные сведения" : "Ресми мәліметтер"}</span></div>
      <div className="stage-seven-mark"><strong>07</strong><span>{locale === "ru" ? "потоков Жетісу" : "Жетісу ағыны"}</span></div>
    </div>
  );
}
