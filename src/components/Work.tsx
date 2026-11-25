import ProjectCard from "./ProjectCard";
import SectionLabel from "./SectionLabel";
import { projects } from "@/lib/projects";

export default function Work() {
  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="container-x">
        <div data-reveal>
          <SectionLabel index="02">Selected work</SectionLabel>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" data-reveal>
          <h2 className="display-lg font-display max-w-2xl text-white">
            Made to be <span className="serif-i gradient-text">experienced.</span>
          </h2>

          <div className="flex items-center gap-5">
            <span className="gradient-text font-display text-6xl font-semibold leading-none tracking-[-0.04em] sm:text-7xl">
              05
            </span>
            <div className="font-mono text-[8px] uppercase leading-5 tracking-[0.22em] text-white/30 sm:text-[9px]">
              <div className="text-white/55">Live products</div>
              <div>Selected / 2026</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                All links live
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-xl text-sm leading-7 text-white/45" data-reveal>
          Five products designed and engineered end to end — audio, discovery, commerce,
          travel and AI. Every card opens the real thing.
        </p>

        <div className="relative mt-12 sm:mt-16 lg:pl-16">
          <div
            className="absolute bottom-4 left-5 top-4 hidden w-px bg-white/[0.07] lg:block"
            aria-hidden="true"
          >
            <div
              data-project-rail
              className="h-full w-full origin-top scale-y-0 bg-gradient-to-b from-pink via-purple to-violet/10 shadow-[0_0_14px_rgba(255,61,154,0.55)]"
            />
          </div>

          <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.name}
                project={project}
                flipped={index % 2 === 1}
              />
            ))}
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-white/[0.07] pt-6 font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-pink" />
            05 / 05 — selected work
          </span>
          <span>Every project opens live in a new tab</span>
        </div>
      </div>
    </section>
  );
}
