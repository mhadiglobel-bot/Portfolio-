"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import FluidGlow from "./FluidGlow";
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
          { yPercent: 115, autoAlpha: 0, duration: 1, stagger: 0.12 },
          "-=0.25"
        )
        .from(".hero-sub", { y: 22, autoAlpha: 0, duration: 0.7 }, "-=0.55")
        .from(".hero-cta", { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.45")
        .from(".hero-card", { y: 26, autoAlpha: 0, scale: 0.96, duration: 0.8, stagger: 0.12 }, "-=0.5")
        .from(".hero-hud", { autoAlpha: 0, duration: 0.8, stagger: 0.06 }, "-=0.35")
        .from(".hero-meta", { autoAlpha: 0, duration: 0.8 }, "-=0.4");

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
      if (onReveal) {
        window.removeEventListener("portfolio:intro-done", onReveal);
      }
      ctx.revert();
    };
  }, []);

  return (
    <section id="top" ref={root} className="relative overflow-hidden pb-8 pt-24 md:pt-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <FluidGlow />
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="absolute -left-40 top-24 h-[480px] w-[480px] rounded-full bg-purple/10 blur-[140px]" />
        <div className="absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-pink/10 blur-[150px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.12),transparent_70%)]" />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-3 hidden items-center lg:flex"
        aria-hidden="true"
      >
        <span className="rotate-180 font-mono text-[7px] uppercase tracking-[0.42em] text-white/15 [writing-mode:vertical-rl]">
          Available for select work — 2026
        </span>
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 right-3 hidden items-center lg:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-[7px] uppercase tracking-[0.42em] text-white/15 [writing-mode:vertical-rl]">
          Build 03 / Fluid field
        </span>
      </div>

      <div className="container-x relative">
        <div className="hero-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/45 sm:text-[11px]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink shadow-[0_0_12px_rgba(255,61,154,1)]" />
          <span className="whitespace-nowrap">Independent developer</span>
          <span className="hidden text-white/20 sm:inline">/</span>
          <span className="hidden whitespace-nowrap sm:inline">Product engineer</span>
          <span className="hidden text-white/20 sm:inline">/</span>
          <span className="hidden whitespace-nowrap sm:inline">Digital builder</span>
        </div>

        <h1 className="display-xl font-display mt-6 max-w-[15ch] text-balance text-white">
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

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-xl">
            <p className="hero-sub text-[15px] leading-7 text-white/55">
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
                  <span aria-hidden="true" className="text-base leading-none">
                    ↗
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="mailto:mhadi.globel@gmail.com"
                  className="hero-cta btn btn-ghost w-full justify-center sm:w-auto"
                >
                  Start a conversation
                  <span aria-hidden="true" className="text-base leading-none">
                    ↗
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="hero-card hidden w-[260px] lg:block">
            <div className="glass rounded-2xl bg-[#0a0712]/80 p-5">
              <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-pink" />
                  dev.ts
                </span>
                <span>UTF-8</span>
              </div>
              <div className="mt-3 space-y-0.5 font-mono text-[10px] leading-[1.7]">
                <p>
                  <span className="text-pink">const</span>{" "}
                  <span className="text-white/80">hadi</span>{" "}
                  <span className="text-white/35">=</span>{" "}
                  <span className="text-white/35">{"{"}</span>
                </p>
                <p className="pl-3 text-white/45">
                  role: <span className="text-emerald-300/80">&quot;engineer&quot;</span>,
                </p>
                <p className="pl-3 text-white/45">
                  stack: <span className="text-purple-300/85">[&quot;next&quot;, &quot;three&quot;]</span>,
                </p>
                <p className="pl-3 text-white/45">
                  status: <span className="text-pink">&quot;shipping&quot;</span>
                </p>
                <p className="text-white/35">
                  {"}"}
                  <span className="cursor-blink ml-1 inline-block h-3 w-[5px] translate-y-[2px] bg-pink/80" />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-hud pointer-events-none absolute right-6 top-24 z-20 hidden flex-col items-end gap-2 font-mono text-[8px] uppercase tracking-[0.24em] text-white/30 lg:flex">
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
            Live render
          </span>
          <span>WebGL / Canvas</span>
          <span className="text-white/15">Scene 01</span>
        </div>

        <div className="hero-meta relative z-10 mt-12 flex items-center justify-between gap-4 border-t border-white/5 pt-5 text-[9px] uppercase tracking-[0.28em] text-white/35 sm:text-[10px]">
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
    </section>
  );
}
