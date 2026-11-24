"use client";

import { useEffect, useState } from "react";
import { OrbitalScene } from "@/components/orbital-scene";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
];

const waveform = [
  18, 28, 44, 34, 56, 74, 49, 31, 22, 40, 66, 88, 61, 42, 30, 53, 77, 92, 68, 45,
  27, 39, 62, 83, 57, 36, 21, 47, 72, 94, 66, 43, 29, 52, 78, 59, 38, 24, 46, 69,
  86, 58, 35, 22, 41, 64, 81, 54, 32, 20, 37, 60, 79, 51, 30, 17,
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
    <span className={`menu-glyph${open ? " is-open" : ""}`} aria-hidden="true">
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
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      observer = revealObserver;
      revealItems.forEach((item) => revealObserver.observe(item));
    }

    let frame = 0;
    const updateScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        root.style.setProperty("--scroll-progress", `${progress * 100}%`);
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

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header-inner">
          <a className="brand-mark" href="#top" aria-label="Muhammad Hadi, back to top" onClick={closeMenu}>
            <span className="brand-symbol">mh</span>
            <span className="brand-name">Muhammad Hadi</span>
          </a>

          <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
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
        <div id="mobile-navigation" className={`mobile-navigation${menuOpen ? " is-open" : ""}`}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a href="mailto:mhadi.globel@gmail.com" onClick={closeMenu}>Email me</a>
        </div>
      </header>

      <div id="main-content">
        <section className="hero-section" id="top" aria-labelledby="hero-title">
          <div className="hero-grid" />
          <OrbitalScene />
          <div className="hero-content page-container">
            <p className="hero-kicker"><span className="kicker-dot" /> Developer & digital maker</p>
            <h1 id="hero-title">
              I make digital
              <span className="hero-title-line">experiences feel</span>
              <span className="hero-title-accent">alive.</span>
            </h1>
            <p className="hero-description">
              I’m Muhammad Hadi. I turn ambitious ideas into thoughtful products, expressive interfaces, and experiences that stay with you.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Explore the work <span className="button-arrow"><ArrowUpRight /></span>
              </a>
              <a className="text-link" href="mailto:mhadi.globel@gmail.com">Start a conversation <ArrowUpRight /></a>
            </div>
          </div>

          <div className="hero-bottom page-container">
            <div className="hero-caption">
              <span>Curiosity, made tangible.</span>
              <span className="caption-rule" />
              <span>Independent by nature.</span>
            </div>
            <a className="scroll-cue" href="#intro" aria-label="Scroll to introduction">
              <span>Scroll to explore</span>
              <span className="scroll-cue-line"><i /></span>
            </a>
            <div className="hero-index">PORTFOLIO <span> / </span> 2026</div>
          </div>
        </section>

        <section className="intro-section page-container" id="intro" data-reveal>
          <div className="section-side-label"><span className="side-label-line" /> A little about the work</div>
          <div className="intro-copy">
            <p className="section-eyebrow">Design-minded. Detail-driven.</p>
            <h2>
              The best digital experiences don’t just <span>work beautifully.</span> They make you feel something.
            </h2>
            <p className="intro-support">
              I care about the full picture: the first impression, the small interactions, the structure underneath, and the moment everything comes together.
            </p>
          </div>
          <div className="intro-orbit" aria-hidden="true"><span /><span /><span /></div>
        </section>

        <section className="work-section page-container" id="work" aria-labelledby="work-title">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-eyebrow">Selected work</p>
              <h2 id="work-title">Made to be <span>experienced.</span></h2>
            </div>
            <p className="section-heading-note">A closer look at a product built around sound, creativity, and the freedom to make.</p>
          </div>

          <article className="project-card" data-reveal>
            <div
              className="project-visual"
              aria-hidden="true"
              onPointerMove={(event) => {
                if (event.pointerType !== "mouse") return;
                const rect = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                event.currentTarget.style.setProperty("--tilt-x", `${x * 3.2}deg`);
                event.currentTarget.style.setProperty("--tilt-y", `${y * -3.2}deg`);
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--tilt-x", "0deg");
                event.currentTarget.style.setProperty("--tilt-y", "0deg");
              }}
            >
              <div className="project-glow project-glow--one" />
              <div className="project-glow project-glow--two" />
              <div className="audio-window">
                <div className="audio-window-top">
                  <div className="window-dots"><i /><i /><i /></div>
                  <span className="window-title">AUDIXO / STUDIO</span>
                  <span className="window-status"><i /> SESSION READY</span>
                </div>
                <div className="audio-workspace">
                  <aside className="audio-sidebar">
                    <div className="audio-logo"><span>au</span>dixo</div>
                    <div className="audio-side-label">WORKSPACE</div>
                    <div className="audio-side-item is-active"><span className="side-icon">◈</span> Studio</div>
                    <div className="audio-side-item"><span className="side-icon">▤</span> Library</div>
                    <div className="audio-side-item"><span className="side-icon">◌</span> Tools</div>
                    <div className="audio-sidebar-bottom">Your sound, your space.</div>
                  </aside>
                  <div className="audio-main">
                    <div className="audio-main-head">
                      <div>
                        <span className="audio-overline">MULTITRACK STUDIO</span>
                        <strong>Untitled session</strong>
                      </div>
                      <span className="audio-save">All changes saved</span>
                    </div>
                    <div className="audio-toolbar">
                      <span className="play-button">▶</span>
                      <span className="audio-time">00:42 <i>/</i> 03:18</span>
                      <span className="audio-toolbar-spacer" />
                      <span className="audio-tool">↶</span>
                      <span className="audio-tool">↷</span>
                      <span className="audio-export">Export mix</span>
                    </div>
                    <div className="audio-track-head"><span>TRACKS</span><span>00:00</span><span>01:00</span><span>02:00</span><span>03:00</span></div>
                    <div className="audio-track">
                      <div className="track-name"><i className="track-color track-color--pink" /><span>Lead vocal</span><small>STEREO</small></div>
                      <div className="track-wave track-wave--pink">{waveform.map((height, index) => <i key={`v-${index}`} style={{ height: `${height}%` }} />)}</div>
                    </div>
                    <div className="audio-track">
                      <div className="track-name"><i className="track-color track-color--purple" /><span>Instrumental</span><small>STEREO</small></div>
                      <div className="track-wave track-wave--purple">{waveform.slice().reverse().map((height, index) => <i key={`i-${index}`} style={{ height: `${Math.max(12, height - 8)}%` }} />)}</div>
                    </div>
                    <div className="audio-track">
                      <div className="track-name"><i className="track-color track-color--blue" /><span>Atmosphere</span><small>MONO</small></div>
                      <div className="track-wave track-wave--blue">{waveform.map((height, index) => <i key={`a-${index}`} style={{ height: `${Math.max(10, 100 - height)}%` }} />)}</div>
                    </div>
                    <div className="audio-playhead"><i /></div>
                  </div>
                </div>
              </div>
              <div className="project-sticker project-sticker--top"><span className="sticker-orbit">✳</span><span>MAKE SOMETHING<br />THAT SOUNDS LIKE YOU</span></div>
              <div className="project-sticker project-sticker--bottom">AUDIO / CREATION / FLOW</div>
            </div>

            <div className="project-details">
              <div className="project-number">01 <span>/</span> PRODUCT EXPERIENCE</div>
              <div className="project-info">
                <div className="project-copy">
                  <h3>AUDIXO</h3>
                  <p className="project-lede">A creative audio studio, right in the browser.</p>
                  <p className="project-description">
                    A browser-based workspace for recording, trimming, arranging tracks, shaping sound, and exporting finished mixes. Built to make creative audio workflows feel approachable without getting in the way.
                  </p>
                  <div className="project-tags"><span>Web application</span><span>Audio workflows</span><span>Product design</span></div>
                </div>
                <div className="project-links">
                  <a href="https://audixo.tiers.rest/" target="_blank" rel="noreferrer">Visit live project <ArrowUpRight /></a>
                  <a href="https://github.com/mhadiglobel-bot/audixo" target="_blank" rel="noreferrer">View source <ArrowUpRight /></a>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="approach-section" id="approach" aria-labelledby="approach-title">
          <div className="page-container">
            <div className="approach-heading" data-reveal>
              <p className="section-eyebrow">The way I think</p>
              <h2 id="approach-title">Good work lives in <span>the details.</span></h2>
              <p>Not more effects. Better decisions. Every part should have a reason to be there.</p>
            </div>

            <div className="approach-list">
              <article className="approach-item" data-reveal>
                <div className="approach-index">01</div>
                <div className="approach-symbol approach-symbol--focus"><span /><span /><span /></div>
                <div className="approach-text">
                  <h3>Start with the feeling.</h3>
                  <p>Understand what the experience should feel like before deciding how it should look. Clarity first, decoration last.</p>
                </div>
                <span className="approach-arrow"><ArrowUpRight /></span>
              </article>
              <article className="approach-item" data-reveal>
                <div className="approach-index">02</div>
                <div className="approach-symbol approach-symbol--layers"><span /><span /><span /></div>
                <div className="approach-text">
                  <h3>Make complexity feel simple.</h3>
                  <p>Thoughtful structure and careful engineering let people focus on what they came to do, not on how the product works.</p>
                </div>
                <span className="approach-arrow"><ArrowUpRight /></span>
              </article>
              <article className="approach-item" data-reveal>
                <div className="approach-index">03</div>
                <div className="approach-symbol approach-symbol--motion"><span /><span /><span /></div>
                <div className="approach-text">
                  <h3>Give every movement meaning.</h3>
                  <p>Motion should guide attention, explain change, and add a little character. It should never make the experience harder to use.</p>
                </div>
                <span className="approach-arrow"><ArrowUpRight /></span>
              </article>
            </div>
          </div>
        </section>

        <section className="about-section page-container" id="about" aria-labelledby="about-title">
          <div className="about-side" data-reveal>
            <p className="section-eyebrow">A bit more human</p>
            <div className="about-monogram" aria-hidden="true"><span>m</span><span>h</span><i /></div>
            <p className="about-caption">Curious by default.<br />Careful by choice.</p>
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
            <a className="text-link about-github" href="https://github.com/mhadiglobel-bot" target="_blank" rel="noreferrer">Find me on GitHub <ArrowUpRight /></a>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-light" aria-hidden="true" />
          <div className="page-container contact-inner" data-reveal>
            <p className="section-eyebrow">Have something in mind?</p>
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
