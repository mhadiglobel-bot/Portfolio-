import type {Project} from "@/lib/projects";
import OrbitEarth from "./OrbitEarth";
import s from "./Orbit.module.css";

export default function OrbitalStage({position,projects}:{position:number;projects:Project[]}){
  return <div className={s.stage}>
    <div className={s.earth}><OrbitEarth position={position}/></div>
    {[0,1,2].map(i=><div key={i} className={s.ring} aria-hidden="true"/>)}
    {projects.map((project,i)=>{
      const count=projects.length;
      const relative=((i-position+count*1.5)%count)-count/2;
      if(Math.abs(relative)>2.55)return null;
      const angle=relative*2*Math.PI/Math.min(count,5);
      const x=Math.sin(angle),z=Math.cos(angle);
      const depth=(z+1)/2;
      return <a className={s.panel} key={project.href} href={project.href} target="_blank" rel="noreferrer"
        aria-label={"Visit "+project.name} tabIndex={Math.round(position)===i?0:-1}
        style={{left:(50+42*x)+"%",top:(48+26*z-3*x)+"%",zIndex:z<0?1:6+Math.round(depth*4),
          transform:`translate(-50%,-50%) perspective(650px) rotateY(${-38*x}deg) rotateZ(${4*x-2}deg) scale(${.54+.46*depth**3})`}}>
        <img src={project.image} alt={project.name+" homepage"}/>
      </a>;
    })}
  </div>;
}
