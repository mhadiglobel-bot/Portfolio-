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
      const section = root.current;
      const stage = section?.querySelector<HTMLElement>(".signature-stage");
      const seal = section?.querySelector<HTMLElement>(".signature-seal");
      const art = section?.querySelector<HTMLElement>(".signature-art");
      const sealImage = seal?.querySelector<HTMLImageElement>("img");
      const type = section?.querySelector<HTMLElement>(".signature-type");
      const orbits = section?.querySelector<HTMLElement>(".signature-orbits");

      if (!section || !stage || !seal || !art || !sealImage || !type || !orbits) return;

      const coverScale = () => {
        const rect = seal.getBoundingClientRect();
        if (!rect.width || !rect.height) return 3;
        return Math.max(window.innerWidth / seal.offsetWidth, window.innerHeight / seal.offsetHeight) * 1.16;
      };

      const centerX = () => {
        const rect = art.getBoundingClientRect();
        return window.innerWidth / 2 - (rect.left + rect.width / 2);
      };

      const centerY = () => {
        const rect = art.getBoundingClientRect();
        return window.innerHeight / 2 - (rect.top + rect.height / 2);
      };

      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 1.12),
          pin: stage,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      transition
        .to(type, {
          yPercent: -22,
          autoAlpha: 0,
          filter: "blur(14px)",
          ease: "none",
          duration: 0.38,
        }, 0)
        .to(orbits, {
          rotation: 48,
          scale: 1.45,
          autoAlpha: 0,
          ease: "none",
          duration: 0.68,
        }, 0)
        .to(seal, {
          x: centerX,
          y: centerY,
          scale: coverScale,
          rotateY: 0,
          rotateZ: 0,
          borderRadius: "0%",
          filter: "blur(0px)",
          boxShadow: "0 0 120px rgba(255, 61, 154, 0.34)",
          ease: "none",
          duration: 0.82,
        }, 0)
        .to(sealImage, {
          borderRadius: "0%",
          ease: "none",
          duration: 0.82,
        }, 0)
        .to(seal, {
          scale: () => coverScale() * 1.07,
          filter: "blur(30px)",
          autoAlpha: 0,
          ease: "none",
          duration: 0.18,
        }, 0.82);

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("portfolio:intro-done", refresh);
      return () => window.removeEventListener("portfolio:intro-done", refresh);
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
