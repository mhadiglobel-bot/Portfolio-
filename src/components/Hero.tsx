"use client";
import { useEffect, useRef } from "react";
import RollingText from "./RollingText";
import Image from "next/image";

export default function Hero() {
  const scene = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = scene.current!;
    const stage = root.querySelector<HTMLElement>(".signature-stage")!;
    const plate = root.querySelector<HTMLElement>(".emblem-plate")!;
    let frame = 0;
    const draw = () => {
      frame = 0;
      const p = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1,root.offsetHeight-stage.offsetHeight)));
      const cx = stage.clientWidth/2 - plate.offsetLeft - plate.offsetWidth/2;
      const cy = stage.clientHeight/2 - plate.offsetTop - plate.offsetHeight/2;
      const zoom = Math.max(innerWidth,stage.clientHeight)/(plate.offsetWidth*.76);
      plate.style.transform = "translate("+cx*p+"px,"+cy*p+"px) scale("+ (1+zoom*p*p) +") rotateY("+(-16*Math.sin(Math.PI*p))+"deg)";
      plate.style.opacity = String(Math.min(1,(1-p)/.25));
      root.style.setProperty("--type-opacity", String(Math.max(0,1-p*2.8)));
    };
    const queue = () => { if (!frame) frame=requestAnimationFrame(draw); };
    draw(); window.addEventListener("scroll",queue,{passive:true});window.addEventListener("resize",queue);
    return () => { cancelAnimationFrame(frame);window.removeEventListener("scroll",queue);window.removeEventListener("resize",queue); };
  }, []);
  return (
    <section ref={scene} id="top" className="signature">
      <div className="signature-stage container-x">
        <div className="signature-type">
          <p className="folio-label">Independent developer &amp; product engineer</p>
          <h1><RollingText>Muhammad</RollingText><br /><em><RollingText>Hadi.</RollingText></em></h1>
          <p className="signature-bio">I build web products, shape how they move, and help people find them through search.</p>
          <a className="folio-link" href="#work">Explore the work <span aria-hidden="true">↓</span></a>
        </div>
        <div className="emblem-plate" aria-hidden="true">
          <div className="emblem-halo" />
          <Image src="/mh-emblem.webp" alt="" width={1254} height={1254} sizes="(max-width: 700px) 48vw, 32vw" loading="eager" />
        </div>
      </div>
    </section>
  );
}
