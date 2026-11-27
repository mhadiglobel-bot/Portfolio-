"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import RollingText from "./RollingText";
import { projects } from "@/lib/projects";

export default function Work() {
  return (
    <section id="work" className="work-showcase" aria-labelledby="work-heading">
      <div className="container-x work-shell">
        <header className="work-heading-row" data-reveal>
          <h2 id="work-heading" className="work-heading">
            Selected <em><RollingText>projects.</RollingText></em>
          </h2>
        </header>

        <div className="work-grid" data-reveal-stagger>
          {projects.map((project) => (
            <article
              className="work-card"
              key={project.index}
              style={{ "--project-accent": project.accent } as CSSProperties}
              onPointerMove={(event) => {
                if (
                  event.pointerType !== "mouse" ||
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ) return;
                const rect = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                event.currentTarget.style.setProperty("--card-rx", String(-y * 2.4) + "deg");
                event.currentTarget.style.setProperty("--card-ry", String(x * 3.2) + "deg");
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--card-rx", "0deg");
                event.currentTarget.style.setProperty("--card-ry", "0deg");
              }}
            >
              <a
                className="work-card-visual"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={"Visit " + project.name}
              >
                <Image
                  src={project.image}
                  alt={project.name + " website preview"}
                  fill
                  sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 640px"
                  unoptimized
                  priority={project.index === "01"}
                />
                <span className="work-card-open" aria-hidden="true">↗</span>
              </a>

              <div className="work-card-copy">
                <div className="work-card-heading">
                  <span className="work-card-index">
                    {project.index} <i aria-hidden="true">/</i> {project.category}
                  </span>
                  <h3>{project.name}</h3>
                </div>
                <p>{project.description}</p>
                <div className="work-card-bottom">
                  <a
                    className="work-card-link"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View project <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
