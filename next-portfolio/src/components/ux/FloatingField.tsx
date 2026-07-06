"use client";

import { useId, useState } from "react";

/** Floating-label input / textarea with an ember underline that animates on focus. */
export function FloatingField({
  label,
  name,
  type = "text",
  textarea = false,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const floated = value.length > 0;

  const sharedClass =
    "peer w-full bg-transparent pt-6 pb-2 text-bone outline-none placeholder-transparent";

  return (
    <div className="relative border-b border-bone/15 focus-within:border-ember transition-colors">
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          placeholder={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={sharedClass}
        />
      )}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-0 font-mono uppercase tracking-widest2 text-bone/45 transition-all duration-200 ${
          floated ? "top-0 text-[0.6rem]" : "top-6 text-xs"
        } peer-focus:top-0 peer-focus:text-[0.6rem] peer-focus:text-ember`}
      >
        {label}
      </label>
    </div>
  );
}
