"use client";

import {useState, type CSSProperties} from "react";
import styles from "./PortfolioSections.module.css";

const disciplines = [
  ["Web development", "I build responsive websites with layouts that work across small screens, wide monitors and keyboard navigation."],
  ["UI & UX design", "I map user journeys, shape the visual hierarchy and prototype interactions before moving into code."],
  ["Backend programming", "I write the APIs, authentication checks and application logic behind forms, dashboards and product workflows."],
  ["Database management", "I structure records, write queries and plan schema changes as a product grows."],
  ["AI integration & chatbots", "I connect models to websites and tune chatbot prompts and conversation flows around real customer questions."],
  ["AI-assisted development", "I prototype with coding assistants, review their output and test edge cases before release."],
  ["Version control & deployment", "I manage Git branches, review changes on GitHub and use preview builds to check releases before publishing."],
  ["Hosting & maintenance", "I configure domains and hosting, investigate errors through logs and keep live sites running after launch."],
  ["Technical SEO", "I improve crawlability, indexing, metadata and page performance, then monitor how pages appear in search."],
];

const symbols = ["</>", "Aa", "{ }", "SQL", "AI", ">_", "git", "DNS", "SEO"];
const colors = ["#f499cb","#c6a2ff","#b9b0ff","#ff97ca","#d392ff","#f59fcc","#b0a7ff","#dc97ef","#fdb2c9"];

export default function Capabilities() {
  const [active, select] = useState(0);
  const [title, description] = disciplines[active];
  return <section id="expertise" className={`container-x ${styles.skills}`}>
    <header className={styles.header}><h2>Technical <em>expertise.</em></h2></header>
    <div className={styles.lab}>
      <div className={styles.instrument} style={{"--light":colors[active]} as CSSProperties}>
        <div className={styles.object} aria-hidden="true" key={active}>
          {[0,1,2,3].map(i=><i key={i} style={{"--layer":i,"--angle":(active*15)+"deg"} as CSSProperties}/>)}
          <b>{symbols[active]}</b>
        </div>
        <div className={styles.readout} aria-live="polite"><h3>{title}</h3><p>{description}</p></div>
      </div>
      <div className={styles.keys} aria-label="Explore expertise">{disciplines.map(([name],i)=>
        <button key={name} aria-pressed={i===active} onPointerEnter={e=>{if(e.pointerType==="mouse")select(i)}} onFocus={()=>select(i)} onClick={()=>select(i)}>
          <small>{String(i+1).padStart(2,"0")}</small>{name}<span aria-hidden="true">↗</span>
        </button>)}</div>
    </div>
  </section>;
}
