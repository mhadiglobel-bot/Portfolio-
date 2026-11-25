"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function IntroLoader() {
  const [active, setActive] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
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

    const fit = () => {
      const title = titleRef.current;
      if (!title) return;
      const portrait = matchMedia("(max-width: 800px) and (orientation: portrait)").matches;
      const area = root.getBoundingClientRect();
      root.style.setProperty("--name-width", String((portrait ? area.height * .80 : area.width * .946) / title.offsetWidth));
      root.style.setProperty("--name-height", String((portrait ? area.width * .60 : Math.min(area.height * .47, area.width * .24)) / title.offsetHeight));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    if (titleRef.current) observer.observe(titleRef.current);
    fit();
    exitingRef.current = false;
    window.scrollTo(0, 0);
    arrowRef.current?.focus({ preventScroll: true });

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
      exit.to(root.querySelectorAll(".intro-glyph"), {
        xPercent: (i) => (i - 5.5) * 17,
        yPercent: (i) => 75 + (i % 4) * 34,
        rotation: (i) => (i - 5.5) * 3,
        filter: "blur(7px)", opacity: 0,
        stagger: { each: .025, from: "center" }, duration: .72, ease: "power2.in",
      }, 0)
        .to([kickerRef.current, arrowRef.current], { opacity: 0, duration: .24 }, 0)
        .fromTo(root, { "--wipe": "-35%" }, { "--wipe": "110%", duration: .92, ease: "power2.inOut" }, .23);

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
      if (event.key === "Tab") { event.preventDefault(); arrowRef.current?.focus(); return; }
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
      observer.disconnect();
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
      <div className="intro-content absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
        <p
          ref={kickerRef}
          className="intro-kicker mb-7 font-mono text-[8px] uppercase tracking-[0.34em] text-white/40 sm:text-[10px]"
        >
          Independent developer <span className="px-2 text-pink/70">/</span> Product engineer
        </p>

        <div className="intro-axis"><div className="intro-fit"><h1 ref={titleRef} aria-label="Muhammad Hadi" className="intro-title font-display">
          {["MUHAMMAD", "HADI"].map((word, wordIndex) => (
            <span className="intro-word" key={word} aria-hidden="true">
              {Array.from(word, (letter, index) => (
                <span className="intro-glyph" key={index}
                  style={{ "--index": index + wordIndex * 8, "--ink": (index + wordIndex * 8) / 11 * 100 + "%" } as CSSProperties}>
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h1></div></div>

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
