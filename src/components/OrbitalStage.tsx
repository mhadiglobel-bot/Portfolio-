"use client";

import Image from "next/image";
import { useMemo, type CSSProperties } from "react";
import type { Project } from "@/lib/projects";
import styles from "./PortfolioSections.module.css";

type Props = {
  position: number;
  projects: Project[];
  reduced?: boolean;
};

type GalleryStop = {
  step: number;
  x: number;
  y: number;
  scale: number;
  z: number;
  glow: number;
};

// Five screens share a single continuous perspective lane. A screen moves
// smoothly from the foreground into the gallery as another becomes active.
// The path joins at 0/5, preventing the old jump between ends.
const stops: GalleryStop[] = [
  { step: 0, x: 48, y: 24, scale: .92, z: 50, glow: 1 },
  { step: 1, x: 34.5, y: 31, scale: .68, z: -95, glow: .86 },
  { step: 2, x: 28, y: 38, scale: .48, z: -210, glow: .7 },
  { step: 3, x: 24, y: 43, scale: .34, z: -300, glow: .54 },
  { step: 4, x: 21, y: 47, scale: .24, z: -390, glow: .4 },
  { step: 5, x: 48, y: 24, scale: .92, z: 50, glow: 1 },
];

const portalFrames = [
  { left: 48, top: 12, width: 51, height: 57, opacity: .71 },
  { left: 42, top: 18, width: 44, height: 50, opacity: .56 },
  { left: 37, top: 25, width: 36, height: 42, opacity: .43 },
  { left: 32, top: 31, width: 29, height: 35, opacity: .34 },
  { left: 28, top: 37, width: 23, height: 27, opacity: .26 },
  { left: 25, top: 41, width: 17, height: 21, opacity: .19 },
];

function getStop(relative: number) {
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (relative < a.step || relative > b.step) continue;
    const t = (relative - a.step) / (b.step - a.step);
    const eased = t * t * (3 - 2 * t);
    const mix = (key: "x" | "y" | "scale" | "z" | "glow") =>
      a[key] + (b[key] - a[key]) * eased;

    return { x: mix("x"), y: mix("y"), scale: mix("scale"), z: mix("z"), glow: mix("glow") };
  }
  return stops[0];
}

function ProjectGlassCard({
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
  // A cyclic 0..5 phase keeps the current panel at the front and puts the
  // other four in visible, progressively smaller positions behind it.
  const relative = ((index - position) % count + count) % count;
  const stop = getStop(relative);
  const depth = Math.min(relative, count - relative);
  const prominent = depth < .55;
  const near = depth < 1.45;
  const next = relative > .001 && relative < 1.5;
  const style = {
    "--gallery-x": stop.x + "%",
    "--gallery-y": stop.y + "%",
    "--gallery-scale": String(stop.scale),
    "--gallery-z": stop.z + "px",
    "--gallery-glow": String(stop.glow),
    "--glass-accent": project.accent,
    zIndex: Math.round(80 - depth * 13),
  } as CSSProperties;

  return (
    <div
      className={styles.galleryCard}
      style={style}
      data-prominent={prominent ? "true" : undefined}
      data-near={near ? "true" : undefined}
      data-next={next ? "true" : undefined}
      data-reduced={reduced ? "true" : undefined}
      aria-hidden="true"
    >
      <div className={styles.galleryGlass}>
        <div className={styles.galleryGlassRim}>
          <div className={styles.galleryScreen}>
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width:700px) 95vw, 52vw"
              quality={90}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className={styles.galleryReflection}>
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(max-width:700px) 95vw, 52vw"
          quality={65}
          draggable={false}
        />
      </div>
    </div>
  );
}

export default function OrbitalStage({ position, projects, reduced = false }: Props) {
  const count = projects.length;
  const portals = useMemo(() => portalFrames, []);
  if (count === 0) return null;

  return (
    <div
      className={styles.galleryStage}
      role="img"
      aria-label="Perspective tunnel with glass project screens that move forward as you browse"
      data-reduced={reduced ? "true" : undefined}
    >
      <div className={styles.galleryAtmosphere} aria-hidden="true" />
      <div className={styles.galleryFloor} aria-hidden="true" />
      <div className={styles.galleryTrack} aria-hidden="true" />

      {portals.map((frame, index) => (
        <span
          aria-hidden="true"
          key={index}
          className={styles.galleryPortal}
          style={{
            "--portal-left": frame.left + "%",
            "--portal-top": frame.top + "%",
            "--portal-width": frame.width + "%",
            "--portal-height": frame.height + "%",
            "--portal-opacity": String(frame.opacity),
            animationDelay: index * -0.33 + "s",
          } as CSSProperties}
        />
      ))}

      <div className={styles.galleryCards}>
        {projects.map((project, index) => (
          <ProjectGlassCard
            key={project.href}
            project={project}
            index={index}
            position={position}
            count={count}
            reduced={reduced}
          />
        ))}
      </div>
      <div className={styles.galleryFloorMist} aria-hidden="true" />
    </div>
  );
}
