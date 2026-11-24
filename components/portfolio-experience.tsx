"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
];

const projects = [
  {
    number: "01",
    title: "Rank Ur Business",
    category: "DIGITAL PRODUCT / BUSINESS DISCOVERY",
    description:
      "A business discovery platform built to make finding and exploring businesses feel clear, useful and straightforward.",
    href: "https://urbusiness.tiers.rest/",
    action: "Visit live experience",
  },
];

const capabilities = [
  {
    number: "01",
    title: "Digital products",
    description:
      "Useful interfaces and thoughtful workflows shaped around real people and the way they work.",
    symbol: "✳",
    detail: "PRODUCT / EXPERIENCE",
  },
  {
    number: "02",
    title: "Web engineering",
    description:
      "Fast, dependable websites and platforms with the structure to grow beyond their first release.",
    symbol: "⌘",
    detail: "FRONTEND / SYSTEMS",
  },
  {
    number: "03",
    title: "Motion & interaction",
    description:
      "Dimensional details, responsive movement and interactions that make an experience feel alive.",
    symbol: "↗",
    detail: "MOTION / INTERACTION",
  },
];

const approach = [
  {
    number: "01",
    title: "Start with the feeling.",
    description:
      "Understand what the experience should feel like before deciding how it should look. Clarity first, decoration last.",
    note: "INTENTION BEFORE INTERFACE",
  },
  {
    number: "02",
    title: "Make complexity feel simple.",
    description:
      "Thoughtful structure and careful engineering let people focus on what they came to do, not on how the product works.",
    note: "LESS FRICTION, MORE FLOW",
  },
  {
    number: "03",
    title: "Give every movement meaning.",
    description:
      "Motion should guide attention, explain change and add character. It should never make the experience harder to use.",
    note: "MOTION WITH A PURPOSE",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" fill="none">
      <path
        d="M4 14 14 4M5 4h9v9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const header = document.querySelector<HTMLElement>(".site-header");
    let observer: IntersectionObserver | null = null;

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", Math.min(index % 4, 3) * 75 + "ms");
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
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
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
        root.style.setProperty("--page-progress", (progress * 100).toFixed(2) + "%");
        sceneRef.current?.style.setProperty("--scroll-y", (-heroProgress * 34).toFixed(1) + "px");
        header?.classList.toggle("is-scrolled", window.scrollY > 24);
        scrollFrame = 0;
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });

    const hero = heroRef.current;
    const scene = sceneRef.current;
    const onHeroPointerMove = (event: PointerEvent) => {
      if (!finePointer || reducedMotion || !hero || !scene) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      scene.style.setProperty("--mx", (x * 18).toFixed(1) + "px");
      scene.style.setProperty("--my", (y * 14).toFixed(1) + "px");
      scene.style.setProperty("--rx", (y * -5).toFixed(2) + "deg");
      scene.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
    };
    const resetHeroPointer = () => {
      if (!scene) return;
      scene.style.setProperty("--mx", "0px");
      scene.style.setProperty("--my", "0px");
      scene.style.setProperty("--rx", "0deg");
      scene.style.setProperty("--ry", "0deg");
    };

    hero?.addEventListener("pointermove", onHeroPointerMove, { passive: true });
    hero?.addEventListener("pointerleave", resetHeroPointer);

    const tiltItems = finePointer
      ? Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"))
      : [];
    const tiltCleanups = tiltItems.map((item) => {
      const onMove = (event: PointerEvent) => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
        item.style.setProperty("--tilt-x", (y * -3.2).toFixed(2) + "deg");
        item.style.setProperty("--tilt-y", (x * 4.2).toFixed(2) + "deg");
        item.style.setProperty("--shine-x", ((x + 0.5) * 100).toFixed(1) + "%");
        item.style.setProperty("--shine-y", ((y + 0.5) * 100).toFixed(1) + "%");
      };
      const onLeave = () => {
        item.style.setProperty("--tilt-x", "0deg");
        item.style.setProperty("--tilt-y", "0deg");
        item.style.setProperty("--shine-x", "50%");
        item.style.setProperty("--shine-y", "50%");
      };
      item.addEventListener("pointermove", onMove, { passive: true });
      item.addEventListener("pointerleave", onLeave);
      return () => {
        item.removeEventListener("pointermove", onMove);
        item.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      hero?.removeEventListener("pointermove", onHeroPointerMove);
      hero?.removeEventListener("pointerleave", resetHeroPointer);
      tiltCleanups.forEach((cleanup) => cleanup());
      root.classList.remove("motion-ready");
      root.style.removeProperty("--page-progress");
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />

      <header className="site-header">
        <div className="header-inner">
          <a className="brand-mark" href="#top" onClick={closeMenu} aria-label="Muhammad Hadi, back to top">
            <span className="brand-symbol">mh</span>
            <span className="brand-name">Muhammad Hadi</span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
            ))}
            <a className="nav-contact" href="mailto:mhadi.globel@gmail.com" onClick={closeMenu}>
              Let’s talk <ArrowIcon />
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

        <nav id="mobile-navigation" className={"mobile-navigation" + (menuOpen ? " is-open" : "")} aria-label="Mobile navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
          ))}
          <a href="mailto:mhadi.globel@gmail.com" onClick={closeMenu}>Let’s talk <ArrowIcon /></a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero-section" id="top" ref={heroRef} aria-labelledby="hero-title">
          <div className="hero-background-grid" aria-hidden="true" />
          <div className="hero-glow hero-glow--one" aria-hidden="true" />
          <div className="hero-glow hero-glow--two" aria-hidden="true" />

          <div className="hero-scene" ref={sceneRef} aria-hidden="true">
            <div className="scene-aura" />
            <div className="scene-backplate" />
            <div className="scene-loop scene-loop--one" />
            <div className="scene-loop scene-loop--two" />
            <div className="scene-core">
              <span className="scene-core-highlight" />
              <span className="scene-core-shadow" />
            </div>
            <div className="scene-ribbon scene-ribbon--one" />
            <div className="scene-ribbon scene-ribbon--two" />
            <div className="scene-spark scene-spark--one" />
            <div className="scene-spark scene-spark--two" />
            <div className="scene-spark scene-spark--three" />

            <div className="scene-panel scene-panel--one">
              <span className="scene-panel-index">01 / BUILD</span>
              <strong>Systems with purpose</strong>
              <span className="scene-panel-meter"><i /></span>
            </div>
            <div className="scene-panel scene-panel--two">
              <span className="scene-panel-index">02 / DESIGN</span>
              <strong>Details with intent</strong>
              <span className="scene-panel-meter"><i /></span>
            </div>
            <div className="scene-panel scene-panel--three">
              <span className="scene-panel-index">03 / SHIP</span>
              <strong>Ideas into reality</strong>
              <span className="scene-panel-meter"><i /></span>
            </div>
            <span className="scene-coordinate scene-coordinate--one">FORM / FUNCTION</span>
            <span className="scene-coordinate scene-coordinate--two">INTERACTIVE STUDY 01</span>
          </div>

          <div className="hero-content page-container">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> INDEPENDENT DEVELOPER <i>/</i> DIGITAL MAKER</p>
              <h1 id="hero-title">
                <span>I make digital</span>
                <span>experiences</span>
                <em className="gradient-text">feel alive.</em>
              </h1>
              <p className="hero-description">
                I’m Muhammad Hadi. I turn ambitious ideas into thoughtful products, expressive interfaces and experiences that stay with you.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  Explore the work <span className="button-icon"><ArrowIcon /></span>
                </a>
                <a className="text-link" href="mailto:mhadi.globel@gmail.com">
                  Start a conversation <ArrowIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="hero-footer page-container">
            <div className="hero-footer-note">
              <span>Curiosity, made tangible.</span>
              <i />
              <span>Independent by nature.</span>
            </div>
            <a className="scroll-cue" href="#statement">
              <span>Scroll to explore</span>
              <b><i /></b>
            </a>
            <span className="hero-index">PORTFOLIO <i>/</i> 2026</span>
          </div>
        </section>

        <div className="ticker" aria-label="Areas of work">
          <div className="ticker-track">
            <span>PRODUCT THINKING</span><i>✳</i><span>INTERFACE DESIGN</span><i>✳</i><span>WEB ENGINEERING</span><i>✳</i><span>INTERACTIVE SYSTEMS</span><i>✳</i>
            <span>PRODUCT THINKING</span><i>✳</i><span>INTERFACE DESIGN</span><i>✳</i><span>WEB ENGINEERING</span><i>✳</i><span>INTERACTIVE SYSTEMS</span><i>✳</i>
          </div>
        </div>

        <section className="statement-section page-container" id="statement">
          <div className="section-aside" data-reveal>
            <p className="section-eyebrow"><span /> 01 / THE POINT OF THE WORK</p>
            <span className="section-index">MH — 01</span>
          </div>
          <div className="statement-content" data-reveal>
            <h2>The best digital experiences don’t just <em className="gradient-text">work beautifully.</em> They make you feel something.</h2>
            <div className="statement-foot">
              <span className="statement-mark" aria-hidden="true"><i /><i /><b /></span>
              <p>The first impression matters. So do the small interactions, the structure underneath, and the moment everything comes together.</p>
            </div>
          </div>
          <span className="statement-watermark" aria-hidden="true">01</span>
        </section>

        <section className="work-section page-container" id="work" aria-labelledby="work-title">
          <div className="section-topline" data-reveal>
            <p className="section-eyebrow"><span /> 02 / SELECTED WORK</p>
            <span className="section-note">A growing archive / 2026</span>
          </div>
          <div className="work-heading" data-reveal>
            <h2 id="work-title">Made to be <em className="gradient-text">experienced.</em></h2>
            <p>A closer look at products and ideas shaped by curiosity, careful engineering and the freedom to make.</p>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => (
              <a
                className="project-card"
                href={project.href}
                key={project.number}
                target="_blank"
                rel="noreferrer"
                data-tilt
                data-reveal
                style={{ "--card-delay": index * 100 + "ms" } as CSSProperties}
              >
                <div className="project-visual">
                  <div className="project-visual-glow" />
                  <div className="project-visual-orbit project-visual-orbit--one" />
                  <div className="project-visual-orbit project-visual-orbit--two" />
                  <div className="project-visual-mark">R</div>
                  <div className="project-visual-label"><span>RANK</span><i /> <span>UR</span><i /> <span>BUSINESS</span></div>
                  <span className="project-visual-corner">DIGITAL PRODUCT / 01</span>
                </div>
                <div className="project-info">
                  <div className="project-meta"><span>{project.number} / PRODUCT EXPERIENCE</span><span>LIVE / 2026</span></div>
                  <h3>{project.title}</h3>
                  <p className="project-category">{project.category}</p>
                  <p className="project-description">{project.description}</p>
                  <span className="project-link">{project.action} <ArrowIcon /></span>
                </div>
              </a>
            ))}

            <article className="archive-note" data-reveal>
              <span className="archive-note-index">02 / THE ARCHIVE</span>
              <div className="archive-note-art" aria-hidden="true">
                <span className="archive-note-shape archive-note-shape--one" />
                <span className="archive-note-shape archive-note-shape--two" />
                <span className="archive-note-shape archive-note-shape--three" />
                <b>+</b>
              </div>
              <div className="archive-note-copy">
                <h3>More work is taking shape.</h3>
                <p>New projects will find their place here as their stories are ready to be shared. No filler, no borrowed case studies.</p>
              </div>
            </article>
          </div>
          <div className="work-footnote" data-reveal>
            <span>SELECTED WORK / IN PROGRESS</span>
            <span>Built with curiosity and care.</span>
          </div>
        </section>

        <section className="capabilities-section">
          <div className="page-container">
            <div className="capabilities-heading" data-reveal>
              <p className="section-eyebrow"><span /> 03 / WHAT I DO</p>
              <h2>Good ideas deserve <em className="gradient-text">good execution.</em></h2>
            </div>
            <div className="capability-grid">
              {capabilities.map((item, index) => (
                <article className="capability-card" key={item.number} data-reveal style={{ "--card-delay": index * 100 + "ms" } as CSSProperties}>
                  <div className="capability-top"><span>{item.number}</span><span>{item.detail}</span></div>
                  <div className="capability-symbol" aria-hidden="true">{item.symbol}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="capability-line"><i /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="approach-section page-container" id="approach">
          <div className="approach-layout">
            <div className="approach-heading" data-reveal>
              <p className="section-eyebrow"><span /> 04 / THE WAY I THINK</p>
              <h2>Good work lives in <em className="gradient-text">the details.</em></h2>
              <p>Not more effects. Better decisions. Every part should have a reason to be there.</p>
              <span className="approach-stamp" aria-hidden="true">MADE WITH<br />INTENTION</span>
            </div>
            <div className="approach-list">
              {approach.map((item, index) => (
                <article className="approach-item" key={item.number} data-reveal style={{ "--card-delay": index * 100 + "ms" } as CSSProperties}>
                  <span className="approach-index">{item.number}</span>
                  <div className="approach-text">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="approach-note">{item.note}</span>
                  </div>
                  <span className="approach-arrow"><ArrowIcon /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section page-container" id="about">
          <div className="about-visual" data-reveal>
            <p className="section-eyebrow"><span /> 05 / A BIT MORE HUMAN</p>
            <div className="portrait-scene" data-tilt>
              <div className="portrait-aura" />
              <div className="portrait-frame">
                <img
                  src="/hadi-portrait.webp"
                  width="380"
                  height="475"
                  alt="Muhammad Hadi"
                  loading="lazy"
                  decoding="async"
                />
                <span className="portrait-frame-line" />
              </div>
              <span className="portrait-label">MUHAMMAD HADI <i> / </i> DIGITAL MAKER</span>
              <span className="portrait-index">MH / 2026</span>
            </div>
            <p className="about-caption">Curious by default.<br />Careful by choice.</p>
          </div>

          <div className="about-copy" data-reveal>
            <p className="section-eyebrow"><span /> HELLO, THERE</p>
            <h2>Hello, I’m <em className="gradient-text">Muhammad Hadi.</em></h2>
            <p className="about-lede">I enjoy making things for the internet that feel considered, useful, and a little unexpected.</p>
            <p>I’m drawn to the intersection of design and engineering: where an idea becomes an interface, where a small interaction makes a product click, and where the details add up to something people genuinely enjoy using.</p>
            <p>I like exploring new tools, solving the tricky parts, and refining a build until the experience feels as good as the idea behind it.</p>
            <a className="text-link about-link" href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer">
              Find me on GitHub <ArrowIcon />
            </a>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-orb" aria-hidden="true">
            <span className="contact-orb-ring contact-orb-ring--one" />
            <span className="contact-orb-ring contact-orb-ring--two" />
            <span className="contact-orb-core" />
          </div>
          <div className="contact-inner page-container" data-reveal>
            <p className="section-eyebrow"><span /> HAVE SOMETHING IN MIND?</p>
            <h2>Let’s make<br /><em className="gradient-text">it matter.</em></h2>
            <p className="contact-copy">A thoughtful idea deserves a thoughtful build. Tell me what you’re imagining.</p>
            <a className="contact-email" href="mailto:mhadi.globel@gmail.com">
              mhadi.globel@gmail.com <span><ArrowIcon /></span>
            </a>
            <small className="contact-footnote">No forms. No hoops. Just an email.</small>
          </div>
        </section>
      </main>

      <footer className="site-footer page-container">
        <a className="brand-mark footer-brand" href="#top" aria-label="Back to top">
          <span className="brand-symbol">mh</span>
          <span className="brand-name">Muhammad Hadi</span>
        </a>
        <p>Made with curiosity and care.</p>
        <div className="footer-links">
          <a href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer">GitHub <ArrowIcon /></a>
          <a href="mailto:mhadi.globel@gmail.com">Email <ArrowIcon /></a>
        </div>
        <span className="footer-year">© 2026</span>
      </footer>
    </div>
  );
}
