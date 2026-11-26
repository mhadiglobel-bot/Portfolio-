"use client";

import RollingText from "./RollingText";
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

    const stage = root.querySelector<HTMLElement>(".reel-stage");
    const slides = Array.from(root.querySelectorAll<HTMLElement>(".reel-slide"));
    if (!stage || slides.length === 0) return;

    const motion = matchMedia("(min-height: 520px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let start = 0;
    let travel = 1;

    let presented: number | undefined;
    let previousFrame = 0;
    const planets = Array.from(root.querySelectorAll<HTMLElement>(".orbit-project"));
    const render = (time: number) => {
      frame = 0;
      if (!motion.matches) return;

      const target = Math.min(1, Math.max(0, (scrollY - start) / travel)) * (slides.length - 1);
      const dt = Math.min(48, Math.max(1, time - previousFrame)) / 1000;
      previousFrame = time;
      if (presented === undefined || scrollY < start - stage.clientHeight || scrollY > start + travel + stage.clientHeight) presented = target;
      const delta = target - presented;
      const maxStep = dt * 1.15;
      presented += Math.sign(delta) * Math.min(maxStep, Math.abs(delta) * (1 - Math.exp(-9 * dt)));
      if (Math.abs(delta) < .002) presented = target;
      else frame = requestAnimationFrame(render);
      const position = presented;
      const active = Math.round(position);
      setCurrent(previous => previous === active ? previous : active);
      stage.style.setProperty("--reel-progress", (position / (slides.length - 1) * 100) + "%");
      planets.forEach((planet,index) => {
        const angle = (index-position)*2*Math.PI/slides.length;
        const depth = (1+Math.cos(angle))/2;
        planet.style.left = (50 + 35*Math.sin(angle))+"%";
        planet.style.top = (46 + 32*Math.cos(angle))+"%";
        planet.style.transform = "translate(-50%,-50%) scale("+(.42+.58*depth)+") rotateY("+(-24*Math.sin(angle))+"deg)";
        planet.style.opacity = String(.44+.56*depth);
        planet.style.zIndex = String(1+Math.round(depth*10));
      });
      slides.forEach((slide,index) => { slide.inert = index !== active; slide.style.display = index === active ? "grid" : "none"; });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const measure = () => {
      start = root.getBoundingClientRect().top + scrollY;
      travel = Math.max(1, root.offsetHeight - stage.offsetHeight);

      schedule();
    };

    const configure = () => {
      if (motion.matches) {
        root.dataset.pinned = "true";
        requestAnimationFrame(measure);
      } else {
        delete root.dataset.pinned;
        slides.forEach((slide) => {
          slide.inert = false;
          slide.removeAttribute("style");
        });
      }
      measure();
    };

    jump.current = (index) => {
      presented = index;
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
      slides.forEach((slide) => {
        slide.inert = false;
        slide.removeAttribute("style");
      });
    };
  }, []);

  return (
    <section id="work" ref={section} className="project-reel" aria-labelledby="work-heading">
      <div className="reel-stage">
        <div className="container-x reel-inner">
          <header className="reel-head">
            <h2 id="work-heading"><RollingText>Selected</RollingText> <em><RollingText>work.</RollingText></em></h2>
            <span className="folio-label">Portfolio / 2026</span>
            <span className="reel-progress" aria-hidden="true"><i /></span>
          </header>
          <div className="reel-screen">
            <div className="orbit-stage">
              <div className="orbit-ring" aria-hidden="true" /><strong aria-hidden="true">Work</strong>
              {projects.map((project,index) => <button key={project.index} className="orbit-project" aria-label={"Select "+project.name} onClick={()=>jump.current(index)}>
                <Image src={project.image} width={600} height={375} sizes="(max-width:700px) 45vw, 24vw" alt="" />
              </button>)}
            </div>
            {projects.map((project) => (
              <article className="reel-slide" key={project.index}>
                <div className="reel-copy">
                  <p className="folio-label">{project.index} / 05 &nbsp; · &nbsp; {project.category}</p>
                  <h3><RollingText>{project.name}</RollingText></h3>
                  <p className="reel-description">{project.description}</p>
                  <a className="folio-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={"Open " + project.name + " in a new tab"}>
                    View live project <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <figure className="reel-image">
                  <div className="reel-media-surface"
                    onPointerMove={(event) => {
                      if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
                      const rect = event.currentTarget.getBoundingClientRect();
                      const x = (event.clientX - rect.left) / rect.width - .5;
                      const y = (event.clientY - rect.top) / rect.height - .5;
                      event.currentTarget.style.setProperty("--media-rotate-x", String(-y * 5) + "deg");
                      event.currentTarget.style.setProperty("--media-rotate-y", String(x * 5) + "deg");
                      event.currentTarget.style.setProperty("--media-light-x", String((x + .5) * 100) + "%");
                      event.currentTarget.style.setProperty("--media-light-y", String((y + .5) * 100) + "%");
                    }}
                    onPointerLeave={(event) => {
                      event.currentTarget.style.setProperty("--media-rotate-x", "0deg");
                      event.currentTarget.style.setProperty("--media-rotate-y", "0deg");
                    }}>
                    <Image src={project.image} alt={project.name + " homepage"} width={1440} height={900} sizes="(max-width: 700px) 92vw, 60vw" />
                    <div className="reel-media-chrome" aria-hidden="true">
                      <span className="reel-media-id">PROJECT / {project.index}</span>
                      <span className="reel-media-arrow">↗</span>
                    </div>
                    <figcaption className="reel-media-foot">
                      <span><i aria-hidden="true" /> {project.category}</span>
                      <span>EXPLORE THE PROJECT</span>
                    </figcaption>
                  </div>
                </figure>
              </article>
            ))}
          </div>
          <nav className="reel-nav" aria-label="Choose a project">
            {projects.map((project, index) => (
              <button
                key={project.index}
                aria-label={"Show " + project.name}
                aria-current={current === index ? "step" : undefined}
                onClick={() => jump.current(index)}
              >
                <i /><span>{project.index}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
