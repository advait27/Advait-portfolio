# Advait Dharmadhikari / AI systems studio

A responsive portfolio for a Forward Deployed Engineer working in Applied AI.
The design leads with independent systems, customer delivery and verifiable
outcomes, with interactive 3D presentations that explain the architecture.

**Live:** [advaitdharmadhikari.netlify.app](https://advaitdharmadhikari.netlify.app)

## Experience

- An editorial hero with the owner's current GitHub portrait and an interactive
  orbital intelligence core.
- EADIP and Veritas showcases, followed by a systems lab with three selectable
  architecture walkthroughs: EADIP, Veritas and previous work on ClawbackVault.
  Visitors select stages through native buttons or 3D nodes, orbit the view,
  reset the camera, and pause motion.
- Seven existing sections: About, Resume, Research, Portfolio, Blog, Podcast
  and Contact. Hash links, project filtering, DOI links, BibTeX copy, Spotify
  embeds, testimonials and the contact form are preserved.
- A corrected two-page downloadable CV with embedded fonts.
- The existing grounded assistant and interactive terminal, updated to match
  the visible profile. API keys remain server-side.

The 3D scenes are explanatory illustrations. They do not display live customer
data, production telemetry or measured performance. Historical outcomes retain
employer labels. Frensei is a previous role, **October 2025–October 2026**.
The UCD MSc dates are **September 2025–August 2026**. IndiGo appointments
are separate: ML engineering in January 2024–August 2025 and BI engineering
in June–December 2023.

## Local development

The site remains buildless HTML, CSS and JavaScript, compatible with the
existing Netlify deployment.

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. To include the serverless assistant, use an
installed Netlify CLI (`netlify dev`). The optional `NVIDIA_API_KEY` belongs in
Netlify environment variables or an ignored local `.env`; it must never be
committed or sent to the browser. `NVIDIA_MODEL` and `NVIDIA_FALLBACK_MODEL`
are optional existing overrides.

```sh
npm run check
npm run functions:check
```

## Source map

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic content, navigation, stage controls and static fallbacks |
| `assets/css/studio.css` | Studio design, responsive layouts and reduced-motion rules |
| `assets/css/style.css` | Existing components, forms, chat and terminal foundations |
| `assets/css/motion.css` | Existing research figures and presentation components |
| `assets/js/studio.js` | Architecture narratives, controls, clock and optional WebGL |
| `assets/js/script.js` | Routing, filters, contact form and citation copy |
| `assets/js/vendor/` | Local Three.js 0.160.0, OrbitControls and licence |
| `assets/data/portfolio-kb.json` | Grounding facts and section anchors for the assistant |
| `assets/js/terminal.js` | Keyboard-accessible virtual profile filesystem |
| `netlify/functions/ask.mjs` | Existing server-side NVIDIA API proxy and guardrails |
| `assets/Advait_Dharmadhikari.pdf` | Current two-page CV |

The original `motion.js` and `pipeline.js` remain as legacy source and are no
longer loaded. GSAP is not a runtime dependency. Three.js and OrbitControls
are bundled locally at the same pinned version used before the redesign.

## Graphics and accessibility

WebGL enhances readable HTML and static SVG/CSS illustrations. If WebGL or a
module fails, all architecture copy and stage buttons continue to work. With
`prefers-reduced-motion: reduce`, the site does not initialize WebGL and shows
static architecture graphics. Motion controls let visitors pause animation.

A shared requestAnimationFrame scheduler updates visible scenes at about
30 fps, caps pixel ratio at 1.5, and stops when paused, offscreen, in another
section or in a hidden tab. ResizeObserver maintains responsive cameras;
context loss restores the static view. Geometry, materials, controls and
observers are disposed on page exit. Native stage buttons are equivalent to
selecting the 3D nodes.

Career facts live in the HTML, assistant KB, terminal and CV. Update all four
together. The supplied LinkedIn export informed dates and experience and is
not bundled with this repository. Existing providers (Google Fonts, Ionicons,
Spotify, Formspree and the server-side NVIDIA service) retain their roles.

## Deployment

`netlify.toml` publishes the repository root, bundles the knowledge base with
the function, and preserves `/api/ask`. Push to the connected GitHub production
branch to use the existing Netlify deployment. Netlify runs `node scripts/check-site.mjs` before publication; the same check
runs in GitHub Actions. No new hosting account, framework build, secrets or
database are required.

## Credits and licence

The original component foundation was adapted from
[vCard by codewithsadee](https://github.com/codewithsadee/vcard-personal-portfolio)
(MIT). Its licence remains in `LICENSE`. Three.js and OrbitControls retain
their MIT licence under `assets/js/vendor/THREE-LICENSE.txt`.

Profile copy, research, images and project descriptions belong to their
respective owners.
