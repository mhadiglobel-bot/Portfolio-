import type { CSSProperties } from "react";

type Props = {
  children: string;
  animateOnLoad?: boolean;
  delayOffset?: number;
  staggerMs?: number;
};

export default function RollingText({
  children,
  animateOnLoad = false,
  delayOffset = 0,
  staggerMs = 16,
}: Props) {
  let offset = delayOffset;
  return (
    <span className={animateOnLoad ? "roll-text roll-text--load" : "roll-text"}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {children.split(" ").map((word, index) => (
          <span key={index}>{index > 0 && " "}<span className="roll-word">
            {Array.from(word, (glyph, i) => (
              <span className="roll-letter" key={i} style={{ "--delay": (offset++ * staggerMs) + "ms" } as CSSProperties}>{glyph}</span>
            ))}
          </span></span>
        ))}
      </span>
    </span>
  );
}
