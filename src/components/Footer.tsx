export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="container-x flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="" width="40" height="40" className="rounded-full" />
          <div>
            <div className="text-sm font-semibold tracking-tight text-white/90">
              Muhammad Hadi
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/30">
              Independent developer
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-white/40">
          <span className="hidden font-mono text-[8px] tracking-[0.18em] text-white/20 md:inline">
            Next.js / React / GSAP
          </span>
          <a
            href="https://github.com/mhadiglobel-bot"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
          <a
            href="mailto:mhadi.globel@gmail.com"
            className="transition-colors hover:text-white"
          >
            Email
          </a>
          <span className="text-white/20">© 2026</span>
        </div>
      </div>
    </footer>
  );
}
