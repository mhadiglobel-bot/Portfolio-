"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { projects } from "@/lib/projects";
import styles from "./PortfolioSections.module.css";

export default function Work() {
  const [current, select] = useState(0);
  const project = projects[current];
  if (!project) return null;

  return <section id="work" className={`container-x ${styles.section}`} aria-labelledby="work-heading">
    <header className={styles.heading}>
      <h2 id="work-heading">Selected <em>projects.</em></h2>
      <label className={styles.picker}>Project index
        <select value={current} onChange={event => select(Number(event.target.value))}>
          {projects.map((item, i) => <option key={item.href} value={i}>{item.index} · {item.name}</option>)}
        </select>
      </label>
    </header>
    <div className={styles.spread} style={{"--ink":project.accent} as CSSProperties}>
      <figure className={styles.stage}>
        <div key={project.href} className={styles.frame}>
          <Image src={project.image} alt={project.name + " homepage"} fill sizes="(max-width: 760px) 92vw, 55vw" />
        </div>
      </figure>
      <div className={styles.detail}>
        <article key={project.href} aria-live="polite">
          <p className={styles.meta}>{project.category}</p>
          <h3>{project.name}</h3><p>{project.description}</p>
          <ul aria-label="Project tags">{project.tags.map((tag,i) => <li key={tag} style={{animationDelay:i*65+"ms"}}>{tag}</li>)}</ul>
          <a className="folio-link" href={project.href} target="_blank" rel="noopener noreferrer">Visit {project.name} ↗</a>
        </article>
        <nav aria-label="Browse projects" className={styles.controls}>
          <button aria-label="Previous project" onClick={() => select((current+projects.length-1)%projects.length)}>←</button>
          <span>{project.index} / {String(projects.length).padStart(2,"0")}</span>
          <button aria-label="Next project" onClick={() => select((current+1)%projects.length)}>→</button>
        </nav>
      </div>
    </div>
  </section>;
}
