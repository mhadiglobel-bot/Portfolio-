"use client";

import { useEffect, useRef } from "react";

export default function FluidGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: width * 0.5, y: height * 0.5 };
    const smooth = { x: width * 0.5, y: height * 0.5 };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    const blobs = [
      { bx: 0.28, by: 0.36, r: 0.42, color: [255, 61, 154], phase: 0, speed: 0.00028 },
      { bx: 0.72, by: 0.62, r: 0.48, color: [168, 85, 247], phase: 2.1, speed: -0.00022 },
      { bx: 0.5, by: 0.5, r: 0.34, color: [124, 58, 237], phase: 4.3, speed: 0.00034 },
      { bx: 0.6, by: 0.3, r: 0.26, color: [232, 121, 249], phase: 1.4, speed: -0.0003 },
    ];

    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;

      t += 1;
      smooth.x += (mouse.x - smooth.x) * 0.05;
      smooth.y += (mouse.y - smooth.y) * 0.05;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#07060b";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";

      blobs.forEach((blob) => {
        const driftX = Math.sin(t * blob.speed + blob.phase) * 0.12;
        const driftY = Math.cos(t * blob.speed * 1.3 + blob.phase) * 0.1;
        const cursorPullX = (smooth.x / width - 0.5) * 0.18;
        const cursorPullY = (smooth.y / height - 0.5) * 0.18;

        const x = (blob.bx + driftX + cursorPullX) * width;
        const y = (blob.by + driftY + cursorPullY) * height;
        const radius = blob.r * Math.min(width, height);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${blob.color.join(",")}, 0.22)`);
        gradient.addColorStop(0.45, `rgba(${blob.color.join(",")}, 0.08)`);
        gradient.addColorStop(1, `rgba(${blob.color.join(",")}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // cursor disturbance
      const cursorRadius = Math.min(width, height) * 0.34;
      const cursorGradient = ctx.createRadialGradient(
        smooth.x,
        smooth.y,
        0,
        smooth.x,
        smooth.y,
        cursorRadius
      );
      cursorGradient.addColorStop(0, "rgba(255, 61, 154, 0.16)");
      cursorGradient.addColorStop(0.35, "rgba(168, 85, 247, 0.1)");
      cursorGradient.addColorStop(1, "rgba(124, 58, 237, 0)");
      ctx.fillStyle = cursorGradient;
      ctx.beginPath();
      ctx.arc(smooth.x, smooth.y, cursorRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
