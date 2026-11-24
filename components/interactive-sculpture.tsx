"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function createRibbon(
  phase: number,
  material: THREE.Material,
  radius: number,
  shape: "horizontal" | "vertical",
) {
  const points: THREE.Vector3[] = [];
  const count = 112;

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const swell = 1 + 0.13 * Math.sin(angle * 3 + phase);
    const depth = 0.28 * Math.sin(angle * 2 + phase);

    if (shape === "horizontal") {
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * 1.18 * swell,
          Math.sin(angle) * 0.74 * (1 + 0.12 * Math.cos(angle * 2 + phase)),
          depth,
        ),
      );
    } else {
      points.push(
        new THREE.Vector3(
          Math.sin(angle) * 0.72 * (1 + 0.1 * Math.cos(angle * 3 + phase)),
          Math.cos(angle) * 1.22 * swell,
          0.3 * Math.sin(angle * 2 + phase),
        ),
      );
    }
  }

  const curve = new THREE.CatmullRomCurve3(points, true, "centripetal");
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 260, radius, 10, true),
    material,
  );
}

export function InteractiveSculpture() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.matchMedia("(max-width: 760px)").matches;
    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrame = 0;
    let visible = true;
    let disposed = false;
    let lastFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSmall,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      });
    } catch {
      host.dataset.failed = "true";
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0, 6.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1 : 1.35));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    host.appendChild(renderer.domElement);
    renderer.domElement.className = "sculpture-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");

    const root = new THREE.Group();
    root.position.set(0.12, 0, 0);
    scene.add(root);

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x6599ff,
      metalness: 0.24,
      roughness: 0.16,
      transmission: 0.32,
      thickness: 1.1,
      ior: 1.32,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.68,
      iridescenceIOR: 1.28,
      iridescenceThicknessRange: [260, 520],
      attenuationColor: new THREE.Color(0x2d68df),
      attenuationDistance: 2.1,
      emissive: new THREE.Color(0x061a48),
      emissiveIntensity: 0.34,
    });

    const brightGlass = new THREE.MeshPhysicalMaterial({
      color: 0xb7d5ff,
      metalness: 0.58,
      roughness: 0.12,
      transmission: 0.16,
      thickness: 0.7,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      iridescence: 0.35,
      emissive: new THREE.Color(0x0b2d76),
      emissiveIntensity: 0.22,
    });

    const chrome = new THREE.MeshStandardMaterial({
      color: 0x7daeff,
      metalness: 0.82,
      roughness: 0.2,
      emissive: 0x09265f,
      emissiveIntensity: 0.18,
    });

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd7e9ff,
      metalness: 0.12,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x1b4ca8,
      emissiveIntensity: 0.42,
    });

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.74, 4),
      glass,
    );
    root.add(core);

    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 36, 36),
      coreMaterial,
    );
    root.add(inner);

    const ribbonA = createRibbon(0.3, brightGlass, 0.047, "horizontal");
    ribbonA.rotation.set(0.28, 0.12, -0.16);
    root.add(ribbonA);

    const ribbonB = createRibbon(1.9, glass, 0.052, "vertical");
    ribbonB.rotation.set(-0.18, 0.55, 0.42);
    root.add(ribbonB);

    const ribbonC = createRibbon(3.2, chrome, 0.018, "horizontal");
    ribbonC.scale.set(1.22, 1.18, 1.12);
    ribbonC.rotation.set(0.8, -0.2, 0.55);
    root.add(ribbonC);

    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8ebaff,
      metalness: 0.48,
      roughness: 0.13,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      iridescence: 0.55,
      emissive: 0x0d2e75,
      emissiveIntensity: 0.24,
    });

    const crystalA = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 1), crystalMaterial);
    crystalA.position.set(1.48, 0.72, 0.22);
    crystalA.rotation.set(0.4, 0.2, 0.7);
    root.add(crystalA);

    const crystalB = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 1), brightGlass);
    crystalB.position.set(-1.45, -0.64, 0.38);
    root.add(crystalB);

    const crystalC = new THREE.Mesh(new THREE.TetrahedronGeometry(0.16, 0), chrome);
    crystalC.position.set(0.95, -1.1, -0.24);
    root.add(crystalC);

    const particles: number[] = [];
    for (let index = 0; index < 190; index += 1) {
      const angle = index * 2.399963229728653;
      const radius = 1.55 + (index % 13) * 0.055;
      particles.push(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.17) * (0.82 + (index % 7) * 0.1),
        Math.sin(angle) * (0.7 + (index % 5) * 0.11),
      );
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particles, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xb5d3ff,
      size: isSmall ? 0.012 : 0.016,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particleField = new THREE.Points(particleGeometry, particleMaterial);
    root.add(particleField);

    const ambient = new THREE.HemisphereLight(0x8cb8ff, 0x07101f, 1.05);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xe3efff, 3.1);
    keyLight.position.set(-3.4, 4.2, 4.5);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x2e68ff, 18, 9, 2);
    blueLight.position.set(2.8, 1.2, 2.1);
    scene.add(blueLight);

    const rimLight = new THREE.PointLight(0x83d3ff, 12, 8, 2);
    rimLight.position.set(-2.6, -1.8, -1.2);
    scene.add(rimLight);

    const resize = () => {
      if (!renderer) return;
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 760 ? 6.9 : 6.2;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * -2;
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const renderStatic = () => {
      if (renderer) renderer.render(scene, camera);
    };

    const stop = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const animate = (timestamp: number) => {
      if (disposed || !renderer || !visible || document.hidden) {
        animationFrame = 0;
        return;
      }

      const frameInterval = isSmall ? 34 : 20;
      if (timestamp - lastFrame < frameInterval) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      lastFrame = timestamp;
      const time = timestamp * 0.001;
      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;

      root.rotation.y += ((pointerX * 0.28) + Math.sin(time * 0.22) * 0.08 - root.rotation.y) * 0.035;
      root.rotation.x += ((pointerY * 0.18) + Math.cos(time * 0.18) * 0.035 - root.rotation.x) * 0.035;
      root.rotation.z = Math.sin(time * 0.16) * 0.055;
      root.position.y = Math.sin(time * 0.42) * 0.055;
      core.rotation.x = time * 0.055;
      core.rotation.y = time * 0.085;
      inner.rotation.y = -time * 0.12;
      inner.rotation.x = time * 0.08;
      ribbonA.rotation.y += 0.0015;
      ribbonB.rotation.x -= 0.0012;
      ribbonC.rotation.z += 0.0008;
      crystalA.rotation.x += 0.002;
      crystalA.rotation.y += 0.003;
      crystalB.rotation.y -= 0.002;
      crystalC.rotation.x += 0.002;
      particleField.rotation.y = -time * 0.018;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (reducedMotion) {
        renderStatic();
        return;
      }
      if (!animationFrame && visible && !document.hidden) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      host.dataset.failed = "true";
      stop();
    };

    renderer.domElement.addEventListener("webglcontextlost", onContextLost, false);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(host);

    if (reducedMotion) renderStatic();
    else start();

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer?.domElement.removeEventListener("webglcontextlost", onContextLost);

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });

      renderer?.dispose();
      renderer?.forceContextLoss();
      if (renderer?.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="sculpture-stage" ref={hostRef} aria-hidden="true">
      <div className="sculpture-fallback">
        <span className="fallback-ring fallback-ring--one" />
        <span className="fallback-ring fallback-ring--two" />
        <span className="fallback-core" />
      </div>
      <div className="sculpture-caption">REAL-TIME / 3D / INTERACTIVE</div>
    </div>
  );
}
