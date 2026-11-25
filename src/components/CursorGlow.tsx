"use client";

import { useEffect, useRef } from "react";

const fragment = [
  "precision mediump float;",
  "uniform vec2 viewport, head, tail;",
  "uniform float time;",
  "float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }",
  "float noise(vec2 p) {",
  "  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);",
  "  float a = hash(i); float b = hash(i + vec2(1.0, 0.0));",
  "  float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));",
  "  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);",
  "}",
  "float fbm(vec2 p) {",
  "  float value = 0.0; float amplitude = 0.5;",
  "  for (int i = 0; i < 4; i++) { value += amplitude * noise(p); p = p * 2.02 + vec2(13.7, 7.9); amplitude *= 0.5; }",
  "  return value;",
  "}",
  "void main() {",
  "  vec2 uv = gl_FragCoord.xy / viewport;",
  "  vec2 ratio = vec2(viewport.x / viewport.y, 1.0);",
  "  vec2 p = (uv - head) * ratio;",
  "  vec2 velocity = (head - tail) * ratio;",
  "  float speed = clamp(length(velocity) * 5.0, 0.0, 1.0);",
  "  vec2 axis = normalize(velocity + vec2(0.0001, 0.0001));",
  "  vec2 side = vec2(-axis.y, axis.x);",
  "  float along = dot(p, axis); float across = dot(p, side);",
  "  float turbulence = fbm(uv * 3.2 + vec2(time * 0.075, -time * 0.055)) - 0.5;",
  "  float detail = fbm(uv * 7.0 + vec2(-time * 0.09, time * 0.07)) - 0.5;",
  "  float wobble = turbulence * 0.055 + detail * 0.018 + sin(along * 10.0 + time * 0.7) * 0.012;",
  "  float stretched = along < 0.0 ? along * 0.76 : along;",
  "  float distanceField = length(vec2(across, stretched)) - (0.145 + wobble + speed * 0.025);",
  "  float body = 1.0 - smoothstep(-0.018, 0.035, distanceField);",
  "  float edge = exp(-abs(distanceField) * 25.0);",
  "  float glow = exp(-max(distanceField, 0.0) * 10.5);",
  "  float trail = exp(-across * across * 78.0) * exp(-max(-along, 0.0) * 4.4) * smoothstep(-0.48, -0.015, along) * (0.12 + speed * 0.22);",
  "  float colorShift = clamp(uv.x + turbulence * 0.2 + detail * 0.08, 0.0, 1.0);",
  "  vec3 pink = vec3(1.0, 0.10, 0.48); vec3 purple = vec3(0.55, 0.22, 1.0);",
  "  vec3 ink = mix(pink, purple, smoothstep(0.12, 0.9, colorShift));",
  "  vec3 highlight = vec3(1.0, 0.62, 0.9);",
  "  float intensity = glow * 0.46 + edge * 0.43 + trail;",
  "  vec3 color = ink * intensity + highlight * body * 0.24;",
  "  float alpha = clamp(intensity * 0.62 + body * 0.06, 0.0, 0.42);",
  "  gl_FragColor = vec4(color, alpha);",
  "}"
].join(String.fromCharCode(10));

export default function CursorGlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    let disposed = false;
    let clean = () => {};
    const field = canvas.parentElement!;

    const fallback = (event: PointerEvent) => {
      if (motion.matches || field.dataset.rendered) return;
      field.style.setProperty("--light-x", (event.clientX / innerWidth * 100) + "%");
      field.style.setProperty("--light-y", (event.clientY / innerHeight * 100) + "%");
    };

    window.addEventListener("pointermove", fallback, { passive: true });

    async function initialize() {
      const { WebGLRenderer, Scene, OrthographicCamera, ShaderMaterial, PlaneGeometry, Mesh, Vector2 } = await import("three");
      if (disposed || motion.matches || !canvas) return;

      const renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);

      const head = new Vector2(0.5, 0.52);
      const tail = head.clone();
      const aim = head.clone();
      const viewport = new Vector2();

      const material = new ShaderMaterial({
        uniforms: {
          viewport: { value: viewport },
          head: { value: head },
          tail: { value: tail },
          time: { value: 0 },
        },
        vertexShader: "void main(){gl_Position=vec4(position.xy,0.,1.);}",
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
      });

      const geometry = new PlaneGeometry(2, 2);
      const scene = new Scene();
      scene.add(new Mesh(geometry, material));
      const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const resize = () => {
        const scale = Math.min(0.5, 850 / Math.max(innerWidth, innerHeight));
        viewport.set(Math.max(1, Math.round(innerWidth * scale)), Math.max(1, Math.round(innerHeight * scale)));
        renderer.setSize(viewport.x, viewport.y, false);
      };

      const pointer = (event: PointerEvent) => {
        aim.set(event.clientX / innerWidth, 1 - event.clientY / innerHeight);
      };

      let previous = 0;
      const draw = (time: number) => {
        if (time - previous < 33) return;
        previous = time;
        head.lerp(aim, 0.2);
        tail.lerp(head, 0.055);
        material.uniforms.time.value = time / 1000;
        renderer.render(scene, camera);
      };

      const visibility = () => {
        renderer.setAnimationLoop(document.hidden || motion.matches ? null : draw);
      };

      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", pointer, { passive: true });
      document.addEventListener("visibilitychange", visibility);
      motion.addEventListener("change", visibility);
      resize();
      visibility();
      field.dataset.rendered = "true";

      clean = () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", pointer);
        document.removeEventListener("visibilitychange", visibility);
        motion.removeEventListener("change", visibility);
        renderer.setAnimationLoop(null);
        material.dispose();
        geometry.dispose();
        renderer.dispose();
      };
    }

    if (!motion.matches && finePointer.matches) void initialize().catch(() => {});

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", fallback);
      delete field.dataset.rendered;
      clean();
    };
  }, []);

  return <div className="liquid-field" aria-hidden="true"><canvas ref={ref} /></div>;
}
