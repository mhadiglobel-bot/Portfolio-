"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_scroll;
  uniform vec2 u_mouse;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float sphere(vec3 p, float radius) {
    return length(p) - radius;
  }

  float torus(vec3 p, vec2 size) {
    vec2 q = vec2(length(p.xz) - size.x, p.y);
    return length(q) - size.y;
  }

  float smoothUnion(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  float scene(vec3 p) {
    float motion = u_time * 0.18 + u_scroll * 1.15;
    vec3 q = p;
    q.xy = rotate2d(motion * 0.52) * q.xy;
    q.xz = rotate2d(motion * 0.31) * q.xz;

    float core = sphere(q, 0.39);

    vec3 ringA = q;
    ringA.yz = rotate2d(1.04) * ringA.yz;
    ringA.xz = rotate2d(motion * 0.13) * ringA.xz;
    float a = torus(ringA, vec2(0.78, 0.026));

    vec3 ringB = q;
    ringB.xy = rotate2d(1.12) * ringB.xy;
    ringB.yz = rotate2d(-0.58) * ringB.yz;
    float b = torus(ringB, vec2(0.96, 0.018));

    vec3 ringC = q;
    ringC.yz = rotate2d(-0.82) * ringC.yz;
    ringC.xz = rotate2d(0.74) * ringC.xz;
    float c = torus(ringC, vec2(0.62, 0.022));

    float d = smoothUnion(core, a, 0.075);
    d = smoothUnion(d, b, 0.055);
    d = smoothUnion(d, c, 0.05);

    vec3 satellite = q - vec3(cos(motion * 1.45) * 1.08, sin(motion * 1.45) * 0.36, cos(motion * 1.45) * 0.24);
    d = min(d, sphere(satellite, 0.065));

    vec3 satelliteTwo = q - vec3(sin(motion * 0.92 + 2.1) * 0.92, cos(motion * 0.92 + 2.1) * 0.55, sin(motion * 0.92 + 2.1) * 0.18);
    d = min(d, sphere(satelliteTwo, 0.035));

    return d;
  }

  vec3 normalAt(vec3 p) {
    const float e = 0.0015;
    return normalize(vec3(
      scene(p + vec3(e, 0.0, 0.0)) - scene(p - vec3(e, 0.0, 0.0)),
      scene(p + vec3(0.0, e, 0.0)) - scene(p - vec3(0.0, e, 0.0)),
      scene(p + vec3(0.0, 0.0, e)) - scene(p - vec3(0.0, 0.0, e))
    ));
  }

  float march(vec3 ro, vec3 rd, out vec3 hit) {
    float travel = 0.0;
    float distanceToScene = 0.0;
    hit = ro;
    for (int i = 0; i < 64; i++) {
      vec3 p = ro + rd * travel;
      distanceToScene = scene(p);
      hit = p;
      if (distanceToScene < 0.0014 || travel > 6.5) break;
      travel += max(distanceToScene * 0.78, 0.006);
    }
    return travel;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 screen = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
    float rightBias = u_resolution.x > u_resolution.y ? 0.39 : 0.025;
    vec2 uv = screen;
    uv.x -= rightBias;
    uv += u_mouse * 0.035;

    vec3 color = vec3(0.014, 0.011, 0.021);
    float pinkCloud = exp(-length(screen - vec2(0.45, 0.06)) * 2.6);
    float violetCloud = exp(-length(screen - vec2(0.05, -0.16)) * 2.0);
    color += vec3(0.22, 0.018, 0.13) * pinkCloud;
    color += vec3(0.065, 0.035, 0.19) * violetCloud;

    vec2 starCell = floor((screen + vec2(u_time * 0.0015, 0.0)) * vec2(108.0, 82.0));
    float star = step(0.9975, hash(starCell));
    color += vec3(0.44, 0.35, 0.58) * star * 0.34;

    vec3 ro = vec3(0.0, 0.0, 3.28);
    vec3 rd = normalize(vec3(uv, -1.82));
    vec3 hit;
    float travel = march(ro, rd, hit);

    if (travel < 6.5) {
      vec3 n = normalAt(hit);
      vec3 lightDirection = normalize(vec3(-0.85, 1.2, 2.5));
      float diffuse = max(dot(n, lightDirection), 0.0);
      float specular = pow(max(dot(reflect(-lightDirection, n), -rd), 0.0), 38.0);
      float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 2.8);
      float contour = 0.5 + 0.5 * sin(hit.y * 8.0 + hit.x * 4.0 + u_time * 0.38);

      vec3 pink = vec3(1.0, 0.15, 0.63);
      vec3 purple = vec3(0.42, 0.22, 0.98);
      vec3 base = mix(pink, purple, smoothstep(-0.78, 0.82, hit.y + hit.x * 0.2));
      vec3 edge = mix(pink, purple, contour);
      vec3 shaded = base * (0.19 + diffuse * 0.58);
      shaded += vec3(0.82, 0.72, 1.0) * specular * 0.78;
      shaded += edge * fresnel * 0.82;
      shaded += vec3(0.17, 0.035, 0.19) * (1.0 - abs(n.z)) * 0.34;
      color = mix(color, shaded, clamp(1.0 - travel * 0.045, 0.0, 1.0));
    }

    float vignette = 1.0 - smoothstep(0.18, 1.45, length(screen * vec2(0.78, 1.0)));
    color *= 0.72 + 0.28 * vignette;
    color = pow(max(color, 0.0), vec3(0.92));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function OrbitalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      canvas.dataset.failed = "true";
      return;
    }

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) {
      canvas.dataset.failed = "true";
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      canvas.dataset.failed = "true";
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.dataset.failed = "true";
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }

    const buffer = gl.createBuffer();
    if (!buffer) {
      canvas.dataset.failed = "true";
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const scroll = gl.getUniformLocation(program, "u_scroll");
    const mouse = gl.getUniformLocation(program, "u_mouse");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastFrame = 0;
    let pageScroll = 0;
    let pointerX = 0;
    let pointerY = 0;
    let disposed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const quality = window.innerWidth < 700 ? 0.5 : 0.64;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.2) * quality;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      if (reducedMotion) draw(0);
    };

    const updateScroll = () => {
      pageScroll = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight * 3.4, 1)));
    };

    const updatePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointerY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * -2;
    };

    const draw = (timestamp: number) => {
      if (disposed) return;
      if (!reducedMotion && timestamp - lastFrame < (window.innerWidth < 700 ? 33 : 18)) {
        raf = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;
      gl.useProgram(program);
      gl.uniform1f(time, reducedMotion ? 0 : timestamp * 0.001);
      gl.uniform1f(scroll, pageScroll);
      gl.uniform2f(mouse, pointerX, pointerY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reducedMotion) raf = window.requestAnimationFrame(draw);
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      canvas.dataset.failed = "true";
      window.cancelAnimationFrame(raf);
    };

    canvas.addEventListener("webglcontextlost", onContextLost, false);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    updateScroll();
    resize();
    if (reducedMotion) draw(0);
    else raf = window.requestAnimationFrame(draw);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <div className="orbital-scene" aria-hidden="true">
      <canvas ref={canvasRef} className="orbital-canvas" />
      <div className="orbital-fallback" />
      <div className="orbital-halo orbital-halo--pink" />
      <div className="orbital-halo orbital-halo--violet" />
    </div>
  );
}
