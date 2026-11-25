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
  "mat2 rot(float a) {",
  "  float c=cos(a), s=sin(a);",
  "  return mat2(c,-s,s,c);",
  "}",
  "float smin(float a, float b, float k) {",
  "  float h=max(k-abs(a-b),0.0)/k;",
  "  return min(a,b)-h*h*k*0.25;",
  "}",
  "float smax(float a,float b,float k){return -smin(-a,-b,k);}",
  "float ellipsoid(vec3 p,vec3 r) {",
  "  float k0=length(p/r);",
  "  float k1=length(p/(r*r));",
  "  return k0*(k0-1.0)/max(k1,0.0001);",
  "}",
  "float field(vec3 p) {",
  "  float t=uTime*0.76;",
  "  vec2 mouse=(uTrail[0].xy-0.5)*vec2(uResolution.x/uResolution.y,1.0)*3.15;",
  "  float d=length(p.xy-mouse);",
  "  float impact=uActive*exp(-d*d*0.86);",
  "  float wave=sin(d*8.0-uTime*7.0)*exp(-d*1.4)*uActive;",
  "  p.xy-=uDirection*(impact*0.72+wave*0.12);",
  "  p.z-=impact*0.72;",
  "  p.xy=rot(0.34*sin(t*0.55)+0.13*t)*p.xy;",
  "  p.xz=rot(0.27*cos(t*0.39)+0.17*t)*p.xz;",
  "  p.yz=rot(0.24*sin(t*0.43)-0.10*t)*p.yz;",
  "  vec3 q=p;",
  "  q.x+=0.18*sin(q.y*2.15+t*1.25)+0.10*cos(q.z*2.4-t*.8);",
  "  q.y+=0.17*cos(q.x*2.1-t*1.3);",
  "  q.z+=0.13*sin(q.x*2.75+q.y*1.8+t*1.65);",
  "  float a=ellipsoid(q-vec3(-.91+0.60*sin(t*.78), .41+.45*cos(t*.57),.16),",
  "    vec3(1.50+.12*sin(t*.56),1.18,1.12));",
  "  float b=ellipsoid(q-vec3(.96+.56*cos(t*.62),-.25+.55*sin(t*.92),.13),",
  "    vec3(1.23,1.44+.21*sin(t*.53),1.08));",
  "  float c=ellipsoid(q-vec3(-.23+.33*sin(t*.41),-1.08+.49*cos(t*.72),-.19),",
  "    vec3(1.54, .76+.21*sin(t*.80),1.12));",
  "  float body=smin(smin(a,b,.52),c,.54);",
  "  vec3 cut=vec3(.19+.68*sin(t*.68), -.25+.57*cos(t*.53), .84+.15*sin(t*.64));",
  "  float cavity=ellipsoid(q-cut,vec3(.86+.1*sin(t*.87),.74,.78));",
  "  body=smax(body,-cavity,.25);",
  "  float second=ellipsoid(q-vec3(-1.55*cos(t*.45),.38*sin(t*.61),.79),vec3(.36,.53,.50));",
  "  body=smax(body,-second,.11);",
  "  body+=.033*sin(q.x*4.6+q.z*3.0+t*1.6)*sin(q.y*4.3-t*1.1);",
  "  return body;",
  "}",
  "vec3 normalAt(vec3 p) {",
  "  float h=.008;",
  "  vec2 e=vec2(1.,-1.)*h;",
  "  return normalize(",
  "    e.xyy*field(p+e.xyy)+e.yyx*field(p+e.yyx)+",
  "    e.yxy*field(p+e.yxy)+e.xxx*field(p+e.xxx)",
  "  );",
  "}",
  "void main(){",
  "  vec2 uv=(gl_FragCoord.xy-.5*uResolution)/uResolution.y;",
  "  vec3 ro=vec3(0.,0.,4.75);",
  "  vec3 rd=normalize(vec3(uv*1.38,-2.1));",
  "  float d=0., z=0.;",
  "  bool hit=false;",
  "  for(int i=0;i<46;i++){",
  "    d=field(ro+rd*z);",
  "    if(d<.012){hit=true;break;}",
  "    z+=max(.024,d*.84);",
  "    if(z>8.0)break;",
  "  }",
  "  if(!hit){gl_FragColor=vec4(0.);return;}",
  "  vec3 p=ro+rd*z;",
  "  vec3 n=normalAt(p);",
  "  vec3 view=-rd;",
  "  float t=uTime*.76;",
  "  vec3 lightA=vec3(-1.12*cos(t*.89)+.42*sin(t*.31),",
  "                   .96*sin(t*.72)+.2*cos(t*.35),2.08);",
  "  vec3 lightB=vec3(1.26*sin(t*.47+.7),",
  "                   -.76*cos(t*.55),1.42);",
  "  vec3 L=lightA-p;",
  "  vec3 L2=lightB-p;",
  "  float attenuation=exp(-dot(L.xy,L.xy)*.64);",
  "  float attenuation2=exp(-dot(L2.xy,L2.xy)*.46);",
  "  vec3 Ln=normalize(L);",
  "  vec3 Ln2=normalize(L2);",
  "  float diffuse=pow(max(dot(n,Ln),0.),1.9)*attenuation;",
  "  float secondary=pow(max(dot(n,Ln2),0.),2.3)*attenuation2;",
  "  float spec=pow(max(dot(n,normalize(Ln+view)),0.),14.)*attenuation;",
  "  float spec2=pow(max(dot(n,normalize(Ln2+view)),0.),19.)*attenuation2;",
  "  float rim=pow(1.-max(dot(n,view),0.),3.6);",
  "  vec2 mouse=(uTrail[0].xy-0.5)*vec2(uResolution.x/uResolution.y,1.0)*3.15;",
  "  vec3 mouseLight=normalize(vec3(mouse-p.xy,1.35));",
  "  float touch=pow(max(dot(n,normalize(mouseLight+view)),0.),11.)",
  "        *exp(-dot(p.xy-mouse,p.xy-mouse)*.88)*uActive;",
  "",
  "  vec3 rose=vec3(1.,.022,.37);",
  "  vec3 pink=vec3(1.,.10,.66);",
  "  vec3 violet=vec3(.42,.025,1.);",
  "  vec3 base=vec3(.010,.002,.018);",
  "  float shadows=smoothstep(-.32,.55,dot(n,normalize(vec3(-.35,.5,.78))));",
  "  vec3 color=base+rose*(.013+.044*shadows);",
  "  color+=rose*(2.05*pow(diffuse,1.55)+.82*spec);",
  "  color+=violet*(.20*pow(secondary,1.50)+.34*spec2+.031*rim);",
  "  color+=pink*(.20*pow(diffuse,2.)+.15*spec);",
  "  color+=mix(rose,violet,.35+.3*sin(t*.7))*(.55*touch);",
  "  color*=mix(.10,1.0,shadows);",
  "  float lens=1.0-smoothstep(.52,1.65,length(uv));",
  "  color*=lens;",
  "  gl_FragColor=vec4(min(color,vec3(1.)),.96);",
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
      const scale = Math.min(0.43, 820 / Math.max(window.innerWidth, window.innerHeight));
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform2f(u.resolution, canvas.width, canvas.height);
    };

    const draw = (time: number) => {
      frame = 0;
      if (!enabled.matches || document.hidden) return;

      // Reference animation morphs even while the cursor is stationary.
      frame = requestAnimationFrame(draw);
      if (time - tick < 42) return;
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
    frame = requestAnimationFrame(draw);
    field.dataset.rendered = "fluid";
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame && enabled.matches) {
        frame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointermove", fallback, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
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
