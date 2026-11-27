import type {Project} from "@/lib/projects";
import s from "./PortfolioSections.module.css";

export default function OrbitalStage({position,projects}:{position:number; projects:Project[]; reduced?:boolean}) {
  return <div className={s.universe} aria-label="Project globe">
    <div className={s.planet}/><i className={s.trail}/><i className={s.trail}/>
    {projects.map((p,i)=>{
      const count=projects.length;
      const d=((i-position+count*1.5)%count)-count/2;
      if(Math.abs(d)>2.6)return null;
      const a=d*2*Math.PI/Math.min(count,5);
      const depth=(1+Math.cos(a))/2;
      return <a key={p.href} href={p.href} target="_blank" rel="noreferrer" aria-label={"Visit "+p.name} className={s.window}
        style={{left:(50+36*Math.sin(a))+"%",top:(34+28*depth+14*Math.sin(2*a))+"%",zIndex:2+Math.round(depth*8),transform:`translate(-50%,-50%) perspective(700px) rotateY(${-24*Math.sin(a)}deg) scale(${.48+.52*depth})`}}>
        <img src={p.image} alt={p.name+" homepage"}/>
      </a>;
    })}
  </div>;
}
