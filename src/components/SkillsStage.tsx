"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html, Line, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import styles from "./PortfolioSections.module.css";

type Props = { active: number; reduced?: boolean };

const stations = [
  { position: [-2.12, 0, 0.38] as [number, number, number], color: "#ff5bc8" },
  { position: [-0.42, 0, -1.62] as [number, number, number], color: "#bd7bff" },
  { position: [2.12, 0, 0.38] as [number, number, number], color: "#ed5ed5" },
  { position: [-1.42, 0, 1.72] as [number, number, number], color: "#a879ff" },
  { position: [1.42, 0, 1.72] as [number, number, number], color: "#ff85d3" },
];

function Platform({ color, active }: { color: string; active: boolean }) {
  return (
    <group>
      <mesh position={[0, -1.22, 0]} rotation={[0.04, 0.16, -0.06]} scale={[1.28, 0.52, 1.0]}>
        <icosahedronGeometry args={[0.94, 0]} />
        <meshStandardMaterial color="#100b17" roughness={0.94} metalness={0.12} flatShading emissive={color} emissiveIntensity={active ? 0.07 : 0.025} />
      </mesh>
      <mesh position={[-0.48, -1.24, 0.16]} scale={[0.42, 0.28, 0.38]} rotation={[0.1, 0.3, 0.2]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#15101d" roughness={1} flatShading />
      </mesh>
      <mesh position={[0.46, -1.26, -0.18]} scale={[0.36, 0.24, 0.32]} rotation={[0.2, -0.2, -0.1]}>
        <dodecahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial color="#0d0915" roughness={1} flatShading />
      </mesh>
      <mesh position={[-0.34, -0.93, 0.22]} scale={[0.5, 0.19, 0.42]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#0b0811" roughness={1} flatShading />
      </mesh>
      <mesh position={[0.38, -0.94, -0.2]} scale={[0.42, 0.16, 0.36]}>
        <dodecahedronGeometry args={[0.52, 0]} />
        <meshStandardMaterial color="#15101d" roughness={0.96} flatShading />
      </mesh>
      <mesh position={[0, -0.66, 0]}>
        <cylinderGeometry args={[0.64, 0.72, 0.2, 64]} />
        <meshPhysicalMaterial color="#21112c" metalness={0.72} roughness={0.22} clearcoat={1} emissive={color} emissiveIntensity={active ? 0.32 : 0.12} />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.63, 0.016, 8, 80]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.98 : 0.62} />
      </mesh>
      <mesh position={[0, -0.53, 0]}>
        <cylinderGeometry args={[0.6, 0.62, 0.075, 64]} />
        <meshStandardMaterial color="#51265d" metalness={0.42} roughness={0.2} emissive={color} emissiveIntensity={0.24} />
      </mesh>
      <mesh position={[0, -0.49, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.009, 6, 64]} />
        <meshBasicMaterial color="#fff0ff" transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

function WebObject({ color }: { color: string }) {
  return (
    <group position={[0, 0.37, 0]}>
      <RoundedBox args={[0.88, 0.88, 0.88]} radius={0.1} smoothness={6}>
        <meshPhysicalMaterial color="#9b5bc0" metalness={0.12} roughness={0.1} transparent opacity={0.2} clearcoat={1} clearcoatRoughness={0.06} emissive={color} emissiveIntensity={0.28} />
        <Edges scale={1.012} color={color} />
      </RoundedBox>
      <Line points={[[-0.2, 0.15, 0.46], [-0.34, 0, 0.46], [-0.2, -0.15, 0.46]]} color="#fff0ff" lineWidth={2.6} />
      <Line points={[[0.2, 0.15, 0.46], [0.34, 0, 0.46], [0.2, -0.15, 0.46]]} color="#fff0ff" lineWidth={2.6} />
      <Line points={[[0.08, 0.2, 0.46], [-0.08, -0.2, 0.46]]} color="#fff0ff" lineWidth={2.6} />
      <mesh position={[0, -0.52, 0]}>
        <boxGeometry args={[0.54, 0.018, 0.54]} />
        <meshBasicMaterial color={color} transparent opacity={0.72} />
      </mesh>
    </group>
  );
}

function UiObject({ color }: { color: string }) {
  return (
    <group position={[0, 0.34, 0]}>
      <group position={[-0.14, 0.08, -0.12]} rotation={[0.06, -0.2, 0.08]}>
        <RoundedBox args={[0.92, 0.68, 0.055]} radius={0.055} smoothness={5}>
          <meshPhysicalMaterial color="#34143d" transparent opacity={0.3} metalness={0.2} roughness={0.12} clearcoat={1} />
          <Edges color={color} />
        </RoundedBox>
      </group>
      <group position={[0.12, 0, 0.08]}>
        <RoundedBox args={[0.9, 0.68, 0.07]} radius={0.055} smoothness={5}>
          <meshPhysicalMaterial color="#24102f" transparent opacity={0.55} metalness={0.35} roughness={0.14} clearcoat={1} emissive={color} emissiveIntensity={0.08} />
          <Edges color={color} />
        </RoundedBox>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.79, 0.55]} />
          <meshBasicMaterial color="#160c20" transparent opacity={0.9} />
        </mesh>
        <mesh position={[-0.24, 0.17, 0.06]}>
          <boxGeometry args={[0.28, 0.025, 0.012]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {[0, 1, 2].map((index) => (
          <mesh key={index} position={[-0.25 + index * 0.19, -0.04, 0.06]}>
            <boxGeometry args={[0.13, 0.18 + (index % 2) * 0.08, 0.012]} />
            <meshBasicMaterial color={index === 1 ? "#f8d8ff" : color} transparent opacity={0.78} />
          </mesh>
        ))}
        <mesh position={[0.22, -0.18, 0.06]}>
          <boxGeometry args={[0.22, 0.025, 0.012]} />
          <meshBasicMaterial color="#f5c7f0" transparent opacity={0.8} />
        </mesh>
      </group>
      <Html transform position={[0.42, -0.17, 0.2]} distanceFactor={6.4} occlude={false}>
        <div style={{ color: "#fff3ff", font: "700 40px/1 Arial,sans-serif", textShadow: "0 0 12px #ff5bc8" }}>↖</div>
      </Html>
    </group>
  );
}

function AiObject({ color }: { color: string }) {
  const nodes = useMemo(() => {
    const items: [number, number, number][] = [];
    for (let i = 0; i < 22; i++) {
      const phi = Math.acos(-1 + (2 * (i + 0.5)) / 22);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      items.push([
        Math.cos(theta) * Math.sin(phi) * 0.38,
        Math.cos(phi) * 0.38,
        Math.sin(theta) * Math.sin(phi) * 0.38,
      ]);
    }
    return items;
  }, []);
  const connections = useMemo(
    () => nodes.slice(0, 14).map((point, index) => [point, nodes[(index * 3 + 5) % nodes.length]] as [[number, number, number], [number, number, number]]),
    [nodes],
  );
  return (
    <group position={[0, 0.42, 0]}>
      <mesh>
        <sphereGeometry args={[0.58, 40, 40]} />
        <meshPhysicalMaterial color="#4c205e" transparent opacity={0.16} metalness={0.18} roughness={0.1} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[-0.15, 0.02, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshPhysicalMaterial color="#8c3caa" transparent opacity={0.24} emissive={color} emissiveIntensity={0.28} roughness={0.2} />
      </mesh>
      <mesh position={[0.15, 0.02, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshPhysicalMaterial color="#8c3caa" transparent opacity={0.24} emissive={color} emissiveIntensity={0.28} roughness={0.2} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.42, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.42} />
      </mesh>
      {connections.map((pair, index) => (
        <Line key={index} points={pair} color={color} lineWidth={1.25} transparent opacity={0.82} />
      ))}
      {nodes.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[index % 4 === 0 ? 0.045 : 0.026, 12, 12]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#fff0ff" : color} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshBasicMaterial color="#fff0ff" />
      </mesh>
    </group>
  );
}

function DatabaseObject({ color }: { color: string }) {
  return (
    <group position={[0, 0.24, 0]}>
      {[0, 1, 2].map((index) => (
        <group key={index} position={[0, index * 0.2 - 0.12, 0]}>
          <mesh>
            <cylinderGeometry args={[0.36, 0.36, 0.17, 48, 1, false]} />
            <meshPhysicalMaterial color="#1a1026" metalness={0.78} roughness={0.2} emissive={color} emissiveIntensity={0.18} />
            <Edges color={color} threshold={18} />
          </mesh>
          <mesh position={[0, 0.087, 0]}>
            <torusGeometry args={[0.35, 0.014, 6, 56]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.39, 0.08, 0.08]}>
        <boxGeometry args={[0.035, 0.28, 0.035]} />
        <meshBasicMaterial color="#fff0ff" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function SeoObject({ color }: { color: string }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.48, -0.16, 0.08),
      new THREE.Vector3(-0.22, 0.02, 0.08),
      new THREE.Vector3(0.02, 0.2, 0.08),
      new THREE.Vector3(0.25, 0.4, 0.08),
      new THREE.Vector3(0.46, 0.62, 0.08),
    ]),
    [],
  );
  return (
    <group position={[0, 0.18, 0]}>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} position={[-0.42 + index * 0.28, -0.22 + index * 0.13, 0]}>
          <boxGeometry args={[0.15, 0.3 + index * 0.14, 0.13]} />
          <meshPhysicalMaterial color="#21112d" metalness={0.72} roughness={0.2} emissive={color} emissiveIntensity={0.18} />
        </mesh>
      ))}
      <mesh>
        <tubeGeometry args={[curve, 48, 0.014, 8, false]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0.46, 0.62, 0.08]}>
        <sphereGeometry args={[0.052, 14, 14]} />
        <meshBasicMaterial color="#fff0ff" />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[0.1, 0.1 + index * 0.12, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24 + index * 0.1, 0.008, 5, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.36 - index * 0.08} />
        </mesh>
      ))}
    </group>
  );
}

function Station({ index, active, reduced }: { index: number; active: boolean; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const station = stations[index];
  const color = station.color;

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const target = active ? 1.07 : 1;
    const next = ref.current.scale.x + (target - ref.current.scale.x) * Math.min(1, delta * 4.5);
    ref.current.scale.setScalar(next);
    ref.current.position.y = reduced ? station.position[1] : station.position[1] + Math.sin(clock.elapsedTime * 0.8 + index * 1.2) * 0.035;
    ref.current.rotation.y = reduced ? 0 : Math.sin(clock.elapsedTime * 0.25 + index) * 0.035;
  });

  return (
    <group ref={ref} position={station.position}>
      <Platform color={color} active={active} />
      {index === 0 && <WebObject color={color} />}
      {index === 1 && <UiObject color={color} />}
      {index === 2 && <AiObject color={color} />}
      {index === 3 && <DatabaseObject color={color} />}
      {index === 4 && <SeoObject color={color} />}
    </group>
  );
}

function FloatingTerrain() {
  return (
    <group position={[0, -0.95, 0]}>
      <mesh scale={[3.2, 0.28, 2.22]} rotation={[0.02, -0.08, 0.02]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#0b0812" roughness={0.98} metalness={0.12} flatShading />
      </mesh>
      <mesh position={[-1.85, -0.04, 0.22]} scale={[1.12, 0.2, 0.72]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#100b18" roughness={1} flatShading />
      </mesh>
      <mesh position={[1.72, -0.06, -0.12]} scale={[0.98, 0.18, 0.66]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#100b18" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function CentralCore({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    if (!reduced) {
      ref.current.rotation.y += delta * 0.14;
      ref.current.position.y = 0.16 + Math.sin(clock.elapsedTime * 0.65) * 0.055;
    } else {
      ref.current.rotation.y = 0;
      ref.current.position.y = 0.16;
    }
  });

  return (
    <group ref={ref} position={[0, 0.16, 0.72]}>
      <RoundedBox args={[0.7, 0.7, 0.7]} radius={0.1} smoothness={6}>
        <meshPhysicalMaterial color="#321044" metalness={0.28} roughness={0.13} transparent opacity={0.46} clearcoat={1} emissive="#a22cff" emissiveIntensity={0.42} />
        <Edges scale={1.015} color="#e0a0ff" />
      </RoundedBox>
      <Html transform position={[0, 0, 0.37]} distanceFactor={6.6} occlude={false}>
        <div style={{ color: "#fff1ff", font: "700 31px/1 ui-monospace,monospace", textShadow: "0 0 12px #f44bc8,0 0 26px #a44dff" }}>&lt;/&gt;</div>
      </Html>
    </group>
  );
}

function SkillScene({ active, reduced = false }: Props) {
  const { size } = useThree();
  const sceneScale = size.width < 520 ? 0.68 : size.width < 680 ? 0.88 : size.width < 900 ? 1.08 : 1.25;
  const paths = useMemo(
    () => stations.map((station) => {
      const [x, , z] = station.position;
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.28, 0.05),
        new THREE.Vector3(x * 0.38, -0.16, z * 0.34),
        new THREE.Vector3(x * 0.76, -0.12, z * 0.72),
        new THREE.Vector3(x, -0.48, z),
      ]);
    }),
    [],
  );

  return (
    <group position={[0, 0.5, 0]} scale={sceneScale}>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 4.2, 5]} color="#ff65d1" intensity={22} distance={13} decay={2} />
      <pointLight position={[-4, 2.5, -2]} color="#9d62ff" intensity={17} distance={11} decay={2} />
      <pointLight position={[4, 1, 1]} color="#e24bc5" intensity={11} distance={10} decay={2} />

      {paths.map((curve, index) => (
        <group key={index}>
          <mesh>
            <tubeGeometry args={[curve, 48, 0.018, 7, false]} />
            <meshBasicMaterial color={stations[index].color} transparent opacity={active === index ? 0.88 : 0.48} />
          </mesh>
          <mesh>
            <tubeGeometry args={[curve, 48, 0.042, 7, false]} />
            <meshBasicMaterial color={stations[index].color} transparent opacity={active === index ? 0.12 : 0.055} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {stations.map((_, index) => (
        <Station key={index} index={index} active={active === index} reduced={reduced} />
      ))}
      <CentralCore reduced={reduced} />
      <Sparkles count={95} scale={[7, 3, 7]} size={1.35} speed={reduced ? 0 : 0.18} color="#ee85e6" opacity={0.54} />
    </group>
  );
}

export default function SkillsStage({ active, reduced = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = host.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "160px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className={styles.skillCanvas} aria-label="Three-dimensional skills and expertise installation">
      <Canvas
        dpr={[1, 1.4]}
        frameloop={visible && !reduced ? "always" : "demand"}
        camera={{ position: [0, 3.7, 7.8], fov: 36, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; gl.setClearColor(0x000000, 0); }}
      >
        <Suspense fallback={null}>
          <SkillScene active={active} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}