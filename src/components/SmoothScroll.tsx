"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.15,
    });

    if (document.documentElement.getAttribute("data-intro") === "active") {
      lenis.stop();
    }

    const handleIntroDone = () => {
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
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
        gsap.fromTo(
          Array.from(parent.children),
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: parent, start: "top 88%", once: true },
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

      const statementWords = gsap.utils.toArray<HTMLElement>("[data-statement-word]");
      if (statementWords.length) {
        gsap.fromTo(
          statementWords,
          { opacity: 0.14 },
          {
            opacity: (_index, target) =>
              target instanceof HTMLElement && target.hasAttribute("data-statement-accent")
                ? 0.55
                : 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: "#statement",
              start: "top 78%",
              end: "bottom 55%",
              scrub: 0.7,
            },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-media-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -4 },
          {
            yPercent: 4,
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

      const rail = document.querySelector<HTMLElement>("[data-project-rail]");
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#work",
              start: "top 70%",
              end: "bottom 72%",
              scrub: 0.6,
            },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-project]").forEach((card) => {
        const media = card.querySelector<HTMLElement>("[data-project-media]");
        const image = card.querySelector<HTMLElement>("[data-project-image]");

        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.06 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "top 45%",
                scrub: true,
              },
            }
          );
        }
      });
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -88 });
    };
    document.addEventListener("click", onClick);

    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("portfolio:intro-done", handleIntroDone);
      ctx.revert();
      lenis.off("scroll", onScroll);
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return null;
}
