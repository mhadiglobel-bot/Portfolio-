"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const links = [
  { href: "#work", label: "Work" },
  { href: "#approach", label: "Approach" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-x">
        <div
          className={clsx(
            "mt-3 flex items-center justify-between rounded-full px-3 py-2.5 transition-all duration-500 sm:px-4",
            scrolled ? "glass-strong" : "border border-transparent"
          )}
        >
          <a href="#top" className="flex items-center gap-3" aria-label="Muhammad Hadi — back to top">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-pink/20 to-purple/20 text-[13px] font-bold tracking-tight text-white shadow-[0_0_30px_-6px_rgba(255,61,154,0.7)]">
              MH
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-white/90 sm:block">
              Muhammad Hadi
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-white/55 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="mailto:mhadi.globel@gmail.com"
              className="btn btn-primary hidden px-5 py-2.5 text-[13px] sm:inline-flex"
            >
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={clsx(
                    "absolute left-0 top-0 h-[1.5px] w-full bg-white transition-transform",
                    open && "translate-y-[5px] rotate-45"
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-0 top-[5px] h-[1.5px] w-full bg-white transition-opacity",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-0 top-[10px] h-[1.5px] w-full bg-white transition-transform",
                    open && "-translate-y-[5px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={clsx(
          "fixed inset-0 -z-10 bg-[#07060b]/95 backdrop-blur-2xl transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav
          className="container-x flex h-full flex-col justify-center gap-2 pb-16"
          aria-label="Mobile"
        >
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display border-b border-white/10 py-5 text-4xl font-medium tracking-tight text-white/85 transition-colors hover:text-pink"
            >
              <span className="mr-3 align-top text-[11px] tracking-[0.25em] text-white/35">
                0{index + 1}
              </span>
              {link.label}
            </a>
          ))}
          <a
            href="mailto:mhadi.globel@gmail.com"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-8 self-start"
          >
            Let&apos;s talk ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
