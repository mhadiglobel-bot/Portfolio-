"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

function Orb() {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const scroll =
      typeof window !== "undefined"
        ? Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
        : 0;

    const g = group.current;
    if (g) {
      g.rotation.y += delta * 0.14;
      g.rotation.x = Math.sin(t * 0.16) * 0.1 + scroll * 0.4;
      g.position.y = -scroll * 0.7;
      g.scale.setScalar(1 - scroll * 0.16);
    }

    if (ringA.current) ringA.current.rotation.z = t * 0.28;
    if (ringB.current) ringB.current.rotation.z = -t * 0.2;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.4,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.3,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.32, 96, 96]} />
        <meshPhysicalMaterial
          color="#140a26"
          emissive="#5b21b6"
          emissiveIntensity={0.45}
          metalness={0.85}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.25}
        />
      </mesh>

      <mesh scale={1.03}>
        <sphereGeometry args={[1.32, 64, 64]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.15, 0]}>
        <torusGeometry args={[2.1, 0.012, 16, 220]} />
        <meshBasicMaterial color="#ff3d9a" toneMapped={false} transparent opacity={0.9} />
      </mesh>

      <mesh ref={ringB} rotation={[Math.PI / 1.9, -0.35, 0.4]}>
        <torusGeometry args={[1.85, 0.008, 12, 200]} />
        <meshBasicMaterial color="#c084fc" toneMapped={false} transparent opacity={0.7} />
      </mesh>

      <mesh rotation={[Math.PI / 2.2, 0.6, 0.2]}>
        <torusGeometry args={[2.4, 0.004, 8, 240]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.22} />
      </mesh>

      <Sparkles count={60} scale={6.5} size={2.4} speed={0.3} opacity={0.55} color="#e9d5ff" />
    </group>
  );
}

export default function HeroScene() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.2], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={80} color="#ff3d9a" distance={14} />
      <pointLight position={[-4, -2, 3]} intensity={70} color="#8b5cf6" distance={14} />
      <pointLight position={[0, 0, 5]} intensity={30} color="#ffffff" distance={12} />

      <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.5}>
        <Orb />
      </Float>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
