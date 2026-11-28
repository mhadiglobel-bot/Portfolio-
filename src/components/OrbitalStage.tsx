import type { Project } from "@/lib/projects";
import styles from "./PortfolioSections.module.css";

export default function OrbitalStage({ position, projects }: { position: number; projects: Project[]; reduced?: boolean }) {
  return <div className={styles.exhibit}>
    {projects.map((project,index)=>{
      const offset=index-position;
      if(Math.abs(offset)>1.8) return null;
      const distance=Math.abs(offset);
      return <a key={project.href} className={styles.print} href={project.href} target="_blank" rel="noreferrer" aria-label={"Visit "+project.name}
        tabIndex={Math.round(position)===index?0:-1}
        style={{zIndex:10-Math.round(distance*3),opacity:Math.max(0,1-distance*.56),transform:`translate(-50%,-50%) translateX(${offset*92}%) translateZ(${-distance*200}px) rotateY(${-offset*42}deg)`}}>
        <img src={project.image} alt={project.name+" website"}/>
      </a>;
    })}
  </div>;
}
