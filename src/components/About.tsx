import Image from "next/image";
import SectionLabel from "./SectionLabel";

const traits = ["Design × Engineering", "Frontend systems", "Motion & interaction"];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative mx-auto w-full max-w-[420px]" data-reveal>
            <div
              className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-pink/20 via-purple/10 to-transparent blur-2xl"
              aria-hidden="true"
            />
            <div className="glass relative rounded-[32px] p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-panel">
                <Image
                  src="/hadi-portrait.webp"
                  alt="Portrait of Muhammad Hadi"
                  fill
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07060b] via-transparent to-transparent opacity-75" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-white/45">
                      Muhammad Hadi
                    </div>
                    <div className="font-display mt-1 text-sm font-medium text-white">
                      Digital maker
                    </div>
                  </div>
                  <span className="glass-strong rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white/50">
                    mh / 2026
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div data-reveal>
            <SectionLabel index="05">A bit more human</SectionLabel>
            <h2 className="display-lg font-display mt-8 max-w-lg text-white">
              Curious by <span className="serif-i gradient-text">default.</span>
              <br />
              Careful by <span className="serif-i gradient-text">choice.</span>
            </h2>

            <div className="mt-7 max-w-xl space-y-4 text-sm leading-7 text-white/50">
              <p>
                Hello, I&apos;m Muhammad Hadi. I enjoy making things for the internet
                that feel considered, useful, and a little unexpected.
              </p>
              <p>
                I&apos;m drawn to the intersection of design and engineering: where an
                idea becomes an interface, where a small interaction makes a product
                click, and where the details add up to something people genuinely enjoy
                using.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/45"
                >
                  {trait}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/mhadiglobel-bot"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost"
              >
                Find me on GitHub
                <span aria-hidden="true">↗</span>
              </a>
              <a href="mailto:mhadi.globel@gmail.com" className="btn btn-ghost">
                Say hello
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
