"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reel = document.getElementById("work");
    let previousWheel = 0;
    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.05,
      virtualScroll: (input) => {
        if (input.event.type !== "wheel" || !reel?.dataset.pinned) return true;
        const bounds = reel.getBoundingClientRect();
        if (bounds.top <= 32 && bounds.bottom >= innerHeight - 32) {
          const time = performance.now();
          const elapsed = Math.max(8, Math.min(110, time - previousWheel));
          const limit = innerHeight * elapsed / 650;
          input.deltaY = Math.sign(input.deltaY) * Math.min(Math.abs(input.deltaY), limit);
          previousWheel = time;
        }
        return true;
      },
    });

    if (document.documentElement.getAttribute("data-intro") === "active") {
      lenis.stop();
    }

    function roll(group: Element | null) {
      if (!group || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
      const letters = Array.from(group.querySelectorAll<HTMLElement>(".roll-letter"));
      const beat = 110;
      letters.forEach((letter,index) => {
        letter.getAnimations().forEach(a=>a.cancel());
        letter.animate([{transform:"rotate(0deg)"},{transform:"rotate(360deg)"}],{
          duration:beat,delay:index*beat,easing:"ease-in-out"
        });
      });
    }
    const onHeading = (e: PointerEvent | FocusEvent) => {
      const group = e.target instanceof Element ? e.target.closest("h1,h2,h3,.mail-line") : null;
      if (group && !(e.relatedTarget instanceof Node && group.contains(e.relatedTarget))) roll(group);
    };
    document.addEventListener("pointerover",onHeading);
    document.addEventListener("focusin",onHeading);
    const handleIntroDone = () => {
      roll(document.querySelector(".signature h1"));
      lenis.start();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("portfolio:intro-done", handleIntroDone);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 89%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
        gsap.fromTo(
          Array.from(parent.children),
          { y: 22, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.72,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: parent, start: "top 89%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number.parseFloat(el.dataset.parallax ?? "0.12");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-media-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("a") ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("section[id]").forEach((section) => {
        if (section.id === "top" || section.id === "work") return;
        gsap.fromTo(
          section,
          { y: 24, autoAlpha: 0.92 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".tilt-card").forEach((card) => {
        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
          card.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
        };
        const onLeave = () => {
          card.style.setProperty("--rx", "0deg");
          card.style.setProperty("--ry", "0deg");
        };
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
      });
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      const distance = Math.abs(el.getBoundingClientRect().top);
      lenis.scrollTo(id === "#top" ? 0 : el as HTMLElement, {
        offset: id === "#top" ? 0 : -72,
        duration: Math.min(2.1, .75 + distance / Math.max(innerHeight, 1) * .16),
        easing: t => t*t*(3-2*t),
        lerp: 0,
      });
    };
    document.addEventListener("click", onClick);

    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("portfolio:intro-done", handleIntroDone);
      ctx.revert();
      lenis.off("scroll", onScroll);
      document.removeEventListener("pointerover",onHeading);
      document.removeEventListener("focusin",onHeading);
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return null;
}
