"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projects";

export default function Work() {
  const section = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const jump = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".reel-stage")!;
    const slides = Array.from(root.querySelectorAll<HTMLElement>(".reel-slide"));
    const motion = matchMedia("(min-height: 520px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let start = 0;
    let travel = 1;

    const render = () => {
      frame = 0;
      if (!motion.matches) return;
      const position = Math.min(1, Math.max(0, (scrollY - start) / travel)) * (slides.length - 1);
      const step = Math.floor(position);
      const incoming = Math.max(0, (position - step - .42) / .58);
      const blend = incoming * incoming * (3 - 2 * incoming);
      const active = step + Number(blend > .5);
      setCurrent(active);
      stage.style.setProperty("--longitude", (position * 58) + "deg");
      slides.forEach((slide, index) => {
        const next = index === step + 1;
        const opacity = index === step ? 1 - blend : next ? blend : 0;
        slide.inert = index !== active;
        slide.style.visibility = opacity > 0 ? "visible" : "hidden";
        if (opacity === 0) return;
        const shift = next ? blend - 1 : blend;
        slide.style.opacity = String(opacity);
        slide.style.setProperty("--depth", String(1 + shift * .24));
        slide.style.setProperty("--turn", (-shift * 14) + "deg");
        slide.style.setProperty("--rise", (-shift * 46) + "px");
        slide.style.setProperty("--blur", (Math.abs(shift) * 7) + "px");
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const measure = () => {
      start = root.getBoundingClientRect().top + scrollY;
      travel = Math.max(1, root.offsetHeight - stage.offsetHeight);
      schedule();
    };
    const configure = () => {
      if (motion.matches) root.dataset.pinned = "true";
      else {
        delete root.dataset.pinned;
        slides.forEach(slide => { slide.inert = false; slide.removeAttribute("style"); });
      }
      measure();
    };
    jump.current = index => {
      const top = start + travel * index / (slides.length - 1);
      window.scrollTo({ top, behavior: "instant" });
    };
    configure();
    const size = new ResizeObserver(measure);
    size.observe(document.body);
    size.observe(stage);
    motion.addEventListener("change", configure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("portfolio:intro-done", measure);
    return () => {
      cancelAnimationFrame(frame);
      size.disconnect();
      motion.removeEventListener("change", configure);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("portfolio:intro-done", measure);
      delete root.dataset.pinned;
      slides.forEach(slide => { slide.inert = false; slide.removeAttribute("style"); });
    };
  }, []);

  return (
    <section id="work" ref={section} className="project-reel" aria-labelledby="work-heading">
      <div className="reel-stage">
        <div className="container-x reel-inner">
          <header className="reel-head">
            <h2 id="work-heading">Selected <em>work.</em></h2>
            <span className="folio-label">Portfolio / 2026</span>
          </header>
          <div className="reel-screen">
            <div className="reel-globe" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            {projects.map(project => (
              <article className="reel-slide" key={project.index}>
                <div className="reel-copy">
                  <p className="folio-label">{project.index} / 05 &nbsp; · &nbsp; {project.category}</p>
                  <h3>{project.name}</h3>
                  <p className="reel-description">{project.description}</p>
                  <a className="folio-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} in a new tab`}>View live project <span aria-hidden="true">↗</span></a>
                </div>
                <figure className="reel-image">
                  <Image src={project.image} alt={`${project.name} homepage`} width={1440} height={900} sizes="(max-width: 700px) 92vw, 60vw" />
                </figure>
              </article>
            ))}
          </div>
          <nav className="reel-nav" aria-label="Choose a project">
            {projects.map((project, index) => (
              <button key={project.index} aria-label={`Show ${project.name}`}
                aria-current={current === index ? "step" : undefined} onClick={() => jump.current(index)}>
                <i /><span>{project.index}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
