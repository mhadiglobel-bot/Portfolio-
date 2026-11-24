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
  "float hash31(vec3 p) {",
  "  p = fract(p * 0.3183099 + vec3(0.1));",
  "  p *= 17.0;",
  "  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));",
  "}",
  "float noise3d(vec3 p) {",
  "  vec3 i = floor(p);",
  "  vec3 f = fract(p);",
  "  f = f * f * (3.0 - 2.0 * f);",
  "  float n000 = hash31(i + vec3(0.0, 0.0, 0.0));",
  "  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));",
  "  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));",
  "  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));",
  "  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));",
  "  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));",
  "  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));",
  "  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));",
  "  float nx00 = mix(n000, n100, f.x);",
  "  float nx10 = mix(n010, n110, f.x);",
  "  float nx01 = mix(n001, n101, f.x);",
  "  float nx11 = mix(n011, n111, f.x);",
  "  return mix(mix(nx00, nx10, f.y), mix(nx01, nx11, f.y), f.z);",
  "}",
  "float fbm(vec3 p) {",
  "  float value = 0.0;",
  "  float amplitude = 0.5;",
  "  for (int i = 0; i < 4; i++) {",
  "    value += amplitude * noise3d(p);",
  "    p *= 2.03;",
  "    amplitude *= 0.5;",
  "  }",
  "  return value;",
  "}",
  "void main() {",
  "  vec3 p = position;",
  "  vec3 flow = normal * 2.15 + vec3(uTime * 0.12 + uPointer.x * 0.48, -uTime * 0.1 + uPointer.y * 0.44, uTime * 0.08);",
  "  float noise = fbm(flow);",
  "  float fold = sin(p.y * 3.0 + uTime * 0.52 + uPointer.x) * cos(p.x * 2.7 - uTime * 0.42 + uPointer.y);",
  "  float displacement = (noise - 0.48) * 0.58 + fold * 0.075 + uScroll * 0.035;",
  "  p += normal * displacement;",
  "  p += normal * sin(p.z * 2.8 + p.x * 1.6 + uTime * 0.38) * 0.025;",
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
  "  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.3);",
  "  float specular = pow(max(dot(N, H), 0.0), 54.0);",
  "  float flow = sin(vPosition.y * 3.2 + vPosition.x * 2.1 + uTime * 0.34 + uPointer.x * 0.6);",
  "  float molten = smoothstep(-0.38, 0.82, flow * 0.5 + 0.5);",
  "  vec3 shadow = vec3(0.065, 0.01, 0.005);",
  "  vec3 deep = vec3(0.26, 0.025, 0.009);",
  "  vec3 orange = vec3(0.95, 0.19, 0.035);",
  "  vec3 gold = vec3(1.0, 0.63, 0.34);",
  "  vec3 base = mix(shadow, deep, molten);",
  "  base = mix(base, orange, smoothstep(0.24, 0.92, molten) * 0.84);",
  "  base = mix(base, gold, fresnel * 0.78);",
  "  vec3 color = base * (0.24 + diffuse * 0.72);",
  "  color += gold * specular * 1.7;",
  "  color += orange * fresnel * 0.62;",
  "  color += vec3(0.19, 0.025, 0.006) * (0.5 + 0.5 * sin(uTime * 0.26 + vUv.y * 6.0));",
  "  gl_FragColor = vec4(color, 0.99);",
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

    let animationFrame = 0;
    let visible = true;
    let disposed = false;
    let lastFrame = 0;
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    let scrollTarget = 0;
    let scrollCurrent = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0, isSmall ? 6.9 : 6.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1 : 1.45));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
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

    const liquid = new THREE.Mesh(new THREE.SphereGeometry(1.48, 128, 128), liquidMaterial);
    liquid.scale.set(1.02, 0.94, 0.96);
    root.add(liquid);

    const strandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.32, -0.18, -0.24),
      new THREE.Vector3(-1.18, 0.48, 0.12),
      new THREE.Vector3(-0.58, 0.98, 0.34),
      new THREE.Vector3(0.08, 0.9, 0.42),
      new THREE.Vector3(0.72, 0.47, 0.24),
      new THREE.Vector3(1.22, -0.24, -0.08),
    ]);
    const strandMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff8648,
      metalness: 0.68,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x5d1708,
      emissiveIntensity: 0.34,
    });
    const strand = new THREE.Mesh(new THREE.TubeGeometry(strandCurve, 140, 0.052, 16, false), strandMaterial);
    root.add(strand);

    const dropletMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffb47c,
      metalness: 0.4,
      roughness: 0.13,
      clearcoat: 1,
      emissive: 0x79220a,
      emissiveIntensity: 0.28,
    });
    const droplet = new THREE.Mesh(new THREE.SphereGeometry(0.12, 36, 36), dropletMaterial);
    droplet.scale.set(0.72, 1.3, 0.72);
    droplet.position.set(1.46, 0.52, 0.18);
    root.add(droplet);

    const dropletSmall = new THREE.Mesh(new THREE.SphereGeometry(0.07, 28, 28), dropletMaterial);
    dropletSmall.position.set(-1.34, -0.62, 0.22);
    root.add(dropletSmall);

    const particlePositions: number[] = [];
    for (let index = 0; index < 88; index += 1) {
      const angle = index * 2.399963229728653;
      const radius = 1.95 + (index % 8) * 0.055;
      particlePositions.push(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.13) * (0.92 + (index % 5) * 0.09),
        Math.sin(angle) * (0.62 + (index % 7) * 0.08),
      );
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffc08a,
      size: isSmall ? 0.011 : 0.015,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    root.add(particles);

    scene.add(new THREE.HemisphereLight(0xffd6b7, 0x160804, 1.2));

    const keyLight = new THREE.DirectionalLight(0xfff0df, 3.4);
    keyLight.position.set(-3.2, 4.4, 4.6);
    scene.add(keyLight);

    const warmLight = new THREE.PointLight(0xff5d25, 24, 9, 2);
    warmLight.position.set(2.5, 1.4, 2.2);
    scene.add(warmLight);

    const rimLight = new THREE.PointLight(0xffbd7a, 14, 8, 2);
    rimLight.position.set(-2.5, -1.8, -1.4);
    scene.add(rimLight);

    const resize = () => {
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
      uniforms.uTime.value = time;
      uniforms.uPointer.value.copy(pointerCurrent);
      uniforms.uScroll.value = scrollCurrent;

      root.rotation.y = pointerCurrent.x * 0.23 + scrollCurrent * 0.28 + Math.sin(time * 0.18) * 0.035;
      root.rotation.x = pointerCurrent.y * 0.15 + Math.cos(time * 0.16) * 0.028;
      root.rotation.z = Math.sin(time * 0.13) * 0.022;
      root.position.y = Math.sin(time * 0.4) * 0.04 - scrollCurrent * 0.045;
      liquid.scale.set(
        1.02 + Math.sin(time * 0.34) * 0.018,
        0.94 + Math.cos(time * 0.31) * 0.022,
        0.96 + Math.sin(time * 0.27) * 0.018,
      );
      strand.rotation.y = Math.sin(time * 0.22) * 0.055;
      droplet.position.y = 0.52 + Math.sin(time * 0.48) * 0.08;
      dropletSmall.position.x = -1.34 + Math.sin(time * 0.38) * 0.05;
      particles.rotation.y = -time * 0.012;

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
        <span className="fallback-liquid" />
      </div>
      <div className="sculpture-caption">LIQUID FORM / REAL-TIME 3D</div>
    </div>
  );
}
