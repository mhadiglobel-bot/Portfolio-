"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function IntroLoader() {
  const [active, setActive] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const enterRef = useRef<() => void>(() => {});
  const exitingRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || document.documentElement.getAttribute("data-intro") !== "active") {
      setActive(false);
      return;
    }

    exitingRef.current = false;
    window.scrollTo(0, 0);

    const complete = () => {
      document.documentElement.setAttribute("data-intro", "done");
      const w = window as Window & { __mhIntro?: boolean };
      delete w.__mhIntro;
      timelineRef.current = null;
      setActive(false);
      window.dispatchEvent(new Event("portfolio:intro-done"));
    };

    const enter = () => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      timelineRef.current?.kill();

      const exit = gsap.timeline({ onComplete: complete });
      timelineRef.current = exit;
      exit
        .to(
          [titleRef.current, kickerRef.current, arrowRef.current],
          {
            autoAlpha: 0,
            y: -26,
            scale: 0.985,
            duration: 0.42,
            stagger: 0.035,
            ease: "power2.in",
          },
          0
        )
        .to(
          leftCurtainRef.current,
          { xPercent: -102, duration: 1.05, ease: "expo.inOut" },
          0.18
        )
        .to(
          rightCurtainRef.current,
          { xPercent: 102, duration: 1.05, ease: "expo.inOut" },
          0.18
        )
        .to(root, { autoAlpha: 0, duration: 0.16, ease: "none" }, 1.04);
    };

    enterRef.current = enter;

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    timelineRef.current = intro;
    intro
      .fromTo(
        kickerRef.current,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, delay: 0.12 }
      )
      .fromTo(
        titleRef.current,
        { autoAlpha: 0, y: 54, scale: 0.965 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.05, ease: "expo.out" },
        "-=0.18"
      )
      .fromTo(
        arrowRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.55 },
        "-=0.35"
      );

    let touchStartY = 0;
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) {
        event.preventDefault();
        enter();
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      if (touchStartY - endY > 28) enter();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === "Enter" ||
        event.code === "Space"
      ) {
        event.preventDefault();
        enter();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      timelineRef.current?.kill();
      timelineRef.current = null;
      enterRef.current = () => {};
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      data-intro-loader
      role="dialog"
      aria-modal="true"
      aria-label="Muhammad Hadi portfolio introduction"
      className="intro-screen fixed inset-0 z-[200] overflow-hidden text-white"
    >
      <div ref={leftCurtainRef} className="intro-curtain intro-curtain--left" aria-hidden="true">
        <div className="intro-grid absolute inset-0 opacity-45" />
        <div className="intro-curtain-glow intro-curtain-glow--left" />
      </div>
      <div ref={rightCurtainRef} className="intro-curtain intro-curtain--right" aria-hidden="true">
        <div className="intro-grid absolute inset-0 opacity-45" />
        <div className="intro-curtain-glow intro-curtain-glow--right" />
      </div>

      <div className="intro-content absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
        <p
          ref={kickerRef}
          className="intro-kicker mb-7 font-mono text-[8px] uppercase tracking-[0.34em] text-white/40 sm:text-[10px]"
        >
          Independent developer <span className="px-2 text-pink/70">/</span> Product engineer
        </p>

        <h1 ref={titleRef} aria-label="Muhammad Hadi" className="intro-title font-display">
          <span className="intro-title__word">MUHAMMAD</span>
          <span className="intro-title__word intro-title__word--accent">HADI</span>
        </h1>

        <button
          ref={arrowRef}
          type="button"
          onClick={() => enterRef.current()}
          aria-label="Enter the portfolio"
          className="intro-enter mt-9 flex flex-col items-center gap-3"
        >
          <span className="intro-enter-label font-mono text-[8px] uppercase tracking-[0.3em] text-white/35">
            Scroll to enter
          </span>
          <span className="intro-arrow text-2xl leading-none text-pink" aria-hidden="true">↓</span>
        </button>
      </div>
    </div>
  );
}
