"use client";

import { useEffect, useRef } from "react";

// Three offset layers pull a folded band of light along the last pointer path.
const fragment = `
precision mediump float;
uniform vec2 viewport, head, tail;
uniform float time;
void main() {
  vec2 uv = gl_FragCoord.xy / viewport;
  vec2 ratio = vec2(viewport.x / viewport.y, 1.);
  vec2 p = (uv - mix(head, tail, .34)) * ratio;
  p += (tail - head) * ratio * sin(uv.y * 8. + time * .3) * .48;
  float r = length(p);
  float a = 1.18 * exp(-r * 2.) + .25 * sin(time * .25);
  p = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
  float field = p.y + .17 * sin(p.x * 8. + time * .34)
                    + .07 * cos(p.x * 14. - time * .29 + p.y * 4.);
  float rim = exp(-abs(field) * 23.) * smoothstep(-.04, .025, field);
  float fold = (.16 + .84 * smoothstep(-.21, .015, field)) * exp(-abs(field) * 6.);
  float intensity = (rim * .4 + fold * .63) * exp(-r*r * 5.);
  vec3 ink = mix(vec3(1.,.055,.43), vec3(.51,.12,1.), smoothstep(.34,.66,uv.x));
  gl_FragColor = vec4(ink, intensity * .69);
}`;

export default function CursorGlow() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let clean = () => {};
    const field = canvas.parentElement!;
    const fallback = (event: PointerEvent) => {
      if (motion.matches || field.dataset.rendered) return;
      const horizontal = event.clientX / innerWidth;
      field.style.setProperty("--light-x", horizontal * 100 + "%");
      field.style.setProperty("--light-y", event.clientY / innerHeight * 100 + "%");
      field.style.setProperty("--light-hue", String(333 - 65 * horizontal));
    };
    window.addEventListener("pointermove", fallback, { passive: true });
    async function initialize() {
      if (!canvas) return;
      const { WebGLRenderer, Scene, OrthographicCamera, ShaderMaterial, PlaneGeometry, Mesh, Vector2 } = await import("three");
      if (disposed || motion.matches) return;
      const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
      const head = new Vector2(.28,.48), tail = head.clone(), aim = head.clone();
      const viewport = new Vector2();
      const material = new ShaderMaterial({
        uniforms: { viewport: {value: viewport}, head: {value: head}, tail: {value: tail}, time: {value: 0} },
        vertexShader: "void main(){gl_Position=vec4(position.xy,0.,1.);}",
        fragmentShader: fragment, transparent: true, depthWrite: false,
      });
      const geometry = new PlaneGeometry(2,2);
      const scene = new Scene();
      scene.add(new Mesh(geometry, material));
      const camera = new OrthographicCamera(-1,1,1,-1,0,1);
      const resize = () => {
        const scale = Math.min(.5, 850 / Math.max(innerWidth, innerHeight));
        viewport.set(Math.round(innerWidth * scale), Math.round(innerHeight * scale));
        renderer.setSize(viewport.x, viewport.y, false);
      };
      const pointer = (event: PointerEvent) => aim.set(event.clientX / innerWidth, 1 - event.clientY / innerHeight);
      let previous = 0;
      const draw = (time: number) => {
        if (time - previous < 33) return;
        previous = time;
        head.lerp(aim,.22);
        tail.lerp(head,.075);
        material.uniforms.time.value = time / 1000;
        renderer.render(scene,camera);
      };
      const visibility = () => renderer.setAnimationLoop(document.hidden || motion.matches ? null : draw);
      window.addEventListener("resize",resize);
      window.addEventListener("pointermove",pointer,{passive:true});
      document.addEventListener("visibilitychange",visibility);
      motion.addEventListener("change",visibility);
      resize(); visibility();
      field.dataset.rendered = "true";
      clean = () => {
        window.removeEventListener("resize",resize);
        window.removeEventListener("pointermove",pointer);
        document.removeEventListener("visibilitychange",visibility);
        motion.removeEventListener("change",visibility);
        renderer.setAnimationLoop(null);
        material.dispose(); geometry.dispose(); renderer.dispose();
      };
    }
    if (!motion.matches) void initialize().catch(() => {});
    return () => {
      disposed = true;
      window.removeEventListener("pointermove", fallback);
      delete field.dataset.rendered;
      clean();
    };
  }, []);
  return <div className="liquid-field" aria-hidden="true"><canvas ref={ref} /></div>;
}
