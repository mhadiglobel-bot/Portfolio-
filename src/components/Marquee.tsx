const items = [
  "Product thinking",
  "Interface design",
  "Web engineering",
  "Interactive systems",
];

export default function Marquee() {
  return (
    <div className="marquee relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-5">
      <div className="marquee-track">
        {[0, 1].map((repeat) => (
          <div
            key={repeat}
            className="flex shrink-0 items-center"
            aria-hidden={repeat === 1 ? true : undefined}
          >
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center gap-8 pr-8 text-[11px] font-medium uppercase tracking-[0.28em] text-white/40"
              >
                {item}
                <span className="text-pink">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
