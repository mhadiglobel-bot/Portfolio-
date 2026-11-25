"use client";
import { useEffect, useRef } from "react";

// A continuous light field, bent by three time scales of pointer motion.
const fragment = `
precision mediump float;
uniform vec2 size, head, middle, tail;
uniform float phase, gain;
void main(){
 vec2 uv=gl_FragCoord.xy/size;
 vec2 ratio=vec2(size.x/size.y,1.);
 vec2 p=(uv-.5)*ratio;
 vec2 a=(head-.5)*ratio, b=(middle-.5)*ratio, c=(tail-.5)*ratio;
 vec2 d=a-c;
 p-=.38*a+.25*b;
 p+=d*.58*exp(-2.*dot(p-b,p-b));
 float bend=sin(p.y*2.6+p.x*1.35+phase)*.68+sin(p.x*2.1-p.y*1.55-phase*.46)*.34;
 float sheet=p.y*1.58+.65*p.x + bend + sin(p.x*3.8+b.y*2.4+phase*.55)*.20;
 float wash=exp(-sheet*sheet*2.);
 float lip=exp(-abs(sheet+.13)*7.);
 float shade=.20+.8*smoothstep(-.45,.50,p.x+sin(p.y*2.4+phase)*.5+dot(d,vec2(1.,.5)));
 float light=(wash*.18+lip*.36)*shade*gain;
 vec3 color=mix(vec3(1.,.085,.46),vec3(.54,.20,1.),smoothstep(.26,.75,uv.x));
 gl_FragColor=vec4(color,light);
}`;

export default function CursorGlow(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current!;
  const gl=canvas.getContext("webgl",{alpha:true,premultipliedAlpha:false,antialias:false,depth:false});
  if(!gl)return;
  const program=gl.createProgram()!;
  const shaders=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((type,i)=>{
   const shader=gl.createShader(type)!;
   gl.shaderSource(shader,i?fragment:"attribute vec2 pos;void main(){gl_Position=vec4(pos,0.,1.);}");
   gl.compileShader(shader);gl.attachShader(program,shader);return shader;
  });
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,"pos");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const loc=(key:string)=>gl.getUniformLocation(program,key);
  const u={size:loc("size"),head:loc("head"),middle:loc("middle"),tail:loc("tail"),phase:loc("phase"),gain:loc("gain")};
  const enabled=matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
  const aim=[.5,.5],head=[...aim],mid=[...aim],tail=[...aim];
  let frame=0,last=0,tick=0,phase=0,lit:HTMLElement|null=null;
  function draw(t:number){
   frame=0;
   if(!enabled.matches || document.hidden || t-last>2700){gl!.clear(gl!.COLOR_BUFFER_BIT);return;}
   frame=requestAnimationFrame(draw);
   if(t-tick<24)return;
   const dt=Math.min(48,t-tick);tick=t;phase+=dt*.00024;
   for(let k=0;k<2;k++){head[k]+=(aim[k]-head[k])*.28;mid[k]+=(head[k]-mid[k])*.12;tail[k]+=(mid[k]-tail[k])*.07;}
   gl!.uniform2fv(u.head,head);gl!.uniform2fv(u.middle,mid);gl!.uniform2fv(u.tail,tail);gl!.uniform1f(u.phase,phase);
   gl!.uniform1f(u.gain,Math.exp(-Math.max(0,t-last-160)/570));gl!.drawArrays(gl!.TRIANGLES,0,3);
  }
  function resize(){const scale=Math.min(.7,1152/innerWidth);canvas.width=Math.round(innerWidth*scale);canvas.height=Math.round(innerHeight*scale);gl!.viewport(0,0,canvas.width,canvas.height);gl!.uniform2f(u.size,canvas.width,canvas.height);}
  function move(e:PointerEvent){
   if(!enabled.matches)return;
   aim[0]=e.clientX/innerWidth;aim[1]=1-e.clientY/innerHeight;last=performance.now();
   const card=(e.target as Element).closest<HTMLElement>(".card-hover,.reel-image");
   if(lit!==card){lit?.removeAttribute("data-lit");card?.setAttribute("data-lit","");lit=card;}
   if(card){const b=card.getBoundingClientRect();card.style.setProperty("--sheen-x",e.clientX-b.x+"px");card.style.setProperty("--sheen-y",e.clientY-b.y+"px");}
   if(!frame)frame=requestAnimationFrame(draw);
  }
  resize();window.addEventListener("resize",resize);window.addEventListener("pointermove",move,{passive:true});
  return ()=>{cancelAnimationFrame(frame);window.removeEventListener("resize",resize);window.removeEventListener("pointermove",move);gl.deleteBuffer(buffer);shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);};
 },[]);
 return <div className="liquid-field" data-rendered="silk" aria-hidden="true"><canvas ref={ref}/></div>;
}
