"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Lazy-load the WebGL scene so it never blocks first paint and is dropped from the
// initial bundle. ssr:false because three.js touches browser-only globals.
const SignalPipeline = dynamic(() => import("./SignalPipeline"), { ssr: false });

/** Static, dependency-free fallback shown under reduced-motion or while the scene loads. */
function StaticPipeline() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-ember-radial opacity-60" />
      <svg viewBox="0 0 400 500" className="h-full w-full" aria-hidden>
        <g stroke="#F37512" strokeOpacity="0.5" strokeWidth="1" fill="none">
          <path d="M120 60 L280 130 L120 200 L280 270 L120 340 L280 410" />
        </g>
        {[
          [120, 60],
          [280, 130],
          [120, 200],
          [280, 270],
          [120, 340],
          [280, 410],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 0 || i === 5 ? 9 : 6} fill="#F37512">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="2.4s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}

export function HeroScene() {
  const reduced = useReducedMotion();
  if (reduced) return <StaticPipeline />;

  return (
    <Suspense fallback={<StaticPipeline />}>
      <SignalPipeline />
    </Suspense>
  );
}
