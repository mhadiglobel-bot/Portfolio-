"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
        el.style.opacity = "1";
        raf = 0;
      });
    };

    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] opacity-0 transition-[opacity,transform] duration-300 ease-out will-change-transform"
      style={{
        background:
          "radial-gradient(circle, rgba(168,85,247,0.105) 0%, rgba(255,61,154,0.065) 34%, transparent 68%)",
      }}
    />
  );
}
