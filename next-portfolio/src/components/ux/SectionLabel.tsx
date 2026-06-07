import { cn } from "@/lib/utils";

/** Numbered mono eyebrow used to head each major section. */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="font-mono text-xs text-ember">{index}</span>
      <span className="h-px w-8 bg-ember/40" />
      <span className="label-mono">{children}</span>
    </div>
  );
}
