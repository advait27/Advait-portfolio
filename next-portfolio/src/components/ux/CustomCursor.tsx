"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "hover" | "text" | "view";

/**
 * Lerp-eased dot + ring cursor. Disabled on touch / coarse-pointer devices.
 * Contextual states are driven by `data-cursor` attributes on hovered elements:
 *   data-cursor="hover" | "text" | "view"
 * Links, buttons, and [role=button] default to the "hover" state automatically.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']"
      );
      if (!target) {
        setState("default");
        return;
      }
      const explicit = target.getAttribute("data-cursor") as CursorState | null;
      setState(explicit ?? "hover");
    };

    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.16;
      ring.y += (mouse.y - ring.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  const ringSize =
    state === "view" ? 72 : state === "hover" ? 56 : state === "text" ? 4 : 34;
  const ringBorder = state === "default" ? "rgba(242,242,236,0.5)" : "rgba(243,117,18,0.9)";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-ember"
        style={{ opacity: state === "text" ? 0 : 1 }}
      />
      {/* Ring / contextual */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,border-color] duration-200 ease-out"
        style={{
          width: state === "text" ? 2 : ringSize,
          height: state === "text" ? 26 : ringSize,
          marginLeft: state === "text" ? -1 : -ringSize / 2,
          marginTop: state === "text" ? -13 : -ringSize / 2,
          borderColor: ringBorder,
          borderRadius: state === "text" ? 2 : 9999,
          backgroundColor: state === "text" ? "rgba(243,117,18,0.9)" : "transparent",
        }}
      >
        {state === "view" && (
          <span className="font-mono text-[0.55rem] tracking-widest2 text-ember">VIEW</span>
        )}
      </div>
    </div>
  );
}
