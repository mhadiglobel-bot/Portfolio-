"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

function Rings() {
  const ringA = useRef<THREE.Group>(null);
  const ringB = useRef<THREE.Group>(null);
  const ringC = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringA.current) ringA.current.rotation.z = t * 0.22;
    if (ringB.current) ringB.current.rotation.z = -t * 0.16;
    if (ringC.current) ringC.current.rotation.z = t * 0.1;
  });

  return (
    <group>
      <group ref={ringA} rotation={[Math.PI / 2.35, 0.18, 0]}>
        <mesh>
          <torusGeometry args={[2.02, 0.013, 16, 240]} />
          <meshBasicMaterial color="#ff3d9a" toneMapped={false} transparent opacity={0.95} />
        </mesh>
        <mesh position={[2.02, 0, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#ffd6ef" toneMapped={false} />
        </mesh>
      </group>

      <group ref={ringB} rotation={[Math.PI / 1.95, -0.32, 0.35]}>
        <mesh>
          <torusGeometry args={[1.82, 0.009, 12, 220]} />
          <meshBasicMaterial color="#c084fc" toneMapped={false} transparent opacity={0.8} />
        </mesh>
        <mesh position={[-1.82, 0, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#f3e8ff" toneMapped={false} />
        </mesh>
      </group>

      <group ref={ringC} rotation={[Math.PI / 2.6, 0.55, -0.15]}>
        <mesh>
          <torusGeometry args={[2.32, 0.004, 8, 260]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.18} />
        </mesh>
      </group>
    </group>
  );
}

function Sculpture() {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const lowPower = typeof window !== "undefined" && window.innerWidth < 768;

  const scroll = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const y =
      typeof window !== "undefined"
        ? Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)))
        : 0;
    scroll.current = THREE.MathUtils.damp(scroll.current, y, 4, delta);

    const g = root.current;
    if (g) {
      g.rotation.x = THREE.MathUtils.damp(
        g.rotation.x,
        state.pointer.y * 0.2 + scroll.current * 0.4,
        4,
        delta
      );
      g.rotation.y = THREE.MathUtils.damp(
        g.rotation.y,
        state.pointer.x * 0.28,
        4,
        delta
      );
      g.position.y = Math.sin(t * 0.7) * 0.06 - scroll.current * 0.45;
      g.scale.setScalar(1 - scroll.current * 0.14);
    }

    if (spin.current) {
      spin.current.rotation.y += delta * 0.22;
      spin.current.rotation.z = Math.sin(t * 0.24) * 0.12;
    }

    if (knot.current) {
      knot.current.rotation.x = Math.sin(t * 0.19) * 0.14;
    }

    if (core.current) {
      const pulse = 0.14 * (1 + Math.sin(t * 1.4) * 0.08);
      core.current.scale.setScalar(pulse);
    }

    if (glow.current) {
      const pulse = 0.24 * (1 + Math.sin(t * 1.4) * 0.1);
      glow.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[1.02, 0.28, 280, 40, 2, 3]} />
          <meshPhysicalMaterial
            color="#2a1145"
            metalness={0.88}
            roughness={0.14}
            clearcoat={1}
            clearcoatRoughness={0.08}
            iridescence={1}
            iridescenceIOR={1.55}
            iridescenceThicknessMinimum={120}
            iridescenceThicknessMaximum={900}
            envMapIntensity={2.6}
            emissive="#5b21b6"
            emissiveIntensity={0.22}
          />
        </mesh>

        <mesh ref={core} scale={0.14}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#ffd6ef" toneMapped={false} />
        </mesh>

        <mesh ref={glow} scale={0.24}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color="#ff3d9a"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <Rings />
      <pointLight position={[0, 0, 0]} intensity={6} distance={3} color="#ff8ad8" />
      <Sparkles
        count={lowPower ? 32 : 70}
        scale={lowPower ? 5.6 : 7}
        size={2.2}
        speed={0.24}
        opacity={0.55}
        color="#f5d0fe"
      />
    </group>
  );
}

function Shards({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);

  const shards = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        const radius = 2.55 + (index % 3) * 0.28;
        return {
          position: [
            Math.cos(angle) * radius,
            Math.sin(angle * 1.7) * 1.45,
            Math.sin(angle) * radius * 0.55 - 0.6,
          ] as [number, number, number],
          rotation: [angle, angle * 1.4, angle * 0.6] as [number, number, number],
          scale: 0.035 + (index % 4) * 0.014,
          color: index % 3 === 0 ? "#ff3d9a" : index % 3 === 1 ? "#c084fc" : "#ffffff",
        };
      }),
    [count]
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.045;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <group ref={group}>
      {shards.map((shard, index) => (
        <mesh
          key={index}
          position={shard.position}
          rotation={shard.rotation}
          scale={shard.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color={shard.color}
            toneMapped={false}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, isMobile ? 1.35 : 1.8]}
      camera={{ position: [0, 0, 7], fov: 38 }}
      gl={{ alpha: true, antialias: !isMobile, powerPreference: "high-performance" }}
      performance={{ min: 0.6 }}
      style={{ background: "transparent" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 4, 5]} intensity={110} color="#ff3d9a" distance={18} />
      <pointLight position={[-5, -3, 4]} intensity={90} color="#8b5cf6" distance={18} />
      <pointLight position={[0, 3, 6]} intensity={45} color="#ffffff" distance={16} />

      <Environment resolution={isMobile ? 96 : 256} frames={1}>
        <Lightformer
          intensity={4}
          color="#ff3d9a"
          position={[0, 5, -9]}
          scale={[10, 10, 1]}
        />
        <Lightformer
          intensity={2.4}
          color="#a855f7"
          rotation-y={Math.PI / 2}
          position={[-5, 1, -1]}
          scale={[10, 2, 1]}
        />
        <Lightformer
          intensity={2.2}
          color="#ffffff"
          rotation-y={-Math.PI / 2}
          position={[5, -1, 1]}
          scale={[10, 2, 1]}
        />
        <Lightformer
          form="ring"
          intensity={2.4}
          color="#ffb4e6"
          position={[2, 4, 2]}
          scale={2.2}
        />
      </Environment>

      <Sculpture />
      <Shards count={isMobile ? 7 : 12} />

      {!isMobile && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.05}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
