"use client";

import { motion } from "framer-motion";
import {
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
  type ExperienceItem,
  type EducationItem,
} from "@/lib/content";
import { SectionLabel } from "@/components/ux/SectionLabel";
import { SplitText } from "@/components/ux/SplitText";
import { Reveal } from "@/components/ux/Reveal";

function TimelineEntry({
  item,
  i,
}: {
  item: ExperienceItem | EducationItem;
  i: number;
}) {
  const title = "role" in item ? item.role : item.degree;
  const org = "location" in item && item.location ? `${item.org} · ${item.location}` : item.org;

  return (
    <motion.li
      className="relative pl-7"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
    >
      {/* Rail + node */}
      <span className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ember" />
      <span className="absolute left-0 top-1.5 h-full w-px -translate-x-1/2 bg-bone/10" />

      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h4 className="font-display text-lg font-medium leading-snug text-bone">{title}</h4>
        <span className="font-mono text-xs text-ember/80">{item.dates}</span>
      </div>
      <p className="mt-1 font-mono text-xs text-bone/55">{org}</p>
      <p className="mt-2 text-sm leading-relaxed text-bone/65">{item.description}</p>
    </motion.li>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="03">Experience & education</SectionLabel>
        <SplitText
          as="h2"
          by="word"
          className="mt-6 block max-w-3xl font-display text-4xl font-semibold leading-tight text-bone sm:text-6xl"
          segments={[
            { text: "A track record of " },
            { text: "shipping", className: "italic text-gradient-ember" },
            { text: "." },
          ]}
        />

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Experience rail */}
          <div>
            <p className="label-mono mb-8">Experience</p>
            <ol className="space-y-9">
              {EXPERIENCE.map((item, i) => (
                <TimelineEntry key={item.index} item={item} i={i} />
              ))}
            </ol>
          </div>

          {/* Education rail */}
          <div>
            <p className="label-mono mb-8">Education</p>
            <ol className="space-y-9">
              {EDUCATION.map((item, i) => (
                <TimelineEntry key={item.index} item={item} i={i} />
              ))}
            </ol>
          </div>
        </div>

        {/* Certifications & recognition */}
        <Reveal className="mt-20">
          <p className="label-mono mb-5">Certifications & recognition</p>
          <div className="flex flex-wrap gap-2.5">
            {CERTIFICATIONS.map((c) => (
              <span
                key={c}
                className="glass rounded-full px-4 py-2 font-mono text-[0.68rem] text-bone/70"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
