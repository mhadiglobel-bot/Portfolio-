"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FluidGlow from "./FluidGlow";
import HeroScene from "./HeroScene";
import Magnetic from "./Magnetic";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onReveal: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });

      tl.from(".hero-eyebrow", { y: 16, autoAlpha: 0, duration: 0.6 })
        .from(
          ".hero-line",
          { yPercent: 112, autoAlpha: 0, duration: 0.95, stagger: 0.12 },
          "-=0.22"
        )
        .from(".hero-sub", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.48")
        .from(".hero-cta", { y: 14, autoAlpha: 0, duration: 0.55, stagger: 0.08 }, "-=0.42")
        .from(".hero-meta", { autoAlpha: 0, duration: 0.7 }, "-=0.28");

      const play = () => tl.play(0);
      const w = window as Window & { __mhIntro?: boolean };

      if (w.__mhIntro) {
        onReveal = play;
        window.addEventListener("portfolio:intro-done", onReveal, { once: true });
      } else {
        play();
      }
    }, root);

    return () => {
      if (onReveal) window.removeEventListener("portfolio:intro-done", onReveal);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)", () => {
      const sequence = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
      });
      sequence.to(".hero-copy", { y: -85, duration: 1 }, 0)
        .to(".sculpture-object", { scale: 1.22, xPercent: -10, yPercent: 5, duration: 1 }, 0)
        .to(".sculpture-orbit", { rotation: 25, scale: 1.12, duration: 1 }, 0);
    }, root);
    return () => media.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="hero-journey relative isolate"
    >
      <div className="hero-viewport">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <FluidGlow />
          <div className="hero-grid absolute inset-0 opacity-35" />
          <div className="hero-ambient hero-ambient--left" />
          <div className="hero-ambient hero-ambient--right" />
        </div>

        <div className="container-x hero-layout relative">
          <div className="hero-copy relative z-10">
            <div className="hero-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/45 sm:text-[11px]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink shadow-[0_0_12px_rgba(255,61,154,1)]" />
              <span className="whitespace-nowrap">Independent developer</span>
              <span className="text-white/20">/</span>
              <span className="whitespace-nowrap">Product engineer</span>
              <span className="hidden text-white/20 sm:inline">/</span>
              <span className="hidden whitespace-nowrap sm:inline">Digital builder</span>
            </div>

            <h1 className="display-xl font-display mt-7 text-white">
              <span className="block overflow-hidden pb-1">
                <span className="hero-line block">I build digital</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-line block">experiences</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="hero-line block">
                  that feel <span className="serif-i gradient-text pr-1">alive.</span>
                </span>
              </span>
            </h1>

            <p className="hero-sub mt-8 max-w-xl text-[15px] leading-7 text-white/55">
              I&apos;m Muhammad Hadi. I turn ambitious ideas into thoughtful products,
              expressive interfaces, and motion-rich experiences that stay with you.
            </p>

            <div className="hero-sub mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30 sm:text-[9px]">
              <span className="text-white/50">Stack</span>
              <span>Next.js</span>
              <span className="text-white/15">/</span>
              <span>React</span>
              <span className="text-white/15">/</span>
              <span>TypeScript</span>
              <span className="text-white/15">/</span>
              <span>GSAP</span>
              <span className="ml-1 flex items-center gap-1.5 text-white/25">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                5 live products
              </span>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Magnetic>
                <a href="#work" className="hero-cta btn btn-primary w-full justify-center sm:w-auto">
                  Explore the work
                  <span aria-hidden="true" className="text-base leading-none">↗</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="mailto:mhadi.globel@gmail.com"
                  className="hero-cta btn btn-ghost w-full justify-center sm:w-auto"
                >
                  Start a conversation
                  <span aria-hidden="true" className="text-base leading-none">↗</span>
                </a>
              </Magnetic>
            </div>
          </div>

          <HeroScene />

          <div className="hero-meta relative z-10 flex items-center justify-between gap-4 border-t border-white/5 pt-5 text-[9px] uppercase tracking-[0.28em] text-white/35 sm:text-[10px]">
            <span className="hidden sm:block">Curiosity, made tangible.</span>
            <a
              href="#statement"
              className="mx-auto flex items-center gap-3 text-white/45 transition-colors hover:text-white/80 sm:mx-0"
            >
              <span className="scroll-dot h-1.5 w-1.5 rounded-full bg-pink" />
              Scroll to explore
            </a>
            <span className="hidden sm:block">Portfolio / 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
