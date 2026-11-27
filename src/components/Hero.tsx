"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RollingText from "./RollingText";

const emblemSource =
  "https://res.cloudinary.com/dyhprfqyb/image/upload/c_crop,g_center,h_1180,r_max,w_1180/f_png/v1795744708/portfolio/mh-emblem-source.png";

export default function Hero() {
  const scene = useRef<HTMLElement>(null);
  const [revealStarted, setRevealStarted] = useState(false);

  useEffect(() => {
    const root = scene.current;
    if (!root) return;

    const stage = root.querySelector<HTMLElement>(".signature-stage");
    const plate = root.querySelector<HTMLElement>(".emblem-plate");
    const core = root.querySelector<HTMLElement>(".emblem-plate-core");
    if (!stage || !plate || !core) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)");
    let frame = 0;

    const draw = () => {
      frame = 0;

      if (reducedMotion.matches) {
        const targetSize = Math.max(window.innerWidth, stage.clientHeight);
        const startScale = Math.min(1, plate.offsetWidth / Math.max(1, targetSize));
        core.style.setProperty("--emblem-scale", String(startScale));
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
      const startScale = Math.min(1, plate.offsetWidth / Math.max(1, targetSize));
      const scale = startScale + (1 - startScale) * Math.pow(progress, 0.82);
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
      plate.style.opacity = String(Math.min(1, (1 - progress) / 0.025));
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

  useEffect(() => {
    const startReveal = () => setRevealStarted(true);
    if (document.documentElement.dataset.intro === "done") {
      startReveal();
      return;
    }
    window.addEventListener("portfolio:intro-done", startReveal, { once: true });
    return () => window.removeEventListener("portfolio:intro-done", startReveal);
  }, []);

  return (
    <section
      ref={scene}
      id="top"
      className={"signature" + (revealStarted ? " is-revealing" : "")}
    >
      <div className="signature-stage container-x">
        <div className="signature-type">
          <p className="folio-label">Independent developer &amp; product engineer</p>
          <h1>
            <RollingText animateOnLoad staggerMs={48}>Muhammad</RollingText>
            <br />
            <em>
              <RollingText animateOnLoad delayOffset={8} staggerMs={48}>
                Hadi.
              </RollingText>
            </em>
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
              src={emblemSource}
              alt=""
              width={1180}
              height={1180}
              sizes="100vw"
              priority
              unoptimized
              draggable={false}
            />
          </div>
          <div className="emblem-terminal">
            <div className="emblem-terminal-bar">
              <span />
              <span />
              <span />
              <b>identity.tsx</b>
            </div>
            <div className="emblem-terminal-code">
              <p className="terminal-line terminal-line-one">
                <i>const</i> name = <b>&quot;Muhammad Hadi&quot;</b>;
              </p>
              <p className="terminal-line terminal-line-two">
                <i>render</i>(&lt;MH /&gt;);
              </p>
              <p className="terminal-line terminal-line-three">
                <i>deploy</i>(&quot;production&quot;);
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
