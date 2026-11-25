import SectionLabel from "./SectionLabel";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-[260px] w-[420px] -translate-x-1/2 rounded-full bg-pink/10 blur-[120px]" />
      </div>

      <div className="container-x relative">
        <div className="flex justify-center" data-reveal>
          <SectionLabel index="06">Have something in mind?</SectionLabel>
        </div>

        <div className="mt-7 flex justify-center" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.24em] text-emerald-300/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            Available for select projects — 2026
          </span>
        </div>

        <h2
          className="display-xl font-display mt-6 text-balance text-center text-white"
          data-reveal
        >
          Let&apos;s make it <span className="serif-i gradient-text">matter.</span>
        </h2>

        <p
          className="mx-auto mt-6 max-w-md text-center text-sm leading-7 text-white/45"
          data-reveal
        >
          A thoughtful idea deserves a thoughtful build. Tell me what you&apos;re
          imagining.
        </p>

        <div className="mt-11 flex justify-center" data-reveal>
          <a
            href="mailto:mhadi.globel@gmail.com"
            className="glass card-hover group flex flex-col items-center gap-2 rounded-3xl px-8 py-6 text-center sm:px-12"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/35">
              Email
            </span>
            <span className="font-display text-lg font-medium tracking-tight text-white sm:text-2xl">
              mhadi.globel@gmail.com
            </span>
            <span className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/35 transition-colors group-hover:text-pink">
              Start a conversation
              <span aria-hidden="true">↗</span>
            </span>
          </a>
        </div>

        <p
          className="mt-7 text-center text-[10px] uppercase tracking-[0.28em] text-white/25"
          data-reveal
        >
          No forms. No hoops. Just an email.
        </p>
      </div>
    </section>
  );
}
