"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-18 py-4">
        <a href="#top" className="flex items-center gap-2.5 shrink-0" aria-label={`${site.name} home`}>
          <Logo className="h-7 w-7 text-forest" />
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            {site.name}
          </span>
        </a>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-sm font-medium text-ink/80 hover:text-ink link-underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 font-display text-sm font-semibold text-paper hover:bg-forest-2 transition-colors"
          >
            Book a free session
          </a>
        </div>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex flex-col justify-center gap-[5px] p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* mobile sheet */}
      {open && (
        <div className="md:hidden fixed inset-x-0 top-18 bottom-0 bg-paper z-40 border-t border-line">
          <nav className="container-x flex flex-col py-6" aria-label="Mobile">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl font-semibold text-ink py-4 border-b border-line"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-forest px-5 py-3.5 font-display text-base font-semibold text-paper"
            >
              Book a free session
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
