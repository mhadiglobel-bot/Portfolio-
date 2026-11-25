"use client";

import { useEffect, useRef } from "react";

const TRAIL_SIZE = 12;

const fragment = [
  "precision mediump float;",
  "uniform vec2 uResolution;",
  "uniform vec2 uDirection;",
  "uniform float uTime;",
  "uniform float uActive;",
  "uniform vec4 uTrail[12];",
  "float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }",
  "float noise(vec2 p) {",
  "  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);",
  "  float a = hash(i); float b = hash(i + vec2(1.0, 0.0));",
  "  float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));",
  "  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);",
  "}",
  "void main() {",
  "  vec2 uv = gl_FragCoord.xy / uResolution;",
  "  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);",
  "  float slowNoise = noise(uv * 3.0 + vec2(uTime * 0.018, -uTime * 0.014));",
  "  float crossNoise = noise(uv * 3.0 + vec2(8.3, uTime * 0.016));",
  "  vec2 warpedUV = uv + (vec2(slowNoise, crossNoise) - 0.5) * 0.052;",
  "  vec2 axis = normalize(uDirection * aspect + vec2(0.0001, 0.0001));",
  "  vec2 side = vec2(-axis.y, axis.x);",
  "  float field = 0.0; float halo = 0.0;",
  "  for (int i = 0; i < 12; i++) {",
  "    vec4 pointData = uTrail[i];",
  "    float age = pointData.z; float strength = pointData.w;",
  "    if (strength > 0.001) {",
  "      vec2 p = (warpedUV - pointData.xy) * aspect;",
  "      float along = dot(p, axis); float across = dot(p, side);",
  "      float radius = mix(0.22, 0.078, age);",
  "      float width = mix(0.16, 0.058, age);",
  "      float distanceField = length(vec2(along / radius, across / width));",
  "      float wobble = sin((along + across) * 12.0 + uTime * 0.62) * 0.055 + (slowNoise - 0.5) * 0.16 + (crossNoise - 0.5) * 0.1;",
  "      distanceField += wobble;",
  "      float blob = 1.0 - smoothstep(0.68, 1.18, distanceField);",
  "      float weight = strength * exp(-age * 1.55);",
  "      field += blob * weight * 0.42;",
  "      halo += exp(-distanceField * distanceField * 0.32) * weight * 0.06;",
  "    }",
  "  }",
  "  vec2 headPoint = (warpedUV - uTrail[0].xy) * aspect;",
  "  float headAlong = dot(headPoint, axis); float headAcross = dot(headPoint, side);",
  "  float headNoise = noise((headPoint + vec2(uTime * 0.04, -uTime * 0.03)) * 5.0);",
  "  float headDistance = length(vec2(headAlong * 0.84, headAcross * 1.08)) / 0.2 + (headNoise - 0.5) * 0.88;",
  "  float ribbon = exp(-headAcross * headAcross * 32.0) * exp(-max(-headAlong, 0.0) * 1.7) * smoothstep(-1.0, -0.01, headAlong);",
  "  field += ribbon * uActive * 0.92;",
  "  float headBlob = 1.0 - smoothstep(0.66, 1.18, headDistance);",
  "  field += headBlob * uActive * 0.95;",
  "  float body = smoothstep(0.32, 1.05, field);",
  "  float inner = smoothstep(0.72, 1.42, field);",
  "  float rim = exp(-abs(field - 0.95) * 3.8) * smoothstep(0.18, 0.48, field);",
  "  float outerGlow = exp(-max(0.0, 0.42 - field) * 2.3) * smoothstep(0.01, 0.3, field);",
  "  float palette = clamp(0.4 + slowNoise * 0.42 + crossNoise * 0.18, 0.0, 1.0);",
  "  vec3 pink = vec3(1.0, 0.055, 0.43);",
  "  vec3 purple = vec3(0.43, 0.085, 0.96);",
  "  vec3 violet = vec3(0.72, 0.25, 1.0);",
  "  vec3 highlight = vec3(1.0, 0.58, 0.88);",
  "  vec3 deep = vec3(0.055, 0.008, 0.12);",
  "  vec3 color = mix(pink, purple, smoothstep(0.12, 0.9, palette));",
  "  color = mix(color, deep, inner * 0.82);",
  "  vec2 specularPoint = headPoint - vec2(-0.08, 0.11);",
  "  float specular = exp(-dot(specularPoint, specularPoint) * 150.0) * body * uActive;",
  "  color += highlight * specular * 0.5;",
  "  color += violet * outerGlow * 0.3;",
  "  color += highlight * rim * 0.72;",
  "  color += pink * rim * 0.22;",
  "  float alpha = clamp(body * 0.42 + rim * 0.28 + outerGlow * 0.22 + halo, 0.0, 0.72);",
  "  gl_FragColor = vec4(color, alpha);",
  "}"
].join("\n");

type TrailPoint = { x: number; y: number; time: number };

export default function CursorGlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const field = canvas?.parentElement;
    if (!canvas || !field) return;

    const enabled = window.matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
    const history: TrailPoint[] = [];
    const trailData = new Float32Array(TRAIL_SIZE * 4);
    let lastInput: TrailPoint | null = null;
    let lastMove = 0;
    let tick = 0;
    let frame = 0;
    let lit: HTMLElement | null = null;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let vertex: WebGLShader | null = null;
    let pixel: WebGLShader | null = null;

    const fallback = (event: PointerEvent) => {
      if (field.dataset.rendered || window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
      field.style.setProperty("--light-x", String(event.clientX / window.innerWidth * 100) + "%");
      field.style.setProperty("--light-y", String(event.clientY / window.innerHeight * 100) + "%");
    };

    if (!enabled.matches) {
      window.addEventListener("pointermove", fallback, { passive: true });
      return () => window.removeEventListener("pointermove", fallback);
    }

    gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      window.addEventListener("pointermove", fallback, { passive: true });
      return () => window.removeEventListener("pointermove", fallback);
    }

    const compile = (type: number, source: string) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    vertex = compile(gl.VERTEX_SHADER, "attribute vec2 pos;void main(){gl_Position=vec4(pos,0.0,1.0);}");
    pixel = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vertex || !pixel) {
      if (vertex) gl.deleteShader(vertex);
      if (pixel) gl.deleteShader(pixel);
      window.addEventListener("pointermove", fallback, { passive: true });
      return () => window.removeEventListener("pointermove", fallback);
    }

    program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, pixel);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      window.addEventListener("pointermove", fallback, { passive: true });
      return () => window.removeEventListener("pointermove", fallback);
    }

    gl.useProgram(program);
    const loc = (name: string) => gl!.getUniformLocation(program!, name);
    const u = {
      resolution: loc("uResolution"),
      direction: loc("uDirection"),
      time: loc("uTime"),
      active: loc("uActive"),
      trail: loc("uTrail[0]"),
    };

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "pos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const direction = { x: 0.02, y: 0.01 };

    const resize = () => {
      const scale = Math.min(0.52, 900 / Math.max(window.innerWidth, window.innerHeight));
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform2f(u.resolution, canvas.width, canvas.height);
    };

    const draw = (time: number) => {
      frame = 0;
      if (!enabled.matches || document.hidden || !lastMove || time - lastMove > 1850) {
        gl!.clear(gl!.COLOR_BUFFER_BIT);
        return;
      }

      frame = requestAnimationFrame(draw);
      if (time - tick < 30) return;
      tick = time;

      for (let i = 0; i < TRAIL_SIZE; i++) {
        const point = history[i];
        if (!point) {
          trailData[i * 4] = -2;
          trailData[i * 4 + 1] = -2;
          trailData[i * 4 + 2] = 1;
          trailData[i * 4 + 3] = 0;
          continue;
        }
        const age = Math.min(Math.max((time - point.time) / 1180, 0), 1);
        trailData[i * 4] = point.x;
        trailData[i * 4 + 1] = point.y;
        trailData[i * 4 + 2] = age;
        trailData[i * 4 + 3] = 1 - age;
      }

      gl!.uniform2f(u.direction, direction.x, direction.y);
      gl!.uniform1f(u.time, time / 1000);
      gl!.uniform1f(u.active, Math.max(0, 1 - (time - lastMove) / 1650));
      gl!.uniform4fv(u.trail, trailData);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    };

    const move = (event: PointerEvent) => {
      const now = performance.now();
      const next = {
        x: event.clientX / window.innerWidth,
        y: 1 - event.clientY / window.innerHeight,
        time: now,
      };

      if (lastInput) {
        const dx = (next.x - lastInput.x) * (window.innerWidth / window.innerHeight);
        const dy = next.y - lastInput.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0.001) {
          direction.x = next.x - lastInput.x;
          direction.y = next.y - lastInput.y;
          const length = Math.hypot(direction.x, direction.y) || 1;
          direction.x /= length;
          direction.y /= length;
          const steps = Math.max(1, Math.ceil(distance / 0.022));
          for (let i = 1; i <= steps; i++) {
            const progress = i / steps;
            history.unshift({
              x: lastInput.x + (next.x - lastInput.x) * progress,
              y: lastInput.y + (next.y - lastInput.y) * progress,
              time: now - (steps - i) * 5,
            });
          }
        }
      } else {
        history.unshift(next);
      }

      lastInput = next;
      lastMove = now;
      if (history.length > TRAIL_SIZE) history.length = TRAIL_SIZE;

      if (event.target instanceof Element) {
        const card = event.target.closest<HTMLElement>(".card-hover,.reel-image");
        if (lit !== card) {
          lit?.removeAttribute("data-lit");
          card?.setAttribute("data-lit", "");
          lit = card;
        }
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--sheen-x", event.clientX - rect.x + "px");
          card.style.setProperty("--sheen-y", event.clientY - rect.y + "px");
        }
      }

      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    field.dataset.rendered = "fluid";
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointermove", fallback, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointermove", fallback);
      lit?.removeAttribute("data-lit");
      delete field.dataset.rendered;
      if (buffer) gl!.deleteBuffer(buffer);
      if (vertex) gl!.deleteShader(vertex);
      if (pixel) gl!.deleteShader(pixel);
      if (program) gl!.deleteProgram(program);
    };
  }, []);

  return <div className="liquid-field" aria-hidden="true"><canvas ref={ref} /></div>;
}
