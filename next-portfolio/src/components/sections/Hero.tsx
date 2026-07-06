"use client";

import { motion } from "framer-motion";
import { HERO } from "@/lib/content";
import { scrollToHash } from "@/lib/scroll";
import { SplitText } from "@/components/ux/SplitText";
import { MagneticButton } from "@/components/ux/MagneticButton";
import { HeroScene } from "@/components/three/HeroScene";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-28 sm:px-10"
    >
      {/* Top metadata strip */}
      <motion.p
        className="label-mono absolute left-6 top-24 max-w-full truncate sm:left-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {HERO.metaStrip}
      </motion.p>

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 py-10 lg:grid-cols-2">
        {/* LEFT: copy */}
        <div className="order-2 lg:order-1">
          <motion.p
            className="font-mono text-sm tracking-wide text-ember"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {HERO.eyebrow}
          </motion.p>

          <h1
            className="mt-5 font-display text-[14vw] font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]"
            data-cursor="text"
          >
            <SplitText
              by="char"
              stagger={0.03}
              delay={0.6}
              segments={[{ text: `${HERO.headline.lead} ` }]}
              className="block text-bone"
            />
            <SplitText
              by="char"
              stagger={0.03}
              delay={0.9}
              segments={[
                { text: HERO.headline.emphasis, className: "italic text-gradient-ember" },
                { text: ` ${HERO.headline.trail}`, className: "text-bone" },
              ]}
              className="block"
            />
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            {HERO.subtitle}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <MagneticButton onClick={() => scrollToHash("#work")} variant="primary">
              View Work
            </MagneticButton>
            <MagneticButton onClick={() => scrollToHash("#contact")} variant="ghost">
              Get in touch
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-8 flex items-center gap-2 font-mono text-xs text-bone/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-ember" />
            {HERO.availability}
          </motion.div>
        </div>

        {/* RIGHT: 3D signal pipeline */}
        <div className="order-1 h-[44vh] w-full lg:order-2 lg:h-[68vh]">
          <HeroScene />
        </div>
      </div>

      {/* Footer stat bar */}
      <motion.div
        className="mx-auto grid w-full max-w-7xl grid-cols-3 gap-4 border-t border-bone/10 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        {HERO.stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="font-display text-2xl font-semibold text-bone sm:text-4xl">
              {s.value}
            </span>
            <span className="label-mono mt-1 normal-case tracking-wide">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
