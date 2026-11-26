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
      root.style.setProperty("--name-width", String((portrait ? area.height * .80 : area.width * .96) / title.offsetWidth));
      root.style.setProperty("--name-height", String((portrait ? area.width * .60 : Math.min(area.height * .52, area.width * .265)) / title.offsetHeight));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    if (titleRef.current) observer.observe(titleRef.current);
    fit();
    root.dataset.fitted = "true";
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

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const glyphs = Array.from(root.querySelectorAll<HTMLElement>(".intro-glyph"));
      const fragments = Array.from(root.querySelectorAll<HTMLElement>(".intro-fragment"));
      const faces = Array.from(root.querySelectorAll<HTMLElement>(".intro-glyph-face"));
      const exit = gsap.timeline({ onComplete: complete });
      timelineRef.current = exit;

      exit.to([kickerRef.current, arrowRef.current], {
        autoAlpha: 0, y: 12, duration: 0.2,
      }, 0);

      if (reduced) {
        exit.to(root, { opacity: 0, duration: 0.22 }, 0.08);
        return;
      }

      // Keep the original font and its fitted geometry; only the visible
      // letter face disappears. Jagged clipped replicas then split into shards.
      gsap.set(faces, { autoAlpha: 0 });
      gsap.set(fragments, {
        autoAlpha: 1, x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0,
        transformPerspective: 1000, transformOrigin: "50% 50%",
      });

      const sw = window.innerWidth;
      const sh = window.innerHeight;
      // The intro's fitted title uses a responsive scale transform.
      // Convert desired viewport distances into the glyph's local coordinates.
      const sample = glyphs[0];
      const sampleRect = sample?.getBoundingClientRect();
      const scaleX = Math.max(.01, (sampleRect?.width ?? 1) / Math.max(1, sample?.offsetWidth ?? 1));
      const scaleY = Math.max(.01, (sampleRect?.height ?? 1) / Math.max(1, sample?.offsetHeight ?? 1));
      fragments.forEach((fragment, index) => {
        const glyphIndex = Math.floor(index / 4);
        const pieceIndex = index % 4;
        const spread = (glyphIndex - (glyphs.length - 1) / 2) / Math.max(1, glyphs.length / 2);
        const horizontal = spread * sw * 0.6 + (pieceIndex - 1.5) * sw * 0.19;
        const sideways = Math.sin(index * 2.39996) * sw * 0.1;
        const fling = [-0.7, -0.18, 0.38, 0.76][pieceIndex];
        const firstY = sh * (fling * 0.35 + Math.sin(index * 1.7) * 0.1);
        const rotation = ((index * 47) % 260 - 130) * (pieceIndex % 2 ? -1 : 1);

        exit.to(fragment, {
          x: (horizontal + sideways) / scaleX,
          y: firstY / scaleY,
          z: 0,
          rotation,
          rotationX: (pieceIndex % 2 ? -1 : 1) * (22 + index % 34),
          rotationY: (pieceIndex % 3 - 1) * 38,
          duration: 0.41 + (index % 3) * 0.07,
          ease: "power3.out",
        }, index * 0.009);

        exit.to(fragment, {
          x: (horizontal + sideways) * 1.18 / scaleX,
          y: sh * (0.9 + (index % 5) * 0.13) / scaleY,
          z: 0,
          rotation: rotation * 1.55,
          rotationX: (pieceIndex % 2 ? -1 : 1) * 220,
          autoAlpha: 0,
          duration: 0.73 + (index % 4) * 0.07,
          ease: "power2.in",
        }, 0.34 + index * 0.009);
      });

      // Home is revealed only after the letters have broken apart.
      exit.to(root, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, 0.73);
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
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: .8, ease: "expo.out" },
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
                  <span className="intro-glyph-face">{letter}</span>
                  {Array.from({ length: 4 }, (_, piece) => (
                    <span className={"intro-fragment intro-fragment--" + piece} key={piece} aria-hidden="true">{letter}</span>
                  ))}
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
