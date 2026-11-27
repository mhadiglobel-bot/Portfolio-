"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import RollingText from "./RollingText";
import { projects } from "@/lib/projects";

const latitudes = [0, 0.24, -0.22, 0.17, -0.15];

export default function Work() {
  const section = useRef<HTMLElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);
  const jump = useRef<(index: number) => void>(() => {});
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const root = section.current;
    const pin = pinWrap.current;
    if (!root || !pin) return;

    const stage = pin.querySelector<HTMLElement>(".reel-stage");
    const globe = pin.querySelector<HTMLElement>(".globe-world");
    const nodes = Array.from(pin.querySelectorAll<HTMLElement>(".globe-node"));
    const progressBar = pin.querySelector<HTMLElement>(".reel-progress > i");
    if (!stage || !globe || nodes.length !== projects.length) return;

    const motion = window.matchMedia(
      "(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)"
    );

    let frame = 0;
    let start = 0;
    let travel = 1;
    let presented: number | undefined;
    let previousFrame = 0;

    const positionNodes = (position: number) => {
      const rotation = (position * Math.PI * 2) / projects.length;
      const radiusX = globe.clientWidth * 0.425;
      const radiusY = radiusX * 0.25;
      const radiusZ = radiusX * 0.82;

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
        node.style.setProperty("--node-scale", String(0.72 + depth * 0.48));
        node.style.setProperty(
          "--node-turn",
          String(-Math.sin(longitude) * 12) + "deg"
        );
        node.style.opacity = String(0.2 + depth * 0.8);
        node.style.filter =
          "blur(" +
          (1 - depth) * 1.05 +
          "px) saturate(" +
          (0.76 + depth * 0.3) +
          ")";
        node.style.zIndex = z > 0 ? String(12 + Math.round(depth * 10)) : "1";
        node.style.pointerEvents = z > radiusZ * 0.12 ? "auto" : "none";
      });

      const next = Math.round(position);
      setCurrent((previous) => (previous === next ? previous : next));
    };

    const render = (time: number) => {
      frame = 0;
      if (!motion.matches || !pin.hasAttribute("data-pinned")) return;

      const relative = window.scrollY - start;
      const progress = Math.max(0, Math.min(1, relative / travel));
      const pinState = relative <= 0 ? "before" : relative >= travel ? "after" : "active";
      if (stage.dataset.pinState !== pinState) {
        stage.dataset.pinState = pinState;
      }
      const target = progress * (projects.length - 1);
      const elapsed = previousFrame
        ? Math.min(50, Math.max(1, time - previousFrame))
        : 16;
      previousFrame = time;

      if (presented === undefined) presented = target;

      const delta = target - presented;
      presented += delta * (1 - Math.exp((-9 * elapsed) / 1000));

      if (Math.abs(delta) < 0.0015) {
        presented = target;
      } else {
        frame = requestAnimationFrame(render);
      }

      positionNodes(presented);
      if (progressBar) {
        progressBar.style.width = progress * 100 + "%";
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const measure = () => {
      start = pin.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, pin.offsetHeight - stage.offsetHeight);
      presented = undefined;

      if (motion.matches) {
        schedule();
      } else {
        positionNodes(0);
        if (progressBar) progressBar.style.width = "0%";
      }
    };

    const configure = () => {
      if (motion.matches) {
        pin.dataset.pinned = "true";
      } else {
        delete pin.dataset.pinned;
        delete stage.dataset.pinState;
      }

      jump.current = (index) => {
        if (!motion.matches) {
          document
            .getElementById("project-card-" + projects[index].index)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        const top = start + (travel * index) / (projects.length - 1);
        window.scrollTo({ top, behavior: "smooth" });
      };

      measure();
    };

    const onGlobeMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = globe.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const y = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      globe.style.setProperty("--globe-tilt-x", -y * 4.5 + "deg");
      globe.style.setProperty("--globe-tilt-y", x * 6.5 + "deg");
    };

    const onGlobeLeave = () => {
      globe.style.setProperty("--globe-tilt-x", "0deg");
      globe.style.setProperty("--globe-tilt-y", "0deg");
    };

    const resize = new ResizeObserver(measure);
    resize.observe(pin);
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
      delete pin.dataset.pinned;
      jump.current = () => {};
    };
  }, []);

  const cardTilt = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const y = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    event.currentTarget.style.setProperty("--project-card-rx", -y * 2.6 + "deg");
    event.currentTarget.style.setProperty("--project-card-ry", x * 3.4 + "deg");
  };

  const resetCardTilt = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--project-card-rx", "0deg");
    event.currentTarget.style.setProperty("--project-card-ry", "0deg");
  };

  return (
    <section
      id="work"
      ref={section}
      className="project-reel"
      aria-labelledby="work-heading"
    >
      <div ref={pinWrap} className="reel-pin-wrap">
        <div className="reel-stage">
          <div className="container-x reel-inner">
            <header className="reel-head">
              <h2 id="work-heading">
                <RollingText>Selected</RollingText>{" "}
                <em><RollingText>projects.</RollingText></em>
              </h2>
              <div className="reel-head-status">
                <span className="folio-label">PROJECT ORBIT</span>
                <span className="reel-counter" aria-live="polite">
                  {String(current + 1).padStart(2, "0")}
                  <i>/</i>
                  {String(projects.length).padStart(2, "0")}
                </span>
              </div>
              <span className="reel-progress" aria-hidden="true"><i /></span>
            </header>

            <div className="orbit-stage" aria-label="Three-dimensional project orbit">
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
                      sizes="(max-width: 900px) 28vw, 230px"
                      quality={90}
                      unoptimized
                      draggable={false}
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
          </div>
        </div>
      </div>

      <div className="container-x reel-projects">
        <header className="reel-projects-heading">
          <p className="folio-label">PROJECT DETAILS / 01—05</p>
          <h3>Selected work, <em>in detail.</em></h3>
        </header>

        <div className="reel-project-grid" data-reveal-stagger>
          {projects.map((project) => (
            <article
              key={project.index}
              id={"project-card-" + project.index}
              className="reel-project-card"
              style={{ "--project-accent": project.accent } as CSSProperties}
              onPointerMove={cardTilt}
              onPointerLeave={resetCardTilt}
            >
              <a
                className="reel-project-media"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={"Visit " + project.name}
              >
                <Image
                  src={project.image}
                  alt={project.name + " website preview"}
                  fill
                  sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 420px"
                  quality={92}
                  unoptimized
                  draggable={false}
                />
                <span aria-hidden="true">↗</span>
              </a>

              <div className="reel-project-copy">
                <div className="reel-project-meta">
                  <span>{project.index} / {project.category}</span>
                  <span>LIVE PROJECT</span>
                </div>
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                <a
                  className="reel-project-link"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore live project <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
