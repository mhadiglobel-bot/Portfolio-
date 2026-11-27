"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import RollingText from "./RollingText";

export default function Hero() {
  const scene = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = scene.current;
    if (!root) return;

    const stage = root.querySelector<HTMLElement>(".signature-stage");
    const plate = root.querySelector<HTMLElement>(".emblem-plate");
    const core = root.querySelector<HTMLElement>(".emblem-plate-core");
    if (!stage || !plate || !core) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const draw = () => {
      frame = 0;

      if (reducedMotion.matches) {
        core.style.setProperty("--emblem-scale", "1");
        core.style.transform = "";
        plate.style.transform = "";
        plate.style.opacity = "1";
        root.style.setProperty("--type-opacity", "1");
        root.style.setProperty("--bio-light", "1");
        root.removeAttribute("data-scrolling");
        return;
      }

      const progress = Math.max(
        0,
        Math.min(
          1,
          -root.getBoundingClientRect().top /
            Math.max(1, root.offsetHeight - stage.offsetHeight)
        )
      );

      root.toggleAttribute("data-scrolling", progress > 0.008);

      const centerX =
        stage.clientWidth / 2 - plate.offsetLeft - plate.offsetWidth / 2;
      const centerY =
        stage.clientHeight / 2 - plate.offsetTop - plate.offsetHeight / 2;
      const targetSize = Math.max(window.innerWidth, stage.clientHeight);
      const finalScale = targetSize / Math.max(1, plate.offsetWidth);
      const scale =
        1 + (finalScale - 1) * Math.pow(progress, 0.82);
      const scrollTilt = -12 * Math.sin(Math.PI * progress);

      core.style.setProperty("--emblem-scale", String(scale));
      plate.style.transform =
        "translate(" +
        centerX * progress +
        "px," +
        centerY * progress +
        "px) rotateY(" +
        scrollTilt +
        "deg)";
      plate.style.opacity = String(Math.min(1, (1 - progress) / 0.08));
      root.style.setProperty(
        "--type-opacity",
        String(Math.min(1, (1 - progress) / 0.48))
      );
      root.style.setProperty(
        "--bio-light",
        String(0.7 + 0.3 * Math.min(1, progress * 4))
      );
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)");
    const onPointerMove = (event: PointerEvent) => {
      if (root.hasAttribute("data-scrolling")) return;
      const rect = plate.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const y = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      core.style.transform =
        "perspective(1100px) rotateX(" +
        -y * 8 +
        "deg) rotateY(" +
        x * 10 +
        "deg) translateZ(14px)";
    };

    const onPointerLeave = () => {
      core.style.transform =
        "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    };

    if (finePointer.matches && !reducedMotion.matches) {
      plate.addEventListener("pointermove", onPointerMove, { passive: true });
      plate.addEventListener("pointerleave", onPointerLeave);
    }

    draw();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    reducedMotion.addEventListener("change", queue);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      reducedMotion.removeEventListener("change", queue);
      plate.removeEventListener("pointermove", onPointerMove);
      plate.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section ref={scene} id="top" className="signature">
      <div className="signature-stage container-x">
        <div className="signature-type">
          <p className="folio-label">Independent developer &amp; product engineer</p>
          <h1>
            <RollingText animateOnLoad staggerMs={48}>Muhammad</RollingText>
            <br />
            <em><RollingText animateOnLoad delayOffset={8} staggerMs={48}>Hadi.</RollingText></em>
          </h1>
          <p className="signature-bio">
            I build websites and digital products, from the interface and database
            to deployment and SEO.
          </p>
          <a className="folio-link" href="#work">
            Explore the work <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="emblem-plate" aria-hidden="true">
          <div className="emblem-halo" />
          <div className="emblem-plate-core">
            <Image
              src="/mh-emblem.webp"
              alt=""
              width={1254}
              height={1254}
              sizes="(max-width: 700px) 48vw, 61svh"
              priority
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
