import type { CSSProperties } from "react";

export default function RollingText({ children }: { children: string }) {
  let offset = 0;
  return (
    <span className="roll-text">
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {children.split(" ").map((word, index) => (
          <span key={index}>{index > 0 && " "}<span className="roll-word">
            {Array.from(word, (glyph, i) => (
              <span className="roll-letter" key={i} style={{ "--delay": (offset++ * 16) + "ms" } as CSSProperties}>{glyph}</span>
            ))}
          </span></span>
        ))}
      </span>
    </span>
  );
}
