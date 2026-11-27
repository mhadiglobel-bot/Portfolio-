"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useRef, useState } from "react";
import RollingText from "./RollingText";
import { projects } from "@/lib/projects";

const latitudes = [0, 0.31, -0.28, 0.2, -0.18];

export default function Work() {
  const section = useRef<HTMLElement>(null);
  const jump = useRef<(index: number) => void>(() => {});
  const [current, setCurrent] = useState(0);
  const activeProject = projects[current] ?? projects[0];

  useEffect(() => {
    const root = section.current;
    if (!root) return;

    const stage = root.querySelector<HTMLElement>(".reel-stage");
    const globe = root.querySelector<HTMLElement>(".globe-world");
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".globe-node"));
    if (!stage || !globe || nodes.length !== projects.length) return;

    const motion = window.matchMedia(
      "(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)"
    );

    let frame = 0;
    let start = 0;
    let travel = 1;
    let presented: number | undefined;
    let previousFrame = 0;

    const render = (time: number) => {
      frame = 0;
      if (!motion.matches || !root.hasAttribute("data-pinned")) return;

      const target =
        Math.max(0, Math.min(1, (window.scrollY - start) / travel)) *
        (projects.length - 1);
      const elapsed = previousFrame
        ? Math.min(50, Math.max(1, time - previousFrame))
        : 16;
      previousFrame = time;

      if (
        presented === undefined ||
        window.scrollY < start - stage.clientHeight ||
        window.scrollY > start + travel + stage.clientHeight
      ) {
        presented = target;
      }

      const delta = target - presented;
      presented += delta * (1 - Math.exp((-9 * elapsed) / 1000));

      if (Math.abs(delta) < 0.002) {
        presented = target;
      } else {
        frame = requestAnimationFrame(render);
      }

      const rotation = (presented * Math.PI * 2) / projects.length;
      const radiusX = Math.min(globe.clientWidth * 0.34, 230);
      const radiusY = radiusX * 0.76;
      const radiusZ = radiusX * 0.78;

      globe.style.setProperty(
        "--globe-turn",
        (rotation * 180) / Math.PI + "deg"
      );
      stage.style.setProperty(
        "--reel-progress",
        (presented / (projects.length - 1)) * 100 + "%"
      );

      nodes.forEach((node, index) => {
        const longitude = (index * Math.PI * 2) / projects.length - rotation;
        const latitude = latitudes[index] ?? 0;
        const x = Math.sin(longitude) * Math.cos(latitude) * radiusX;
        const y = -Math.sin(latitude) * radiusY;
        const z = Math.cos(longitude) * Math.cos(latitude) * radiusZ;
        const depth = (z / radiusZ + 1) / 2;

        node.style.setProperty("--node-x", x + "px");
        node.style.setProperty("--node-y", y + "px");
        node.style.setProperty("--node-z", z + "px");
        node.style.setProperty("--node-scale", String(0.76 + depth * 0.38));
        node.style.opacity = String(0.18 + depth * 0.82);
        node.style.filter =
          "blur(" +
          (1 - depth) * 1.15 +
          "px) saturate(" +
          (0.78 + depth * 0.28) +
          ")";
        node.style.zIndex = z > 0 ? String(12 + Math.round(depth * 10)) : "1";
        node.style.pointerEvents = z > radiusZ * 0.12 ? "auto" : "none";
      });

      const next = Math.round(presented);
      setCurrent((previous) => (previous === next ? previous : next));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const measure = () => {
      start = root.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, root.offsetHeight - stage.offsetHeight);
      presented = undefined;
      schedule();
    };

    const configure = () => {
      if (motion.matches) {
        root.dataset.pinned = "true";
        requestAnimationFrame(measure);
      } else {
        delete root.dataset.pinned;
        globe.removeAttribute("style");
        nodes.forEach((node) => node.removeAttribute("style"));
        setCurrent(0);
      }
      measure();
    };

    jump.current = (index) => {
      const top = start + (travel * index) / (projects.length - 1);
      window.scrollTo({ top, behavior: "smooth" });
    };

    const onGlobeMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = globe.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const y = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      globe.style.setProperty("--globe-tilt-x", -y * 5 + "deg");
      globe.style.setProperty("--globe-tilt-y", x * 7 + "deg");
    };

    const onGlobeLeave = () => {
      globe.style.setProperty("--globe-tilt-x", "0deg");
      globe.style.setProperty("--globe-tilt-y", "0deg");
    };

    const resize = new ResizeObserver(measure);
    resize.observe(root);
    resize.observe(stage);
    resize.observe(globe);

    configure();
    stage.addEventListener("pointermove", onGlobeMove, { passive: true });
    stage.addEventListener("pointerleave", onGlobeLeave);
    motion.addEventListener("change", configure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("portfolio:intro-done", measure);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      stage.removeEventListener("pointermove", onGlobeMove);
      stage.removeEventListener("pointerleave", onGlobeLeave);
      motion.removeEventListener("change", configure);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("portfolio:intro-done", measure);
      delete root.dataset.pinned;
      jump.current = () => {};
    };
  }, []);

  const overviewTilt = (event: React.PointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--overview-rx", -y * 3.5 + "deg");
    event.currentTarget.style.setProperty("--overview-ry", x * 5 + "deg");
  };

  const resetOverviewTilt = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--overview-rx", "0deg");
    event.currentTarget.style.setProperty("--overview-ry", "0deg");
  };

  return (
    <section
      id="work"
      ref={section}
      className="project-reel"
      aria-labelledby="work-heading"
    >
      <div className="reel-stage">
        <div className="container-x reel-inner">
          <header className="reel-head">
            <h2 id="work-heading">
              <RollingText>Selected</RollingText>{" "}
              <em><RollingText>projects.</RollingText></em>
            </h2>
            <div className="reel-head-status">
              <span className="folio-label">PROJECT ORBIT</span>
              <span className="reel-counter">
                {String(current + 1).padStart(2, "0")}
                <i>/</i>
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <span className="reel-progress" aria-hidden="true"><i /></span>
          </header>

          <div className="reel-screen">
            <div className="orbit-stage" aria-label="Interactive 3D project globe">
              <div className="globe-caption">
                <span>PROJECT ORBIT</span>
                <span>SCROLL TO ROTATE</span>
              </div>
              <div className="globe-world">
                <div className="globe-atmosphere" aria-hidden="true" />
                <div className="globe-orbit globe-orbit-one" aria-hidden="true" />
                <div className="globe-orbit globe-orbit-two" aria-hidden="true" />
                <div className="globe-sphere" aria-hidden="true">
                  <svg className="globe-grid" viewBox="0 0 600 600" fill="none">
                    <circle cx="300" cy="300" r="258" />
                    <ellipse cx="300" cy="300" rx="258" ry="86" />
                    <ellipse cx="300" cy="300" rx="258" ry="166" />
                    <ellipse cx="300" cy="300" rx="96" ry="258" />
                    <ellipse cx="300" cy="300" rx="178" ry="258" />
                    <path d="M42 300H558M300 42V558" />
                  </svg>
                  <span className="globe-core-mark">MH</span>
                </div>

                {projects.map((project, index) => (
                  <button
                    key={project.index}
                    type="button"
                    className="globe-node"
                    aria-label={"Bring " + project.name + " to the front"}
                    aria-pressed={current === index}
                    style={{ "--project-accent": project.accent } as CSSProperties}
                    onClick={() => jump.current(index)}
                  >
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(max-width: 1100px) 18vw, 205px"
                      quality={86}
                    />
                    <span className="globe-node-label">
                      <i>{project.index}</i>
                      {project.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="globe-footer">
                <span>FIVE PROJECTS</span>
                <span>ONE ORBIT</span>
              </div>
            </div>

            <article
              key={activeProject.index}
              className="reel-overview"
              style={{ "--project-accent": activeProject.accent } as CSSProperties}
              aria-live="polite"
              onPointerMove={overviewTilt}
              onPointerLeave={resetOverviewTilt}
            >
              <div className="reel-overview-media">
                <Image
                  src={activeProject.image}
                  alt={activeProject.name + " project preview"}
                  fill
                  sizes="(max-width: 1100px) 44vw, 520px"
                  quality={92}
                  priority
                />
                <div className="reel-overview-media-top">
                  <span>PROJECT / {activeProject.index}</span>
                  <span className="reel-overview-live"><i /> LIVE EXPERIENCE</span>
                </div>
                <span className="reel-overview-corner" aria-hidden="true">↗</span>
              </div>

              <div className="reel-overview-copy">
                <div className="reel-overview-meta">
                  <span>{activeProject.category}</span>
                  <span>{activeProject.index} / 0{projects.length}</span>
                </div>
                <h3><RollingText>{activeProject.name}</RollingText></h3>
                <p>{activeProject.description}</p>
                <a
                  className="reel-overview-link"
                  href={activeProject.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore live project <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          </div>

          <nav className="reel-nav" aria-label="Choose a project">
            {projects.map((project, index) => (
              <button
                key={project.index}
                type="button"
                aria-label={"Show " + project.name}
                aria-current={current === index ? "step" : undefined}
                onClick={() => jump.current(index)}
              >
                <i />
                <span>{project.index}</span>
                <b>{project.name}</b>
              </button>
            ))}
          </nav>

          <div className="reel-mobile-list" data-reveal-stagger>
            {projects.map((project) => (
              <article
                key={project.index}
                className="project-mobile-card"
                style={{ "--project-accent": project.accent } as CSSProperties}
              >
                <a
                  className="project-mobile-media"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={"Visit " + project.name}
                >
                  <Image
                    src={project.image}
                    alt={project.name + " website preview"}
                    fill
                    sizes="(max-width: 700px) 92vw, 46vw"
                    quality={88}
                  />
                  <span>{project.index} <i>↗</i></span>
                </a>
                <div className="project-mobile-copy">
                  <span>{project.category}</span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    View live project <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
