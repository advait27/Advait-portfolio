"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { ABOUT } from "@/lib/content";
import { SectionLabel } from "@/components/ux/SectionLabel";
import { SplitText } from "@/components/ux/SplitText";
import { Reveal } from "@/components/ux/Reveal";
import { CountUp } from "@/components/ux/CountUp";

/** Renders a bio paragraph, turning *…* runs into italic ember emphasis. */
function BioText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <p className="text-base leading-relaxed text-bone/70">
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className="font-display italic text-ember">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </p>
  );
}

function SkillBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-bone/80">{label}</span>
        <span className="font-mono text-xs text-ember">{value}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bone/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-ember-deep via-ember to-ember-highlight bg-[length:200%_100%] animate-shimmer"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="—">About</SectionLabel>
        <h2 className="mt-6 font-display text-4xl font-semibold leading-tight text-bone sm:text-6xl">
          <SplitText by="word" segments={[{ text: ABOUT.headline.line1 }]} className="block" />
          <SplitText
            by="word"
            delay={0.15}
            segments={[{ text: ABOUT.headline.line2, className: "italic text-gradient-ember" }]}
            className="block"
          />
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-16">
          {/* Portrait / monogram card */}
          <Reveal>
            <div className="glass relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl p-6">
              {/* corner brackets */}
              {[
                "left-3 top-3 border-l border-t",
                "right-3 top-3 border-r border-t",
                "left-3 bottom-3 border-l border-b",
                "right-3 bottom-3 border-r border-b",
              ].map((pos) => (
                <span key={pos} className={`absolute h-5 w-5 border-ember/50 ${pos}`} />
              ))}

              <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest2 text-bone/50">
                <span>{ABOUT.card.metaLabel}</span>
                <span className="flex items-center gap-1.5 text-ember">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ember" />
                  {ABOUT.card.status}
                </span>
              </div>

              {/* Monogram */}
              <div className="flex flex-1 items-center justify-center">
                <div className="relative font-display text-[10rem] font-bold leading-none">
                  <span className="text-bone">{ABOUT.monogram.a}</span>
                  <span className="-ml-8 italic text-gradient-ember">{ABOUT.monogram.d}</span>
                </div>
              </div>

              <p className="font-mono text-[0.68rem] leading-relaxed text-bone/55">
                {ABOUT.card.caption}
              </p>
            </div>
          </Reveal>

          {/* Bio + stack */}
          <div>
            <div className="space-y-5">
              {ABOUT.bio.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <BioText text={p} />
                </Reveal>
              ))}
            </div>

            {/* Tech-stack pills */}
            <div className="mt-10 space-y-4">
              {ABOUT.stack.map((row) => (
                <div key={row.label} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="label-mono w-36 shrink-0">{row.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {row.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-bone/15 px-3 py-1 font-mono text-[0.65rem] text-bone/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Counter stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 border-y border-bone/10 py-10 sm:grid-cols-4">
          {ABOUT.stats.map((s) => (
            <div key={s.label}>
              <span className="font-display text-4xl font-semibold text-bone sm:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} pad={"pad" in s ? s.pad : false} />
              </span>
              <span className="label-mono mt-2 block normal-case tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Skill bars */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-3xl">
          {ABOUT.skills.map((s) => (
            <SkillBar key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>
    </section>
  );
}
