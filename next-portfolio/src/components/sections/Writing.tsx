"use client";

import { ARTICLES, WRITING_INTRO, LINKS } from "@/lib/content";
import { SectionLabel } from "@/components/ux/SectionLabel";
import { SplitText } from "@/components/ux/SplitText";
import { Reveal } from "@/components/ux/Reveal";

export function Writing() {
  return (
    <section id="writing" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="04">Writing</SectionLabel>
        <SplitText
          as="h2"
          by="word"
          className="mt-6 block max-w-3xl font-display text-4xl font-semibold leading-tight text-bone sm:text-6xl"
          segments={[
            { text: "Thinking out " },
            { text: "loud", className: "italic text-gradient-ember" },
            { text: "." },
          ]}
        />
        <p className="mt-5 max-w-xl text-bone/60">{WRITING_INTRO}</p>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <Reveal key={a.href} delay={(i % 3) * 0.05}>
              <a
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group glass flex h-full flex-col justify-between rounded-2xl p-6 transition-colors hover:border-ember/40"
              >
                <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest2 text-bone/50">
                  <span className="text-ember/80">{a.category}</span>
                  <span>{a.date}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-medium leading-snug text-bone">
                  {a.title}
                </h3>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-bone/50 transition-colors group-hover:text-ember">
                  Read on Medium
                  <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </span>
              </a>
            </Reveal>
          ))}

          {/* Read all card */}
          <Reveal delay={0.1}>
            <a
              href={LINKS.medium}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group flex h-full min-h-[180px] flex-col items-start justify-center gap-4 rounded-2xl border border-ember/30 bg-ember/[0.06] p-6 transition-colors hover:bg-ember/[0.12]"
            >
              <span className="font-display text-2xl font-medium text-bone">
                Read all on Medium
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-ember">
                17 articles & counting
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
