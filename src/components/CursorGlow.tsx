"use client";
import { useEffect, useRef } from "react";

// The flow texture carries velocity in RG, ink in B and pigment in A.
// All targets use filterable RGBA8, including on integrated GPUs.
const common = `
precision highp float;
varying vec2 uv;
uniform sampler2D flow, pressure;
uniform vec2 cell, aspect, fromPoint, toPoint, impulse;
uniform float dt, strength;
const float zero = 128./255.;
vec2 velocity(vec2 p){return (texture2D(flow,p).rg-zero)*18.;}
float pr(vec2 p){return (texture2D(pressure,p).r-zero)*18.;}
float divergence(vec2 p){
 return .5*(velocity(p+vec2(cell.x,0)).x-velocity(p-vec2(cell.x,0)).x
           +velocity(p+vec2(0,cell.y)).y-velocity(p-vec2(0,cell.y)).y);
}
`;
const solve = `void main(){
 vec2 x=vec2(cell.x,0),y=vec2(0,cell.y);
 float p=(pr(uv-x)+pr(uv+x)+pr(uv-y)+pr(uv+y)-divergence(uv))*.25;
 gl_FragColor=vec4(zero+p/18.,0,0,1);
}`;
const transport = `void main(){
 vec2 x=vec2(cell.x,0), y=vec2(0,cell.y);
 vec2 back=uv-velocity(uv)*cell*dt;
 vec4 sampleInk=texture2D(flow,back);
 vec2 v=(sampleInk.rg-zero)*18.;
 v-=.5*vec2(pr(back+x)-pr(back-x),pr(back+y)-pr(back-y));
 vec2 path=(toPoint-fromPoint)*aspect, q=(uv-fromPoint)*aspect;
 float along=clamp(dot(q,path)/max(.000001,dot(path,path)),0.,1.);
 vec2 r=q-path*along;
 float radius=.070+.045*strength;
 float brush=exp(-dot(r,r)/(radius*radius));
 vec2 axis=normalize(impulse+vec2(.00001));
 vec2 side=vec2(-axis.y,axis.x);
 float flank=dot(r,side)/radius;
 // Opposite rotations on the two sides roll a swept stroke back into itself.
 vec2 swirl=vec2(-r.y,r.x)/radius*flank;
 v=v*pow(.982,dt)+brush*strength*(impulse*.68+swirl*2.4);
 float injected=brush*strength*.48;
 float ink=sampleInk.b*pow(.979,dt);
 float pigment=mix(sampleInk.a,smoothstep(.30,.72,toPoint.x),injected/max(.001,ink+injected));
 gl_FragColor=vec4(clamp(v/18.+zero,0.,1.),min(1.,ink+injected*(1.-ink)),pigment);
}`;
const display = `void main(){
 float d=texture2D(flow,uv).b;
 vec2 e=cell*2.8;
 vec2 slope=vec2(texture2D(flow,uv+vec2(e.x,0)).b-texture2D(flow,uv-vec2(e.x,0)).b,
                 texture2D(flow,uv+vec2(0,e.y)).b-texture2D(flow,uv-vec2(0,e.y)).b);
 vec3 normal=normalize(vec3(-slope*8.,.43));
 float light=max(0.,dot(normal,normalize(vec3(-.55,.58,.32))));
 float rim=smoothstep(.015,.22,length(slope));
 float hot=smoothstep(.48,.95,d);
 float energy=clamp(d*(.13+.64*light)+rim*light*.5+hot*.4,0.,.94);
 vec3 color=mix(vec3(1.,.01,.55),vec3(.48,.035,1.),texture2D(flow,uv).a);
 gl_FragColor=vec4(color,energy*smoothstep(.025,.10,d));
}`;

export default function CursorGlow(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current!;
  const field=canvas.parentElement!;
  const media=matchMedia("(prefers-reduced-motion:no-preference)");
  const gl=media.matches ? canvas.getContext("webgl",{alpha:true,premultipliedAlpha:false,depth:false,antialias:false}):null;
  if(!gl)return;
  const resources:(()=>void)[]=[];
  const dispose=()=>resources.reverse().forEach(release=>release());
  function shader(type:number,source:string){
   const obj=gl!.createShader(type)!;resources.push(()=>gl!.deleteShader(obj));
   gl!.shaderSource(obj,source);gl!.compileShader(obj);
   if(!gl!.getShaderParameter(obj,gl!.COMPILE_STATUS))throw Error("Shader unavailable");
   return obj;
  }
  function program(body:string,vertex:WebGLShader){
   const p=gl!.createProgram()!;resources.push(()=>gl!.deleteProgram(p));
   gl!.attachShader(p,vertex);gl!.attachShader(p,shader(gl!.FRAGMENT_SHADER,common+body));gl!.bindAttribLocation(p,0,"pos");gl!.linkProgram(p);
   if(!gl!.getProgramParameter(p,gl!.LINK_STATUS))throw Error("Program unavailable");
   const keys=["flow","pressure","cell","aspect","fromPoint","toPoint","impulse","strength","dt"] as const;
   const u=Object.fromEntries(keys.map(k=>[k,gl!.getUniformLocation(p,k)]));
   gl!.useProgram(p);gl!.uniform1i(u.flow,0);gl!.uniform1i(u.pressure,1);
   return {p,u};
  }
  function target(){
   const tex=gl!.createTexture()!,fb=gl!.createFramebuffer()!;
   resources.push(()=>{gl!.deleteTexture(tex);gl!.deleteFramebuffer(fb);});
   gl!.bindTexture(gl!.TEXTURE_2D,tex);
   for(const key of [gl!.TEXTURE_MIN_FILTER,gl!.TEXTURE_MAG_FILTER])gl!.texParameteri(gl!.TEXTURE_2D,key,gl!.LINEAR);
   for(const key of [gl!.TEXTURE_WRAP_S,gl!.TEXTURE_WRAP_T])gl!.texParameteri(gl!.TEXTURE_2D,key,gl!.CLAMP_TO_EDGE);
   return {tex,fb};
  }
  try {
   const vert=shader(gl.VERTEX_SHADER,"attribute vec2 pos;varying vec2 uv;void main(){uv=pos*.5+.5;gl_Position=vec4(pos,0,1);}");
   const pressurePass=program(solve,vert),flowPass=program(transport,vert),displayPass=program(display,vert);
   const mesh=gl.createBuffer();resources.push(()=>gl.deleteBuffer(mesh));gl.bindBuffer(gl.ARRAY_BUFFER,mesh);
   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
   const fluid=[target(),target()],pressure=[target(),target()];
   let w=0,h=0,fi=0,pi=0,frame=0,lastFrame=0,lastMove=0;
   let x=.5,y=.5,oldX=x,oldY=y,lit:HTMLElement|null=null;
   function resize(){
    const scale=Math.min(1,420/innerHeight,800/innerWidth);
    w=Math.max(8,Math.round(innerWidth*scale));h=Math.max(8,Math.round(innerHeight*scale));
    canvas.width=Math.round(Math.min(innerWidth*Math.min(devicePixelRatio,2),2048));canvas.height=Math.max(1,Math.round(canvas.width*innerHeight/innerWidth));
    for(const t of [...fluid,...pressure]){
     gl!.bindTexture(gl!.TEXTURE_2D,t.tex);gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGBA,w,h,0,gl!.RGBA,gl!.UNSIGNED_BYTE,null);
     gl!.bindFramebuffer(gl!.FRAMEBUFFER,t.fb);gl!.framebufferTexture2D(gl!.FRAMEBUFFER,gl!.COLOR_ATTACHMENT0,gl!.TEXTURE_2D,t.tex,0);
     gl!.clearColor(128/255,128/255,0,0);gl!.clear(gl!.COLOR_BUFFER_BIT);
    }
    gl!.bindFramebuffer(gl!.FRAMEBUFFER,null);gl!.clearColor(0,0,0,0);gl!.clear(gl!.COLOR_BUFFER_BIT);
   }
   function pass(s:typeof flowPass,fb:WebGLFramebuffer|null){
    gl!.useProgram(s.p);gl!.bindFramebuffer(gl!.FRAMEBUFFER,fb);
    gl!.activeTexture(gl!.TEXTURE0);gl!.bindTexture(gl!.TEXTURE_2D,fluid[fi].tex);
    gl!.activeTexture(gl!.TEXTURE1);gl!.bindTexture(gl!.TEXTURE_2D,pressure[pi].tex);
    gl!.uniform2f(s.u.cell,1/w,1/h);
   }
   function draw(t:number){
    frame=0;
    if(document.hidden||!media.matches||t-lastMove>3900){resize();return;}
    frame=requestAnimationFrame(draw);
    if(t-lastFrame<16)return;
    const dt=Math.min(2,(t-lastFrame)/16.67);lastFrame=t;
    gl!.viewport(0,0,w,h);
    for(let n=0;n<6;n++){pass(pressurePass,pressure[1-pi].fb);gl!.drawArrays(gl!.TRIANGLES,0,3);pi=1-pi;}
    pass(flowPass,fluid[1-fi].fb);
    const nx=oldX+(x-oldX)*(1-Math.exp(-.66*dt)),ny=oldY+(y-oldY)*(1-Math.exp(-.66*dt));
    const dx=(nx-oldX)*w,dy=(ny-oldY)*h,dist=Math.hypot(dx,dy);
    const scale=Math.min(1,6/Math.max(.01,dist));
    gl!.uniform2f(flowPass.u.aspect,w/h,1);gl!.uniform2f(flowPass.u.fromPoint,oldX,oldY);gl!.uniform2f(flowPass.u.toPoint,nx,ny);
    gl!.uniform2f(flowPass.u.impulse,dx*scale,dy*scale);gl!.uniform1f(flowPass.u.strength,Math.min(1,dist*.38));gl!.uniform1f(flowPass.u.dt,dt);
    gl!.drawArrays(gl!.TRIANGLES,0,3);fi=1-fi;oldX=nx;oldY=ny;
    pass(displayPass,null);gl!.viewport(0,0,canvas.width,canvas.height);gl!.drawArrays(gl!.TRIANGLES,0,3);
   }
   function track(clientX:number,clientY:number){
    if(!media.matches)return;
    const now=performance.now();x=clientX/innerWidth;y=1-clientY/innerHeight;
    if(now-lastMove>500){oldX=x;oldY=y;}
    lastMove=now;
    if(!frame)frame=requestAnimationFrame(draw);
   }
   function touch(e:TouchEvent){const t=e.touches[0];if(t)track(t.clientX,t.clientY);}
   function move(e:PointerEvent){
    if(e.pointerType==="touch")return;
    track(e.clientX,e.clientY);
    const card=e.target instanceof Element?e.target.closest<HTMLElement>(".card-hover,.reel-image"):null;
    if(card!==lit){lit?.removeAttribute("data-lit");card?.setAttribute("data-lit","");lit=card;}
    if(card){const rect=card.getBoundingClientRect();card.style.setProperty("--sheen-x",e.clientX-rect.x+"px");card.style.setProperty("--sheen-y",e.clientY-rect.y+"px");}
    if(!frame)frame=requestAnimationFrame(draw);
   }
   window.addEventListener("touchstart",touch,{passive:true});window.addEventListener("touchmove",touch,{passive:true});
   resize();field.dataset.rendered="ink-flow";
   window.addEventListener("pointermove",move,{passive:true});window.addEventListener("resize",resize);
   return ()=>{window.removeEventListener("touchstart",touch);window.removeEventListener("touchmove",touch);cancelAnimationFrame(frame);window.removeEventListener("pointermove",move);window.removeEventListener("resize",resize);lit?.removeAttribute("data-lit");delete field.dataset.rendered;dispose();};
  }catch{dispose();}
 },[]);
 return <div className="liquid-field" aria-hidden="true"><canvas ref={ref}/></div>;
}
