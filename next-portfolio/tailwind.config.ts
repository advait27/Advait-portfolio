import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#050505",
        graphite: {
          DEFAULT: "#16161a",
          light: "#1f1f24",
          dark: "#0c0c0e",
        },
        ember: {
          DEFAULT: "#F37512",
          highlight: "#FBD5A5",
          deep: "#b9550a",
        },
        bone: "#F2F2EC",
        rust: "#9c4a1a",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      backgroundImage: {
        "industrial-grid":
          "linear-gradient(to right, rgba(242,242,236,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,242,236,0.04) 1px, transparent 1px)",
        "ember-radial":
          "radial-gradient(circle at center, rgba(243,117,18,0.18), transparent 70%)",
      },
      backgroundSize: {
        grid: "64px 64px",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.7)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
