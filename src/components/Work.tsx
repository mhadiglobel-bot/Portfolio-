import Image from "next/image";
import SectionLabel from "./SectionLabel";

const featured = {
  index: "01",
  name: "Genzio AI",
  tagline: "AI outreach platform",
  description:
    "A cold-outreach automation platform that turns inboxes, leads and follow-up sequences into one visual workflow — built to feel fast, clear and effortless.",
  href: "https://genzioai.vercel.app",
  image: "/projects/genzioai.jpg",
  domain: "genzioai.vercel.app",
  tags: ["AI SaaS", "Automation", "Product engineering"],
};

const projects = [
  {
    index: "02",
    name: "Audixo",
    tagline: "Online audio studio",
    description:
      "A browser-based audio studio for recording, trimming, vocal separation and effects — a focused workflow that keeps the sound front and centre.",
    href: "https://audixo.tiers.rest",
    image: "/projects/audixo.jpg",
    tags: ["Audio tool", "Web app"],
  },
  {
    index: "03",
    name: "Rank Ur Business",
    tagline: "Business discovery platform",
    description:
      "A directory helping local businesses and online brands get found, with search, filters and listings designed to make exploring feel straightforward.",
    href: "https://urbusiness.tiers.rest",
    image: "/projects/urbusiness.jpg",
    tags: ["Directory", "SaaS"],
  },
  {
    index: "04",
    name: "Mirfaq International",
    tagline: "Umrah transport platform",
    description:
      "A ground-services platform for Umrah travellers and agencies — airport transfers, intercity transport and package enquiries in one considered flow.",
    href: "https://www.mirfaqinternational.com",
    image: "/projects/mirfaq.jpg",
    tags: ["Travel", "Booking"],
  },
  {
    index: "05",
    name: "Alden Rovell",
    tagline: "Curated commerce storefront",
    description:
      "A polished storefront for jewellery, footwear and lifestyle essentials, shaped around a clear, mobile-first shopping experience.",
    href: "https://aldenrovell.com",
    image: "/projects/aldenrovell.jpg",
    tags: ["E-commerce", "Retail"],
  },
];

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition-all duration-500 group-hover:rotate-45 group-hover:border-pink/40 group-hover:bg-pink/10 group-hover:text-white"
    >
      ↗
    </span>
  );
}

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
          <div className="max-w-sm">
            <p className="text-sm leading-7 text-white/45">
              A selection of live products I&apos;ve designed and engineered — from AI
              outreach and audio tools to travel, commerce and local discovery.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-white/30">
              <span className="h-1 w-1 rounded-full bg-pink" />
              05 live projects / 2026
            </div>
          </div>
        </div>

        <a
          href={featured.href}
          target="_blank"
          rel="noreferrer noopener"
          data-reveal
          className="glass card-hover group mt-14 block overflow-hidden rounded-[30px] p-2 sm:rounded-[34px]"
        >
          <div className="grid gap-2 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-between rounded-[24px] p-6 sm:p-8 lg:p-9">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.2em]">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/50">
                    Featured / {featured.index}
                  </span>
                  <span className="rounded-full border border-pink/30 bg-pink/10 px-3 py-1 text-pink">
                    Live / 2026
                  </span>
                </div>

                <h3 className="font-display mt-7 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {featured.name}
                </h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/35">
                  {featured.tagline}
                </p>
                <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
                  {featured.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex items-center gap-3 text-sm font-medium text-white/80">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink to-purple text-white shadow-[0_10px_30px_-8px_rgba(255,61,154,0.7)] transition-transform duration-500 group-hover:rotate-45">
                  ↗
                </span>
                Visit live project
              </div>
            </div>

            <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0714] lg:aspect-auto lg:min-h-[520px]">
              <div className="relative z-10 flex items-center gap-2 border-b border-white/10 bg-[#0d0917]/80 px-4 py-3 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <div className="ml-3 flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-center text-[9px] tracking-wider text-white/35">
                  {featured.domain}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 top-[45px] overflow-hidden">
                <div
                  className="absolute -inset-y-[5%] inset-x-0"
                  data-media-parallax
                >
                  <Image
                    src={featured.image}
                    alt={`${featured.name} — ${featured.tagline} homepage`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-cover object-left-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]"
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07060b]/45 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </a>

        <div className="mt-5 grid gap-5 md:grid-cols-2" data-reveal-stagger>
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="glass card-hover group flex h-full flex-col overflow-hidden rounded-[28px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06]">
                <Image
                  src={project.image}
                  alt={`${project.name} — ${project.tagline} homepage`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07060b]/55 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
                    {project.index}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    Live
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/35">
                      {project.tagline}
                    </p>
                  </div>
                  <Arrow />
                </div>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
                  {project.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 transition-colors group-hover:text-white/60">
                    Visit ↗
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
