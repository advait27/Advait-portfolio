// Interactive terminal — explore Advait's profile as a tiny Linux-style
// filesystem. Builds a floating ">_" button (above the chat FAB) + a terminal
// panel with ls/cd/cat/tree/open and friends. Additive: nothing here touches
// existing behaviour.

(() => {
  "use strict";

  const USER = "visitor";
  const HOST = "advait-portfolio";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- virtual filesystem ------------------------------------------------
  // dir: { type: "dir", children: {...} }
  // file: { type: "file", content: string, url?: string }

  const F = (content, url) => ({ type: "file", content: content.trim(), url });
  const D = (children) => ({ type: "dir", children });

  const FS = D({
    "README.md": F(`
# Advait Dharmadhikari — Forward Deployed AI Engineer

I build AI systems that production teams actually ship:
LLM architectures, RAG pipelines, agentic workflows, and
multi-agent systems that reduce costs, improve decisions, and scale.

Start here:
  cat about.txt
  ls experience/
  cat experience/frensei.md
  cat contact.txt
  open resume.pdf

Type 'help' to list all commands.`),

    "about.txt": F(`
Forward Deployed AI Engineer · Dublin, Ireland

My work sits where the code meets the customer: embedding with
teams, scoping the real problem, and carrying LLM systems all the
way to production. I came into AI through business and operations,
so before models or tooling my first question is always:
"what decision are we improving?"

Currently: Founding AI Engineer & Product Lead at Frensei
(ClawbackVault AI) while completing an MSc in Business Analytics
at UCD Michael Smurfit (graduating 2026).

Open to: Founding AI Engineer · Applied AI Engineer ·
Forward Deployed Engineer · AI Consulting — Ireland, Europe, global.`),

    "skills.txt": F(`
[##########] 90%  LLM Systems & Agentic AI (RAG, LangGraph, Claude)
[#########-] 88%  Forward Deployed Engineering (0->1 production AI)
[########--] 82%  AI Security & Compliance (AES-256-GCM, PII, GDPR)
[########--] 85%  Business Translation & AI Product Strategy
[########--] 80%  Analytics & ML Engineering (Python, SQL, GCP/Azure)

Stack: Claude · LangGraph · LangChain · RAG · Pydantic AI ·
Python · SQL · Supabase · GCP · Azure · OAuth 2.0 ·
Gmail API · Microsoft Graph · Power BI / Tableau`),

    "education.txt": F(`
2025-2026  MSc Business Analytics
           UCD Michael Smurfit Graduate Business School, Dublin

2023-2024  PG Certification, AI & Machine Learning
           Indian Institute of Technology, Kanpur

2020-2023  BBA Business Analytics & Data Science
           Christ University, Bangalore`),

    "certifications.txt": F(`
- UCD Advantage Award (honor)
- Data Strategy — professional certification
- Introduction to Model Context Protocol
- Google Project Management Professional Certificate
- BCG Advanced Analytics & Data Science (virtual experience)
- Google Business Intelligence Professional Certificate
- Relational Data on Azure (Microsoft)`),

    "contact.txt": F(`
email     advaitdharmadhikari27@gmail.com
linkedin  linkedin.com/in/advaitdharmadhikari
github    github.com/advait27
medium    medium.com/@advaitdharmadhikari7
location  Dublin, Ireland

Open to Founding AI Engineer, Applied AI Engineer, Forward
Deployed Engineer, and AI consulting roles. If you're building
with LLMs, RAG, or agentic AI — let's talk.

Tip: 'open links/linkedin.url' opens LinkedIn in a new tab.`),

    "resume.pdf": F(
      "Binary file. Run 'open resume.pdf' to view/download the PDF.",
      "./assets/Advait_Dharmadhikari.pdf"
    ),

    experience: D({
      "frensei.md": F(`
# Founding AI Engineer & Product Lead — Frensei (ClawbackVault AI)
  Dublin · December 2025 - Present

AI-first compliance intelligence for financial services
broker-dealers. Own full-stack AI architecture, product strategy,
and team leadership from 0 to scale.

* Three-stage targeted-surveillance pipeline (header scan ->
  PII-masked body fetch -> LLM signal classification):
  80-90% cut in LLM token spend per broker.
* Four-tier signal-detection engine on Claude Sonnet 4.6 across
  15+ behavioural categories, tiered confidence scoring, full
  evidence-trail audit logging.
* Agentic AI systems with planning, execution, verification &
  feedback loops; hallucinations down 60% via rigorous evals.
* AES-256-GCM at rest, PII masking before every LLM call,
  prompt-injection protection, GDPR export; CASA Tier 2 and
  Google OAuth Restricted Scope compliance.
* Gmail API + Microsoft Graph via OAuth 2.0; row-level security
  across Supabase tenants (EU-West, Asia-Pacific).
* Partner directly with the Founder/CEO on roadmap and pricing;
  built and led a 15-person cross-functional team.`),

      "indigo.md": F(`
# Business Analyst & ML Engineer — IndiGo (InterGlobe Aviation)
  Gurugram · June 2023 - August 2025

ML-driven optimisation and decision intelligence across a 300+
aircraft fleet at one of the world's largest airlines.

* Aircraft zero-fuel-weight prediction and on-time-performance
  cost models: ~20% operational cost savings fleet-wide.
* Production BI and insight frameworks on GCP & Azure that
  improved decision quality by 40% for leadership.
* Owned the bridge between data science, business technology,
  and executive decision-making.`),

      "ucd-teaching.md": F(`
# Teaching Assistant — Digital Technologies in Business, UCD
  Dublin · January 2026 - May 2026

Bridged AI/ML theory and production practice for postgraduate
business students: tutorials on AI in business, digital
transformation, and data-driven decision-making.`),

      "earlier.md": F(`
* Business Analytics & ML Mentor — topmate.io (2025-2026):
  1-on-1 mentorship for professionals moving into AI/ML roles.
* Business Development Analyst Team Lead — CHRIST Consulting
  (2021-2022): led a 15-member analyst team; +25% new business.
* Data science internships — IndiGo, LetsGrowMore, The Sparks
  Foundation, EntryLevel (2020-2023).`),
    }),

    projects: D({
      "clawbackvault.md": F(`
# ClawbackVault AI (flagship, production)

Privacy-first AI system protecting broker commissions from silent
client churn. Targeted-surveillance architecture, Claude Sonnet 4.6
signal engine across 15+ behavioural categories, 80-90% lower LLM
cost per broker. Claude · LangGraph · RAG · Supabase · OAuth 2.0.`),

      "open-source.md": F(`
# Open source (PyPI author)

* hallucimap   — hallucination risk cartography for LLM systems
* finfeatures  — financial feature engineering toolkit
* fraudguard   — fraud detection utilities
* esgprofiler  — ESG profiling & scoring
* finance-automl — AutoML tailored for financial applications

github.com/advait27 — 30+ repos across AI, ML, finance, analytics.`),

      "ai-llm.md": F(`
* HalluciMap — detects & maps LLM hallucinations (AI evaluation)
* ChartSense — turns charts into structured, queryable insight
* Jarvis — personal AI assistant exploring agentic tool use
* AI Cost & Growth Optimizer — token cost vs performance tradeoffs`),

      "analytics.md": F(`
* Credit Risk Assessment — ML default-probability scoring
* Employee Turnover Analytics — attrition prediction & drivers
* Market Pulse AI — market sentiment & signal monitoring
* FinPred — stock analysis & prediction app (Streamlit)`),
    }),

    links: D({
      "linkedin.url": F("https://www.linkedin.com/in/advaitdharmadhikari", "https://www.linkedin.com/in/advaitdharmadhikari"),
      "github.url": F("https://github.com/advait27", "https://github.com/advait27"),
      "medium.url": F("https://medium.com/@advaitdharmadhikari7", "https://medium.com/@advaitdharmadhikari7"),
      "podcast.url": F("https://open.spotify.com/show/2nMlpUNSqh9ZiI1vsg5B1g", "https://open.spotify.com/show/2nMlpUNSqh9ZiI1vsg5B1g"),
    }),
  });

  // ---- path helpers ------------------------------------------------------

  let cwd = []; // array of segments relative to ~

  const resolve = (input) => {
    // returns array of segments, or null for paths above ~
    if (!input || input === "~") return [];
    let parts = input.startsWith("~/") ? input.slice(2).split("/") : input.split("/");
    const base = input.startsWith("~") ? [] : [...cwd];
    for (const p of parts) {
      if (!p || p === ".") continue;
      if (p === "..") {
        if (!base.length) return null;
        base.pop();
      } else base.push(p);
    }
    return base;
  };

  const nodeAt = (segs) => {
    if (!segs) return null;
    let node = FS;
    for (const s of segs) {
      if (node.type !== "dir" || !node.children[s]) return null;
      node = node.children[s];
    }
    return node;
  };

  const pathStr = (segs) => "~" + (segs.length ? "/" + segs.join("/") : "");

  // ---- UI ----------------------------------------------------------------

  let fab, panel, outEl, inputEl, promptEl;
  let isOpen = false;
  let lastFocused = null;
  const cmdHistory = [];
  let histIdx = -1;

  const el = (tag, cls, attrs) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };

  const print = (text, cls) => {
    const line = el("div", "term-line" + (cls ? " " + cls : ""));
    line.textContent = text;
    outEl.appendChild(line);
  };

  const printBlock = (text, cls) => {
    text.split("\n").forEach((l) => print(l, cls));
  };

  const printPrompt = (cmd) => {
    const line = el("div", "term-line");
    const p = el("span", "term-prompt-echo");
    p.textContent = `${USER}@${HOST}:${pathStr(cwd)}$ `;
    line.appendChild(p);
    line.appendChild(document.createTextNode(cmd));
    outEl.appendChild(line);
  };

  const scrollBottom = () => { outEl.scrollTop = outEl.scrollHeight; };

  const updatePrompt = () => {
    promptEl.textContent = `${USER}@${HOST}:${pathStr(cwd)}$`;
  };

  // ---- commands ----------------------------------------------------------

  const COMMANDS = {
    help() {
      printBlock(
        [
          "Available commands:",
          "  ls [path]        list directory contents",
          "  cd <dir>         change directory (cd .. to go up)",
          "  cat <file>       print a file",
          "  open <file>      open resume.pdf or a links/*.url in a new tab",
          "  tree             show the full file tree",
          "  pwd              print working directory",
          "  whoami           who is this site about?",
          "  history          commands you've run",
          "  clear            clear the screen",
          "  help             this message",
          "  exit             close the terminal",
          "",
          "Tips: Tab completes, arrow keys browse history.",
        ].join("\n")
      );
    },

    pwd() { print(pathStr(cwd)); },

    whoami() {
      printBlock(
        "Advait Dharmadhikari — Forward Deployed AI Engineer.\nLLM systems & agentic AI · RAG · LangGraph · Claude · Python.\nDublin, Ireland. Try: cat about.txt"
      );
    },

    date() { print(new Date().toString()); },

    echo(args) { print(args.join(" ")); },

    history() {
      cmdHistory.forEach((c, i) => print(`  ${String(i + 1).padStart(3)}  ${c}`));
    },

    clear() { outEl.textContent = ""; },

    exit() { closePanel(); },

    ls(args) {
      const target = resolve(args[0] || ".");
      const node = nodeAt(target);
      if (!node) return print(`ls: cannot access '${args[0]}': No such file or directory`, "term-err");
      if (node.type === "file") return print(args[0]);
      const line = el("div", "term-line term-ls");
      Object.entries(node.children).forEach(([name, child]) => {
        const item = el("span", child.type === "dir" ? "term-dir" : /\.(pdf|url)$/.test(name) ? "term-link-file" : "term-file");
        item.textContent = child.type === "dir" ? name + "/" : name;
        line.appendChild(item);
      });
      outEl.appendChild(line);
    },

    cd(args) {
      if (!args[0] || args[0] === "~") { cwd = []; return updatePrompt(); }
      const target = resolve(args[0]);
      const node = nodeAt(target);
      if (!node) return print(`cd: no such file or directory: ${args[0]}`, "term-err");
      if (node.type !== "dir") return print(`cd: not a directory: ${args[0]}`, "term-err");
      cwd = target;
      updatePrompt();
    },

    cat(args) {
      if (!args[0]) return print("cat: missing file operand", "term-err");
      const node = nodeAt(resolve(args[0]));
      if (!node) return print(`cat: ${args[0]}: No such file or directory`, "term-err");
      if (node.type === "dir") return print(`cat: ${args[0]}: Is a directory`, "term-err");
      printBlock(node.content);
    },

    open(args) {
      if (!args[0]) return print("open: missing file operand", "term-err");
      const node = nodeAt(resolve(args[0]));
      if (!node) return print(`open: ${args[0]}: No such file or directory`, "term-err");
      if (node.type === "dir" || !node.url) return print(`open: ${args[0]}: nothing to open (try cat)`, "term-err");
      window.open(node.url, "_blank", "noopener");
      print(`Opening ${args[0]} …`);
    },

    tree() {
      const walk = (node, prefix) => {
        const entries = Object.entries(node.children);
        entries.forEach(([name, child], i) => {
          const last = i === entries.length - 1;
          print(prefix + (last ? "└── " : "├── ") + name + (child.type === "dir" ? "/" : ""));
          if (child.type === "dir") walk(child, prefix + (last ? "    " : "│   "));
        });
      };
      print("~/");
      walk(FS, "");
    },

    sudo() {
      print("visitor is not in the sudoers file. This incident will be reported.", "term-err");
      print("(Relax — nothing was reported. But nice try.)");
    },

    man(args) {
      print(args[0] ? `No manual entry for ${args[0]} — try 'help'` : "What manual page do you want? Try 'help'.");
    },

    neofetch() {
      printBlock(
        [
          "        ___        visitor@advait-portfolio",
          "       /   \\       -------------------------",
          "      / ^ ^ \\      Role:    Forward Deployed AI Engineer",
          "     |  >_<  |     Org:     Frensei (ClawbackVault AI)",
          "      \\_____/      Loc:     Dublin, Ireland",
          "      /|   |\\      Stack:   Claude · LangGraph · RAG · Python",
          "                   Uptime:  shipping since 2020",
        ].join("\n"),
        "term-accent"
      );
    },

    hire() {
      printBlock(
        "Good instinct. -> cat contact.txt\nOr just: open links/linkedin.url"
      );
    },
  };

  const ALIASES = { ll: "ls", dir: "ls", cls: "clear", quit: "exit", contact: "hire" };

  const run = (raw) => {
    const input = raw.trim();
    printPrompt(input);
    if (!input) return;
    cmdHistory.push(input);
    histIdx = cmdHistory.length;

    const [name, ...args] = input.split(/\s+/);
    const cmd = COMMANDS[name] || COMMANDS[ALIASES[name]];
    if (cmd) cmd(args);
    else print(`${name}: command not found. Type 'help'.`, "term-err");
    scrollBottom();
  };

  // ---- tab completion ----------------------------------------------------

  const complete = () => {
    const value = inputEl.value;
    const parts = value.split(/\s+/);
    if (parts.length === 1) {
      const names = [...Object.keys(COMMANDS), ...Object.keys(ALIASES)].filter((c) => c.startsWith(parts[0]));
      if (names.length === 1) inputEl.value = names[0] + " ";
      return;
    }
    const frag = parts[parts.length - 1];
    const slash = frag.lastIndexOf("/");
    const dirPart = slash >= 0 ? frag.slice(0, slash + 1) : "";
    const leaf = slash >= 0 ? frag.slice(slash + 1) : frag;
    const dirNode = nodeAt(resolve(dirPart || "."));
    if (!dirNode || dirNode.type !== "dir") return;
    const matches = Object.keys(dirNode.children).filter((n) => n.startsWith(leaf));
    if (matches.length === 1) {
      const child = dirNode.children[matches[0]];
      parts[parts.length - 1] = dirPart + matches[0] + (child.type === "dir" ? "/" : "");
      inputEl.value = parts.join(" ");
    } else if (matches.length > 1) {
      printPrompt(value);
      print(matches.join("  "));
      scrollBottom();
    }
  };

  // ---- open / close ------------------------------------------------------

  const openPanel = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    fab.setAttribute("aria-expanded", "true");
    inputEl.focus();
    scrollBottom();
  };

  const closePanel = () => {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
    const hide = () => { panel.hidden = true; };
    reduceMotion ? hide() : setTimeout(hide, 220);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    else fab.focus();
  };

  // ---- build DOM ---------------------------------------------------------

  const build = () => {
    fab = el("button", "term-fab", {
      type: "button",
      "aria-label": "Open interactive terminal",
      "aria-expanded": "false",
      title: "Interactive terminal",
    });
    fab.innerHTML = '<span class="term-fab-glyph" aria-hidden="true">&gt;_</span><span class="term-fab-label">Terminal</span>';
    fab.addEventListener("click", () => (isOpen ? closePanel() : openPanel()));

    panel = el("section", "term-panel", {
      role: "dialog",
      "aria-label": "Interactive terminal — explore Advait's profile with Linux commands",
      hidden: "",
    });

    const header = el("header", "term-header");
    const dots = el("span", "term-dots", { "aria-hidden": "true" });
    dots.innerHTML = "<i></i><i></i><i></i>";
    const title = el("span", "term-title");
    title.textContent = `${USER}@${HOST}: ~`;
    const close = el("button", "term-close", { type: "button", "aria-label": "Close terminal" });
    close.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
    close.addEventListener("click", closePanel);
    header.append(dots, title, close);

    outEl = el("div", "term-output", { "aria-live": "polite" });

    const form = el("form", "term-form");
    promptEl = el("label", "term-prompt", { for: "term-input" });
    inputEl = el("input", "term-input", {
      id: "term-input",
      type: "text",
      autocomplete: "off",
      autocapitalize: "off",
      spellcheck: "false",
      "aria-label": "Terminal command input",
    });
    form.append(promptEl, inputEl);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      run(inputEl.value);
      inputEl.value = "";
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (histIdx > 0) inputEl.value = cmdHistory[--histIdx] || "";
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx < cmdHistory.length) inputEl.value = cmdHistory[++histIdx] || "";
      } else if (e.key === "Tab") {
        e.preventDefault();
        complete();
      }
    });

    panel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel();
    });
    // Click anywhere in the terminal focuses the input (unless selecting text).
    panel.addEventListener("click", () => {
      if (!window.getSelection().toString()) inputEl.focus();
    });

    panel.append(header, outEl, form);
    document.body.append(fab, panel);

    updatePrompt();
    printBlock(
      "Welcome to Advait's portfolio terminal.\nMy profile is a filesystem — explore it with Linux commands.\nType 'help' to begin, or try: cat README.md"
    );

    // Deep link: visiting …#terminal opens the terminal directly.
    if (window.location.hash === "#terminal") openPanel();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
