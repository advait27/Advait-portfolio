"use client";

/**
 * Smooth-scroll to a hash target via Lenis when available, falling back to native
 * scrollIntoView (used under reduced-motion or before Lenis mounts).
 */
export function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (!el) return;

  if (typeof window !== "undefined" && window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -8, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
