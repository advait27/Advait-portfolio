/**
 * Minimal className combiner — joins truthy class fragments with a space.
 * Kept dependency-free on purpose (no clsx/tailwind-merge) to keep the bundle lean.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
