import type { ReactNode } from "react";

export default function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/45 sm:text-[11px] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink to-purple shadow-[0_0_12px_rgba(255,61,154,0.9)]" />
      <span className="text-white/70">{index}</span>
      <span className="h-px w-8 bg-white/15" />
      <span>{children}</span>
    </div>
  );
}
