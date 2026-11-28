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


/** Dotted land and ocean are projected onto the actual sphere, never onto a flat card. */
function createDotGeometry(step: number, landOnly: boolean) {
  const points: number[] = [];
  const radius = landOnly ? 2.205 : 2.196;
  for (let lat = -83; lat <= 83; lat += step) {
    for (let lon = -180; lon < 180; lon += step) {
      if (landOnly && !landPolygons.some((polygon) => pointInPolygon(lon, lat, polygon))) continue;
      const phi = THREE.MathUtils.degToRad(lat);
      const theta = THREE.MathUtils.degToRad(lon);
      points.push(
        radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.sin(phi),
        radius * Math.cos(phi) * Math.cos(theta),
      );
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

function Globe({ position, reduced }: { position: number; reduced: boolean }) {
  const globe = useRef<THREE.Group>(null);
  const continents = useMemo(() => createDotGeometry(2.3, true), []);
  const ocean = useMemo(() => createDotGeometry(6.8, false), []);
  useEffect(() => () => {
    continents.dispose();
    ocean.dispose();
  }, [continents, ocean]);

  useFrame(({ clock }, delta) => {
    if (!globe.current) return;
    // Europe, Africa and Asia face the camera first, rather than an empty ocean.
    const aim = 0.06 + position * 0.11 + (reduced ? 0 : clock.elapsedTime * 0.012);
    globe.current.rotation.y = reduced
      ? aim
      : THREE.MathUtils.damp(globe.current.rotation.y, aim, 2.2, delta);
    globe.current.rotation.x = -0.13;
  });

  return (
    <group ref={globe}>
      <mesh>
        <sphereGeometry args={[2.185, 72, 72]} />
        <meshPhysicalMaterial
          color="#10071a"
          metalness={0.14}
          roughness={0.72}
          emissive="#481350"
          emissiveIntensity={0.45}
          clearcoat={0.6}
        />
      </mesh>
      <mesh scale={1.035}>
        <sphereGeometry args={[2.185, 48, 48]} />
        <meshBasicMaterial
          color="#f345e3" transparent opacity={0.14}
          side={THREE.BackSide} depthWrite={false}
        />
      </mesh>
      <points geometry={ocean}>
        <pointsMaterial
          color="#c163d5" size={0.018} sizeAttenuation
          transparent opacity={0.34} depthWrite={false}
        />
      </points>
      <points geometry={continents}>
        <pointsMaterial
          color="#c53fe3" size={0.075} sizeAttenuation
          transparent opacity={0.18} blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <points geometry={continents}>
        <pointsMaterial
          color="#ffa1f3" size={0.043} sizeAttenuation
          transparent opacity={0.98} depthWrite={false}
        />
      </points>
      {[-65, -45, -25, 0, 25, 45, 65].map((latitude) => {
        const radians = THREE.MathUtils.degToRad(latitude);
        return (
          <mesh key={latitude}
            position={[0, Math.sin(radians) * 2.191, 0]}
            rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[Math.cos(radians) * 2.191, 0.0038, 5, 144]} />
            <meshBasicMaterial color="#b454ca" transparent opacity={0.24} depthWrite={false} />
          </mesh>
        );
      })}
      {Array.from({ length: 12 }, (_, index) => (
        <mesh key={index} rotation={[0, (index * Math.PI) / 12, 0]}>
          <torusGeometry args={[2.191, 0.0034, 5, 144]} />
          <meshBasicMaterial color="#ac42c4" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitalRings({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.14) * 0.035;
  });
  return (
    <group ref={group}>
      <mesh rotation={[1.15, 0.09, -0.23]} scale={[1.15, 0.83, 1]}>
        <torusGeometry args={[2.83, 0.016, 6, 240]} />
        <meshBasicMaterial color="#ff60db" />
      </mesh>
      <mesh rotation={[1.15, 0.09, -0.23]} scale={[1.15, 0.83, 1]}>
        <torusGeometry args={[2.83, 0.068, 6, 240]} />
        <meshBasicMaterial
          color="#f125c1" transparent opacity={0.2}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>
      <mesh rotation={[0.67, -0.54, 0.75]} scale={[0.99, 0.85, 1]}>
        <torusGeometry args={[3.13, 0.008, 5, 240]} />
        <meshBasicMaterial color="#af61e5" transparent opacity={0.68} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * Five fixed positions reproduce the reference composition.
 * Continuous interpolation between positions keeps scroll selection animated.
 * The two end positions meet behind the globe, avoiding a teleport at wrap.
 */
const orbitStops = [
  { at: -2.5, x: -3.25, y: 0.0, z: -0.7, scale: 0.55 },
  { at: -2, x: -2.75, y: 1.25, z: 0.25, scale: 0.7 },
  { at: -1, x: 2.7, y: 1.22, z: 0.38, scale: 0.7 },
  { at: 0, x: 0.0, y: -0.44, z: 2.48, scale: 1.0 },
  { at: 1, x: 2.9, y: -1.36, z: 0.72, scale: 0.75 },
  { at: 2, x: -2.8, y: -1.2, z: 0.64, scale: 0.72 },
  { at: 2.5, x: -3.25, y: 0.0, z: -0.7, scale: 0.55 },
];

function getOrbitStop(relative: number) {
  let current = orbitStops[0];
  let next = orbitStops[orbitStops.length - 1];
  for (let i = 0; i < orbitStops.length - 1; i++) {
    if (relative >= orbitStops[i].at && relative <= orbitStops[i + 1].at) {
      current = orbitStops[i];
      next = orbitStops[i + 1];
      break;
    }
  }
  const fraction = THREE.MathUtils.clamp(
    (relative - current.at) / (next.at - current.at), 0, 1,
  );
  const t = fraction * fraction * (3 - 2 * fraction);
  return {
    x: THREE.MathUtils.lerp(current.x, next.x, t),
    y: THREE.MathUtils.lerp(current.y, next.y, t),
    z: THREE.MathUtils.lerp(current.z, next.z, t),
    scale: THREE.MathUtils.lerp(current.scale, next.scale, t),
  };
}

function ProjectPanel({
  project, index, position, count, reduced,
}: {
  project: Project; index: number; position: number; count: number; reduced: boolean;
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
  const stop = getOrbitStop(relative);
  const opacity = Math.abs(relative) > 2.25 ? Math.max(0.1, 1 - (Math.abs(relative) - 2.25) * 3.3) : 1;
  const yaw = -stop.x * 0.048;
  return (
    <Float
      speed={reduced ? 0 : 0.55 + index * 0.04}
      floatIntensity={reduced ? 0 : 0.045}
      rotationIntensity={reduced ? 0 : 0.014}
    >
      <group
        position={[stop.x, stop.y, stop.z]}
        rotation={[-0.016, yaw, -stop.x * 0.018]}
        scale={stop.scale}
        visible={opacity > 0.12}
      >
        <RoundedBox args={[2.66, 1.62, 0.13]} radius={0.075} smoothness={6}
          position={[0, 0, -0.04]}>
          <meshPhysicalMaterial
            color="#180b21"
            metalness={0.56} roughness={0.23} clearcoat={0.85}
            emissive={project.accent} emissiveIntensity={0.22}
          />
          <Edges scale={1.014} threshold={12} color={project.accent} />
        </RoundedBox>
        <mesh position={[0, 0, 0.044]}>
          <planeGeometry args={[2.52, 1.47]} />
          <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide}
            transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, -0.765, 0.055]}>
          <boxGeometry args={[0.78, 0.012, 0.012]} />
          <meshBasicMaterial color={project.accent} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({ position, projects, reduced = false }: Props) {
  const { viewport } = useThree();
  // Use the available world-space viewport, not arbitrary screen-size breakpoints.
  const sceneScale = Math.min(1, viewport.width / 9.5, viewport.height / 6.1);

  return (
    <group scale={sceneScale}>
      <ambientLight intensity={0.85} />
      <pointLight position={[1.4, 3, 5]} color="#ff78ea" intensity={17} distance={12} />
      <pointLight position={[-3, 1, -1]} color="#993cff" intensity={13} distance={11} />
      <Globe position={position} reduced={reduced} />
      <OrbitalRings reduced={reduced} />
      {projects.map((project, index) => (
        <ProjectPanel
          key={project.href} project={project}
          index={index} position={position} count={projects.length}
          reduced={reduced}
        />
      ))}
      <Sparkles count={52} scale={[7.3, 4.5, 3.3]} size={1.2}
        speed={reduced ? 0 : 0.12} color="#ee7ee0" opacity={0.48} />
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
      ([entry]) => setVisible(entry.isIntersecting), { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={host} className={styles.sceneCanvas}
      aria-label="Glowing 3D globe with five orbiting portfolio projects">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible && !reduced ? "always" : "demand"}
        camera={{ position: [0, 0, 8.9], fov: 37, near: 0.1, far: 60 }}
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
