"use client";

import SkillsStage from "./SkillsStage";
import { useState } from "react";
import styles from "./PortfolioSections.module.css";



const disciplines = [
  {
    title: "Web Development",
    short: "Responsive websites, full-stack applications and production-ready interfaces.",
    detail: "I turn designs into responsive React and Next.js interfaces, including forms, navigation and keyboard interactions.",
    accent: "#ff58c8",
  },
  {
    title: "UI/UX Design",
    short: "Clear visual systems, considered layouts and purposeful interaction.",
    detail: "I map the steps users take, prototype the key screens and refine the layout before development.",
    accent: "#c58aff",
  },
  {
    title: "AI Integration",
    short: "Practical AI features, LLM APIs and workflow automation.",
    detail: "I connect chatbot conversations to product data and APIs so an assistant can answer questions and trigger useful actions.",
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
    <div className={styles.workbench}>
      {[
        {name:"Design", items:[1,0]},
        {name:"Engineering", items:[3,2]},
        {name:"Launch & operations", items:[5,4,6]},
      ].map(group=><section key={group.name} className={styles.discipline}>
        <h3>{group.name}</h3>
        {group.items.map(i=><button type="button" key={i} aria-pressed={active===i} onFocus={()=>setActive(i)} onPointerEnter={()=>setActive(i)} onClick={()=>setActive(i)}>
          <SkillsStage active={i} title={disciplines[i].title}/>
          <span><strong>{disciplines[i].title}</strong><span>{disciplines[i].detail}</span></span>
        </button>)}
      </section>)}
    </div>
  </section>;
}
