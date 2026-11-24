"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const InteractiveSculpture = dynamic(
  () => import("@/components/interactive-sculpture").then((module) => module.InteractiveSculpture),
  {
    ssr: false,
    loading: () => (
      <div className="sculpture-stage" aria-hidden="true">
        <div className="sculpture-fallback">
          <span className="fallback-orbit fallback-orbit--one" />
          <span className="fallback-orbit fallback-orbit--two" />
          <span className="fallback-liquid" />
        </div>
      </div>
    ),
  },
);

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
];

const focusAreas = [
  {
    number: "01",
    title: "Digital products",
    description: "Useful interfaces and clear workflows, shaped around the people who rely on them.",
    tags: "PRODUCT / INTERFACE",
    symbol: "product",
  },
  {
    number: "02",
    title: "Web engineering",
    description: "Fast, considered websites and platforms with the structure to grow beyond launch.",
    tags: "WEB / ENGINEERING",
    symbol: "web",
  },
  {
    number: "03",
    title: "Interactive systems",
    description: "Motion, dimensional visuals and small details that make an experience feel alive.",
    tags: "MOTION / REAL-TIME",
    symbol: "motion",
  },
];

const process = [
  {
    number: "01",
    title: "Find the real problem.",
    description: "Start with the people, the context and the thing that actually needs to change.",
    note: "CLARITY BEFORE COMPLEXITY",
  },
  {
    number: "02",
    title: "Give the idea a shape.",
    description: "Build a visual language and a structure that make the experience feel obvious.",
    note: "FORM WITH A REASON",
  },
  {
    number: "03",
    title: "Make every detail work.",
    description: "Engineer, test and refine the real thing until the small moments feel intentional.",
    note: "FINISH IS PART OF THE DESIGN",
  },
];

// Add verified case studies here when they are ready to be published.
// Audixo is intentionally not part of this portfolio archive.
const projects: Array<{
  number: string;
  title: string;
  category: string;
  description: string;
  href: string;
  year: string;
}> = [];

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 12.5 12.5 3.5M4.5 3.5h8v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className={"menu-glyph" + (open ? " is-open" : "")} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

export function PortfolioExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | null = null;

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", (Math.min(index % 4, 3) * 85) + "ms");
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      root.classList.add("motion-ready");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -9% 0px" },
      );
      revealItems.forEach((item) => observer?.observe(item));
    }

    let scrollFrame = 0;
    const updateScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        const heroProgress = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight, 1)));
        root.style.setProperty("--scroll-progress", (progress * 100).toFixed(2) + "%");
        root.style.setProperty("--hero-progress", heroProgress.toFixed(3));
        document.querySelector(".site-header")?.classList.toggle("is-scrolled", window.scrollY > 28);
        scrollFrame = 0;
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });

    const tiltItems = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    const tiltHandlers = tiltItems.map((item) => {
      const onMove = (event: PointerEvent) => {
        const rect = item.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / Math.max(rect.width, 1)));
        const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / Math.max(rect.height, 1)));
        item.style.setProperty("--tilt-x", ((0.5 - y) * 5.5).toFixed(2) + "deg");
        item.style.setProperty("--tilt-y", ((x - 0.5) * 7).toFixed(2) + "deg");
        item.style.setProperty("--shine-x", (x * 100).toFixed(1) + "%");
        item.style.setProperty("--shine-y", (y * 100).toFixed(1) + "%");
      };
      const onLeave = () => {
        item.style.setProperty("--tilt-x", "0deg");
        item.style.setProperty("--tilt-y", "0deg");
        item.style.setProperty("--shine-x", "50%");
        item.style.setProperty("--shine-y", "50%");
      };
      item.addEventListener("pointermove", onMove);
      item.addEventListener("pointerleave", onLeave);
      return () => {
        item.removeEventListener("pointermove", onMove);
        item.removeEventListener("pointerleave", onLeave);
      };
    });

    const distortion = document.getElementById("liquid-distortion-scale") as SVGAnimationElement | null;
    const distortionItems = Array.from(document.querySelectorAll<HTMLElement>("[data-distort]"));
    const distortionHandlers = distortionItems.map((item) => {
      const onEnter = () => {
        try {
          distortion?.beginElement();
        } catch {
          // The visual remains usable if SVG filter animation is unavailable.
        }
      };
      item.addEventListener("pointerenter", onEnter);
      return () => item.removeEventListener("pointerenter", onEnter);
    });

    const cursor = cursorRef.current;
    let cursorFrame = 0;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let targetX = cursorX;
    let targetY = cursorY;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const animateCursor = () => {
      cursorX += (targetX - cursorX) * 0.19;
      cursorY += (targetY - cursorY) * 0.19;
      if (cursor) {
        cursor.style.transform = "translate3d(" + cursorX + "px," + cursorY + "px,0) translate(-50%,-50%)";
      }
      if (Math.abs(targetX - cursorX) > 0.15 || Math.abs(targetY - cursorY) > 0.15) {
        cursorFrame = window.requestAnimationFrame(animateCursor);
      } else {
        cursorFrame = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (cursor && !cursorFrame) cursorFrame = window.requestAnimationFrame(animateCursor);

      if (cursor) {
        const hovered = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-cursor]");
        cursor.dataset.mode = hovered ? "active" : "idle";
        const label = cursor.querySelector<HTMLElement>(".cursor-label");
        if (label) label.textContent = hovered?.dataset.cursor || "";
      }
    };

    const onPointerDown = () => cursor?.classList.add("is-pressed");
    const onPointerUp = () => cursor?.classList.remove("is-pressed");

    if (cursor && finePointer && !reducedMotion) {
      root.classList.add("has-custom-cursor");
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      tiltHandlers.forEach((cleanup) => cleanup());
      distortionHandlers.forEach((cleanup) => cleanup());
      if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      root.classList.remove("motion-ready", "has-custom-cursor");
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--hero-progress");
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />

      <svg className="svg-defs" aria-hidden="true" focusable="false">
        <filter id="liquid-distort" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="8" result="noise">
            <animate attributeName="baseFrequency" values="0.012 0.035;0.028 0.075;0.012 0.035" dur="900ms" begin="indefinite" fill="freeze" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">
            <animate id="liquid-distortion-scale" attributeName="scale" values="0;20;0" dur="900ms" begin="indefinite" fill="freeze" />
          </feDisplacementMap>
        </filter>
      </svg>

      <div className="cursor-follower" ref={cursorRef} aria-hidden="true">
        <span className="cursor-dot" />
        <span className="cursor-ring"><span className="cursor-label" /></span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand-mark" href="#top" aria-label="Muhammad Hadi, back to top" onClick={closeMenu} data-cursor="TOP">
            <span className="brand-symbol">mh</span>
            <span className="brand-name">Muhammad Hadi</span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu} data-cursor="GO">{item.label}</a>
            ))}
            <a className="nav-contact" href="mailto:mhadi.globel@gmail.com" onClick={closeMenu} data-cursor="EMAIL">
              Let’s talk <ArrowUpRight />
            </a>
          </nav>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <MenuGlyph open={menuOpen} />
          </button>
        </div>

        <div id="mobile-navigation" className={"mobile-navigation" + (menuOpen ? " is-open" : "")}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
          ))}
          <a href="mailto:mhadi.globel@gmail.com" onClick={closeMenu}>Let’s talk</a>
        </div>
      </header>

      <div id="main-content">
        <section className="hero-section" id="top" aria-labelledby="hero-title">
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-liquid-glow hero-liquid-glow--one" aria-hidden="true" />
          <div className="hero-liquid-glow hero-liquid-glow--two" aria-hidden="true" />
          <InteractiveSculpture />

          <div className="hero-container page-container">
            <div className="hero-copy">
              <p className="hero-kicker"><span className="kicker-dot" /> INDEPENDENT DEVELOPER <span className="kicker-slash">/</span> DIGITAL MAKER</p>
              <h1 id="hero-title">
                I build
                <span>digital things</span>
                <em>with a pulse.</em>
              </h1>
              <p className="hero-description">
                I’m Muhammad Hadi. I turn ambitious ideas into thoughtful products, expressive interfaces and digital experiences built to last.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work" data-cursor="EXPLORE">
                  Explore the work <span className="button-arrow"><ArrowUpRight /></span>
                </a>
                <a className="text-link" href="mailto:mhadi.globel@gmail.com" data-cursor="EMAIL">
                  Start a conversation <ArrowUpRight />
                </a>
              </div>
            </div>
          </div>

          <div className="hero-annotations" aria-hidden="true">
            <span className="hero-annotation hero-annotation--top">FORM / FUNCTION</span>
            <span className="hero-annotation hero-annotation--side">REAL-TIME OBJECT 01</span>
            <span className="hero-annotation hero-annotation--bottom">BUILT TO RESPOND</span>
          </div>

          <div className="hero-bottom page-container">
            <div className="hero-caption">
              <span>Curiosity, made tangible.</span>
              <span className="caption-rule" />
              <span>Independent by nature.</span>
            </div>
            <a className="scroll-cue" href="#manifesto" data-cursor="SCROLL">
              <span>Scroll to explore</span>
              <span className="scroll-cue-line"><i /></span>
            </a>
            <span className="hero-index">PORTFOLIO <b>/</b> 2026</span>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>PRODUCT THINKING</span><i>✳</i><span>INTERFACE DESIGN</span><i>✳</i><span>WEB ENGINEERING</span><i>✳</i><span>INTERACTIVE SYSTEMS</span><i>✳</i>
            <span>PRODUCT THINKING</span><i>✳</i><span>INTERFACE DESIGN</span><i>✳</i><span>WEB ENGINEERING</span><i>✳</i><span>INTERACTIVE SYSTEMS</span><i>✳</i>
          </div>
        </div>

        <section className="manifesto-section page-container" id="manifesto">
          <div className="manifesto-aside" data-reveal>
            <p className="section-eyebrow"><span className="eyebrow-line" /> 01 / THE POINT OF THE WORK</p>
            <span className="manifesto-index">MH — 01</span>
          </div>
          <div className="manifesto-content" data-reveal>
            <h2>Good work has a feeling. <em>Great work has a reason.</em></h2>
            <div className="manifesto-foot">
              <span className="manifesto-orbit-mark" aria-hidden="true"><i /><i /><b /></span>
              <p>The first impression matters. So do the small interactions, the structure underneath, and the moment everything comes together.</p>
            </div>
          </div>
          <div className="manifesto-watermark" aria-hidden="true">01</div>
        </section>

        <section className="work-section page-container" id="work" aria-labelledby="work-title">
          <div className="section-topline" data-reveal>
            <p className="section-eyebrow"><span className="eyebrow-line" /> 02 / SELECTED WORK</p>
            <span className="section-side-note">A growing archive / 2026</span>
          </div>
          <div className="work-heading" data-reveal>
            <h2 id="work-title">Made to be <em>experienced.</em></h2>
            <p>A considered collection of products, systems and experiments. Each project will have room for its own story.</p>
          </div>

          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map((project) => (
                <a className="project-card" href={project.href} key={project.number} data-cursor="VIEW" data-tilt>
                  <div className="project-card-visual"><span>{project.number}</span></div>
                  <div className="project-card-info">
                    <div><p>{project.category} / {project.year}</p><h3>{project.title}</h3></div>
                    <ArrowUpRight />
                    <p className="project-description">{project.description}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="archive-card" data-tilt data-reveal>
              <div className="archive-art" data-distort data-cursor="EXPLORE" aria-hidden="true">
                <div className="archive-art-grid" />
                <div className="archive-art-orbit archive-art-orbit--one" />
                <div className="archive-art-orbit archive-art-orbit--two" />
                <div className="archive-art-orbit archive-art-orbit--three" />
                <div className="archive-art-core" />
                <div className="archive-art-window archive-art-window--one"><span /><i /><i /><i /></div>
                <div className="archive-art-window archive-art-window--two"><span /><b /><b /><b /></div>
                <span className="archive-art-coordinate archive-art-coordinate--one">24° / 01</span>
                <span className="archive-art-coordinate archive-art-coordinate--two">IDEAS IN MOTION</span>
                <span className="archive-art-caption">WORK / INDEX</span>
              </div>
              <div className="archive-copy">
                <p className="archive-status"><i /> CASE STUDIES / BEING CURATED</p>
                <h3>The work deserves<br /><em>its own space.</em></h3>
                <p>The archive is ready. Projects will be added with the context, decisions and details behind the build. No filler projects or borrowed case studies.</p>
                <div className="archive-categories">
                  <span>PRODUCTS</span><span>SYSTEMS</span><span>EXPERIMENTS</span>
                </div>
                <a className="text-link archive-link" href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer" data-cursor="OPEN">
                  Explore the public GitHub <ArrowUpRight />
                </a>
              </div>
            </div>
          )}
          <div className="work-footnote" data-reveal>
            <span>WORK IS NEVER JUST THE SCREEN.</span>
            <span>IT’S EVERYTHING THAT MAKES IT WORK.</span>
          </div>
        </section>

        <section className="focus-section" id="focus" aria-labelledby="focus-title">
          <div className="page-container">
            <div className="focus-heading" data-reveal>
              <p className="section-eyebrow"><span className="eyebrow-line" /> 03 / AREAS OF FOCUS</p>
              <h2 id="focus-title">Different disciplines.<br /><em>One connected experience.</em></h2>
            </div>
            <div className="focus-grid">
              {focusAreas.map((item) => (
                <article className="focus-card" key={item.number} data-reveal data-cursor="DETAILS">
                  <div className="focus-card-top"><span>{item.number}</span><span>{item.tags}</span></div>
                  <div className={"focus-symbol focus-symbol--" + item.symbol} aria-hidden="true"><i /><i /><i /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="focus-card-line" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="approach-section" id="approach" aria-labelledby="approach-title">
          <div className="page-container">
            <div className="approach-layout">
              <div className="approach-heading" data-reveal>
                <p className="section-eyebrow"><span className="eyebrow-line" /> 04 / THE APPROACH</p>
                <h2 id="approach-title">Good work lives in <em>the details.</em></h2>
                <p>Not more effects. Better decisions. Every part should have a reason to be there.</p>
                <span className="approach-stamp" aria-hidden="true">THOUGHTFUL<br />BY DESIGN</span>
              </div>
              <div className="approach-list">
                {process.map((item) => (
                  <article className="approach-item" key={item.number} data-reveal>
                    <span className="approach-index">{item.number}</span>
                    <div className="approach-text">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span className="approach-note">{item.note}</span>
                    </div>
                    <span className="approach-arrow"><ArrowUpRight /></span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section page-container" id="about" aria-labelledby="about-title">
          <div className="about-visual" data-reveal>
            <p className="section-eyebrow"><span className="eyebrow-line" /> 05 / A BIT MORE HUMAN</p>
            <div className="about-emblem" aria-hidden="true">
              <span className="about-emblem-ring about-emblem-ring--one" />
              <span className="about-emblem-ring about-emblem-ring--two" />
              <span className="about-emblem-core">mh</span>
              <i />
            </div>
            <p className="about-caption">Curious by default.<br />Careful by choice.</p>
            <span className="about-coordinate">INDEPENDENT / DIGITAL MAKER</span>
          </div>
          <div className="about-copy" data-reveal>
            <h2 id="about-title">Hello, I’m <em>Muhammad Hadi.</em></h2>
            <p className="about-lede">I enjoy making things for the internet that feel considered, useful, and a little unexpected.</p>
            <p>I’m drawn to the intersection of design and engineering: where an idea becomes an interface, where a small interaction makes a product click, and where the details add up to something people genuinely enjoy using.</p>
            <p>I like exploring new tools, solving the tricky parts, and refining a build until the experience feels as good as the idea behind it.</p>
            <a className="text-link about-link" href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer" data-cursor="OPEN">
              Find me on GitHub <ArrowUpRight />
            </a>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-liquid" aria-hidden="true">
            <span className="contact-liquid-ring contact-liquid-ring--one" />
            <span className="contact-liquid-ring contact-liquid-ring--two" />
            <span className="contact-liquid-core" />
          </div>
          <div className="page-container contact-inner" data-reveal>
            <p className="section-eyebrow"><span className="eyebrow-line" /> 06 / HAVE SOMETHING IN MIND?</p>
            <h2 id="contact-title">Let’s make<br /><em>it matter.</em></h2>
            <p className="contact-copy">A thoughtful idea deserves a thoughtful build. Tell me what you’re imagining.</p>
            <a className="contact-email" href="mailto:mhadi.globel@gmail.com" data-cursor="EMAIL">
              <span>mhadi.globel@gmail.com</span>
              <span className="contact-email-icon"><ArrowUpRight /></span>
            </a>
            <span className="contact-footnote">No forms. No hoops. Just an email.</span>
          </div>
        </section>
      </div>

      <footer className="site-footer page-container">
        <a className="brand-mark footer-brand" href="#top" aria-label="Back to top" data-cursor="TOP">
          <span className="brand-symbol">mh</span>
          <span className="brand-name">Muhammad Hadi</span>
        </a>
        <p>Made with curiosity and care.</p>
        <div className="footer-links">
          <a href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer" data-cursor="OPEN">GitHub <ArrowUpRight /></a>
          <a href="mailto:mhadi.globel@gmail.com" data-cursor="EMAIL">Email <ArrowUpRight /></a>
        </div>
        <span className="footer-year">© 2026</span>
      </footer>
    </main>
  );
}
