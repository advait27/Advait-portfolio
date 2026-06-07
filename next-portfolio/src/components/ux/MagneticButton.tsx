"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "ghost";
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

/**
 * Spring-physics magnetic button: pulls toward the cursor on hover with an ember
 * sweep highlight. Renders as <a> when `href` is provided, otherwise <button>.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
  target,
  rel,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.3 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.35);
    y.set(relY * 0.4);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors";
  const styles =
    variant === "primary"
      ? "bg-ember text-carbon hover:bg-ember-highlight"
      : "border border-bone/20 text-bone hover:border-ember/60";

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "ghost" && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ember/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
    </>
  );

  const motionProps = {
    ref: ref as never,
    style: { x: springX, y: springY },
    onMouseMove: handleMove,
    onMouseLeave: reset,
    className: cn(base, styles, className),
    "data-cursor": "hover",
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} onClick={onClick} {...motionProps}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...motionProps}>
      {inner}
    </motion.button>
  );
}
