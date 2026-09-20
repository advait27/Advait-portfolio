"use client";

import { useEffect, useRef, useState } from "react";
import { PODCASTS, PODCAST_INTRO, type Podcast } from "@/lib/content";
import { SectionLabel } from "@/components/ux/SectionLabel";
import { SplitText } from "@/components/ux/SplitText";
import { Reveal } from "@/components/ux/Reveal";

/** Mounts the Spotify iframe only once its card scrolls into view (perf). */
function LazySpotify({ podcast }: { podcast: Podcast }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-[152px] w-full overflow-hidden rounded-xl bg-graphite-dark/60">
      {visible ? (
        <iframe
          title={podcast.title}
          src={podcast.embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ borderRadius: 12 }}
        />
      ) : (
        <div className="flex h-full items-center justify-center font-mono text-xs text-bone/40">
          Loading player…
        </div>
      )}
    </div>
  );
}

export function Podcast() {
  return (
    <section className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="—">Podcast</SectionLabel>
        <SplitText
          as="h2"
          by="word"
          className="mt-6 block max-w-3xl font-display text-4xl font-semibold leading-tight text-bone sm:text-6xl"
          segments={[
            { text: "On the " },
            { text: "mic", className: "italic text-gradient-ember" },
            { text: "." },
          ]}
        />
        <p className="mt-5 max-w-2xl text-bone/60">{PODCAST_INTRO}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PODCASTS.map((p, i) => (
            <Reveal key={p.index} delay={i * 0.08}>
              <article className="glass flex h-full flex-col gap-6 rounded-2xl p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-ember/70">{p.index}</span>
                    <h3 className="mt-2 font-display text-2xl font-medium text-bone">{p.title}</h3>
                    <p className="mt-2 text-sm text-bone/60">{p.tagline}</p>
                  </div>
                  <a
                    href={p.openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="shrink-0 rounded-full border border-bone/15 px-3 py-1.5 font-mono text-[0.62rem] text-bone/70 transition-colors hover:border-ember/50 hover:text-ember"
                  >
                    Open ↗
                  </a>
                </div>

                <LazySpotify podcast={p} />

                <ul className="space-y-2">
                  {p.episodes.map((ep) => (
                    <li key={ep} className="flex items-start gap-2 text-sm text-bone/65">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember" />
                      {ep}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
