"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { createSculpture } from "@/lib/sculpture";

export default function HeroScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.closest<HTMLElement>("#top");
    if (!canvas || !hero) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      let sculpture: ReturnType<typeof createSculpture> | undefined;
      let disposed = false;
      let visible = false;
      let loading = false;
      let contextLost = false;
      let frame = 0;
      let progress = 0;
      let x = 0;
      let y = 0;
      const pointer = { x: 0, y: 0 };

      const paint = () => {
        frame = 0;
        if (!visible || !sculpture || contextLost || document.hidden) return;
        x += (pointer.x - x) * .18;
        y += (pointer.y - y) * .18;
        sculpture.draw(progress, x, y);
        canvas.dataset.ready = "true";
        if (Math.abs(pointer.x - x) + Math.abs(pointer.y - y) > .003) schedule();
      };
      const schedule = () => {
        if (visible && !frame && sculpture && !document.hidden) frame = requestAnimationFrame(paint);
      };
      const resize = () => {
        const size = Math.min(1120, Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 1.5)));
        if (size > 0) sculpture?.resize(size);
        schedule();
      };
      const load = async () => {
        if (loading) return;
        loading = true;
        try {
          const { createSculpture } = await import("@/lib/sculpture");
          if (disposed) return;
          sculpture = createSculpture(canvas);
          resize();
        } catch {
          // The prerendered first frame remains visible when WebGL is unavailable.
        }
      };
      const onPointer = (event: PointerEvent) => {
        if (!visible || event.pointerType !== "mouse") return;
        pointer.x = event.clientX / window.innerWidth * 2 - 1;
        pointer.y = event.clientY / window.innerHeight * 2 - 1;
        schedule();
      };
      const resetPointer = () => { pointer.x = 0; pointer.y = 0; schedule(); };
      const lost = () => { contextLost = true; delete canvas.dataset.ready; };
      const restore = () => { contextLost = false; resize(); };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) { void load(); schedule(); }
      });
      observer.observe(canvas);
      const sizing = new ResizeObserver(resize);
      sizing.observe(canvas);
      canvas.addEventListener("webglcontextlost", lost);
      canvas.addEventListener("webglcontextrestored", restore);
      hero.addEventListener("pointermove", onPointer);
      hero.addEventListener("pointerleave", resetPointer);
      document.addEventListener("visibilitychange", schedule);
      ScrollTrigger.create({
        trigger: hero, start: "top top", end: "bottom top",
        onUpdate: (trigger) => { progress = trigger.progress; schedule(); },
      });
      return () => {
        disposed = true;
        observer.disconnect();
        sizing.disconnect();
        hero.removeEventListener("pointermove", onPointer);
        hero.removeEventListener("pointerleave", resetPointer);
        document.removeEventListener("visibilitychange", schedule);
        canvas.removeEventListener("webglcontextlost", lost);
        canvas.removeEventListener("webglcontextrestored", restore);
        cancelAnimationFrame(frame);
        sculpture?.dispose();
        delete canvas.dataset.ready;
      };
    });
    return () => media.revert();
  }, []);

  return (
    <div className="sculpture-stage" aria-hidden="true">
      <div className="sculpture-halo" />
      <div className="sculpture-orbit" />
      <div className="sculpture-object">
        <canvas ref={ref} />
      </div>
    </div>
  );
}
