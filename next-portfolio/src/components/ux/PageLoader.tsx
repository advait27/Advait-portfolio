"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Theatrical first-paint loader: rotating diamond + a 0→100 progress count.
 * Disappears after the count completes; only shows once per page load.
 */
export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Ease toward 100 with a little jitter so it feels organic.
      const step = current < 70 ? 4 + Math.round((100 - current) / 16) : 3;
      current = Math.min(100, current + step);
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 420);
      }
    }, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-carbon"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          <motion.div
            className="h-7 w-7 border border-ember"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            style={{ transform: "rotate(45deg)" }}
          />
          <div className="mt-8 font-mono text-xs tracking-widest2 text-bone/50">LOADING</div>
          <div className="mt-3 font-display text-5xl font-light tabular-nums text-bone">
            {String(progress).padStart(3, "0")}
          </div>
          <div className="mt-6 h-px w-48 overflow-hidden bg-bone/10">
            <motion.div
              className="h-full bg-ember"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
