"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html, Line, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import styles from "./PortfolioSections.module.css";

type Props = { active: number; reduced?: boolean };
const stations = [
  { position: [-2.55,0,0.72] as [number,number,number], color: "#ff5bc8" },
  { position: [0,0,2.35] as [number,number,number], color: "#bd7bff" },
  { position: [2.55,0,0.72] as [number,number,number], color: "#ed5ed5" },
  { position: [-1.65,0,-1.72] as [number,number,number], color: "#a879ff" },
  { position: [1.65,0,-1.72] as [number,number,number], color: "#ff85d3" },
];

function Platform({ color, active }: { color: string; active: boolean }) {
  return <group>
    <mesh position={[0,-0.72,0]}><cylinderGeometry args={[0.72,0.78,0.17,64]} /><meshPhysicalMaterial color="#120b1b" metalness={0.82} roughness={0.2} clearcoat={1} emissive={color} emissiveIntensity={active?0.22:0.06} /></mesh>
    <mesh position={[0,-0.625,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[0.66,0.018,8,72]} /><meshBasicMaterial color={color} transparent opacity={active?0.98:0.52} /></mesh>
    <mesh position={[0,-0.615,0]}><cylinderGeometry args={[0.57,0.63,0.035,64]} /><meshStandardMaterial color="#28112d" metalness={0.72} roughness={0.25} /></mesh>
  </group>;
}

function WebObject({ color }: { color: string }) {
  return <group position={[0,-0.02,0]}>
    <RoundedBox args={[0.9,0.62,0.075]} radius={0.07} smoothness={5}>
      <meshPhysicalMaterial color="#130c20" metalness={0.58} roughness={0.17} transparent opacity={0.96} emissive={color} emissiveIntensity={0.18} />
      <Edges scale={1.012} color={color} />
    </RoundedBox>
    <Html transform position={[0,0,0.055]} distanceFactor={7.5} occlude={false}>
      <div style={{color:"#ffeaff",font:"700 38px/1 ui-monospace,monospace",textShadow:"0 0 12px #ff4fc8,0 0 24px #b45aff",whiteSpace:"nowrap"}}>&lt;/&gt;</div>
    </Html>
    <mesh position={[0,-0.38,0]}><boxGeometry args={[0.6,0.035,0.08]} /><meshStandardMaterial color="#32143a" metalness={0.6} roughness={0.25} /></mesh>
  </group>;
}

function UiObject({ color }: { color: string }) {
  return <group position={[0,0.08,0]}>
    <mesh position={[-0.11,0.12,-0.1]} rotation={[0.02,-0.12,0.04]}><planeGeometry args={[0.66,0.48]} /><meshPhysicalMaterial color="#291234" transparent opacity={0.36} metalness={0.55} roughness={0.15} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.04,0.04,0]}><planeGeometry args={[0.68,0.5]} /><meshPhysicalMaterial color="#1a1026" transparent opacity={0.82} metalness={0.62} roughness={0.16} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.04,0.04,0.012]}><planeGeometry args={[0.59,0.41]} /><meshBasicMaterial color="#25102f" transparent opacity={0.78} /></mesh>
    <Html transform position={[0.03,0.06,0.035]} distanceFactor={7.4} occlude={false}>
      <div style={{color:"#fff0ff",font:"700 30px/1 ui-monospace,monospace",textShadow:`0 0 14px ${color}`}}>✣</div>
    </Html>
    <mesh position={[0.34,-0.19,0.08]} rotation={[0,0,-0.38]}><coneGeometry args={[0.07,0.24,3]} /><meshBasicMaterial color="#f6d7ff" /></mesh>
  </group>;
}

function AiObject({ color }: { color: string }) {
  const nodes = useMemo(() => {
    const items: [number,number,number][] = [];
    for(let i=0;i<15;i++){
      const phi=Math.acos(-1+(2*(i+0.5))/15);
      const theta=Math.PI*(1+Math.sqrt(5))*i;
      items.push([Math.cos(theta)*Math.sin(phi)*0.42,Math.cos(phi)*0.42,Math.sin(theta)*Math.sin(phi)*0.42]);
    }
    return items;
  },[]);
  const connections = useMemo(() => nodes.slice(0,10).map((point,index)=>[point,nodes[(index*3+4)%nodes.length]] as [[number,number,number],[number,number,number]]),[nodes]);
  return <group position={[0,0.06,0]}>
    <mesh><icosahedronGeometry args={[0.28,2]} /><meshPhysicalMaterial color="#271032" metalness={0.5} roughness={0.18} emissive={color} emissiveIntensity={0.42} transparent opacity={0.78} wireframe /></mesh>
    {connections.map((pair,index)=><Line key={index} points={pair} color={color} lineWidth={1.2} transparent opacity={0.78} />)}
    {nodes.map((point,index)=><mesh key={index} position={point}><sphereGeometry args={[index%4===0?0.045:0.026,12,12]} /><meshBasicMaterial color={index%3===0?"#fff0ff":color} /></mesh>)}
    <mesh><sphereGeometry args={[0.12,20,20]} /><meshBasicMaterial color="#f6b9ff" /></mesh>
  </group>;
}

function DatabaseObject({ color }: { color: string }) {
  return <group position={[0,0.02,0]}>
    {[0,1,2].map((index)=><group key={index} position={[0,index*0.19-0.13,0]}>
      <mesh><cylinderGeometry args={[0.32,0.32,0.16,40,1,false]} /><meshPhysicalMaterial color="#1a1026" metalness={0.78} roughness={0.2} emissive={color} emissiveIntensity={0.13} /><Edges color={color} threshold={18} /></mesh>
      <mesh position={[0,0.081,0]}><torusGeometry args={[0.315,0.012,6,48]} /><meshBasicMaterial color={color} /></mesh>
    </group>)}
  </group>;
}

function SeoObject({ color }: { color: string }) {
  const curve = useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42,-0.1,0.05),new THREE.Vector3(-0.2,0.08,0.05),
    new THREE.Vector3(0.02,0.2,0.05),new THREE.Vector3(0.25,0.34,0.05),new THREE.Vector3(0.43,0.52,0.05),
  ]),[]);
  return <group position={[0,-0.05,0]}>
    {[0,1,2,3].map((index)=><mesh key={index} position={[-0.38+index*0.25,-0.26+index*0.115,0]}>
      <boxGeometry args={[0.13,0.28+index*0.12,0.12]} /><meshPhysicalMaterial color="#21112d" metalness={0.72} roughness={0.2} emissive={color} emissiveIntensity={0.16} />
    </mesh>)}
    <mesh><tubeGeometry args={[curve,40,0.012,6,false]} /><meshBasicMaterial color={color} /></mesh>
    <mesh position={[0.43,0.52,0.05]}><sphereGeometry args={[0.045,12,12]} /><meshBasicMaterial color="#fff0ff" /></mesh>
  </group>;
}

function Station({ index, active, reduced }: { index: number; active: boolean; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const station = stations[index];
  const color = station.color;
  useFrame(({clock},delta)=>{
    if(!ref.current)return;
    const target=active?1.07:1;
    const next=ref.current.scale.x+(target-ref.current.scale.x)*Math.min(1,delta*4.5);
    ref.current.scale.setScalar(next);
    ref.current.position.y=reduced?0:Math.sin(clock.elapsedTime*0.8+index*1.2)*0.035;
    ref.current.rotation.y=reduced?0:Math.sin(clock.elapsedTime*0.25+index)*0.035;
  });
  return <group ref={ref} position={station.position}>
    <Platform color={color} active={active} />
    {index===0&&<WebObject color={color} />}
    {index===1&&<UiObject color={color} />}
    {index===2&&<AiObject color={color} />}
    {index===3&&<DatabaseObject color={color} />}
    {index===4&&<SeoObject color={color} />}
  </group>;
}

function CentralCore({ reduced }: { reduced: boolean }) {
  const ref=useRef<THREE.Group>(null);
  useFrame(({clock},delta)=>{
    if(!ref.current)return;
    if(!reduced){
      ref.current.rotation.y+=delta*0.14;
      ref.current.position.y=0.45+Math.sin(clock.elapsedTime*0.65)*0.055;
    } else {
      ref.current.rotation.y=0;
      ref.current.position.y=0.45;
    }
  });
  return <group ref={ref} position={[0,0.45,0]}>
    <mesh>
      <RoundedBox args={[0.82,0.82,0.82]} radius={0.1} smoothness={6}>
        <meshPhysicalMaterial color="#1a0d28" metalness={0.76} roughness={0.16} clearcoat={1} emissive="#a22cff" emissiveIntensity={0.5} />
        <Edges scale={1.015} color="#d88aff" />
      </RoundedBox>
    </mesh>
    <Html transform position={[0,0,0.43]} distanceFactor={6.8} occlude={false}>
      <div style={{color:"#fff1ff",font:"700 35px/1 ui-monospace,monospace",textShadow:"0 0 12px #f44bc8,0 0 28px #a44dff"}}>&lt;/&gt;</div>
    </Html>
    <mesh scale={1.18}><sphereGeometry args={[0.56,28,28]} /><meshBasicMaterial color="#e84ed2" transparent opacity={0.055} side={THREE.BackSide} /></mesh>
  </group>;
}

function SkillScene({ active, reduced = false }: Props) {
  const {size}=useThree();
  const sceneScale=size.width<520?0.58:size.width<680?0.78:1;
  const paths=useMemo(()=>stations.map((station)=>{
    const [x,,z]=station.position;
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,-0.55,0),new THREE.Vector3(x*0.42,-0.46,z*0.42),
      new THREE.Vector3(x*0.78,-0.48,z*0.78),new THREE.Vector3(x,-0.48,z),
    ]);
  }),[]);
  return <group scale={sceneScale}>
      <ambientLight intensity={0.78} />
      <pointLight position={[0,4.5,5]} color="#ff65d1" intensity={22} distance={12} decay={2} />
      <pointLight position={[-4,2.5,-2]} color="#9d62ff" intensity={16} distance={10} decay={2} />
      <pointLight position={[4,1,1]} color="#e24bc5" intensity={10} distance={9} decay={2} />
      <mesh position={[0,-0.91,0]}><cylinderGeometry args={[3.75,3.9,0.14,96]} /><meshPhysicalMaterial color="#0d0813" metalness={0.8} roughness={0.24} clearcoat={1} /></mesh>
      <mesh position={[0,-0.82,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[3.62,0.018,8,128]} /><meshBasicMaterial color="#e64bc5" transparent opacity={0.75} /></mesh>
      {paths.map((curve,index)=><mesh key={index}><tubeGeometry args={[curve,48,0.009,6,false]} /><meshBasicMaterial color={stations[index].color} transparent opacity={active===index?0.92:0.38} /></mesh>)}
      {stations.map((_,index)=><Station key={index} index={index} active={active===index} reduced={reduced} />)}
      <CentralCore reduced={reduced} />
      <Sparkles count={70} scale={[7,2.5,7]} size={1.4} speed={reduced?0:0.2} color="#ee85e6" opacity={0.5} />
  </group>;
}

export default function SkillsStage({ active, reduced = false }: Props) {
  const host=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(true);
  useEffect(()=>{
    const element=host.current;
    if(!element||typeof IntersectionObserver==="undefined")return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:"160px"});
    observer.observe(element);
    return ()=>observer.disconnect();
  },[]);
  return <div ref={host} className={styles.skillCanvas} aria-label="Three-dimensional skills and expertise installation">
    <Canvas dpr={[1,1.4]} frameloop={visible&&!reduced?"always":"demand"}
      camera={{position:[0,5.3,9.2],fov:37,near:0.1,far:60}}
      gl={{alpha:true,antialias:true,powerPreference:"high-performance"}}
      onCreated={({gl})=>{gl.outputColorSpace=THREE.SRGBColorSpace;gl.setClearColor(0x000000,0);}}>
      <Suspense fallback={null}><SkillScene active={active} reduced={reduced} /></Suspense>
    </Canvas>
  </div>;
}
