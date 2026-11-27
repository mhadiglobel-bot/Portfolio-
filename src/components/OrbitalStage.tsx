"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Edges, Float, RoundedBox, Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "@/lib/projects";
import styles from "./PortfolioSections.module.css";

type Props = { position: number; projects: Project[]; reduced?: boolean };

const landPolygons: number[][][] = [
  [[-168,72],[-145,70],[-130,58],[-125,48],[-124,39],[-117,32],[-108,25],[-98,18],[-88,18],[-82,25],[-80,32],[-68,44],[-56,52],[-70,62],[-95,72],[-125,76],[-150,75]],
  [[-82,12],[-69,10],[-55,-2],[-48,-15],[-53,-28],[-61,-40],[-69,-56],[-77,-48],[-80,-27],[-78,-5]],
  [[-18,36],[-5,37],[9,36],[23,33],[34,30],[44,12],[39,-5],[31,-22],[19,-35],[7,-34],[-2,-18],[-12,-2],[-17,18]],
  [[-10,36],[-8,50],[2,58],[18,70],[38,72],[55,67],[75,74],[99,72],[122,62],[145,57],[166,62],[179,50],[166,39],[145,35],[128,25],[112,17],[96,8],[80,8],[70,20],[58,25],[48,39],[35,37],[26,42],[15,37],[7,43]],
  [[112,-10],[126,-9],[143,-13],[154,-24],[147,-39],[132,-44],[116,-35],[113,-22]],
  [[-52,82],[-24,82],[-18,72],[-35,59],[-52,62],[-60,72]],
];

function pointInPolygon(lon: number, lat: number, polygon: number[][]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const crosses = (yi > lat) !== (yj > lat) &&
      lon < ((xj - xi) * (lat - yi)) / ((yj - yi) || 0.00001) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

function createLandGeometry() {
  const positions: number[] = [];
  const radius = 1.52;
  for (let lat = -78; lat <= 82; lat += 4.8) {
    for (let lon = -180; lon <= 180; lon += 4.8) {
      if (!landPolygons.some((polygon) => pointInPolygon(lon, lat, polygon))) continue;
      const phi = THREE.MathUtils.degToRad(lat);
      const theta = THREE.MathUtils.degToRad(lon);
      positions.push(radius * Math.cos(phi) * Math.sin(theta), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(theta));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function Globe({ position, reduced }: { position: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const land = useMemo(createLandGeometry, []);
  useEffect(() => () => land.dispose(), [land]);
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const target = position * 0.11 + (reduced ? 0 : clock.elapsedTime * 0.018);
    if (reduced) {
      group.current.rotation.y = target;
      group.current.rotation.x = -0.08;
      return;
    }
    group.current.rotation.y += (target - group.current.rotation.y) * Math.min(1, delta * 4);
    group.current.rotation.x = -0.08 + Math.sin(clock.elapsedTime * 0.13) * 0.012;
  });
  return (
    <group ref={group}>
      <mesh><sphereGeometry args={[1.5,64,64]} /><meshPhysicalMaterial color="#0a0712" metalness={0.5} roughness={0.42} clearcoat={0.9} transparent opacity={0.94} /></mesh>
      <points geometry={land}><pointsMaterial color="#ee72f5" size={0.024} sizeAttenuation transparent opacity={0.88} depthWrite={false} /></points>
      {[-66,-44,-22,0,22,44,66].map((latitude) => {
        const radians = THREE.MathUtils.degToRad(latitude);
        return <mesh key={latitude} position={[0,Math.sin(radians)*1.505,0]} rotation={[Math.PI/2,0,0]}>
          <torusGeometry args={[Math.cos(radians)*1.505,0.0028,4,112]} />
          <meshBasicMaterial color="#a76bff" transparent opacity={0.25} />
        </mesh>;
      })}
      {Array.from({length:12},(_,index)=><mesh key={index} rotation={[0,(index*Math.PI)/12,0]}>
        <torusGeometry args={[1.505,0.0025,4,112]} /><meshBasicMaterial color="#d36aff" transparent opacity={0.24} />
      </mesh>)}
      <mesh scale={1.515}><sphereGeometry args={[1,48,48]} /><meshBasicMaterial color="#8c42c8" transparent opacity={0.035} side={THREE.BackSide} depthWrite={false} /></mesh>
    </group>
  );
}

function OrbitalRings({ reduced }: { reduced: boolean }) {
  const rings = useRef<THREE.Group>(null);
  useFrame(({clock},delta) => {
    if (!rings.current || reduced) return;
    rings.current.rotation.z = Math.sin(clock.elapsedTime*0.16)*0.045;
    rings.current.rotation.x = 0.08 + Math.sin(clock.elapsedTime*0.11)*0.025;
    rings.current.rotation.y += delta*0.035;
  });
  return <group ref={rings}>
    <mesh rotation={[1.12,0.12,-0.18]} scale={[1.13,0.76,1]}><torusGeometry args={[2.34,0.012,6,220]} /><meshBasicMaterial color="#ff4fc8" /></mesh>
    <mesh rotation={[1.12,0.12,-0.18]} scale={[1.13,0.76,1]}><torusGeometry args={[2.34,0.042,6,220]} /><meshBasicMaterial color="#f02ab5" transparent opacity={0.105} /></mesh>
    <mesh rotation={[0.62,-0.55,0.88]} scale={[1.04,0.86,1]}><torusGeometry args={[2.72,0.007,6,220]} /><meshBasicMaterial color="#a76aff" transparent opacity={0.78} /></mesh>
    <mesh rotation={[1.5,0.75,-0.2]} scale={[1.02,0.7,1]}><torusGeometry args={[2.9,0.006,6,220]} /><meshBasicMaterial color="#f6a2e8" transparent opacity={0.48} /></mesh>
  </group>;
}

function ProjectPanel({ project, index, position, count, reduced }: { project: Project; index: number; position: number; count: number; reduced: boolean }) {
  const texture = useTexture(project.image);
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);
  const angle = (index/count)*Math.PI*2;
  const relative = (index-position)*(Math.PI*2/count);
  const diff = Math.abs(index-position)%count;
  const distance = Math.min(diff,count-diff);
  const scale = 1.12-Math.min(2,distance)*0.19;
  return <Float speed={reduced?0:0.7+index*0.08} floatIntensity={reduced?0:0.045} rotationIntensity={reduced?0:0.018}>
    <group position={[Math.sin(angle)*2.72,Math.sin(relative*1.6)*0.38,Math.cos(angle)*2.62]} rotation={[0,angle,0]} scale={scale}>
      <mesh position={[0,0,-0.025]}>
        <RoundedBox args={[1.96,1.26,0.11]} radius={0.1} smoothness={5}>
          <meshPhysicalMaterial color="#100a18" metalness={0.72} roughness={0.2} clearcoat={1} emissive={project.accent} emissiveIntensity={0.12} />
          <Edges scale={1.012} threshold={12} color={project.accent} />
        </RoundedBox>
      </mesh>
      <mesh position={[0,0,0.034]}><planeGeometry args={[1.87,1.17]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
      <mesh position={[0.82,0.53,0.045]}><sphereGeometry args={[0.025,12,12]} /><meshBasicMaterial color={project.accent} /></mesh>
      <mesh position={[0,-0.64,0.015]}><boxGeometry args={[0.76,0.012,0.016]} /><meshBasicMaterial color={project.accent} transparent opacity={0.76} /></mesh>
    </group>
  </Float>;
}

function Scene({ position, projects, reduced = false }: Props) {
  const orbit = useRef<THREE.Group>(null);
  const { size } = useThree();
  const step = (Math.PI*2)/projects.length;
  const sceneScale = size.width<580?0.68:size.width<850?0.82:size.width<1150?0.92:1;
  useFrame((_,delta) => {
    if (!orbit.current) return;
    const target = -position*step;
    if (reduced) {
      orbit.current.rotation.y = target;
      return;
    }
    orbit.current.rotation.y += (target-orbit.current.rotation.y)*Math.min(1,delta*5.5);
  });
  return <>
    <group scale={sceneScale}>
      <ambientLight intensity={0.72} />
      <pointLight position={[0,1.8,4.6]} color="#ff62ce" intensity={18} distance={10} decay={2} />
      <pointLight position={[-4,2.5,-2]} color="#9b5bff" intensity={15} distance={9} decay={2} />
      <pointLight position={[4,-1.5,1]} color="#d33cce" intensity={7} distance={7} decay={2} />
      <Globe position={position} reduced={reduced} />
      <OrbitalRings reduced={reduced} />
      <group ref={orbit}>
        {projects.map((project,index)=><ProjectPanel key={project.href} project={project} index={index} position={position} count={projects.length} reduced={reduced} />)}
      </group>
      <Sparkles count={95} scale={[6.8,4.2,6.8]} size={1.5} speed={reduced?0:0.22} color="#f28ce8" opacity={0.58} />
      <Sparkles count={30} scale={[5.2,3.4,5.2]} size={2.4} speed={reduced?0:0.12} color="#9b6cff" opacity={0.42} />
    </group>
    <EffectComposer multisampling={0}><Bloom intensity={0.72} luminanceThreshold={0.82} luminanceSmoothing={0.18} mipmapBlur /></EffectComposer>
  </>;
}

export default function OrbitalStage({ position, projects, reduced = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [visible,setVisible] = useState(true);
  useEffect(() => {
    const element=host.current;
    if(!element || typeof IntersectionObserver==="undefined") return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:"180px"});
    observer.observe(element);
    return ()=>observer.disconnect();
  },[]);
  return <div ref={host} className={styles.sceneCanvas} aria-label="Interactive three-dimensional project globe">
    <Canvas dpr={[1,1.5]} frameloop={visible&&!reduced?"always":"demand"}
      camera={{position:[0,0,9.6],fov:37,near:0.1,far:60}}
      gl={{alpha:true,antialias:true,powerPreference:"high-performance"}}
      onCreated={({gl})=>{gl.outputColorSpace=THREE.SRGBColorSpace;gl.setClearColor(0x000000,0);}}>
      <Suspense fallback={null}><Scene position={position} projects={projects} reduced={reduced} /></Suspense>
    </Canvas>
  </div>;
}
