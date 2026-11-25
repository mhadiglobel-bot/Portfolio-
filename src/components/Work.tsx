import SectionLabel from "./SectionLabel";

const rows = [
  { name: "Northline Studio", tag: "Design", gradient: "from-pink to-purple" },
  { name: "Atlas Roasters", tag: "Food & drink", gradient: "from-purple to-violet" },
  { name: "Paper & Pixel", tag: "Agency", gradient: "from-violet to-pink" },
];

export default function Work() {
  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="container-x">
        <div data-reveal>
          <SectionLabel index="02">Selected work</SectionLabel>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6" data-reveal>
          <h2 className="display-lg font-display max-w-xl text-white">
            Made to be <span className="serif-i gradient-text">experienced.</span>
          </h2>
          <p className="max-w-sm text-sm leading-7 text-white/45">
            A closer look at products and ideas shaped by curiosity, careful engineering
            and the freedom to make.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          <a
            href="https://urbusiness.tiers.rest/"
            target="_blank"
            rel="noreferrer noopener"
            data-reveal
            className="glass card-hover group relative overflow-hidden rounded-[28px] p-2"
          >
            <div className="grid h-full gap-2 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col justify-between rounded-[22px] p-6 sm:p-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.2em]">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/50">
                      Digital product / 01
                    </span>
                    <span className="rounded-full border border-pink/30 bg-pink/10 px-3 py-1 text-pink">
                      Live / 2026
                    </span>
                  </div>

                  <h3 className="font-display mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Rank Ur Business
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/35">
                    Product experience
                  </p>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-white/50">
                    A business discovery platform built to make finding and exploring
                    businesses feel clear, useful and straightforward.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white/80">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink to-purple text-white shadow-[0_10px_30px_-8px_rgba(255,61,154,0.7)] transition-transform duration-500 group-hover:rotate-45">
                    ↗
                  </span>
                  Visit live experience
                </div>
              </div>

              <div className="relative min-h-[300px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0b0714] lg:min-h-0">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple/25 blur-3xl" />
                <div className="absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-pink/15 blur-3xl" />

                <div className="relative flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <div className="ml-3 flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-center text-[9px] tracking-wider text-white/30">
                    rankurbusiness.app
                  </div>
                </div>

                <div className="relative p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[8px] uppercase tracking-[0.3em] text-white/35">
                        Discover
                      </div>
                      <div className="font-display mt-1 text-xl font-semibold text-white">
                        Find your next
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] text-white/40">
                      Nearby
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="h-3.5 w-3.5 text-white/30"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" />
                    </svg>
                    <div className="h-1.5 w-24 rounded-full bg-white/10" />
                    <div className="ml-auto flex h-6 w-14 items-center justify-center rounded-md bg-gradient-to-r from-pink to-purple text-[8px] font-semibold text-white">
                      Search
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {rows.map((row) => (
                      <div
                        key={row.name}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                      >
                        <div
                          className={`h-7 w-7 rounded-lg bg-gradient-to-br ${row.gradient} opacity-80`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[10px] font-medium text-white/70">
                            {row.name}
                          </div>
                          <div className="mt-1 h-1 w-16 rounded-full bg-white/10" />
                        </div>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] text-white/35">
                          {row.tag}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {["4.9", "120+", "Live"].map((stat) => (
                      <div
                        key={stat}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-center"
                      >
                        <div className="font-display text-xs font-semibold text-white/80">
                          {stat}
                        </div>
                        <div className="mt-1 text-[7px] uppercase tracking-[0.2em] text-white/25">
                          metric
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <div
            data-reveal
            className="glass card-hover relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[28px] p-7"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple/10 blur-3xl" />
            <div className="grid h-12 w-12 place-items-center rounded-full border border-dashed border-white/20 text-2xl text-white/40">
              +
            </div>
            <div className="relative">
              <h3 className="font-display text-2xl font-medium leading-tight text-white/90">
                More work is taking shape.
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/45">
                New projects will find their place here as their stories are ready to be
                shared. No filler, no borrowed case studies.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-white/30">
              <span>Selected work</span>
              <span>In progress</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
