"use client";

import Image from "next/image";
import {useEffect, useRef, useState, type CSSProperties} from "react";
import {projects} from "@/lib/projects";
import s from "./PortfolioSections.module.css";

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const [position, setPosition] = useState(0);
  const [reduced, setReduced] = useState(false);
  const last = projects.length - 1;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce), (max-height: 540px)");
    let frame = 0, previous = 0, displayed = 0;
    function draw(time: number) {
      frame = 0;
      if (!root.current || media.matches) return;
      const rect = root.current.getBoundingClientRect();
      const travel = Math.max(1, rect.height - root.current.firstElementChild!.clientHeight);
      const target = Math.min(last, Math.max(0, -rect.top / travel * last));
      const delta = target - displayed;
      displayed = Math.abs(delta) < .002 ? target : displayed + delta * (1 - Math.exp(-Math.min(64,time-previous)/115));
      previous = time;
      setPosition(displayed);
      if (displayed !== target) frame = requestAnimationFrame(draw);
    }
    function queue() { if (!frame) frame = requestAnimationFrame(draw); }
    function configure() { setReduced(media.matches); queue(); }
    configure();
    media.addEventListener("change",configure);
    window.addEventListener("scroll",queue,{passive:true});
    window.addEventListener("resize",queue);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change",configure); window.removeEventListener("scroll",queue); window.removeEventListener("resize",queue); };
  },[last]);

  function choose(i:number) {
    if (!root.current || reduced || last <= 0) {setPosition(i);return;}
    const rect = root.current.getBoundingClientRect();
    window.scrollTo({top:scrollY + rect.top + i / last * (rect.height-root.current.firstElementChild!.clientHeight),behavior:"smooth"});
  }
  const active = Math.round(position);
  const project = projects[active];
  if (!project) return null;
  return <section id="work" ref={root} className={s.runway} style={{"--travel":Math.min(700,last*65)+"svh"} as CSSProperties}>
    <div className={s.pin}><div className={`container-x ${s.show}`}>
      <header className={s.header}><h2>Selected <em>projects.</em></h2><span>{project.index} / {String(projects.length).padStart(2,"0")}</span></header>
      <div className={s.theatre}>
        <div className={s.track} aria-hidden="true"/>
        {projects.slice(Math.max(0,active-2),active+3).map(item=>{
          const i=projects.indexOf(item), d=i-position, distance=Math.abs(d);
          const style={transform:`translate(-50%,-50%) translateX(${d*79}%) translateZ(${-190*distance}px) rotateY(${-d*27}deg)`,opacity:Math.max(0,1-distance*.42),zIndex:10-Math.round(distance*2)} as CSSProperties;
          return <button key={item.href} className={s.screen} style={style} onClick={()=>choose(i)} aria-label={"Show "+item.name} aria-pressed={i===active}>
            <Image fill sizes="(max-width:700px) 70vw, 42vw" src={item.image} alt={item.name+" homepage"}/>
          </button>;
        })}
      </div>
      <div className={s.caption} key={project.href}><div><span>{project.category}</span><h3>{project.name}</h3></div><div><p>{project.description}</p><a className="folio-link" href={project.href} target="_blank" rel="noreferrer">View project ↗</a></div></div>
      <nav className={s.index} aria-label="Project chapters">{projects.map((item,i)=><button key={item.href} aria-current={i===active?"step":undefined} onClick={()=>choose(i)}>{item.index} · {item.name}</button>)}</nav>
    </div></div>
  </section>;
}
