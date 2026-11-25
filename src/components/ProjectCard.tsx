"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useRef } from "react";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  flipped?: boolean;
};

export default function ProjectCard({ project, flipped = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handlePointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--rx", `${((0.5 - y) * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 6).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };

  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article data-project className="relative" data-reveal>
      <span
        aria-hidden="true"
        className="absolute -left-16 top-10 hidden h-10 w-10 items-center justify-center lg:flex"
      >
        <span className="absolute left-5 h-px w-16 bg-gradient-to-r from-white/12 to-transparent" />
        <span
          className="relative h-2.5 w-2.5 rounded-full border"
          style={{
            borderColor: `${project.accent}aa`,
            background: "#0b0714",
            boxShadow: `0 0 18px ${project.accent}66`,
          }}
        />
      </span>

      <a
        ref={cardRef}
        href={project.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${project.name} — ${project.tagline}. Opens the live site in a new tab.`}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        className="project-card group relative block overflow-hidden rounded-[26px] p-2 sm:rounded-[32px] sm:p-2.5"
        style={{ "--accent": project.accent } as CSSProperties}
      >
        <div className="relative z-[2] grid gap-2 lg:grid-cols-[1.14fr_0.86fr]">
          <div
            className={`relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0b0714] sm:rounded-[24px] ${
              flipped ? "lg:order-2" : ""
            }`}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#09070e]">
              <div data-project-media className="absolute inset-0">
                <div data-project-image className="relative h-full w-full">
                  <Image
                    src={project.image}
                    alt={`${project.name} — ${project.tagline} homepage`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]"
                  />
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07060b]/70 via-[#07060b]/10 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent"
              />

              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-5 sm:bottom-5">
                <span className="font-display text-3xl font-semibold leading-none tracking-tight text-white/25 sm:text-4xl">
                  {project.wordmark}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/45">
                  {project.index} / 05
                </span>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col justify-between rounded-[20px] p-5 sm:rounded-[24px] sm:p-7 lg:p-8 ${
              flipped ? "lg:order-1" : ""
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <span
                  className="font-display grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-[12px] font-semibold tracking-[0.08em]"
                  style={{
                    color: project.accent,
                    borderColor: `${project.accent}55`,
                    background: `linear-gradient(135deg, ${project.accent}24, transparent 75%)`,
                    boxShadow: `0 0 32px -12px ${project.accent}`,
                  }}
                >
                  {project.wordmark}
                </span>

                <div className="text-right font-mono text-[8px] uppercase leading-5 tracking-[0.18em] text-white/30">
                  <div>{project.category}</div>
                  <div className="text-white/20">{project.year}</div>
                </div>
              </div>

              <h3 className="font-display mt-7 text-[clamp(1.8rem,3.4vw,2.9rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
                {project.name}
              </h3>
              <p
                className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] opacity-80"
                style={{ color: project.accent }}
              >
                {project.tagline}
              </p>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/45">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/35"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
              <span className="flex items-center gap-2.5 text-sm font-medium text-white/75 transition-colors duration-300 group-hover:text-white">
                <span
                  className="h-1 w-1 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{ background: project.accent }}
                />
                View live project
              </span>
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border text-base transition-transform duration-500 group-hover:rotate-45"
                style={{
                  color: project.accent,
                  borderColor: `${project.accent}45`,
                  background: `linear-gradient(135deg, ${project.accent}22, transparent)`,
                }}
              >
                ↗
              </span>
            </div>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="project-cursor pointer-events-none absolute z-20 hidden h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#0a0712]/70 text-center font-mono text-[8px] uppercase leading-[1.5] tracking-[0.16em] text-white/85 backdrop-blur-md md:grid"
        >
          View
          <br />
          site ↗
        </span>
      </a>
    </article>
  );
}
