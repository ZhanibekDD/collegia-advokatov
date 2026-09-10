"use client";

import { useEffect, useRef } from "react";
import { BadgeCheck, Building2, Scale, ShieldCheck } from "lucide-react";
import type { Locale } from "../lib/portal-data";
import { ShanyrakMark } from "./shanyrak-mark";

export function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-enabled");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let interactionFrame = 0;
    let activeTilt: HTMLElement | null = null;
    let activeMagnetic: HTMLElement | null = null;

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

    const resetTilt = (target: HTMLElement | null) => {
      if (!target) return;
      target.style.setProperty("--tilt-rx", "0deg");
      target.style.setProperty("--tilt-ry", "0deg");
      target.style.setProperty("--glow-x", "50%");
      target.style.setProperty("--glow-y", "50%");
    };

    const resetMagnetic = (target: HTMLElement | null) => {
      if (!target) return;
      target.style.setProperty("--magnetic-x", "0px");
      target.style.setProperty("--magnetic-y", "0px");
    };

    const resetInteractions = () => {
      resetTilt(activeTilt);
      resetMagnetic(activeMagnetic);
      activeTilt = null;
      activeMagnetic = null;
    };

    const handleInteraction = (event: PointerEvent) => {
      if (reducedMotion || coarsePointer || event.pointerType === "touch" || !(event.target instanceof Element)) return;
      cancelAnimationFrame(interactionFrame);
      interactionFrame = requestAnimationFrame(() => {
        const tilt = event.target instanceof Element ? event.target.closest("[data-tilt]") as HTMLElement | null : null;
        if (tilt !== activeTilt) {
          resetTilt(activeTilt);
          activeTilt = tilt;
        }
        if (tilt) {
          const bounds = tilt.getBoundingClientRect();
          const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
          const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
          tilt.style.setProperty("--tilt-rx", `${(0.5 - y) * 6}deg`);
          tilt.style.setProperty("--tilt-ry", `${(x - 0.5) * 7}deg`);
          tilt.style.setProperty("--glow-x", `${x * 100}%`);
          tilt.style.setProperty("--glow-y", `${y * 100}%`);
        }

        const magnetic = event.target.closest(".button, .hero-search-control button, .command-trigger") as HTMLElement | null;
        if (magnetic !== activeMagnetic) {
          resetMagnetic(activeMagnetic);
          activeMagnetic = magnetic;
        }
        if (magnetic) {
          const bounds = magnetic.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          magnetic.style.setProperty("--magnetic-x", `${x * 8}px`);
          magnetic.style.setProperty("--magnetic-y", `${y * 6}px`);
        }
      });
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) resetInteractions();
    };

    document.addEventListener("pointermove", handleInteraction, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });

    return () => {
      cancelAnimationFrame(interactionFrame);
      resetInteractions();
      document.removeEventListener("pointermove", handleInteraction);
      document.removeEventListener("pointerout", handlePointerOut);
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
    stage.style.setProperty("--stage-tilt-x", `${y * -7}deg`);
    stage.style.setProperty("--stage-tilt-y", `${x * 8}deg`);
    stage.style.setProperty("--stage-card-tilt-x", `${y * -4}deg`);
    stage.style.setProperty("--stage-card-tilt-y", `${x * 5}deg`);
    stage.style.setProperty("--stage-card-tilt-x-reverse", `${y * 4}deg`);
    stage.style.setProperty("--stage-card-tilt-y-reverse", `${x * -5}deg`);
    stage.style.setProperty("--stage-light-x", `${(x + 0.5) * 100}%`);
    stage.style.setProperty("--stage-light-y", `${(y + 0.5) * 100}%`);
  }

  function reset() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--shift-x", "0px");
    stage.style.setProperty("--shift-y", "0px");
    stage.style.setProperty("--shift-x-reverse", "0px");
    stage.style.setProperty("--shift-y-reverse", "0px");
    stage.style.setProperty("--stage-tilt-x", "0deg");
    stage.style.setProperty("--stage-tilt-y", "0deg");
    stage.style.setProperty("--stage-card-tilt-x", "0deg");
    stage.style.setProperty("--stage-card-tilt-y", "0deg");
    stage.style.setProperty("--stage-card-tilt-x-reverse", "0deg");
    stage.style.setProperty("--stage-card-tilt-y-reverse", "0deg");
    stage.style.setProperty("--stage-light-x", "50%");
    stage.style.setProperty("--stage-light-y", "50%");
  }

  return (
    <div className="motion-stage" ref={stageRef} onPointerMove={move} onPointerLeave={reset} aria-hidden="true">
      <div className="stage-glow" />
      <div className="stage-ambient-light" />
      <div className="stage-radar"><span /></div>
      <div className="stage-particles">
        {Array.from({ length: 12 }, (_, index) => <i style={{ "--particle": index } as React.CSSProperties} key={index} />)}
      </div>
      <div className="stage-streams">
        {Array.from({ length: 7 }, (_, index) => <i style={{ "--stream": index } as React.CSSProperties} key={index} />)}
      </div>
      <div className="stage-orbit stage-orbit-outer"><span /><span /><span /></div>
      <div className="stage-orbit stage-orbit-inner"><span /><span /></div>

      <div className="stage-core">
        <div className="stage-core-energy"><i /><i /><i /></div>
        <div className="stage-core-pulse" />
        <div className="stage-emblem"><ShanyrakMark /></div>
        <strong>KAOJ.KZ</strong>
        <small>{locale === "ru" ? "ЖЕТІСУ · АДВОКАТУРА" : "ЖЕТІСУ · АДВОКАТУРА"}</small>
      </div>

      <div className="stage-float stage-float-members">
        <span><Scale /></span>
        <div><strong><AnimatedNumber value={total} fallback="139" /></strong><small>{locale === "ru" ? "адвокатов" : "адвокат"}</small></div>
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
