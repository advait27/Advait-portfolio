# Advait Dharmadhikari — Personal Portfolio

> **Applied AI Engineer & Technical Advisor** · LLM · RAG · Agentic Systems · Solutions Architecture · Evaluation Frameworks

A fast, fully responsive single-page portfolio for **Advait Dharmadhikari** — an applied-AI engineer who builds production LLM applications and partners with founders and engineering teams to turn them into adopted products. Built with vanilla HTML, CSS, and JavaScript (no framework, no build step) and themed around a dark, glassmorphic AI aesthetic.

**🌐 Live:** [advaitdharmadhikari.netlify.app](https://advaitdharmadhikari.netlify.app)

![Desktop preview](./website-demo-image/desktop.png)

---

## About

Advait works at the intersection of AI systems, business strategy, and technology consulting — translating complex problems into production-ready intelligence systems that people actually use. He has shipped LLM products on the Claude Developer Platform (Claude Sonnet 4.6), led ML-driven optimisation across a 300+ aircraft fleet at IndiGo, and is completing an MSc in Business Analytics at UCD Michael Smurfit.

This site is the single source of truth for his work, writing, projects, and podcasts.

## Features

- **Six sections** — About, Resume, Portfolio, Blog, Podcast, and Contact, switched client-side with no page reloads.
- **Dynamic hero** — typed-text rotator, animated metric counters, and on-scroll reveal animations.
- **"Currently building" spotlight** — highlights the flagship project, **ClawbackVault AI**.
- **Portfolio** — gradient project cards sourced from real GitHub repositories and published Python packages (`esgprofiler`, `finfeatures`, `Finance-AutoML`, and more), with category filtering.
- **Podcast page** — embedded Spotify players for both shows, *The Business Technologist* and *5 Minute Boosters*, with episode highlights.
- **Blog** — long-form articles published on Medium.
- **Contact** — direct contact methods plus a working contact form (Formspree) with a spam honeypot.
- **Shareable deep links** — every section is addressable via a URL hash (e.g. `#podcast`, `#resume`).
- **Accessible & responsive** — keyboard-focusable, `prefers-reduced-motion` aware, and tuned from mobile to wide desktop.
- **Downloadable résumé** — one-click PDF download.

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Hand-written CSS with custom properties (no framework) |
| Behaviour | Vanilla JavaScript (ES2020) — no dependencies, no bundler |
| Icons | [Ionicons](https://ionic.io/ionicons) |
| Fonts | Space Grotesk + JetBrains Mono (Google Fonts) |
| Forms | [Formspree](https://formspree.io) |
| Hosting | Netlify |

## Project structure

```
.
├── index.html                    # All page sections live here
├── assets/
│   ├── css/style.css             # Theme, components, and responsive rules
│   ├── js/script.js              # Navigation, hash routing, animations, form, filters
│   ├── images/                   # Avatar, project & blog visuals, icons
│   └── Advait_Dharmadhikari.pdf  # Downloadable résumé
├── website-demo-image/           # Preview screenshots
└── README.md
```

## Run locally

No build step is required — it's a static site. Clone it and serve the folder over HTTP:

```bash
git clone https://github.com/advait27/Advait-portfolio.git
cd Advait-portfolio

# Python (built in on macOS/Linux)
python3 -m http.server 8000
```

Then open **http://localhost:8000**. Any static server works (`npx serve`, the VS Code Live Server extension, etc.). Opening `index.html` directly via `file://` mostly works, but a local server is recommended so fonts, icons, and the Spotify embeds load correctly.

## Customisation notes

- **Content** lives entirely in `index.html`, grouped by `<article data-page="...">` sections.
- **Theme colours** are CSS custom properties at the top of `assets/css/style.css` (`--orange-yellow-crayola`, `--accent-lime`, gradients, etc.).
- **Navigation is automatic** — add a nav `<button data-nav-link>Name</button>` plus a matching `<article data-page="name">` (in the same order) and the router wires it up.
- ⚠️ The global rule `article { display: none }` hides any `<article>` that isn't the active page. Don't use `<article>` for sub-components without overriding `display`.

## Connect

- **LinkedIn:** [in/advaitdharmadhikari](https://www.linkedin.com/in/advaitdharmadhikari)
- **GitHub:** [@advait27](https://github.com/advait27)
- **Medium:** [@advaitdharmadhikari7](https://medium.com/@advaitdharmadhikari7)
- **Podcasts:** [The Business Technologist](https://open.spotify.com/show/2nMlpUNSqh9ZiI1vsg5B1g) · [5 Minute Boosters](https://open.spotify.com/show/32D27hJiy5sEZ7RnULzcBS)
- **Email:** advaitdharmadhikari27@gmail.com

## Credits & licence

The visual foundation is adapted from the open-source [vCard personal portfolio template](https://github.com/codewithsadee/vcard-personal-portfolio) by **codewithsadee** (MIT-licensed), substantially restyled and extended with new sections, content, and interactions.

All bespoke content — copy, résumé, branding, and project descriptions — © Advait Dharmadhikari.
