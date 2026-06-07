"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PROJECTS,
  WORK_END_CARD,
  PROJECT_ARCHIVE,
  type Project,
  type ArchiveCategory,
} from "@/lib/content";
import { SectionLabel } from "@/components/ux/SectionLabel";
import { SplitText } from "@/components/ux/SplitText";
import { ProceduralPattern } from "@/components/ux/ProceduralPattern";
import { cn } from "@/lib/utils";

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="view"
      className="group relative flex h-[58vh] max-h-[600px] min-h-[440px] w-[80vw] max-w-[540px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-bone/10 bg-graphite-dark/60 p-7 sm:w-[42vw]"
    >
      {/* Procedural visual */}
      <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-50">
        <ProceduralPattern
          kind={project.pattern}
          accent={project.accent}
          className="h-full w-full"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(5,5,5,0.92) 10%, rgba(5,5,5,0.4) 50%, transparent 100%)`,
        }}
      />

      {/* Corner brackets */}
      {[
        "left-4 top-4 border-l border-t",
        "right-4 top-4 border-r border-t",
        "left-4 bottom-4 border-l border-b",
        "right-4 bottom-4 border-r border-b",
      ].map((pos) => (
        <span
          key={pos}
          className={`pointer-events-none absolute h-5 w-5 border-ember opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${pos}`}
        />
      ))}

      <div className="relative flex items-center justify-between font-mono text-xs text-bone/60">
        <span>{project.index}/04</span>
        <span>{project.year}</span>
      </div>

      <div className="relative">
        <div className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest2 text-ember">
          <span>{project.status}</span>
          <span className="text-bone/30">·</span>
          <span>{project.category}</span>
        </div>
        <h3 className="font-display text-3xl font-semibold leading-tight text-bone sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/70">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-bone/15 px-2.5 py-1 font-mono text-[0.62rem] text-bone/60"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="mt-6 inline-flex items-center gap-2 text-sm text-ember opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View project →
        </span>
      </div>
    </a>
  );
}

function EndCard() {
  return (
    <a
      href={WORK_END_CARD.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="view"
      className="group relative flex h-[58vh] max-h-[600px] min-h-[440px] w-[80vw] max-w-[420px] shrink-0 flex-col items-start justify-center gap-6 overflow-hidden rounded-2xl border border-ember/30 bg-ember/[0.06] p-9 sm:w-[34vw]"
    >
      <span className="font-mono text-xs text-ember">/ ARCHIVE</span>
      <p className="font-display text-3xl font-medium leading-tight text-bone sm:text-4xl">
        {WORK_END_CARD.text}
      </p>
      <span className="inline-flex items-center gap-2 text-sm text-ember">
        Browse GitHub
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </a>
  );
}

const FILTERS: Array<"All" | ArchiveCategory> = ["All", "AI & LLM", "Finance", "Analytics"];

function ArchiveGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const items = PROJECT_ARCHIVE.filter(
    (p) => filter === "All" || p.categories.includes(filter as ArchiveCategory)
  );

  return (
    <div className="mx-auto mt-24 max-w-7xl px-6 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-2xl font-medium text-bone">Full archive</h3>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              data-cursor="hover"
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-xs transition-colors",
                filter === f
                  ? "border-ember bg-ember text-carbon"
                  : "border-bone/15 text-bone/60 hover:border-ember/50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group glass flex items-center justify-between rounded-xl px-5 py-4 transition-colors hover:border-ember/40"
          >
            <span>
              <span className="block text-sm font-medium text-bone">{item.name}</span>
              <span className="label-mono mt-1 block normal-case tracking-wide">
                {item.meta ?? item.categories.join(" · ")}
              </span>
            </span>
            <span className="text-bone/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ember">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function SelectedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (prefersReduced || !isDesktop) return;

    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollDistance = () => track.scrollWidth - window.innerWidth + 80;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="work" ref={sectionRef} className="relative z-10 flex min-h-screen flex-col py-20">
        {/* Title row — in normal flow (no absolute positioning to avoid overlap) */}
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
          <SectionLabel index="01">Selected work</SectionLabel>
          <SplitText
            as="h2"
            by="word"
            className="mt-6 block max-w-3xl font-display text-4xl font-semibold leading-tight text-bone sm:text-6xl"
            segments={[
              { text: "Things I've " },
              { text: "architected", className: "italic text-gradient-ember" },
              { text: ", built & shipped." },
            ]}
          />
        </div>

        {/* Cards — horizontal rail on desktop (pinned), vertical stack on mobile */}
        <div className="mt-12 flex flex-1 items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex flex-col gap-6 px-6 md:flex-row md:gap-8 md:px-10"
          >
            {PROJECTS.map((p) => (
              <ProjectCard key={p.index} project={p} />
            ))}
            <EndCard />
          </div>
        </div>
      </section>

      <ArchiveGrid />
    </>
  );
}
