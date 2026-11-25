"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const flowPaths = [
  "M 24 468 C 128 318 206 220 330 246 C 450 270 476 452 610 446 C 700 442 746 356 796 276",
  "M 18 526 C 132 386 226 292 342 314 C 456 336 488 510 616 506 C 704 502 756 420 810 344",
  "M 12 582 C 140 458 238 364 356 382 C 468 398 508 568 628 566 C 714 564 770 488 818 414",
  "M 42 398 C 150 250 240 168 350 188 C 458 208 470 382 594 380 C 682 378 730 300 782 222",
  "M 76 338 C 180 204 264 132 360 150 C 462 168 460 314 574 312 C 656 310 704 242 752 176",
  "M 34 644 C 166 526 260 444 374 458 C 492 472 532 628 644 628 C 728 628 778 560 824 494",
];

export default function HeroScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const plane = planeRef.current;
    if (!scene || !plane || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(plane, {
        rotateX: -y * 5,
        rotateY: x * 7,
        duration: 0.75,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onPointerLeave = () => {
      gsap.to(plane, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    scene.addEventListener("pointermove", onPointerMove, { passive: true });
    scene.addEventListener("pointerleave", onPointerLeave);

    const ctx = gsap.context(() => {
      gsap.to(scene, {
        yPercent: -15,
        scale: 0.92,
        opacity: 0.38,
        ease: "none",
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<SVGPathElement>("[data-flow-path]").forEach((path, index) => {
        gsap.fromTo(
          path,
          { strokeDashoffset: 1, opacity: 0.12 },
          {
            strokeDashoffset: 0,
            opacity: 0.62,
            ease: "none",
            scrollTrigger: {
              trigger: "#top",
              start: "top 72%",
              end: "bottom top",
              scrub: 0.9 + index * 0.04,
            },
          }
        );
      });
    }, scene);

    return () => {
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={sceneRef} className="hero-scene" aria-hidden="true">
      <div ref={planeRef} className="hero-scene__plane">
        <div className="hero-scene__aura" />
        <div className="hero-scene__grid" />
        <svg className="hero-scene__svg" viewBox="0 0 840 840" fill="none" role="presentation">
          <defs>
            <linearGradient id="hero-flow-gradient" x1="80" y1="180" x2="760" y2="680" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ff3d9a" stopOpacity="0.08" />
              <stop offset="0.42" stopColor="#ff5fb7" stopOpacity="0.9" />
              <stop offset="0.72" stopColor="#a855f7" stopOpacity="0.95" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0.08" />
            </linearGradient>
            <radialGradient id="hero-field-point">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.25" stopColor="#ff8bd0" />
              <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {flowPaths.map((path, index) => (
            <path
              key={index}
              d={path}
              pathLength={1}
              data-flow-path
              stroke="url(#hero-flow-gradient)"
              strokeWidth={index === 2 ? 1.7 : 1.15}
              strokeDasharray={1}
              strokeDashoffset={1}
              strokeLinecap="round"
            />
          ))}

          <path
            d="M 92 704 C 240 590 312 544 424 566 C 544 590 592 716 710 690"
            pathLength={1}
            data-flow-path
            stroke="url(#hero-flow-gradient)"
            strokeWidth="1"
            strokeDasharray="1"
            strokeDashoffset="1"
            strokeLinecap="round"
          />
          <ellipse
            cx="430"
            cy="418"
            rx="292"
            ry="174"
            transform="rotate(-24 430 418)"
            stroke="url(#hero-flow-gradient)"
            strokeWidth="0.8"
            strokeOpacity="0.36"
          />
          <ellipse
            cx="430"
            cy="418"
            rx="340"
            ry="224"
            transform="rotate(18 430 418)"
            stroke="url(#hero-flow-gradient)"
            strokeWidth="0.7"
            strokeOpacity="0.2"
          />
          <circle cx="610" cy="446" r="5" fill="url(#hero-field-point)" />
          <circle cx="342" cy="314" r="4" fill="url(#hero-field-point)" />
          <circle cx="644" cy="628" r="4" fill="url(#hero-field-point)" />
        </svg>

        <span className="hero-scene__node hero-scene__node--one" />
        <span className="hero-scene__node hero-scene__node--two" />
        <span className="hero-scene__node hero-scene__node--three" />

        <span className="hero-scene__label hero-scene__label--top">
          <i /> FIELD / 01 <b>LIVE</b>
        </span>
        <span className="hero-scene__label hero-scene__label--bottom">
          POINTER INPUT <b>→</b> DEPTH RESPONSE
        </span>
      </div>
    </div>
  );
}
