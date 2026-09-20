"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FOOTER, LINKS, LINKEDIN_URL } from "@/lib/content";
import { scrollToHash } from "@/lib/scroll";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // Parallax scale on the mega wordmark.
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1.02]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.15, 1]);

  return (
    <footer ref={ref} className="relative z-10 overflow-hidden border-t border-bone/10 pt-20">
      {/* Marquee */}
      <div className="flex select-none overflow-hidden border-y border-bone/10 py-6">
        <div className="animate-marquee flex shrink-0 whitespace-nowrap">
          {[0, 1].map((k) => (
            <span
              key={k}
              className="font-display text-2xl font-light italic text-bone/60 sm:text-4xl"
            >
              {FOOTER.marquee.repeat(3)}
            </span>
          ))}
        </div>
      </div>

      {/* Mega parallax wordmark */}
      <div className="relative flex items-center justify-center px-4 py-16 sm:py-24">
        <motion.h2
          style={{ scale, opacity }}
          className="text-center font-display text-[15vw] font-semibold leading-none tracking-tight text-bone/90"
        >
          {FOOTER.wordmark}
        </motion.h2>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-10 text-sm text-bone/50 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs">{FOOTER.copyright}</p>
        <div className="flex flex-wrap items-center gap-5 font-mono text-xs">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-bone" data-cursor="hover">
            LinkedIn
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-bone" data-cursor="hover">
            GitHub
          </a>
          <a href={LINKS.medium} target="_blank" rel="noopener noreferrer" className="hover:text-bone" data-cursor="hover">
            Medium
          </a>
          <button
            type="button"
            onClick={() => scrollToHash("#hero")}
            className="hover:text-bone"
            data-cursor="hover"
          >
            Back to top ↑
          </button>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ember" />
          {FOOTER.status}
        </div>
      </div>
    </footer>
  );
}
