"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const NAME = "MUHAMMAD HADI";

const bootLines = [
  { label: "init", value: "portfolio_2026", done: true },
  { label: "compile", value: "motion / webgl / type", done: true },
  { label: "status", value: "ready", done: false },
];

export default function IntroLoader() {
  const [active, setActive] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (document.documentElement.getAttribute("data-intro") !== "active") {
      setActive(false);
      return;
    }

    finishedRef.current = false;
    window.scrollTo(0, 0);

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      document.documentElement.setAttribute("data-intro", "done");
      try {
        window.sessionStorage.setItem("mh:intro", "played");
      } catch {
        /* storage can be unavailable in private mode */
      }

      const w = window as Window & { __mhIntro?: boolean };
      delete w.__mhIntro;

      timelineRef.current?.kill();
      timelineRef.current = null;
      setActive(false);
      window.dispatchEvent(new Event("portfolio:intro-done"));
    };

    const chars = root.querySelectorAll<HTMLElement>("[data-intro-char]");
    const counter = { value: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: finish,
    });
    timelineRef.current = tl;

    tl.set(chars, { yPercent: 118, rotate: 4, opacity: 1 })
      .fromTo(
        "[data-intro-chrome]",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
        0
      )
      .to(
        counter,
        {
          value: 100,
          duration: 1.15,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
            }
          },
        },
        0
      )
      .fromTo(
        "[data-intro-bar]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.15, ease: "power2.inOut" },
        0
      )
      .to(chars, {
        yPercent: 0,
        rotate: 0,
        duration: 0.86,
        stagger: 0.032,
        ease: "expo.out",
      }, 0.38)
      .fromTo(
        "[data-intro-meta]",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.08 },
        0.92
      )
      .to(chars, {
        yPercent: -118,
        rotate: -4,
        duration: 0.56,
        stagger: 0.018,
        ease: "power3.in",
      }, 1.62)
      .to(
        "[data-intro-meta]",
        { autoAlpha: 0, y: -12, duration: 0.38 },
        1.62
      )
      .to(
        "[data-intro-chrome], [data-intro-boot]",
        { autoAlpha: 0, duration: 0.38 },
        1.66
      )
      .to(
        root,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.84,
          ease: "expo.inOut",
        },
        1.86
      );

    const safety = window.setTimeout(finish, 6000);

    const accelerate = () => {
      const tl = timelineRef.current;
      if (tl && !finishedRef.current) {
        tl.timeScale(3);
      }
    };
    const onWheel = () => accelerate();
    const onPointer = () => accelerate();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        accelerate();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(safety);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      tl.kill();
      timelineRef.current = null;
    };
  }, []);

  const skip = () => {
    const tl = timelineRef.current;
    if (tl) {
      tl.timeScale(9);
    } else {
      document.documentElement.setAttribute("data-intro", "done");
      window.dispatchEvent(new Event("portfolio:intro-done"));
      setActive(false);
    }
  };

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      data-intro-loader
      role="dialog"
      aria-modal="true"
      aria-label="Loading Muhammad Hadi's portfolio"
      className="intro-shell fixed inset-0 z-[200] overflow-hidden bg-[#050409] text-white"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="intro-grid absolute inset-0 opacity-60" />
        <div className="absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-purple/15 blur-[150px]" />
        <div className="absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-pink/12 blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[70vw] max-w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/10 blur-[130px]" />
        <div className="intro-scanline absolute inset-x-0 h-px" />
        <div className="absolute inset-3 hidden border border-white/[0.04] sm:block" />
      </div>

      <div className="relative z-10 flex h-full flex-col px-5 py-5 sm:px-8 sm:py-7 md:px-12 md:py-9">
        <div
          data-intro-chrome
          className="flex shrink-0 items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="font-display grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-gradient-to-br from-pink/25 to-purple/20 text-[11px] font-bold tracking-tight text-white shadow-[0_0_28px_-8px_rgba(255,61,154,0.8)]">
              mh
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.32em] text-white/35 sm:text-[9px]">
              Portfolio / 2026
            </span>
          </div>

          <span className="hidden items-center gap-2 font-mono text-[8px] uppercase tracking-[0.32em] text-white/25 sm:flex">
            <span className="h-1 w-1 rounded-full bg-pink intro-blink" />
            Loading experience
          </span>

          <button
            type="button"
            onClick={skip}
            className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.24em] text-white/45 transition-colors hover:border-pink/40 hover:text-white sm:px-4 sm:text-[9px]"
          >
            Skip intro
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-45"
            >
              ↗
            </span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-10 text-center">
          <div
            data-intro-meta
            className="intro-meta flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.34em] text-white/35 sm:text-[9px]"
          >
            <span className="h-px w-6 bg-white/20 sm:w-10" />
            Independent developer
            <span className="text-pink">/</span>
            <span className="hidden sm:inline">Product engineer</span>
            <span className="h-px w-6 bg-white/20 sm:hidden" />
          </div>

          <h1
            aria-label="Muhammad Hadi"
            className="font-display mt-5 flex whitespace-nowrap text-[clamp(2.05rem,8.6vw,7.6rem)] font-semibold leading-none tracking-[-0.045em] text-white sm:mt-7"
          >
            {NAME.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                aria-hidden="true"
                className="inline-block overflow-hidden align-bottom"
              >
                <span
                  data-intro-char
                  className="intro-name-char inline-block will-change-transform"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </h1>

          <div
            data-intro-meta
            data-intro-arrow
            className="intro-meta mt-6 flex flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40"
          >
            <span>Scroll to enter</span>
            <span className="intro-arrow text-lg leading-none text-pink">↓</span>
          </div>

          <div
            data-intro-meta
            className="intro-meta mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[8px] uppercase tracking-[0.26em] text-white/30 sm:mt-7 sm:text-[9px]"
          >
            <span>Design engineering</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Interaction systems</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-white/45">Five live products</span>
          </div>
        </div>

        <div data-intro-chrome className="shrink-0">
          <div className="flex items-end justify-between gap-6">
            <div
              data-intro-boot
              className="hidden space-y-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/30 sm:block sm:text-[9px]"
            >
              {bootLines.map((line) => (
                <p key={line.label} className="flex items-center gap-2">
                  <span className="text-pink/70">&gt;</span>
                  <span className="text-white/25">{line.label}</span>
                  <span>{line.value}</span>
                  <span className={line.done ? "text-emerald-400/80" : "text-pink/80"}>
                    {line.done ? "✓" : "•"}
                  </span>
                </p>
              ))}
            </div>

            <div className="ml-auto text-right">
              <div className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/30 sm:text-[9px]">
                Loading
              </div>
              <div className="font-display mt-1 text-2xl font-semibold leading-none tracking-tight text-white/85 sm:text-3xl">
                <span ref={countRef}>000</span>
                <span className="ml-0.5 text-[0.55em] font-normal text-white/25">%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 h-px w-full bg-white/10">
            <div
              data-intro-bar
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-pink via-purple to-violet shadow-[0_0_18px_rgba(255,61,154,0.8)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
