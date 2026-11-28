"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  const radius = 1.635;

  for (let lat = -78; lat <= 82; lat += 2.9) {
    for (let lon = -180; lon <= 180; lon += 2.9) {
      if (!landPolygons.some((polygon) => pointInPolygon(lon, lat, polygon))) continue;
      const phi = THREE.MathUtils.degToRad(lat);
      const theta = THREE.MathUtils.degToRad(lon);
      positions.push(
        radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.sin(phi),
        radius * Math.cos(phi) * Math.cos(theta),
      );
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
    const target = position * 0.2 + (reduced ? 0 : clock.elapsedTime * 0.014);

    if (reduced) {
      group.current.rotation.y = target;
      group.current.rotation.x = -0.075;
      return;
    }

    group.current.rotation.y += (target - group.current.rotation.y) * Math.min(1, delta * 4);
    group.current.rotation.x = -0.075 + Math.sin(clock.elapsedTime * 0.12) * 0.012;
  });

  return (
    <group ref={group}>
      <mesh renderOrder={0}>
        <sphereGeometry args={[1.61, 72, 72]} />
        <meshPhysicalMaterial
          color="#0b0714"
          metalness={0.3}
          roughness={0.58}
          clearcoat={0.9}
          emissive="#241039"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh scale={1.045} renderOrder={1}>
        <sphereGeometry args={[1.61, 48, 48]} />
        <meshBasicMaterial
          color="#a83dff"
          transparent
          opacity={0.075}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <points geometry={land} renderOrder={2}>
        <pointsMaterial
          color="#b64cff"
          size={0.041}
          sizeAttenuation
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </points>
      <points geometry={land} renderOrder={3}>
        <pointsMaterial
          color="#f36be8"
          size={0.019}
          sizeAttenuation
          transparent
          opacity={0.98}
          depthWrite={false}
        />
      </points>

      {[-66, -44, -22, 0, 22, 44, 66].map((latitude) => {
        const radians = THREE.MathUtils.degToRad(latitude);
        return (
          <mesh
            key={latitude}
            position={[0, Math.sin(radians) * 1.625, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            renderOrder={1}
          >
            <torusGeometry args={[Math.cos(radians) * 1.625, 0.0026, 4, 128]} />
            <meshBasicMaterial color="#a76bff" transparent opacity={0.22} depthWrite={false} />
          </mesh>
        );
      })}

      {Array.from({ length: 12 }, (_, index) => (
        <mesh key={index} rotation={[0, (index * Math.PI) / 12, 0]} renderOrder={1}>
          <torusGeometry args={[1.625, 0.0024, 4, 128]} />
          <meshBasicMaterial color="#d36aff" transparent opacity={0.19} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitalRings({ reduced }: { reduced: boolean }) {
  const rings = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!rings.current || reduced) return;
    rings.current.rotation.z = Math.sin(clock.elapsedTime * 0.16) * 0.045;
    rings.current.rotation.x = 0.08 + Math.sin(clock.elapsedTime * 0.11) * 0.025;
    rings.current.rotation.y += delta * 0.032;
  });

  return (
    <group ref={rings}>
      <mesh rotation={[1.12, 0.12, -0.18]} scale={[1.13, 0.76, 1]}>
        <torusGeometry args={[2.5, 0.018, 6, 220]} />
        <meshBasicMaterial color="#ff4fc8" />
      </mesh>
      <mesh rotation={[1.12, 0.12, -0.18]} scale={[1.13, 0.76, 1]}>
        <torusGeometry args={[2.5, 0.062, 6, 220]} />
        <meshBasicMaterial color="#f02ab5" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh rotation={[0.62, -0.55, 0.88]} scale={[1.04, 0.86, 1]}>
        <torusGeometry args={[2.88, 0.01, 6, 220]} />
        <meshBasicMaterial color="#a76aff" transparent opacity={0.78} />
      </mesh>
      <mesh rotation={[1.5, 0.75, -0.2]} scale={[1.02, 0.7, 1]}>
        <torusGeometry args={[3.05, 0.008, 6, 220]} />
        <meshBasicMaterial color="#f6a2e8" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function ProjectPanel({
  project,
  index,
  position,
  count,
  reduced,
}: {
  project: Project;
  index: number;
  position: number;
  count: number;
  reduced: boolean;
}) {
  const texture = useTexture(project.image);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);

  const relative = ((index - position + count / 2) % count + count) % count - count / 2;
  const angle = relative * ((Math.PI * 2) / count);
  const distance = Math.abs(relative);
  const radiusX = 3.95;
  const radiusZ = 2.1;
  const x = Math.sin(angle) * radiusX;
  const y = Math.sin(angle * 2) * 1.8;
  const z = Math.cos(angle) * radiusZ + 0.35;
  const scale = 1.1 - Math.min(2.5, distance) * 0.15;
  const yaw = -Math.atan2(x, 8.8 - z) * 0.92;
  const tilt = -Math.sin(angle) * 0.075;

  return (
    <Float
      speed={reduced ? 0 : 0.68 + index * 0.055}
      floatIntensity={reduced ? 0 : 0.045}
      rotationIntensity={reduced ? 0 : 0.018}
    >
      <group position={[x, y, z]} rotation={[Math.sin(angle) * 0.035, yaw, tilt]} scale={scale}>
        <mesh position={[0, 0, -0.045]}>
          <RoundedBox args={[2.38, 1.48, 0.12]} radius={0.1} smoothness={6}>
            <meshPhysicalMaterial
              color="#100a18"
              metalness={0.68}
              roughness={0.2}
              clearcoat={1}
              emissive={project.accent}
              emissiveIntensity={0.18}
            />
            <Edges scale={1.012} threshold={12} color={project.accent} />
          </RoundedBox>
        </mesh>

        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[2.24, 1.35]} />
          <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>

        <mesh position={[1.01, 0.63, 0.042]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color={project.accent} />
        </mesh>
        <mesh position={[0, -0.705, 0.035]}>
          <boxGeometry args={[0.84, 0.012, 0.014]} />
          <meshBasicMaterial color={project.accent} transparent opacity={0.76} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({ position, projects, reduced = false }: Props) {
  const { size } = useThree();
  const sceneScale = size.width < 520 ? 0.68 : size.width < 760 ? 0.86 : size.width < 900 ? 0.98 : 1.08;

  return (
    <group scale={sceneScale}>
      <ambientLight intensity={0.78} />
      <pointLight position={[0, 1.8, 4.6]} color="#ff62ce" intensity={20} distance={11} decay={2} />
      <pointLight position={[-4, 2.5, -2]} color="#9b5bff" intensity={17} distance={10} decay={2} />
      <pointLight position={[4, -1.5, 1]} color="#d33cce" intensity={8} distance={8} decay={2} />

      <Globe position={position} reduced={reduced} />
      <OrbitalRings reduced={reduced} />

      {projects.map((project, index) => (
        <ProjectPanel
          key={project.href}
          project={project}
          index={index}
          position={position}
          count={projects.length}
          reduced={reduced}
        />
      ))}

      <Sparkles
        count={82}
        scale={[7.1, 4.4, 7.1]}
        size={1.35}
        speed={reduced ? 0 : 0.18}
        color="#f28ce8"
        opacity={0.58}
      />
      <Sparkles
        count={26}
        scale={[5.2, 3.2, 5.2]}
        size={2}
        speed={reduced ? 0 : 0.11}
        color="#9b6cff"
        opacity={0.42}
      />
    </group>
  );
}

export default function OrbitalStage({ position, projects, reduced = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = host.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={host}
      className={styles.sceneCanvas}
      aria-label="Interactive three-dimensional project globe with orbiting project screens"
    >
      <Canvas
        dpr={[1, 1.4]}
        frameloop={visible && !reduced ? "always" : "demand"}
        camera={{ position: [0, 0, 8.8], fov: 36, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(0x000000, 0);
        }}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <Scene position={position} projects={projects} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
