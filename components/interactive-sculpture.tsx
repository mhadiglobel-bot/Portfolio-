"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = [
  "uniform float uTime;",
  "uniform vec2 uPointer;",
  "uniform float uScroll;",
  "varying vec3 vNormal;",
  "varying vec3 vViewPosition;",
  "varying vec3 vPosition;",
  "varying vec2 vUv;",
  "void main() {",
  "  vec3 p = position;",
  "  float waveA = sin(p.x * 3.1 + uTime * 0.72 + uPointer.x * 1.35);",
  "  float waveB = cos(p.y * 3.4 - uTime * 0.58 + uPointer.y * 1.25);",
  "  float waveC = sin((p.z + p.x * 0.65) * 4.0 + uTime * 0.44);",
  "  float waveD = cos((p.y - p.z) * 2.7 - uTime * 0.36);",
  "  float liquid = (waveA * waveB * 0.52 + waveC * 0.28 + waveD * 0.2);",
  "  p += normal * (liquid * 0.145 + uScroll * 0.045);",
  "  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);",
  "  vNormal = normalize(normalMatrix * normal);",
  "  vViewPosition = -mvPosition.xyz;",
  "  vPosition = p;",
  "  vUv = uv;",
  "  gl_Position = projectionMatrix * mvPosition;",
  "}",
].join("\n");

const fragmentShader = [
  "uniform float uTime;",
  "uniform vec2 uPointer;",
  "varying vec3 vNormal;",
  "varying vec3 vViewPosition;",
  "varying vec3 vPosition;",
  "varying vec2 vUv;",
  "void main() {",
  "  vec3 N = normalize(vNormal);",
  "  vec3 V = normalize(vViewPosition);",
  "  vec3 L = normalize(vec3(-0.48, 0.74, 0.82));",
  "  vec3 H = normalize(L + V);",
  "  float diffuse = max(dot(N, L), 0.0);",
  "  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.15);",
  "  float specular = pow(max(dot(N, H), 0.0), 48.0);",
  "  float bands = sin(vPosition.y * 3.0 + vPosition.x * 1.3 + uTime * 0.42 + uPointer.x * 0.8);",
  "  float flow = smoothstep(-0.55, 0.75, bands * 0.5 + 0.5);",
  "  vec3 shadow = vec3(0.085, 0.014, 0.008);",
  "  vec3 ember = vec3(0.56, 0.075, 0.022);",
  "  vec3 orange = vec3(0.98, 0.245, 0.055);",
  "  vec3 gold = vec3(1.0, 0.62, 0.29);",
  "  vec3 base = mix(shadow, ember, flow);",
  "  base = mix(base, orange, smoothstep(0.18, 0.92, flow) * 0.78);",
  "  base = mix(base, gold, fresnel * 0.84);",
  "  float light = 0.22 + diffuse * 0.72;",
  "  vec3 color = base * light;",
  "  color += gold * specular * 1.5;",
  "  color += orange * fresnel * 0.52;",
  "  color += vec3(0.22, 0.035, 0.008) * (0.5 + 0.5 * sin(uTime * 0.3 + vUv.y * 5.0));",
  "  gl_FragColor = vec4(color, 0.98);",
  "  #include <tonemapping_fragment>",
  "  #include <colorspace_fragment>",
  "}",
].join("\n");

export function InteractiveSculpture() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.matchMedia("(max-width: 760px)").matches;
    let renderer: THREE.WebGLRenderer;
    let animationFrame = 0;
    let visible = true;
    let disposed = false;
    let lastFrame = 0;
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let shaderUniforms: { [key: string]: { value: unknown } } | null = null;

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
    camera.position.set(0, 0, 6.4);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1 : 1.45));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    host.appendChild(renderer.domElement);
    renderer.domElement.className = "sculpture-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");

    const root = new THREE.Group();
    root.position.set(0.08, 0.02, 0);
    scene.add(root);

    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
    };

    const liquidMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      toneMapped: true,
    });
    shaderUniforms = uniforms;

    const liquid = new THREE.Mesh(new THREE.IcosahedronGeometry(1.36, 6), liquidMaterial);
    root.add(liquid);

    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff8a4d,
      metalness: 0.88,
      roughness: 0.17,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x5a1607,
      emissiveIntensity: 0.36,
    });
    const ringMaterialSoft = new THREE.MeshStandardMaterial({
      color: 0xffc08a,
      metalness: 0.82,
      roughness: 0.22,
      transparent: true,
      opacity: 0.58,
      emissive: 0x5a1c08,
      emissiveIntensity: 0.18,
    });

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.014, 12, 190), ringMaterial);
    ringA.rotation.set(1.12, 0.18, 0.28);
    root.add(ringA);

    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.008, 8, 170), ringMaterialSoft);
    ringB.rotation.set(0.44, 1.02, 0.78);
    root.add(ringB);

    const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.94, 0.006, 8, 170), ringMaterialSoft);
    ringC.rotation.set(1.48, -0.62, -0.24);
    root.add(ringC);

    const satelliteMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffd3a1,
      metalness: 0.34,
      roughness: 0.13,
      clearcoat: 1,
      emissive: 0x9d310d,
      emissiveIntensity: 0.34,
    });
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.105, 28, 28), satelliteMaterial);
    satellite.position.set(1.48, 0.58, 0.3);
    root.add(satellite);

    const satelliteSmall = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.065, 2),
      new THREE.MeshStandardMaterial({ color: 0xffa66b, metalness: 0.72, roughness: 0.2, emissive: 0x5b1707, emissiveIntensity: 0.3 }),
    );
    satelliteSmall.position.set(-1.55, -0.68, -0.2);
    root.add(satelliteSmall);

    const particlePositions: number[] = [];
    for (let index = 0; index < 112; index += 1) {
      const angle = index * 2.399963229728653;
      const radius = 2.02 + (index % 9) * 0.045;
      particlePositions.push(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.13) * (0.9 + (index % 5) * 0.1),
        Math.sin(angle) * (0.62 + (index % 7) * 0.08),
      );
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffc08a,
      size: isSmall ? 0.012 : 0.016,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    root.add(particles);

    scene.add(new THREE.HemisphereLight(0xffd6b7, 0x160804, 1.15));

    const keyLight = new THREE.DirectionalLight(0xfff0df, 3.2);
    keyLight.position.set(-3.2, 4.4, 4.6);
    scene.add(keyLight);

    const warmLight = new THREE.PointLight(0xff5d25, 22, 9, 2);
    warmLight.position.set(2.5, 1.4, 2.2);
    scene.add(warmLight);

    const rimLight = new THREE.PointLight(0xffbd7a, 13, 8, 2);
    rimLight.position.set(-2.5, -1.8, -1.4);
    scene.add(rimLight);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 760 ? 7.1 : 6.4;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
      pointerTarget.set((x - 0.5) * 2, (0.5 - y) * 2);
    };

    const onPointerLeave = () => pointerTarget.set(0, 0);

    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      scrollTarget = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    };

    const renderStatic = () => renderer.render(scene, camera);

    const stop = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const animate = (timestamp: number) => {
      if (disposed || !visible || document.hidden) {
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
      pointerCurrent.lerp(pointerTarget, 0.045);
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.035;

      if (shaderUniforms) {
        (shaderUniforms.uTime.value as number) = time;
        (shaderUniforms.uPointer.value as THREE.Vector2).copy(pointerCurrent);
        (shaderUniforms.uScroll.value as number) = scrollCurrent;
      }

      root.rotation.y = pointerCurrent.x * 0.24 + scrollCurrent * 0.32 + Math.sin(time * 0.2) * 0.045;
      root.rotation.x = pointerCurrent.y * 0.16 + Math.cos(time * 0.17) * 0.035;
      root.rotation.z = Math.sin(time * 0.14) * 0.035;
      root.position.y = Math.sin(time * 0.42) * 0.045 - scrollCurrent * 0.055;
      ringA.rotation.z += 0.0011;
      ringB.rotation.x -= 0.0009;
      ringC.rotation.y += 0.00065;
      satellite.position.set(Math.cos(time * 0.42) * 1.52, Math.sin(time * 0.42) * 0.78, Math.sin(time * 0.35) * 0.28);
      satellite.rotation.y += 0.0025;
      satelliteSmall.rotation.x += 0.0018;
      particles.rotation.y = -time * 0.018;

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
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      onScroll();
    });
    resizeObserver.observe(host);
    resize();
    onScroll();

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
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="sculpture-stage" ref={hostRef} aria-hidden="true">
      <div className="sculpture-fallback">
        <span className="fallback-orbit fallback-orbit--one" />
        <span className="fallback-orbit fallback-orbit--two" />
        <span className="fallback-liquid" />
      </div>
      <div className="sculpture-caption">LIQUID FORM / REAL-TIME 3D</div>
    </div>
  );
}
