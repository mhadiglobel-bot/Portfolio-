"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projects } from "@/lib/projects";
import styles from "./PortfolioSections.module.css";

const OrbitalStage = dynamic(() => import("./OrbitalStage"), {
  ssr: false,
  loading: () => <div className={styles.scenePlaceholder} aria-hidden="true"><span>Preparing the orbital field</span></div>,
});

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [reduced, setReduced] = useState(false);
  const last = projects.length - 1;

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce), (max-height: 540px)");
    let frame = 0;
    let previous = 0;
    let displayed = 0;
    let published = -1;

    const draw = (time: number) => {
      frame = 0;
      const section = root.current;
      const sticky = pin.current;
      if (!section || !sticky) return;

      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - sticky.offsetHeight);
      const target = media.matches ? 0 : Math.min(last, Math.max(0, (-rect.top / travel) * last));
      const delta = target - displayed;
      displayed = media.matches || Math.abs(delta) < 0.001
        ? target
        : displayed + delta * (1 - Math.exp(-Math.min(64, time - previous) / 105));
      previous = time;

      const pinned = !media.matches && rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      section.toggleAttribute("data-pinned", pinned);

      if (Math.abs(displayed - published) > 0.002 || published < 0) {
        published = displayed;
        setPosition(displayed);
      }
      if (!media.matches && Math.abs(displayed - target) > 0.001) frame = requestAnimationFrame(draw);
    };

    const queue = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const configure = () => { setReduced(media.matches); queue(); };
    configure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    media.addEventListener("change", configure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      media.removeEventListener("change", configure);
      root.current?.removeAttribute("data-pinned");
    };
  }, [last]);

  function choose(index: number) {
    if (!root.current || !pin.current || reduced || last <= 0) {
      setPosition(index);
      return;
    }
    const rect = root.current.getBoundingClientRect();
    const travel = Math.max(1, root.current.offsetHeight - pin.current.offsetHeight);
    window.scrollTo({
      top: window.scrollY + rect.top + (index / last) * travel,
      behavior: "smooth",
    });
  }

  const active = Math.max(0, Math.min(last, Math.round(position)));
  const project = projects[active];
  if (!project) return null;

  return (
    <section id="work" ref={root} className={styles.runway}
      style={{ "--travel": `${last * 90}svh` } as CSSProperties}
      data-reduced={reduced ? "true" : undefined}>
      <div ref={pin} className={styles.pin}>
        <div className={`container-x ${styles.show}`}>
          <header className={styles.header}>
            <div>
              <span className={styles.eyebrow}>03 / PROJECTS</span>
              <h2>Selected <em>projects.</em></h2>
            </div>
            <span className={styles.scrollHint}>SCROLL TO EXPLORE <i aria-hidden="true">↓</i></span>
          </header>

          <div className={styles.orbitLayout}>
            <aside className={styles.projectInfo} key={project.href} aria-live="polite">
              <span className={styles.projectMeta}>{project.index} / {String(projects.length).padStart(2,"0")} <b>·</b> {project.category}</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className={styles.projectTags} aria-label="Project disciplines">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <a className={styles.visitLink} href={project.href} target="_blank" rel="noreferrer">
                Visit live project <span aria-hidden="true">↗</span>
              </a>
            </aside>

            <div className={styles.sceneWrap}>
              <OrbitalStage position={position} projects={projects} reduced={reduced} />

            </div>
          </div>

          <nav className={styles.index} aria-label="Select a project">
            {projects.map((item, index) => (
              <button key={item.href} type="button" aria-label={`Show ${item.name}`}
                aria-current={index === active ? "step" : undefined} onClick={() => choose(index)}>
                <span>{item.index}</span><i aria-hidden="true" />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
