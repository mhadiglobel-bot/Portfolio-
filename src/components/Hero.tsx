"use client";

import { useEffect, useRef } from "react";
import RollingText from "./RollingText";
import Image from "next/image";

export default function Hero() {
  const scene = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = scene.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".signature-stage");
    const plate = root.querySelector<HTMLElement>(".emblem-plate");
    const core = root.querySelector<HTMLElement>(".emblem-plate-core");
    if (!stage || !plate || !core) return;

    let frame = 0;
    const draw = () => {
      frame = 0;
      const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, root.offsetHeight - stage.offsetHeight)));
      root.toggleAttribute("data-scrolling",progress>.008);
      const centerX = stage.clientWidth / 2 - plate.offsetLeft - plate.offsetWidth / 2;
      const centerY = stage.clientHeight / 2 - plate.offsetTop - plate.offsetHeight / 2;
      const zoom = Math.max(innerWidth, stage.clientHeight) / (plate.offsetWidth * 0.76);
      const scrollTilt = -16 * Math.sin(Math.PI * progress);
      plate.style.transform = "translate(" + centerX * progress + "px," + centerY * progress + "px) scale(" + (1 + zoom * progress * progress) + ") rotateY(" + scrollTilt + "deg)";
      plate.style.opacity = String(Math.min(1, (1 - progress) / 0.25));
      root.style.setProperty("--type-opacity", String(Math.min(1,(1-progress)/.48)));
      root.style.setProperty("--bio-light",String(.70+.30*Math.min(1,progress*4)));
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)");
    const onPointerMove = (event: PointerEvent) => {
      const rect = plate.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      core.style.transform = "perspective(1100px) rotateX(" + (-y * 12) + "deg) rotateY(" + (x * 16) + "deg) translateZ(24px)";
    };
    const onPointerLeave = () => {
      core.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    };

    if (finePointer.matches) {
      plate.addEventListener("pointermove", onPointerMove, { passive: true });
      plate.addEventListener("pointerleave", onPointerLeave);
    }

    draw();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      plate.removeEventListener("pointermove", onPointerMove);
      plate.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section ref={scene} id="top" className="signature">
      <div className="signature-stage container-x">
        <div className="signature-type">
          <p className="folio-label">Hello, I’m</p>
          <h1>
            <RollingText animateOnLoad staggerMs={48}>Muhammad</RollingText>
            <br />
            <em><RollingText animateOnLoad delayOffset={8} staggerMs={48}>Hadi.</RollingText></em>
          </h1>
          <p className="signature-bio">I’m an independent developer and product engineer. I write the interface, tune the motion and take the build from a GitHub commit to production.</p>
          <a className="folio-link" href="#work">Explore the work <span aria-hidden="true">↓</span></a>
        </div>
        <div className="emblem-plate" aria-hidden="true">
          <div className="emblem-plate-core">
            <div className="emblem-halo" />
            <div className="build-dialog"><span>studio.ts</span><code>const mark = "MH";</code><code>render(mark);</code></div>
            <Image unoptimized src="/mh-emblem-vector.svg" alt="" width={1254} height={1254} loading="eager" />
          </div>
        </div>
      </div>
    </section>
  );
}
