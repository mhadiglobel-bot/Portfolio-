"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";
import styles from "./PortfolioSections.module.css";

const SkillsStage = dynamic(() => import("./SkillsStage"), {
  ssr: false,
  loading: () => <div className={styles.skillsPlaceholder} aria-hidden="true" />,
});

const disciplines = [
  {
    title: "Web Development",
    short: "Responsive websites, full-stack applications and production-ready interfaces.",
    detail: "Building responsive web products from the interface through to the application logic, with modern React and Next.js workflows.",
    accent: "#ff58c8",
  },
  {
    title: "UI/UX Design",
    short: "Clear visual systems, considered layouts and purposeful interaction.",
    detail: "Shaping user journeys, interface hierarchy, interaction patterns and motion so complex products feel simple to use.",
    accent: "#c58aff",
  },
  {
    title: "AI Integration",
    short: "Practical AI features, LLM APIs and workflow automation.",
    detail: "Connecting ChatGPT and other AI services to real products, including assistants, structured outputs and automated workflows.",
    accent: "#f05acb",
  },
  {
    title: "Backend & Databases",
    short: "APIs, authentication, data models and reliable application logic.",
    detail: "Designing database structures, managing records, integrating APIs and building the backend systems that keep products connected.",
    accent: "#ad7bff",
  },
  {
    title: "Technical SEO & Performance",
    short: "Discoverability, indexing, Core Web Vitals and speed.",
    detail: "Improving crawlability, metadata, structured data, loading performance and technical foundations for search visibility.",
    accent: "#ff80cf",
  },
];

export default function Capabilities() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section id="expertise" className={`container-x ${styles.skills}`}>
      <header className={styles.skillsHeader}>
        <div>
          <span className={styles.eyebrow}>04 / CORE CAPABILITIES</span>
          <h2>Skills &amp; <em>expertise.</em></h2>
        </div>
        <p>The practical disciplines I bring together to plan, design and build digital products.</p>
      </header>

      <div className={styles.skillVisual}>
        <SkillsStage active={active} reduced={reduced} />
        <div className={styles.skillLabels} aria-label="Explore skills">
          {disciplines.map((skill, index) => (
            <button key={skill.title} type="button" className={styles.skillLabel}
              style={{ "--skill-accent": skill.accent } as CSSProperties}
              aria-pressed={active === index}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }}
              onFocus={() => setActive(index)} onClick={() => setActive(index)}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <strong>{skill.title}</strong>
              <span>{skill.short}</span>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}
