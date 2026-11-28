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

// Perspective path from the far-left vanishing point to the right foreground.
// Both distant endpoints meet, so wrapping five projects has no visible jump.
const stops: GalleryStop[] = [
  { step: -2.5, x: 19.3, y: 48, scale: .15, z: -670, glow: .3 },
  { step: -2, x: 27.5, y: 43.5, scale: .29, z: -500, glow: .53 },
  { step: -1, x: 36.4, y: 27, scale: .56, z: -190, glow: .83 },
  { step: 0, x: 48.8, y: 9, scale: .87, z: 32, glow: 1 },
  { step: 1, x: 19.3, y: 49, scale: .19, z: -620, glow: .38 },
  { step: 2, x: 24, y: 46.5, scale: .23, z: -570, glow: .48 },
  { step: 2.5, x: 19.3, y: 48, scale: .15, z: -670, glow: .3 },
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
  const relative =
    ((index - position + count / 2 + count * 4) % count) - count / 2;
  const stop = getStop(relative);
  const prominent = Math.abs(relative) < .55;
  const near = Math.abs(relative) < 1.45;
  const style = {
    "--gallery-x": stop.x + "%",
    "--gallery-y": stop.y + "%",
    "--gallery-scale": String(stop.scale),
    "--gallery-z": stop.z + "px",
    "--gallery-glow": String(stop.glow),
    "--glass-accent": project.accent,
    zIndex: Math.round(70 - Math.abs(relative) * 12),
  } as CSSProperties;

  return (
    <div
      className={styles.galleryCard}
      style={style}
      data-prominent={prominent ? "true" : undefined}
      data-near={near ? "true" : undefined}
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
              priority={index === 0}
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
  const portals = useMemo(() => Array.from({ length: 8 }, (_, index) => index), []);
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

      {portals.map((portal) => (
        <span
          aria-hidden="true"
          key={portal}
          className={styles.galleryPortal}
          style={{
            "--portal-left": (52.6 - portal * 4.62) + "%",
            "--portal-top": (1.5 + portal * 5.7) + "%",
            "--portal-width": (55 - portal * 5.15) + "%",
            "--portal-height": (86 - portal * 8.55) + "%",
            "--portal-opacity": String(Math.max(.21, 1 - portal * .104)),
            animationDelay: portal * -0.33 + "s",
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
