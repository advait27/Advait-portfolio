"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin ember progress bar pinned to the right edge of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      className="fixed right-0 top-0 z-50 h-screen w-[2px] origin-top bg-ember"
      style={{ scaleY }}
    />
  );
}
