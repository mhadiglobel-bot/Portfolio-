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
    const measureImages = () => {
      const stageRect = stage.getBoundingClientRect();
      slides.forEach((slide) => {
        const image = slide.querySelector<HTMLElement>(".reel-image");
        if (!image) return;
        const previous = image.style.transform;
        image.style.transform = "none";
        const rect = image.getBoundingClientRect();
        image.style.transform = previous;
        if (!rect.width || !rect.height) return;

        const x = stageRect.left + stageRect.width / 2 - (rect.left + rect.width / 2);
        const y = stageRect.top + stageRect.height / 2 - (rect.top + rect.height / 2);
        const cover = Math.max(stageRect.width / rect.width, stageRect.height / rect.height) * 1.08;

        slide.style.setProperty("--cover-x", x + "px");
        slide.style.setProperty("--cover-y", y + "px");
        slide.style.setProperty("--cover-scale", String(cover));
      });
    };

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
      const step = Math.min(slides.length - 1, Math.floor(position));
      const incoming = Math.max(0, (position - step - 0.42) / 0.58);
      const blend = incoming * incoming * (3 - 2 * incoming);
      const active = Math.min(slides.length - 1, step + Number(blend > 0.5));

      setCurrent((previous) => previous === active ? previous : active);
      stage.style.setProperty("--longitude", (position * 58) + "deg");
      stage.style.setProperty("--reel-progress", String((position / Math.max(1, slides.length - 1)) * 100) + "%");

      slides.forEach((slide, index) => {
        const outgoing = index === step;
        const next = index === step + 1;
        const opacity = outgoing ? 1 - blend : next ? blend : 0;
        const imageProgress = outgoing ? Math.min(1, blend * 2) : next ? Math.min(1, (1 - blend) * 2) : 0;

        slide.inert = index !== active;
        slide.style.visibility = opacity > 0.001 ? "visible" : "hidden";
        slide.style.opacity = String(opacity);

        if (opacity <= 0.001) return;

        const coverX = Number.parseFloat(slide.style.getPropertyValue("--cover-x")) || 0;
        const coverY = Number.parseFloat(slide.style.getPropertyValue("--cover-y")) || 0;
        const coverScale = Number.parseFloat(slide.style.getPropertyValue("--cover-scale")) || 1;
        const shift = next ? blend - 1 : blend;

        slide.style.setProperty("--rise", (-shift * 46) + "px");
        slide.style.setProperty("--image-x", (coverX * imageProgress) + "px");
        slide.style.setProperty("--image-y", (coverY * imageProgress) + "px");
        slide.style.setProperty("--image-scale", String(1 + (coverScale - 1) * imageProgress));
        slide.style.setProperty("--image-blur", (imageProgress * 8) + "px");
        slide.style.setProperty("--chrome-opacity", String(Math.max(0, 1 - imageProgress * 3)));
        slide.style.setProperty("--image-radius", (0.45 * (1 - imageProgress)) + "rem");
        slide.style.setProperty("--image-turn", (-shift * 5 * (1 - imageProgress)) + "deg");
        slide.style.setProperty("--copy-blur", (Math.abs(shift) * 5) + "px");
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const measure = () => {
      start = root.getBoundingClientRect().top + scrollY;
      travel = Math.max(1, root.offsetHeight - stage.offsetHeight);
      if (motion.matches) measureImages();
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
            <div className="reel-globe" aria-hidden="true"><i /><i /><i /><i /><i /></div>
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
