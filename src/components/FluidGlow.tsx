"use client";

import { useEffect, useRef } from "react";

export default function FluidGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let timer = 0;
    let visible = true;
    let tick = 0;

    const mouse = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };

    const blobs = [
      { x: 0.26, y: 0.36, radius: 0.44, color: "255,61,154", phase: 0, speed: 0.38 },
      { x: 0.73, y: 0.62, radius: 0.48, color: "168,85,247", phase: 2.1, speed: -0.3 },
      { x: 0.5, y: 0.48, radius: 0.34, color: "124,58,237", phase: 4.3, speed: 0.24 },
    ];

    const draw = () => {
      tick += coarse ? 0.018 : 0.026;
      smooth.x += (mouse.x - smooth.x) * 0.075;
      smooth.y += (mouse.y - smooth.y) * 0.075;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";

      blobs.forEach((blob) => {
        const driftX = Math.sin(tick * blob.speed + blob.phase) * 0.055;
        const driftY = Math.cos(tick * blob.speed * 1.25 + blob.phase) * 0.05;
        const cursorX = coarse ? 0 : (smooth.x - 0.5) * 0.13;
        const cursorY = coarse ? 0 : (smooth.y - 0.5) * 0.13;
        const x = (blob.x + driftX + cursorX) * width;
        const y = (blob.y + driftY + cursorY) * height;
        const radius = blob.radius * Math.min(width, height);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${blob.color}, 0.2)`);
        gradient.addColorStop(0.42, `rgba(${blob.color}, 0.075)`);
        gradient.addColorStop(1, `rgba(${blob.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!coarse) {
        const x = smooth.x * width;
        const y = smooth.y * height;
        const radius = Math.min(width, height) * 0.27;
        const cursorGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        cursorGradient.addColorStop(0, "rgba(255,61,154,0.13)");
        cursorGradient.addColorStop(0.4, "rgba(168,85,247,0.085)");
        cursorGradient.addColorStop(1, "rgba(124,58,237,0)");
        ctx.fillStyle = cursorGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.25);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      draw();
    };

    const start = () => {
      if (!timer && visible && !document.hidden) {
        draw();
        timer = window.setInterval(draw, coarse ? 50 : 34);
      }
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      mouse.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 }
    );

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    if (!coarse) window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    resize();
    start();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      if (!coarse) window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-fluid-canvas pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
