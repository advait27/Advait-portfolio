"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT, SITE } from "@/lib/content";
import { SectionLabel } from "@/components/ux/SectionLabel";
import { SplitText } from "@/components/ux/SplitText";
import { FloatingField } from "@/components/ux/FloatingField";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (type: string) =>
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    // Simulated submit — swap for Resend/Formspree (see README).
    setTimeout(() => setStatus("sent"), 1400);
  };

  return (
    <section id="contact" className="relative z-10 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="05">Contact</SectionLabel>
        <h2 className="mt-6 font-display text-5xl font-semibold leading-[1.02] text-bone sm:text-7xl">
          <SplitText by="word" segments={[{ text: CONTACT.headline.line1 }]} className="block" />
          <SplitText
            by="word"
            delay={0.15}
            segments={[{ text: CONTACT.headline.line2, className: "italic text-gradient-ember" }]}
            className="block"
          />
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          {/* Form */}
          <div className="glass rounded-2xl p-8">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[420px] flex-col items-start justify-center gap-4"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-ember text-ember">
                    ✓
                  </span>
                  <p className="max-w-md font-display text-2xl leading-snug text-bone">
                    {CONTACT.successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setSelected([]);
                    }}
                    className="font-mono text-xs text-ember"
                    data-cursor="hover"
                  >
                    ← Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FloatingField label="Name" name="name" required />
                    <FloatingField label="Email" name="email" type="email" required />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FloatingField label="Company" name="company" />
                    <FloatingField label="Engagement type" name="engagement" />
                  </div>

                  {/* Project-type chips */}
                  <div>
                    <p className="label-mono mb-3">Project type</p>
                    <div className="flex flex-wrap gap-2">
                      {CONTACT.projectTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggle(type)}
                          data-cursor="hover"
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 font-mono text-[0.65rem] transition-colors",
                            selected.includes(type)
                              ? "border-ember bg-ember text-carbon"
                              : "border-bone/15 text-bone/65 hover:border-ember/50"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <FloatingField label="Message" name="message" textarea required />

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    data-cursor="hover"
                    className="group relative mt-2 inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-bone px-7 py-3.5 text-sm font-medium text-carbon transition-colors disabled:opacity-70"
                  >
                    <span className="relative z-10">
                      {status === "sending" ? "Sending…" : "Send message"}
                    </span>
                    <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-ember transition-transform duration-500 group-hover:translate-x-0" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="label-mono mb-3">Direct</p>
              <a
                href={`mailto:${SITE.email}`}
                data-cursor="hover"
                className="font-display text-2xl font-medium text-bone underline-offset-4 transition-colors hover:text-ember sm:text-3xl"
              >
                {SITE.email}
              </a>
            </div>

            <div>
              <p className="label-mono mb-4">Channels</p>
              <ul className="space-y-3">
                {CONTACT.channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      data-cursor="hover"
                      className="group flex items-center justify-between border-b border-bone/10 pb-3 transition-colors hover:border-ember/40"
                    >
                      <span className="font-mono text-xs uppercase tracking-widest2 text-bone/50">
                        {c.label}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-bone/80 group-hover:text-ember">
                        {c.value}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-mono mb-3">Currently</p>
              <p className="text-sm leading-relaxed text-bone/65">{CONTACT.currently}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
