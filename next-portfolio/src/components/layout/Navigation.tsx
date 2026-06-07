"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/content";
import { scrollToHash } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToHash(href);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
        <motion.nav
          layout
          className={cn(
            "glass flex items-center justify-between rounded-full transition-all duration-500",
            scrolled ? "w-full max-w-3xl px-4 py-2.5" : "w-full max-w-6xl px-5 py-3"
          )}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNav(e, "#hero")}
            className="flex items-center gap-3"
            data-cursor="hover"
          >
            <span className="grid h-7 w-7 place-items-center">
              <motion.span
                className="block h-3 w-3 border border-ember"
                style={{ rotate: 45 }}
                animate={{ rotate: [45, 405] }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="font-display text-sm font-semibold text-bone">
                {SITE.name}
              </span>
              <span className="label-mono ml-2 align-middle text-[0.6rem]">PORTFOLIO</span>
            </span>
          </a>

          {/* Center links (desktop) */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-bone/70 transition-colors hover:text-bone"
                data-cursor="hover"
              >
                <span className="font-mono text-[0.62rem] text-ember/70">{link.index}</span>
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => handleNav(e, "#contact")}
              className="hidden rounded-full bg-bone px-4 py-2 text-sm font-medium text-carbon transition-colors hover:bg-ember sm:inline-flex"
              data-cursor="hover"
            >
              Start a project →
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-bone/15 lg:hidden"
              data-cursor="hover"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-bone transition-transform",
                    open && "translate-y-[6px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[6px] h-px w-full bg-bone transition-opacity",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[12px] h-px w-full bg-bone transition-transform",
                    open && "-translate-y-[6px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-carbon/97 px-8 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="flex items-baseline gap-4 border-b border-bone/10 py-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i + 0.1 }}
                >
                  <span className="font-mono text-sm text-ember">{link.index}</span>
                  <span className="font-display text-3xl text-bone">{link.label}</span>
                </motion.a>
              ))}
            </nav>
            <div className="mt-10 flex flex-col gap-4">
              <a
                href={SITE.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono text-bone/70"
              >
                ↗ Resume (PDF)
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNav(e, "#contact")}
                className="inline-flex w-fit rounded-full bg-ember px-6 py-3 text-sm font-medium text-carbon"
              >
                Start a project →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
