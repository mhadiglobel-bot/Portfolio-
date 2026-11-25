"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const camera = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      camera.to(".signature-seal", { rotateY: -32, rotateZ: 16, scale: 1.32, yPercent: 14 }, 0)
        .to(".signature-type", { yPercent: -20 }, 0)
        .to(".signature-orbits", { rotation: -38, scale: 1.3 }, 0);
    }, root);
    return () => media.revert();
  }, []);

  return (
    <section ref={root} id="top" className="signature">
      <div className="signature-stage container-x">
        <div className="signature-type">
          <p className="folio-label">Independent developer &amp; product engineer</p>
          <h1>Muhammad<br /><em>Hadi.</em></h1>
          <p className="signature-bio">I build web products, shape how they move, and help people find them through search.</p>
          <a className="folio-link" href="#work">Explore the work <span aria-hidden="true">↓</span></a>
        </div>
        <div className="signature-art" aria-hidden="true">
          <div className="signature-orbits"><i /><i /><i /></div>
          <div className="signature-seal">
            <Image src="/mh-emblem.webp" alt="" width={1254} height={1254} sizes="(max-width: 700px) 60vw, 37vw" fetchPriority="high" loading="eager" />
          </div>
        </div>
      </div>
    </section>
  );
}
