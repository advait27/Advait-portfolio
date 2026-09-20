"use client";

import { motion, type Variants } from "framer-motion";
import { type ElementType, type ReactNode } from "react";

/**
 * Character- or word-by-word reveal with overflow-hidden masks and descender-safe
 * bottom padding (so g / y / p / j are never clipped). Triggers when scrolled into view.
 *
 * `segments` lets you style runs differently (e.g. an italic ember word in a headline).
 */
type Segment = { text: string; className?: string };

type SplitTextProps = {
  text?: string;
  segments?: Segment[];
  as?: ElementType;
  className?: string;
  by?: "char" | "word";
  delay?: number;
  stagger?: number;
  once?: boolean;
};

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const child: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function renderUnits(text: string, by: "char" | "word", className?: string): ReactNode[] {
  const units = by === "char" ? Array.from(text) : text.split(/(\s+)/);
  return units.map((u, i) => {
    if (u === " " || /^\s+$/.test(u)) {
      return (
        <span key={`s-${i}`} className="reveal-mask">
          <span className="reveal-char">&nbsp;</span>
        </span>
      );
    }
    return (
      <span key={`u-${i}`} className={`reveal-mask ${className ?? ""}`}>
        <motion.span className="reveal-char" variants={child}>
          {u}
        </motion.span>
      </span>
    );
  });
}

export function SplitText({
  text,
  segments,
  as: Tag = "span",
  className = "",
  by = "char",
  delay = 0,
  stagger = 0.026,
  once = true,
}: SplitTextProps) {
  const segs: Segment[] = segments ?? (text ? [{ text }] : []);

  const MotionTag = motion(Tag);

  return (
    <MotionTag
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
    >
      {segs.map((seg, i) => (
        <span key={i}>{renderUnits(seg.text, by, seg.className)}</span>
      ))}
    </MotionTag>
  );
}
