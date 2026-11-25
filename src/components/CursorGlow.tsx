"use client";

import { useEffect, useRef } from "react";

const TRAIL_SIZE = 12;

const fragment = [
  "precision highp float;",
  "uniform vec2 uResolution;",
  "uniform vec2 uDirection;",
  "uniform float uTime;",
  "uniform float uActive;",
  "uniform vec4 uTrail[12];",
  "",
  "float smoothMin(float a, float b, float k) {",
  "  float h = max(k-abs(a-b),0.0)/k;",
  "  return min(a,b)-h*h*k*0.25;",
  "}",
  "float smoothMax(float a,float b,float k) {",
  "  return -smoothMin(-a,-b,k);",
  "}",
  "float ellipsoid(vec3 p,vec3 r) {",
  "  float k0=length(p/r);",
  "  float k1=length(p/(r*r));",
  "  return k0*(k0-1.0)/max(k1,0.0001);",
  "}",
  "float mapField(vec3 p) {",
  "  float t=uTime*0.16;",
  "  vec2 mouse=(uTrail[0].xy-.5)*vec2(uResolution.x/uResolution.y,1.0)*2.3;",
  "  vec2 delta=p.xy-mouse;",
  "  float influence=exp(-dot(delta,delta)*0.82)*uActive;",
  "  p.xy-=uDirection*0.45*influence;",
  "  p.z-=0.5*influence;",
  "  p.x+=0.15*sin(p.y*2.3+t*1.7)+0.1*sin(p.z*2.2-t);",
  "  p.y+=0.12*cos(p.x*2.0-t*1.3);",
  "  vec3 q=p;",
  "  float a=ellipsoid(q-vec3(-0.95+sin(t)*0.22,0.66+cos(t*0.7)*0.2,0.1),vec3(1.65,1.16,1.11));",
  "  float b=ellipsoid(q-vec3(1.10+cos(t*0.84)*0.22,-0.34+sin(t)*0.25,0.36),vec3(1.56,1.8,1.09));",
  "  float c=ellipsoid(q-vec3(-0.35,-1.16+sin(t*1.2)*0.2,-0.05),vec3(1.62,0.91,1.08));",
  "  float d=ellipsoid(q-vec3(0.13,0.04+sin(t*0.66)*0.15,-0.64),vec3(1.33,1.4,0.91));",
  "  float surface=smoothMin(smoothMin(a,b,0.8),smoothMin(c,d,0.65),0.7);",
  "  vec3 hole=q-vec3(-0.12+sin(t)*0.19,-0.12,1.05);",
  "  float cavity=ellipsoid(hole,vec3(0.83,0.71,0.66));",
  "  surface=smoothMax(surface,-cavity,0.27);",
  "  surface+=0.055*sin(q.x*4.0+q.z*3.0+t*1.4)*sin(q.y*3.9-t*1.2);",
  "  return surface;",
  "}",
  "vec3 calcNormal(vec3 p) {",
  "  vec2 e=vec2(0.007,0.);",
  "  return normalize(vec3(",
  "    mapField(p+e.xyy)-mapField(p-e.xyy),",
  "    mapField(p+e.yxy)-mapField(p-e.yxy),",
  "    mapField(p+e.yyx)-mapField(p-e.yyx)",
  "  ));",
  "}",
  "void main() {",
  "  vec2 uv=(gl_FragCoord.xy-0.5*uResolution)/uResolution.y;",
  "  vec3 ro=vec3(0.0,0.0,4.7);",
  "  vec3 rd=normalize(vec3(uv*1.64,-2.25));",
  "  float t=0.0;",
  "  bool hit=false;",
  "  for(int i=0;i<42;i++) {",
  "    vec3 p=ro+rd*t;",
  "    float d=mapField(p);",
  "    if(d<0.011){hit=true;break;}",
  "    t+=max(d*0.82,0.024);",
  "    if(t>9.0)break;",
  "  }",
  "  if(!hit) {",
  "    gl_FragColor=vec4(0.0);",
  "    return;",
  "  }",
  "  vec3 p=ro+rd*t;",
  "  vec3 n=calcNormal(p);",
  "  vec3 view=-rd;",
  "",
  "  vec2 mouse=(uTrail[0].xy-.5)*vec2(uResolution.x/uResolution.y,1.0)*2.2;",
  "  vec3 pink=vec3(1.0,0.025,0.30);",
  "  vec3 violet=vec3(0.48,0.07,1.0);",
  "  vec3 glow=vec3(0.86,0.30,1.0);",
  "",
  "  vec3 pinkLight=normalize(vec3(-0.5,0.58,1.7));",
  "  vec3 purpleLight=normalize(vec3(0.83,-0.52,1.25));",
  "  vec3 followLight=normalize(vec3(mouse-p.xy,2.05));",
  "  vec3 hPink=normalize(pinkLight+view);",
  "  vec3 hPurple=normalize(purpleLight+view);",
  "  vec3 hFollow=normalize(followLight+view);",
  "",
  "  float lamPink=pow(max(dot(n,pinkLight),0.0),1.9);",
  "  float lamPurple=pow(max(dot(n,purpleLight),0.0),2.25);",
  "  float specPink=pow(max(dot(n,hPink),0.0),7.0);",
  "  float specPurple=pow(max(dot(n,hPurple),0.0),8.0);",
  "  float specFollow=pow(max(dot(n,hFollow),0.0),4.5);",
  "  float fresnel=pow(1.0-max(dot(n,view),0.0),3.0);",
  "",
  "  float pocket=exp(-dot(p.xy-mouse,p.xy-mouse)*0.38);",
  "  float flow=0.5+0.5*sin(p.x*1.25+p.y*1.15-uTime*0.21);",
  "  float softVein=pow(max(0.0,n.x*0.35+n.y*0.62+n.z*0.2+0.15),3.0);",
  "  vec3 color=vec3(0.008,0.002,0.016);",
  "  color += pink*(0.014*lamPink+0.76*pow(specPink,1.9)+0.048*fresnel);",
  "  color += violet*(0.012*lamPurple+0.69*pow(specPurple,2.05)+0.034*fresnel);",
  "  color += mix(pink,glow,flow)*(0.038*softVein+0.024*lamPink*lamPurple);",
  "  color += mix(pink,violet,flow)*(0.86*pow(specFollow,1.35)*pocket*uActive);",
  "  color += vec3(1.,0.47,0.76)*(0.26*pow(specPink,2.7)+0.13*pow(specFollow,1.5)*pocket*uActive);",
  "  float shadow=smoothstep(-0.13,0.4,dot(n,vec3(-0.45,-0.3,0.7)));",
  "  color*=mix(0.035,1.0,shadow*shadow);",
  "  float vignette=1.0-smoothstep(0.55,1.75,length(uv));",
  "  gl_FragColor=vec4(color*vignette,0.89);",
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
