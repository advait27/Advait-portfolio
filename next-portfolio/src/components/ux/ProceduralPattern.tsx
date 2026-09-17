import type { PatternKind } from "@/lib/content";

/**
 * Pure-SVG procedural visuals for project cards — no stock photos. Each kind renders
 * in the project's accent color: mesh / circles / grid / lines.
 */
export function ProceduralPattern({
  kind,
  accent,
  className,
}: {
  kind: PatternKind;
  accent: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="200" height="200" fill="transparent" />
      <g stroke={accent} strokeOpacity="0.55" fill="none" strokeWidth="0.8">
        {kind === "grid" &&
          Array.from({ length: 11 }).flatMap((_, i) => [
            <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={200} />,
            <line key={`h${i}`} x1={0} y1={i * 20} x2={200} y2={i * 20} />,
          ])}

        {kind === "lines" &&
          Array.from({ length: 16 }).map((_, i) => (
            <line key={i} x1={-40 + i * 20} y1={0} x2={60 + i * 20} y2={200} />
          ))}

        {kind === "circles" &&
          Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={100} cy={100} r={10 + i * 11} strokeOpacity={0.5 - i * 0.04} />
          ))}

        {kind === "mesh" && (
          <>
            {Array.from({ length: 7 }).flatMap((_, r) =>
              Array.from({ length: 7 }).map((_, c) => {
                const x = 20 + c * 27;
                const y = 20 + r * 27;
                return <circle key={`${r}-${c}`} cx={x} cy={y} r={1.6} fill={accent} stroke="none" />;
              })
            )}
            {Array.from({ length: 7 }).map((_, r) => (
              <line key={`mh${r}`} x1={20} y1={20 + r * 27} x2={182} y2={20 + r * 27} strokeOpacity={0.25} />
            ))}
            {Array.from({ length: 7 }).map((_, c) => (
              <line key={`mv${c}`} x1={20 + c * 27} y1={20} x2={20 + c * 27} y2={182} strokeOpacity={0.25} />
            ))}
          </>
        )}
      </g>
    </svg>
  );
}
