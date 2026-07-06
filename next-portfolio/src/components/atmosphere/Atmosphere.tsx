/**
 * Fixed atmospheric background: industrial grid, ambient ember orbs, and the
 * film-grain overlay. Purely decorative — pointer-events disabled, sits behind content.
 */
export function Atmosphere() {
  return (
    <>
      {/* Industrial grid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-industrial-grid bg-grid opacity-60"
        style={{
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, black 30%, transparent 85%)",
        }}
      />

      {/* Floating ambient gradient orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-float absolute -left-40 top-[8%] h-[36rem] w-[36rem] rounded-full bg-ember/10 blur-[140px]" />
        <div
          className="animate-float absolute right-[-12rem] top-[42%] h-[30rem] w-[30rem] rounded-full bg-ember-deep/10 blur-[150px]"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="animate-float absolute left-[30%] bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-ember/5 blur-[130px]"
          style={{ animationDelay: "-5s" }}
        />
      </div>

      {/* Film grain */}
      <div aria-hidden className="grain" />
    </>
  );
}
