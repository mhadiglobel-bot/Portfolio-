"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-56 w-56 rounded-full bg-[radial-gradient(circle_at_35%_30%,#c084fc,#7c3aed_45%,#2a1055_75%,transparent_100%)] opacity-80 blur-[2px] shadow-[0_0_140px_50px_rgba(168,85,247,0.22)] sm:h-72 sm:w-72" />
    </div>
  );
}

const floatingCards = [
  {
    index: "01 / BUILD",
    title: "Systems with purpose",
    progress: "w-2/3",
    position: "left-4 top-5 w-[180px]",
    float: "float-y",
    delay: "0s",
  },
  {
    index: "02 / DESIGN",
    title: "Details with intent",
    progress: "w-1/2",
    position: "right-4 top-[44%] w-[172px]",
    float: "float-y-slow",
    delay: "1.2s",
  },
  {
    index: "03 / SHIP",
    title: "Ideas into reality",
    progress: "w-3/4",
    position: "bottom-5 left-5 w-[190px]",
    float: "float-y",
    delay: "0.6s",
  },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { y: 16, autoAlpha: 0, duration: 0.6 })
        .from(
          ".hero-line",
          { yPercent: 115, autoAlpha: 0, duration: 0.95, stagger: 0.12 },
          "-=0.25"
        )
        .from(".hero-sub", { y: 22, autoAlpha: 0, duration: 0.7 }, "-=0.55")
        .from(".hero-cta", { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.45")
        .from(
          ".hero-card",
          { y: 26, autoAlpha: 0, scale: 0.96, duration: 0.8, stagger: 0.12 },
          "-=0.5"
        )
        .from(".hero-meta", { autoAlpha: 0, duration: 0.8 }, "-=0.4");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative overflow-hidden pb-8 pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute -left-40 top-24 h-[480px] w-[480px] rounded-full bg-purple/10 blur-[140px]" />
        <div className="absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-pink/10 blur-[150px]" />
      </div>

      <div className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="relative z-10 max-w-[660px]">
            <div className="hero-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/45 sm:text-[11px]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink shadow-[0_0_12px_rgba(255,61,154,1)]" />
              <span className="whitespace-nowrap">Independent developer</span>
              <span className="hidden text-white/20 sm:inline">/</span>
              <span className="hidden whitespace-nowrap sm:inline">Digital maker</span>
            </div>

            <h1 className="display-xl font-display mt-6 text-balance text-white">
              <span className="block overflow-hidden pb-1">
                <span className="hero-line block">I make digital</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-line block">experiences</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="hero-line block">
                  feel <span className="serif-i gradient-text pr-1">alive.</span>
                </span>
              </span>
            </h1>

            <p className="hero-sub mt-7 max-w-md text-[15px] leading-7 text-white/50">
              I&apos;m Muhammad Hadi. I turn ambitious ideas into thoughtful products,
              expressive interfaces and experiences that stay with you.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#work" className="hero-cta btn btn-primary">
                Explore the work
                <span aria-hidden="true" className="text-base leading-none">
                  ↗
                </span>
              </a>
              <a href="mailto:mhadi.globel@gmail.com" className="hero-cta btn btn-ghost">
                Start a conversation
                <span aria-hidden="true" className="text-base leading-none">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className="relative h-[400px] w-full sm:h-[480px] lg:h-[600px]">
            <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#08060f] shadow-[0_60px_140px_-60px_rgba(124,58,237,0.55)] sm:rounded-[32px]">
              <div className="absolute inset-0">
                <HeroScene />
              </div>

              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(168,85,247,0.16),transparent_62%)] mix-blend-screen"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.05] to-transparent"
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute left-5 top-5 h-4 w-4 border-l border-t border-white/20"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-5 top-5 h-4 w-4 border-r border-t border-white/20"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute bottom-5 left-5 hidden h-4 w-4 border-b border-l border-white/20 sm:block"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute bottom-5 right-5 h-4 w-4 border-b border-r border-white/20"
                aria-hidden="true"
              />

              <div className="pointer-events-none absolute right-9 top-6 whitespace-nowrap text-[8px] uppercase tracking-[0.32em] text-white/25">
                Interactive study / 01
              </div>

              {floatingCards.map((card) => (
                <div
                  key={card.index}
                  className={`hero-card absolute z-20 hidden md:block ${card.position}`}
                >
                  <div
                    className={`glass rounded-2xl bg-[#0b0812]/70 p-4 ${card.float}`}
                    style={{ animationDelay: card.delay }}
                  >
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-white/40">
                      <span>{card.index}</span>
                      <span className="h-1 w-1 rounded-full bg-pink" />
                    </div>
                    <p className="font-display mt-2 text-[13px] font-medium text-white/90">
                      {card.title}
                    </p>
                    <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-pink to-purple ${card.progress}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-meta relative z-10 mt-12 flex items-center justify-between gap-4 border-t border-white/5 pt-6 text-[9px] uppercase tracking-[0.28em] text-white/35 sm:text-[10px]">
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
