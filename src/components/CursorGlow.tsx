"use client";

import { useEffect, useRef } from "react";

type Field = { dye: Float32Array; u: Float32Array; v: Float32Array };
const fields = (size: number): Field => ({
  dye: new Float32Array(size), u: new Float32Array(size), v: new Float32Array(size),
});

// Transport pigment and momentum through the same grid so a turn folds the existing wake.
export default function CursorGlow() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const enabled = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let w = 0, h = 0, frame = 0, previous = 0, lastMove = 0;
    let source = fields(0), buffer = fields(0), pixels: ImageData;
    let last: { x: number; y: number } | undefined;
    let card: HTMLElement | null = null;

    function reset() {
      const resolution = Math.min(220 / Math.max(innerWidth, innerHeight), .22);
      w = canvas!.width = Math.max(12, Math.round(innerWidth * resolution));
      h = canvas!.height = Math.max(12, Math.round(innerHeight * resolution));
      source = fields(w * h);
      buffer = fields(w * h);
      pixels = ctx!.createImageData(w, h);
      last = undefined;
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function render(time: number) {
      frame = 0;
      if (!enabled.matches || document.hidden || time - lastMove > 2300) {
        reset();
        return;
      }
      frame = requestAnimationFrame(render);
      if (time - previous < 23) return;
      const dt = Math.min(1.7, (time - previous) / 30);
      previous = time;
      const decay = Math.exp(-.069 * dt);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = x + y * w;
          const px = Math.max(0, Math.min(w - 1.01, x - source.u[i] * dt));
          const py = Math.max(0, Math.min(h - 1.01, y - source.v[i] * dt));
          const j = Math.floor(px) + Math.floor(py) * w;
          const fx = px % 1, fy = py % 1;
          const a = (1 - fx) * (1 - fy), b = fx * (1 - fy), c = (1 - fx) * fy, d = fx * fy;
          const sample = (f: Float32Array) => a * f[j] + b * f[j+1] + c * f[j+w] + d * f[j+w+1];
          const ink = buffer.dye[i] = sample(source.dye) * decay;
          const slopeX = source.dye[i+1] - source.dye[i-1];
          const slopeY = source.dye[i+w] - source.dye[i-w];
          buffer.u[i] = sample(source.u) * .95 - slopeX * .95;
          buffer.v[i] = sample(source.v) * .95 - slopeY * .95;
          const fold = Math.min(1, Math.max(0, slopeY * 2.8 - slopeX * 1.9));
          const light = Math.min(1, .12 * ink + fold + .36 * Math.max(0, Math.sin(ink * 4 - .9)) * Math.min(ink, 1));
          const mix = Math.min(1, Math.max(0, (x / w - .29) / .42));
          const p = i * 4;
          pixels.data[p] = 255 - mix * 95;
          pixels.data[p+1] = 21 + light * 49;
          pixels.data[p+2] = 122 + mix * 132;
          pixels.data[p+3] = Math.min(178, ink * 50 + light * 140);
        }
      }
      ctx!.putImageData(pixels, 0, 0);
      [source, buffer] = [buffer, source];
    }

    function move(event: PointerEvent) {
      if (!enabled.matches || event.pointerType === "touch") return;
      const now = performance.now();
      const nextCard = (event.target as Element)?.closest<HTMLElement>(".card-hover,.contact-card,.reel-image,.profile-photo");
      if (nextCard) {
        const rect = nextCard.getBoundingClientRect();
        nextCard.style.setProperty("--sheen-x", event.clientX - rect.left + "px");
        nextCard.style.setProperty("--sheen-y", event.clientY - rect.top + "px");
        nextCard.style.setProperty("--sheen-hue", String(328 - 58 * event.clientX / innerWidth));
      }
      if (card !== nextCard) {
        card?.removeAttribute("data-lit");
        nextCard?.setAttribute("data-lit", "");
        card = nextCard;
      }
      const x = event.clientX / innerWidth * w;
      const y = event.clientY / innerHeight * h;
      if (!last || now - lastMove > 240) last = { x, y };
      const dx = x - last.x, dy = y - last.y;
      const length = Math.hypot(dx, dy);
      if (length > .07) {
        const radius = Math.max(4, Math.min(w,h) * .10);
        const steps = Math.max(1, Math.min(24, Math.ceil(length / (radius * .38))));
        const speed = Math.min(1, length / (Math.max(5, now - lastMove) * .25));
        const nx = dx / length, ny = dy / length;
        for (let s = 1; s <= steps; s++) {
          const cx = last.x + dx * s / steps, cy = last.y + dy * s / steps;
          for (let row = Math.max(1, Math.floor(cy-radius)); row <= Math.min(h-2, cy+radius); row++) {
            for (let col = Math.max(1, Math.floor(cx-radius)); col <= Math.min(w-2, cx+radius); col++) {
              const rx = (col-cx)/radius, ry = (row-cy)/radius;
              const r2 = rx*rx + ry*ry;
              if (r2 >= 1) continue;
              const side = rx * -ny + ry * nx;
              const weight = (1-r2) ** 2 * Math.min(1, length / (steps * .9));
              const i = col + row * w;
              source.dye[i] = Math.min(3.2, source.dye[i] + weight * (.2 + speed * .45));
              const curl = side * (1.2 + speed);
              source.u[i] += weight * (nx * speed + ry * curl) * .55;
              source.v[i] += weight * (ny * speed - rx * curl) * .55;
            }
          }
        }
        if (!frame) { previous = now - 30; frame = requestAnimationFrame(render); }
      }
      lastMove = now;
      last = { x, y };
    }

    reset();
    window.addEventListener("resize", reset);
    window.addEventListener("pointermove", move, { passive: true });
    enabled.addEventListener("change", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      window.removeEventListener("resize", reset);
      window.removeEventListener("pointermove", move);
      enabled.removeEventListener("change", reset);
      document.removeEventListener("visibilitychange", reset);
      cancelAnimationFrame(frame);
      card?.removeAttribute("data-lit");
    };
  }, []);
  return <div className="liquid-field" data-rendered="fluid" aria-hidden="true"><canvas ref={ref} /></div>;
}
