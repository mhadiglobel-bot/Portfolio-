"use client";

import { useEffect, useState } from "react";
import { InteractiveSculpture } from "@/components/interactive-sculpture";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
];

const capabilities = [
  {
    number: "01",
    title: "Digital products",
    description: "Clear interfaces and useful workflows, shaped around the people who use them.",
    code: "PRODUCT / UX",
  },
  {
    number: "02",
    title: "Web experiences",
    description: "Responsive websites with a strong point of view and engineering underneath.",
    code: "WEB / FRONT-END",
  },
  {
    number: "03",
    title: "Interactive systems",
    description: "Motion, depth and real-time visuals that make an experience easier to understand.",
    code: "MOTION / 3D",
  },
];

const process = [
  {
    number: "01",
    title: "Find the signal.",
    description: "Understand the problem, the people, and the one thing the experience needs to make clear.",
    note: "CLARITY BEFORE COMPLEXITY",
  },
  {
    number: "02",
    title: "Shape the experience.",
    description: "Give the idea a visual language, a useful structure, and interactions that feel deliberate.",
    note: "FORM FOLLOWS INTENT",
  },
  {
    number: "03",
    title: "Build the details.",
    description: "Engineer the real thing, test the edges, and refine the small moments that make it click.",
    note: "FINISH IS A FEATURE",
  },
];

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | null = null;

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
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      revealItems.forEach((item) => observer?.observe(item));
    }

    let frame = 0;
    const updateScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        root.style.setProperty("--scroll-progress", (progress * 100).toFixed(2) + "%");
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />

      <header className={"site-header" + (scrolled ? " is-scrolled" : "")}>
        <div className="header-inner">
          <a className="brand-mark" href="#top" aria-label="Muhammad Hadi, back to top" onClick={closeMenu}>
            <span className="brand-symbol">mh</span>
            <span className="brand-name">Muhammad Hadi</span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
            ))}
            <a className="nav-contact" href="mailto:mhadi.globel@gmail.com" onClick={closeMenu}>
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
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow hero-glow--one" aria-hidden="true" />
          <div className="hero-glow hero-glow--two" aria-hidden="true" />
          <InteractiveSculpture />

          <div className="hero-container page-container">
            <div className="hero-copy">
              <p className="hero-kicker"><span className="kicker-dot" /> Independent developer <span className="kicker-divider">/</span> Digital maker</p>
              <h1 id="hero-title">
                <span>Digital products</span>
                <span>should <em>feel</em></span>
                <span>as good as they work.</span>
              </h1>
              <p className="hero-description">
                I’m Muhammad Hadi. I build thoughtful digital experiences, with care for the interface, the engineering, and every detail in between.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  Explore the work <span className="button-arrow"><ArrowUpRight /></span>
                </a>
                <a className="text-link" href="mailto:mhadi.globel@gmail.com">
                  Start a conversation <ArrowUpRight />
                </a>
              </div>
            </div>
          </div>

          <div className="hero-annotations" aria-hidden="true">
            <span className="hero-annotation hero-annotation--top">FORM / FUNCTION</span>
            <span className="hero-annotation hero-annotation--side">INTERACTIVE OBJECT 01</span>
            <span className="hero-annotation hero-annotation--bottom">BUILT TO RESPOND</span>
          </div>

          <div className="hero-bottom page-container">
            <div className="hero-caption">
              <span>Curiosity, made tangible.</span>
              <span className="caption-rule" />
              <span>Independent by nature.</span>
            </div>
            <a className="scroll-cue" href="#manifesto">
              <span>Scroll to explore</span>
              <span className="scroll-cue-line"><i /></span>
            </a>
            <span className="hero-index">PORTFOLIO <b>/</b> 2026</span>
          </div>
        </section>

        <section className="manifesto-section page-container" id="manifesto" data-reveal>
          <div className="section-side-label"><span className="side-label-line" /> The point of the work</div>
          <div className="manifesto-copy">
            <p className="section-eyebrow">01 / A way of thinking</p>
            <h2>Good work is not decoration. <span>It’s the decisions underneath.</span></h2>
            <div className="manifesto-bottom">
              <span className="manifesto-mark">MH<span>—</span>01</span>
              <p>I care about the whole experience: how it reads, how it responds, and how it holds up when the details get complicated.</p>
            </div>
          </div>
          <div className="manifesto-orbit" aria-hidden="true">
            <span className="manifesto-orbit-line manifesto-orbit-line--one" />
            <span className="manifesto-orbit-line manifesto-orbit-line--two" />
            <span className="manifesto-orbit-core" />
          </div>
        </section>

        <section className="work-section page-container" id="work" aria-labelledby="work-title">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-eyebrow">02 / Selected work</p>
              <h2 id="work-title">A work index.<br /><span>Not a wall of noise.</span></h2>
            </div>
            <p className="section-heading-note">A considered collection of digital work, experiments, and things built to solve real problems.</p>
          </div>

          <div className="work-index-panel" data-reveal>
            <div className="work-index-visual" aria-hidden="true">
              <div className="work-visual-grid" />
              <div className="work-visual-ring work-visual-ring--one" />
              <div className="work-visual-ring work-visual-ring--two" />
              <div className="work-visual-ring work-visual-ring--three" />
              <div className="work-visual-core"><span>MH</span></div>
              <span className="work-visual-coordinate work-visual-coordinate--one">24° / 01</span>
              <span className="work-visual-coordinate work-visual-coordinate--two">IDEAS IN PROGRESS</span>
            </div>
            <div className="work-index-copy">
              <span className="work-index-label"><i /> WORK ARCHIVE / BEING CURATED</span>
              <h3>The next case study deserves the right story.</h3>
              <p>I’m rebuilding this space around the work itself. New projects will appear here with the context, decisions, and details behind each one.</p>
              <a className="text-link" href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer">
                Explore the public GitHub profile <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="capabilities-section" id="capabilities" aria-labelledby="capabilities-title">
          <div className="page-container">
            <div className="capabilities-heading" data-reveal>
              <p className="section-eyebrow">03 / Areas of focus</p>
              <h2 id="capabilities-title">Different disciplines.<br /><span>One connected experience.</span></h2>
            </div>
            <div className="capabilities-grid">
              {capabilities.map((item) => (
                <article className="capability-card" key={item.number} data-reveal>
                  <div className="capability-topline"><span>{item.number}</span><span>{item.code}</span></div>
                  <div className="capability-symbol capability-symbol--one" aria-hidden="true">
                    {item.number === "01" ? <><i /><i /><i /></> : item.number === "02" ? <><i /><i /></> : <><i /><i /><i /><i /></>}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="capability-rule" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="approach-section" id="approach" aria-labelledby="approach-title">
          <div className="page-container">
            <div className="approach-heading" data-reveal>
              <p className="section-eyebrow">04 / The process</p>
              <h2 id="approach-title">Make every move<br /><span>mean something.</span></h2>
              <p>Less decoration. More intention. A good process makes the hard parts feel clear.</p>
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
        </section>

        <section className="about-section page-container" id="about" aria-labelledby="about-title">
          <div className="about-side" data-reveal>
            <p className="section-eyebrow">05 / A bit more human</p>
            <div className="about-monogram" aria-hidden="true">
              <span>m</span><span>h</span><i />
            </div>
            <p className="about-caption">Curious by default.<br />Careful by choice.</p>
            <span className="about-side-coordinate">KHI / DIGITAL MAKER</span>
          </div>
          <div className="about-content" data-reveal>
            <h2 id="about-title">Hello, I’m <span>Muhammad Hadi.</span></h2>
            <p className="about-lede">I enjoy making things for the internet that feel considered, useful, and a little unexpected.</p>
            <p className="about-body">
              I’m drawn to the intersection of design and engineering: where an idea becomes an interface, where a small interaction makes a product click, and where the details add up to something people genuinely enjoy using.
            </p>
            <p className="about-body">
              I like exploring new tools, solving the tricky parts, and refining a build until the experience feels as good as the idea behind it.
            </p>
            <a className="text-link about-github" href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer">
              Find me on GitHub <ArrowUpRight />
            </a>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-visual" aria-hidden="true">
            <span className="contact-ring contact-ring--one" />
            <span className="contact-ring contact-ring--two" />
            <span className="contact-ring contact-ring--three" />
            <span className="contact-point" />
          </div>
          <div className="page-container contact-inner" data-reveal>
            <p className="section-eyebrow">06 / Have something in mind?</p>
            <h2 id="contact-title">Let’s make<br /><span>it matter.</span></h2>
            <p className="contact-copy">A thoughtful idea deserves a thoughtful build. Tell me what you’re imagining.</p>
            <a className="contact-email" href="mailto:mhadi.globel@gmail.com">
              <span>mhadi.globel@gmail.com</span>
              <span className="contact-email-icon"><ArrowUpRight /></span>
            </a>
            <div className="contact-footnote">No forms. No hoops. Just an email.</div>
          </div>
        </section>
      </div>

      <footer className="site-footer page-container">
        <a className="brand-mark footer-brand" href="#top" aria-label="Back to top">
          <span className="brand-symbol">mh</span>
          <span className="brand-name">Muhammad Hadi</span>
        </a>
        <p>Made with curiosity and care.</p>
        <div className="footer-links">
          <a href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
          <a href="mailto:mhadi.globel@gmail.com">Email <ArrowUpRight /></a>
        </div>
        <span className="footer-year">© 2026</span>
      </footer>
    </main>
  );
}
