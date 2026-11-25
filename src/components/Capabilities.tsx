import RollingText from "./RollingText";
import SectionLabel from "./SectionLabel";

const capabilities = [
  {
    number: "01",
    kicker: "Product / Experience",
    title: "Digital products",
    text: "Useful interfaces and thoughtful workflows shaped around real people and the way they work.",
    tag: "Useful interfaces",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12 3 3 8l9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </svg>
    ),
  },
  {
    number: "02",
    kicker: "Frontend / Systems",
    title: "Web engineering",
    text: "Fast, dependable websites and platforms with the structure to grow beyond their first release.",
    tag: "Built to scale",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="m8 7-5 5 5 5" />
        <path d="m16 7 5 5-5 5" />
        <path d="m13.5 4-3 16" />
      </svg>
    ),
  },
  {
    number: "03",
    kicker: "Motion / Interaction",
    title: "Motion & interaction",
    text: "Dimensional details, responsive movement and interactions that make an experience feel alive.",
    tag: "Alive by design",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M3 12h5l2.5-8 3 16 2.5-8h5" />
      </svg>
    ),
  },
];

export default function Capabilities() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <div data-reveal>
          <SectionLabel index="04">What I do</SectionLabel>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6" data-reveal>
          <h2 className="display-lg font-display max-w-2xl text-white">
            <RollingText>Good ideas deserve good</RollingText>{" "}
            <span className="serif-i gradient-text"><RollingText>execution.</RollingText></span>
          </h2>
          <p className="max-w-xs text-sm leading-7 text-white/45">
            Three disciplines, one standard: every part should earn its place in the
            experience.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3" data-reveal-stagger>
          {capabilities.map((capability) => (
            <article
              key={capability.number}
              className="glass card-hover group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl p-7"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-purple/0 blur-3xl transition-colors duration-700 group-hover:bg-purple/20"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between">
                <span className="gradient-text font-display text-5xl font-semibold tracking-tight opacity-70">
                  {capability.number}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors duration-500 group-hover:text-white">
                  {capability.icon}
                </span>
              </div>

              <div className="relative">
                <p className="text-[9px] uppercase tracking-[0.26em] text-white/35">
                  {capability.kicker}
                </p>
                <h3 className="font-display mt-2 text-2xl font-medium tracking-tight text-white">
                  <RollingText>{capability.title}</RollingText>
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/45">{capability.text}</p>
              </div>

              <div className="relative mt-8 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-white/35">
                <span className="h-1 w-1 rounded-full bg-gradient-to-r from-pink to-purple" />
                {capability.tag}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
