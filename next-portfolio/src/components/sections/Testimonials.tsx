"use client";

import { TESTIMONIALS } from "@/lib/content";
import { SectionLabel } from "@/components/ux/SectionLabel";
import { Reveal } from "@/components/ux/Reveal";

export function Testimonials() {
  return (
    <section className="relative z-10 px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="—">Words from clients</SectionLabel>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="glass relative flex h-full flex-col justify-between rounded-2xl p-8">
                <span className="font-display text-6xl leading-none text-ember/40">&ldquo;</span>
                <blockquote className="-mt-6 font-display text-xl font-light leading-relaxed text-bone/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <span className="h-px w-8 bg-ember/50" />
                  <span className="font-mono text-sm text-bone/70">{t.name}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
