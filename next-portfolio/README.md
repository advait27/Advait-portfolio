# Advait Dharmadhikari — Portfolio

A cinematic, immersive personal portfolio for **Advait Dharmadhikari**, AI Strategy &
Forward Deployed Engineer. Dark industrial creative-studio aesthetic, a generative
Three.js "AI signal pipeline" hero, GSAP-pinned horizontal work gallery, Lenis smooth
scroll, a custom cursor, and a single content config so copy is trivial to edit.

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript** (strict)
- **Three.js r169** + `@react-three/fiber` / `drei` / `postprocessing`
- **GSAP 3.12** + ScrollTrigger (pinned horizontal scroll)
- **Framer Motion 11** (reveals, split-text, transitions)
- **Lenis** smooth inertia scrolling (synced to the GSAP ticker)
- **Tailwind CSS 3.4** with a custom carbon/ember theme

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (next/core-web-vitals)
npm run typecheck  # tsc --noEmit
```

> Requires Node ≥ 18.17.

## Editing content

**All copy, links, dates, and figures live in one file:**
[`src/lib/content.ts`](src/lib/content.ts). Components contain no hardcoded copy — edit
this file to update projects, articles, podcasts, experience, education, testimonials,
contact details, and the project archive. The canonical LinkedIn URL is defined once
(`LINKEDIN_URL`) and reused everywhere.

### Swap the resume PDF

The Resume link (mobile nav overlay) points to `/Advait_Dharmadhikari.pdf`. Drop your
real PDF into [`public/`](public) with exactly that filename — no code changes needed.
(`public/Advait_Dharmadhikari.pdf.README.txt` is just a reminder and can be deleted.)

### Replace the OG image

Edit [`public/og.svg`](public/og.svg) (1200×630). It's referenced from the metadata in
[`src/app/layout.tsx`](src/app/layout.tsx).

### Wire up the contact form

The form in [`src/components/sections/Contact.tsx`](src/components/sections/Contact.tsx)
currently **simulates** submission (1.4s → success state). To make it real:

**Formspree** — replace the `onSubmit` body with a `fetch` to your form endpoint:

```ts
const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("sending");
  const data = new FormData(e.target as HTMLFormElement);
  await fetch("https://formspree.io/f/<your-id>", {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  });
  setStatus("sent");
};
```

**Resend** — create a Route Handler at `src/app/api/contact/route.ts` that calls the
Resend SDK with your `RESEND_API_KEY`, then POST the form data to `/api/contact`.

## Design system

- **Palette** — Carbon `#050505`, Ember `#F37512` / highlight `#FBD5A5`, Bone `#F2F2EC`
- **Type** — Display: Fraunces · Body: Geist · Mono: JetBrains Mono (all via
  `next/font/google`, exposed as CSS variables in `tailwind.config.ts`)
- **Atmospherics** — industrial grid, ambient ember orbs, film-grain overlay, vignette
  (see `src/components/atmosphere/Atmosphere.tsx` and `globals.css`)

## Accessibility & performance

- `prefers-reduced-motion` fully respected — Lenis is skipped, the 3D scene falls back to
  a static SVG, and animations collapse.
- The Three.js scene is lazy-loaded (`next/dynamic`, `ssr:false`) and never blocks first
  paint. Post-processing (Bloom + Chromatic Aberration + Vignette) auto-disables on small
  screens or when `hardwareConcurrency < 4`; DPR scales accordingly.
- Spotify iframes mount only when scrolled into view (IntersectionObserver).
- The custom cursor is disabled on touch / coarse-pointer devices.
- The horizontal work gallery falls back to a vertical stack on mobile.

## Deployment

### Vercel (recommended)

1. Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected). No config changes required.
3. Set the production domain, then update `SITE.baseUrl` in `src/lib/content.ts` and
   `metadataBase` resolves automatically from it.

Or via CLI:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

### Netlify

Netlify runs Next.js via the official Next runtime — no extra config needed.

1. New site from Git → pick the repo.
2. Build command: `next build` · Publish directory: `.next` (the
   `@netlify/plugin-nextjs` plugin is applied automatically).
3. Deploy.

`metadataBase` defaults to `https://advaitdharmadhikari.netlify.app` — change `SITE.baseUrl`
in `src/lib/content.ts` to your final domain.

## Project structure

```
src/
  app/            layout, page, globals.css, sitemap.ts, robots.ts, icon.svg
  components/
    atmosphere/   fixed grid + orbs + grain
    layout/       Navigation, Footer
    providers/    SmoothScroll (Lenis + GSAP)
    sections/     Hero, Services, SelectedWork, Experience, About,
                  Testimonials, Writing, Podcast, Contact
    three/        HeroScene (lazy), SignalPipeline (R3F)
    ux/           CustomCursor, PageLoader, ScrollProgress, MagneticButton,
                  SplitText, Reveal, CountUp, SectionLabel, FloatingField,
                  ProceduralPattern
  hooks/          useReducedMotion
  lib/            content.ts (single source of truth), scroll.ts, utils.ts
public/           og.svg, resume PDF slot
```
