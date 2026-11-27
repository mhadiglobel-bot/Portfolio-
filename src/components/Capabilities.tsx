"use client";

import SkillsStage from "./SkillsStage";
import { useState } from "react";
import styles from "./PortfolioSections.module.css";



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
    title: "Backend & SQL",
    short: "APIs, authentication, data models and reliable application logic.",
    detail: "I design SQL schemas, write queries and build authenticated APIs for web applications.",
    accent: "#ad7bff",
  },
  {
    title: "Technical SEO & Performance",
    short: "Discoverability, indexing, Core Web Vitals and speed.",
    detail: "Improving crawlability, metadata, structured data, loading performance and technical foundations for search visibility.",
    accent: "#ff80cf",
  },
  {title:"GitHub & Deployment",short:"Version control and releases.",detail:"I manage branches, review changes and deploy tested builds from GitHub.",accent:"#dc87fb"},
  {title:"Hosting & Maintenance",short:"Domains, reliability and debugging.",detail:"I configure hosting and DNS, investigate application errors and maintain sites after launch.",accent:"#ff82c8"},
];

export default function Capabilities() {
  const [active, setActive] = useState(0);
  return <section id="expertise" className={`container-x ${styles.atlas}`}>
    <header className={styles.skillsHeader}><h2>Skills &amp; <em>expertise.</em></h2></header>
    <div className={styles.stations}>
      <div className={styles.hub} aria-hidden="true"><b>〈/〉</b></div>
      {disciplines.map((skill,i)=><button type="button" key={skill.title} className={styles.station} aria-pressed={active===i}
        onPointerEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)}>
        <SkillsStage active={i} title={skill.title}/>
        <span><strong>{skill.title}</strong><span>{skill.detail}</span></span>
      </button>)}
    </div>
  </section>;
}
