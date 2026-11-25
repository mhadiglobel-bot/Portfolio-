"use client";

import { useState } from "react";
import RollingText from "./RollingText";
import SectionLabel from "./SectionLabel";

const faqs = [
  {
    question: "Can you improve an existing website?",
    answer: "Yes. Send the live site and tell me what feels slow, hard to use or difficult to find in search. I can work from the existing codebase.",
  },
  {
    question: "What does your development workflow look like?",
    answer: "I prototype the interface, review the code in GitHub, and test the interactions on desktop and mobile before shipping.",
  },
  {
    question: "What should I include in my first email?",
    answer: "A link or a rough idea, who the site is for, and the first thing you want it to do. If you have a launch date or an existing repository, include that too.",
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
              <RollingText>Before we</RollingText> <span className="serif-i gradient-text"><RollingText>start.</RollingText></span>
            </h2>
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
                    aria-controls={`answer-${index}`}
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
                    id={`answer-${index}`} aria-hidden={!isOpen}
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
