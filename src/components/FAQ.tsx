"use client";

import { useState } from "react";
import SectionLabel from "./SectionLabel";

const faqs = [
  {
    question: "What kind of work do you take on?",
    answer:
      "Product-focused work where interface, motion, and engineering all matter — SaaS, internal tools, marketing sites, and interactive experiences. I work best with teams that care about the details.",
  },
  {
    question: "How do you approach a new project?",
    answer:
      "Clarity first. I start with the feeling the experience should have, then shape structure, then refine the details. Motion and visuals come after the foundation is solid.",
  },
  {
    question: "Do you work with existing codebases?",
    answer:
      "Yes. I’m comfortable stepping into an existing product, understanding the system, and improving it without breaking what already works.",
  },
  {
    question: "What stack do you usually use?",
    answer:
      "Next.js, React, TypeScript, Tailwind, GSAP, and Three.js when a project calls for it. I choose tools based on the problem, not the trend.",
  },
  {
    question: "Are you available for new projects?",
    answer:
      "I take on a small number of projects at a time so each one gets real attention. If you have something in mind, reach out and we’ll see if it’s a fit.",
  },
  {
    question: "Do you care about performance?",
    answer:
      "It’s a core part of the work. Fast load, smooth scroll, and no jank are non-negotiable — especially on mobile.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="container-x">
        <div data-reveal>
          <SectionLabel index="06">Questions</SectionLabel>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start" data-reveal>
          <div>
            <h2 className="display-lg font-display max-w-md text-white">
              Good questions deserve <span className="serif-i gradient-text">clear answers.</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
              A few things people usually want to know before we start working
              together.
            </p>
            <div className="mt-8 hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.26em] text-white/30 lg:flex">
              <span className="h-1 w-1 rounded-full bg-pink" />
              Click to expand
            </div>
          </div>

          <div className="space-y-3" data-reveal-stagger>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <article
                  key={faq.question}
                  className={`group relative overflow-hidden rounded-2xl border transition-colors duration-500 ${
                    isOpen
                      ? "border-pink/25 bg-white/[0.04]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute -left-px top-0 h-full w-px transition-opacity duration-500 ${
                      isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                    }`}
                    style={{
                      background: "linear-gradient(180deg, #ff3d9a, #a855f7)",
                    }}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`font-mono text-[9px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                          isOpen ? "text-pink" : "text-white/25"
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <span
                        className={`font-display text-base font-medium tracking-tight transition-colors duration-300 sm:text-lg ${
                          isOpen ? "text-white" : "text-white/70 group-hover:text-white"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </span>

                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-pink/40 bg-pink/10 text-pink"
                          : "border-white/10 bg-white/5 text-white/40 group-hover:text-white"
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-12 text-sm leading-7 text-white/50 sm:px-6 sm:pl-14 sm:pb-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
