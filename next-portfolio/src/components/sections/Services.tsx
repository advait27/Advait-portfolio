"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SERVICES, type Service } from "@/lib/content";
import { scrollToHash } from "@/lib/scroll";
import { SectionLabel } from "@/components/ux/SectionLabel";
import { SplitText } from "@/components/ux/SplitText";
import { Reveal } from "@/components/ux/Reveal";

function ServiceCard({ service }: { service: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ ry: (px - 0.5) * 10, rx: -(py - 0.5) * 10 });
    setSpot({ x: px * 100, y: py * 100 });
  };

  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
      className="group glass relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl p-7 transition-transform duration-200"
      data-cursor="hover"
    >
      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${spot.x}% ${spot.y}%, rgba(243,117,18,0.14), transparent 60%)`,
        }}
      />
      {/* Metal sheen */}
      <div className="metal-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Corner brackets */}
      {[
        "left-3 top-3 border-l border-t",
        "right-3 top-3 border-r border-t",
        "left-3 bottom-3 border-l border-b",
        "right-3 bottom-3 border-r border-b",
      ].map((pos) => (
        <span
          key={pos}
          className={`pointer-events-none absolute h-4 w-4 border-ember/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${pos}`}
        />
      ))}

      <div className="relative">
        <span className="font-mono text-sm text-ember/70">{service.index}</span>
        <h3 className="mt-4 font-display text-2xl font-medium leading-snug text-bone">
          {service.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-bone/60">{service.description}</p>
      </div>

      {/* Capability pills — expand on hover */}
      <div className="relative mt-6 flex flex-wrap gap-2">
        {service.pills.map((pill) => (
          <span
            key={pill}
            className="rounded-full border border-bone/15 px-3 py-1 font-mono text-[0.65rem] text-bone/55 transition-all duration-300 group-hover:border-ember/40 group-hover:text-bone/80"
          >
            {pill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="02">What I do</SectionLabel>
        <SplitText
          as="h2"
          by="word"
          className="mt-6 block max-w-3xl font-display text-4xl font-semibold leading-tight text-bone sm:text-6xl"
          segments={[
            { text: "Systems, strategy, and " },
            { text: "decisions", className: "italic text-gradient-ember" },
            { text: " that ship." },
          ]}
          data-cursor="text"
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.index} delay={i * 0.06}>
              <ServiceCard service={s} />
            </Reveal>
          ))}

          {/* 6th CTA card */}
          <Reveal delay={SERVICES.length * 0.06}>
            <button
              type="button"
              onClick={() => scrollToHash("#contact")}
              className="group relative flex h-full min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-ember/30 bg-ember/[0.06] p-7 text-left transition-colors hover:bg-ember/[0.12]"
              data-cursor="hover"
            >
              <span className="font-mono text-sm text-ember/70">06</span>
              <div>
                <h3 className="font-display text-3xl font-medium leading-tight text-bone">
                  Have a problem worth solving?
                </h3>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-ember">
                  Start a conversation
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
