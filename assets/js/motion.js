// Motion layer: GSAP-driven intro, page transitions, kinetic hero type, scroll
// reveals, a scrubbed career timeline, animated research figures, magnetic
// buttons, spotlight cards and a canvas "signal field" behind the page.
//
// Every animation earns its place: the intro and page entrances show state
// changes, reveals and the timeline tell the story in order, the research
// figures build the data the reader is looking at, and hover effects give
// feedback. Under prefers-reduced-motion nothing moves, and if GSAP fails to
// load the page stays fully readable.

(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
  const { gsap, ScrollTrigger } = window;

  const releasePending = () => {
    clearTimeout(window.__motionFallback);
    root.classList.remove("motion-pending");
  };

  const typedEl = document.querySelector("[data-typed-words]");
  const typedWords = typedEl
    ? typedEl.dataset.typedWords.split("|").map((word) => word.trim()).filter(Boolean)
    : [];

  // ---- static fallbacks ---------------------------------------------------

  if (reduceMotion || !gsap || !ScrollTrigger) {
    releasePending();

    // GSAP unavailable but motion allowed: keep the hero words rotating plainly
    if (!reduceMotion && typedEl && typedWords.length > 1) {
      let index = 0;
      setInterval(() => {
        index = (index + 1) % typedWords.length;
        typedEl.textContent = typedWords[index];
      }, 2800);
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("motion-ready");

  const EASE = "expo.out";
  const skipIntro = Boolean(window.__motionTimedOut);

  // ---- helpers ------------------------------------------------------------

  const formatNumber = (value, decimals) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const numberParts = (el) => ({
    target: parseFloat(el.dataset.count) || 0,
    decimals: parseInt(el.dataset.decimals || "0", 10),
    suffix: el.dataset.suffix || "",
  });

  const zeroCounter = (el) => {
    const { decimals, suffix } = numberParts(el);
    el.textContent = formatNumber(0, decimals) + suffix;
  };

  const countUp = (el, { duration = 1.4, delay = 0 } = {}) => {
    const { target, decimals, suffix } = numberParts(el);
    const state = { value: 0 };
    return gsap.to(state, {
      value: target,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatNumber(state.value, decimals) + suffix;
      },
      onComplete: () => {
        el.textContent = formatNumber(target, decimals) + suffix;
      },
    });
  };

  // Wrap each word of an element in a mask so it can rise into place. Child
  // elements (e.g. the rotating hero word) are kept whole as a single word.
  const wrapWord = (child) => {
    const outer = document.createElement("span");
    const inner = document.createElement("span");
    outer.className = "split-word";
    inner.className = "split-inner";
    inner.appendChild(child);
    outer.appendChild(inner);
    return outer;
  };

  const splitWords = (el) => {
    if (!el) return [];
    if (el.dataset.split) return el.querySelectorAll(".split-inner");
    el.dataset.split = "true";

    const nodes = [...el.childNodes];
    el.textContent = "";

    nodes.forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) {
        el.appendChild(wrapWord(node));
        return;
      }
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) el.appendChild(document.createTextNode(" "));
        else el.appendChild(wrapWord(document.createTextNode(part)));
      });
    });

    return el.querySelectorAll(".split-inner");
  };

  // ---- rotating hero word: decode effect ----------------------------------

  const GLYPHS = "abcdefghijklmnopqrstuvwxyz<>/_-*";
  let typedStarted = false;

  const scrambleTo = (el, target) => {
    const from = el.textContent;
    const state = { progress: 0 };

    return gsap.to(state, {
      progress: 1,
      duration: 0.9,
      ease: "none",
      onUpdate: () => {
        const p = state.progress;
        const length = Math.round(from.length + (target.length - from.length) * Math.min(1, p * 1.6));
        const settled = Math.floor(p * target.length);
        let out = "";
        for (let i = 0; i < length; i++) {
          if (i < settled && i < target.length) out += target[i];
          else if (target[i] === " ") out += " ";
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
      },
      onComplete: () => {
        el.textContent = target;
      },
    });
  };

  const startTypedText = () => {
    if (typedStarted || !typedEl || typedWords.length < 2) return;
    typedStarted = true;
    let index = 0;

    const next = () => {
      index = (index + 1) % typedWords.length;
      scrambleTo(typedEl, typedWords[index]);
      gsap.delayedCall(3, next);
    };
    gsap.delayedCall(2.2, next);
  };

  // ---- scroll progress ----------------------------------------------------

  const setupScrollProgress = () => {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.prepend(bar);

    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  };

  // ---- navbar: sliding active indicator -----------------------------------

  let placeIndicator = () => {};

  const setupNavIndicator = () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const indicator = document.createElement("span");
    indicator.className = "nav-indicator";
    indicator.setAttribute("aria-hidden", "true");
    navbar.appendChild(indicator);

    placeIndicator = (animate) => {
      const active = navbar.querySelector(".navbar-link.active");
      if (!active) return;
      const navBox = navbar.getBoundingClientRect();
      const box = active.getBoundingClientRect();
      const inset = parseFloat(getComputedStyle(active).paddingLeft) || 0;

      gsap.to(indicator, {
        x: box.left - navBox.left + inset,
        width: Math.max(0, box.width - inset * 2),
        duration: animate ? 0.65 : 0,
        ease: EASE,
        overwrite: true,
      });
    };

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => placeIndicator(false), 120);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => placeIndicator(false));
    }
  };

  // ---- reveals ------------------------------------------------------------

  const REVEAL = [
    // about
    ".about-text > p", ".service-title", ".service-item", ".now-card", ".pipeline-lead",
    ".pipeline-stage", ".cert-item", ".stack-group", ".testimonials-title", ".testimonials-item",
    // resume
    ".timeline .title-wrapper", ".timeline-item", ".skills-title", ".skills-item",
    // research
    ".research .section-intro", ".paper-head", ".paper-abstract", ".paper-stats li",
    ".coverage-chart", ".paper-findings li", ".property-list li", ".topic-marquee", ".paper-actions",
    // portfolio, blog, podcast, contact
    ".projects .section-intro", ".filter-list", ".project-item.active", ".blog-post-item",
    ".podcast .section-intro", ".podcast-card", ".contact-intro .section-intro",
    ".contact-method", ".form-title", ".form",
  ].join(",");

  // Items are hidden straight away but only start revealing once the page
  // entrance is under way, so the first cascade is actually seen.
  const setupReveals = (page, delay) => {
    const items = [...page.querySelectorAll(REVEAL)];
    if (!items.length) return;

    // opacity, not autoAlpha: hidden-by-visibility links would drop out of the Tab order
    gsap.set(items, { opacity: 0, y: 34 });

    gsap.delayedCall(delay, () => ScrollTrigger.batch(items, {
      start: "top 92%",
      once: true,
      onEnter: (batch) => {
        batch.forEach((el) => el.classList.add("is-revealing"));
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.08,
          overwrite: true,
          onComplete: () => {
            batch.forEach((el) => el.classList.remove("is-revealing"));
            gsap.set(batch, { clearProps: "transform,opacity" });
          },
        });

        // bullet points inside a revealed timeline entry follow it in
        batch.forEach((el) => {
          const points = el.querySelectorAll(".timeline-points li");
          if (points.length) {
            gsap.from(points, { opacity: 0, x: -14, duration: 0.6, stagger: 0.06, delay: 0.25, ease: EASE });
          }
        });
      },
    }));
  };

  // ---- resume: scrubbed timeline + skill bars ------------------------------

  const setupTimeline = (page) => {
    page.querySelectorAll(".timeline-list").forEach((list) => {
      const items = list.querySelectorAll(".timeline-item");
      if (items.length < 2) return;

      const bar = document.createElement("li");
      bar.className = "timeline-progress";
      bar.setAttribute("aria-hidden", "true");
      list.prepend(bar);

      const sizeBar = () => {
        const last = items[items.length - 1];
        bar.style.height = `${Math.max(0, last.offsetTop)}px`;
      };
      sizeBar();

      gsap.fromTo(bar, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: list,
          start: "top 72%",
          end: "bottom 60%",
          scrub: 0.4,
          invalidateOnRefresh: true,
          onRefresh: sizeBar,
        },
      });

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 72%",
          onEnter: () => item.classList.add("is-passed"),
          onLeaveBack: () => item.classList.remove("is-passed"),
        });
      });
    });
  };

  const setupSkills = (page) => {
    page.querySelectorAll(".skills-item").forEach((item) => {
      const fill = item.querySelector(".skill-progress-fill");
      const data = item.querySelector("data");
      if (!fill) return;

      gsap.set(fill, { scaleX: 0 });
      if (data) {
        data.dataset.count = data.value;
        data.dataset.suffix = "%";
        zeroCounter(data);
      }

      ScrollTrigger.create({
        trigger: item,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(fill, { scaleX: 1, duration: 1.4, delay: 0.15, ease: EASE });
          if (data) countUp(data, { duration: 1.4, delay: 0.15 });
        },
      });
    });
  };

  // ---- research figures -----------------------------------------------------

  const setupResearch = (page) => {
    // stat tiles count up
    page.querySelectorAll(".paper-stats").forEach((stats) => {
      const nums = stats.querySelectorAll(".stat-num");
      nums.forEach(zeroCounter);
      ScrollTrigger.create({
        trigger: stats,
        start: "top 88%",
        once: true,
        onEnter: () => nums.forEach((el, i) => countUp(el, { duration: 1.6, delay: 0.2 + i * 0.1 })),
      });
    });

    // coverage chart: bars grow from the baseline, values count with them
    const chart = page.querySelector(".coverage-chart");
    if (chart) {
      const rows = [...chart.querySelectorAll(".cov-row")];
      rows.forEach((row) => {
        gsap.set(row.querySelector(".cov-fill"), { clipPath: "inset(0% 100% 0% 0%)" });
        zeroCounter(row.querySelector(".cov-value"));
      });

      ScrollTrigger.create({
        trigger: chart,
        start: "top 82%",
        once: true,
        onEnter: () => {
          rows.forEach((row, i) => {
            const delay = 0.35 + i * 0.2;
            gsap.to(row.querySelector(".cov-fill"), {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.5,
              delay,
              ease: "power3.out",
            });
            countUp(row.querySelector(".cov-value"), { duration: 1.5, delay });
          });
        },
      });
    }

    // lifecycle: stages light up in order, then the two loops close
    const lifecycle = page.querySelector(".lifecycle");
    if (lifecycle) {
      const sides = lifecycle.querySelectorAll(".side");
      const stages = [...lifecycle.querySelectorAll(".stage")];
      const loopTrack = lifecycle.querySelector(".loop-track");
      const loopLine = lifecycle.querySelector(".loop-track-line");
      const loopDot = lifecycle.querySelector(".loop-track-dot");
      const loops = lifecycle.querySelectorAll(".loop");
      const caption = lifecycle.querySelector("figcaption");

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });

      tl.from(lifecycle, { autoAlpha: 0, y: 30, duration: 0.8 })
        .from(sides, { autoAlpha: 0, y: 10, stagger: 0.12, duration: 0.6 }, 0.15)
        .from(stages, { autoAlpha: 0, y: 16, scale: 0.92, stagger: 0.16, duration: 0.6 }, 0.3)
        .fromTo(stages, { "--link": 0 }, { "--link": 1, stagger: 0.16, duration: 0.45, ease: "power2.inOut" }, 0.5);

      stages.forEach((stage, i) => {
        tl.call(() => stage.classList.add("is-lit"), null, 0.45 + i * 0.16);
      });

      if (loopTrack && loopLine) {
        tl.from(loopTrack, { autoAlpha: 0, duration: 0.5 }, ">-0.1")
          .fromTo(loopLine, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, "<");
      }

      tl.from(loops, { autoAlpha: 0, y: 12, stagger: 0.14, duration: 0.6 }, "<0.2")
        .from(caption, { autoAlpha: 0, duration: 0.6 }, "<0.2");

      // a signal keeps travelling the adaptation loop, from stage 6 back to stage 2
      if (loopTrack && loopDot) {
        tl.add(() => {
          gsap.set(loopDot, { opacity: 1 });
          gsap.fromTo(loopDot, { x: 0 }, {
            x: () => -loopTrack.clientWidth,
            duration: 2.4,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 1.4,
            repeatRefresh: true,
          });
        });
      }

      ScrollTrigger.create({
        trigger: lifecycle,
        start: "top 80%",
        once: true,
        onEnter: () => tl.play(),
      });
    }

    // topics marquee: duplicate the list for a seamless loop, slow on hover
    const marquee = page.querySelector(".topic-marquee");
    const track = marquee && marquee.querySelector(".topic-track");
    if (track && !track.dataset.looped) {
      track.dataset.looped = "true";
      [...track.children].forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });

      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      marquee.addEventListener("pointerenter", () => gsap.to(loop, { timeScale: 0.15, duration: 0.6 }));
      marquee.addEventListener("pointerleave", () => gsap.to(loop, { timeScale: 1, duration: 0.6 }));
    }
  };

  // ---- per-page setup + entrance --------------------------------------------

  const initialised = new WeakSet();

  const initPage = (page, revealDelay = 0.2) => {
    if (!page || initialised.has(page)) return;
    initialised.add(page);

    setupReveals(page, revealDelay);
    if (page.dataset.page === "resume") {
      setupTimeline(page);
      setupSkills(page);
    }
    if (page.dataset.page === "research") setupResearch(page);
  };

  const heroIntro = (page) => {
    const hero = page.querySelector(".hero-panel");
    if (!hero || hero.dataset.played) return null;
    hero.dataset.played = "true";

    const nums = hero.querySelectorAll(".metric-num");
    nums.forEach(zeroCounter);

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.from(hero.querySelector(".hero-kicker"), { autoAlpha: 0, y: 12, duration: 0.6 })
      .from(splitWords(hero.querySelector(".hero-title")), { yPercent: 118, duration: 1, stagger: 0.045 }, 0.1)
      .from(hero.querySelector(".hero-subtitle"), { autoAlpha: 0, y: 16, duration: 0.8 }, 0.5)
      .from(hero.querySelectorAll(".hero-cta .btn"), { autoAlpha: 0, y: 14, scale: 0.94, stagger: 0.08, duration: 0.7 }, 0.6)
      .from(hero.querySelectorAll(".metric-card"), { autoAlpha: 0, y: 28, stagger: 0.09, duration: 0.85 }, 0.7)
      .add(() => nums.forEach((el, i) => countUp(el, { delay: i * 0.09 })), 0.75)
      .from(hero.querySelectorAll(".tag"), { autoAlpha: 0, y: 10, stagger: 0.035, duration: 0.5 }, 0.95)
      .add(startTypedText, 1.2);

    return tl;
  };

  const enterPage = (page, { delay = 0 } = {}) => {
    const tl = gsap.timeline({
      delay,
      defaults: { ease: EASE },
      onComplete: () => ScrollTrigger.refresh(),
    });

    tl.fromTo(page, { autoAlpha: 0, y: 28 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      clearProps: "transform,opacity,visibility",
    });

    const title = page.querySelector(".article-title");
    if (title) {
      tl.from(splitWords(title), { yPercent: 115, duration: 0.8, stagger: 0.07 }, 0.08)
        .fromTo(title, { "--title-bar": 0 }, { "--title-bar": 1, duration: 0.9 }, 0.25);
    }

    if (page.dataset.page === "about") {
      const hero = heroIntro(page);
      if (hero) tl.add(hero, 0.2);
    }

    return tl;
  };

  // ---- sidebar + navbar intro -------------------------------------------------

  const playIntro = (page) => {
    const sidebar = document.querySelector(".sidebar");
    const navbar = document.querySelector(".navbar");
    const tl = gsap.timeline({ defaults: { ease: EASE } });

    if (sidebar) {
      tl.fromTo(sidebar, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, clearProps: "transform" }, 0)
        .from(sidebar.querySelector(".avatar-box"), { autoAlpha: 0, scale: 0.6, rotate: -10, duration: 1.1, ease: "back.out(1.6)" }, 0.1)
        .from(splitWords(sidebar.querySelector(".info-content .name")), { yPercent: 115, stagger: 0.08, duration: 0.8 }, 0.25)
        .from(sidebar.querySelector(".info-content .title"), { autoAlpha: 0, y: 10, duration: 0.6 }, 0.45);

      if (isDesktop()) {
        tl.from(sidebar.querySelectorAll(".contact-item, .social-item"), { autoAlpha: 0, x: -12, stagger: 0.05, duration: 0.6 }, 0.5);
      }
    }

    if (navbar) {
      tl.fromTo(navbar, { autoAlpha: 0, y: isDesktop() ? -12 : 24 }, { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" }, 0.15)
        .from(navbar.querySelectorAll(".navbar-link"), { autoAlpha: 0, y: 8, stagger: 0.045, duration: 0.5 }, 0.25)
        .add(() => placeIndicator(false), 0.25);
    }

    if (page) tl.add(enterPage(page), 0.3);

    return tl;
  };

  // ---- canvas signal field ------------------------------------------------------

  const setupSignalField = () => {
    const canvas = document.createElement("canvas");
    canvas.className = "signal-field";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LINK = 150;
    const pointer = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let nodes = [];
    let pulses = [];
    let lastScroll = window.scrollY;
    let running = false;
    let frame = 0;
    let lastPulse = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(72, Math.max(24, (width * height) / 21000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.3 + 0.6,
      }));
      pulses = [];
    };

    const spawnPulse = () => {
      const a = (Math.random() * nodes.length) | 0;
      let best = -1;
      let bestD = LINK * LINK;
      for (let j = 0; j < nodes.length; j++) {
        if (j === a) continue;
        const dx = nodes[j].x - nodes[a].x;
        const dy = nodes[j].y - nodes[a].y;
        const d = dx * dx + dy * dy;
        if (d < bestD && d > 900) {
          bestD = d;
          best = j;
        }
      }
      if (best >= 0) pulses.push({ a, b: best, t: 0 });
    };

    const draw = (time) => {
      if (!running) return;
      frame = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);

      const scrollY = window.scrollY;
      const drift = (scrollY - lastScroll) * 0.12;
      lastScroll = scrollY;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy - drift;

        const px = n.x - pointer.x;
        const py = n.y - pointer.y;
        const pd = Math.sqrt(px * px + py * py);
        if (pd < 130 && pd > 0.1) {
          const force = (1 - pd / 130) * 0.9;
          n.x += (px / pd) * force;
          n.y += (py / pd) * force;
        }

        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "#52f6ff";
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK) * 0.14;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "#52f6ff";
      for (const n of nodes) {
        const near = Math.hypot(n.x - pointer.x, n.y - pointer.y) < 160;
        ctx.globalAlpha = near ? 0.75 : 0.35;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // pulses: a lime signal travelling along a link
      if (time - lastPulse > 900 && pulses.length < 6) {
        spawnPulse();
        lastPulse = time;
      }
      ctx.fillStyle = "#b8ff6a";
      pulses = pulses.filter((p) => {
        p.t += 0.011;
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b || p.t >= 1) return false;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        ctx.globalAlpha = 0.18 * fade;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.85 * fade;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running) return;
      running = true;
      lastScroll = window.scrollY;
      frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    start();
    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 2, delay: 0.4, ease: "power1.out" });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    if (finePointer) {
      window.addEventListener("pointermove", (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      }, { passive: true });
      document.addEventListener("pointerleave", () => {
        pointer.x = -9999;
        pointer.y = -9999;
      });
    }
  };

  // ---- pointer feedback: magnetic buttons + spotlight cards ------------------

  const setupMagnetic = () => {
    if (!finePointer) return;

    document.querySelectorAll(".btn, .form-btn").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.45, ease: "power3.out" });

      btn.addEventListener("pointermove", (event) => {
        const box = btn.getBoundingClientRect();
        xTo((event.clientX - (box.left + box.width / 2)) * 0.2);
        yTo((event.clientY - (box.top + box.height / 2)) * 0.3);
      });

      btn.addEventListener("pointerleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
      });
    });
  };

  const setupSpotlight = () => {
    if (!finePointer) return;

    const cards = document.querySelectorAll(
      ".project-card, .paper, .service-item, .cert-item, .metric-card, .contact-method, .podcast-card, .now-card, .paper-findings li"
    );

    cards.forEach((card) => {
      const glow = document.createElement("span");
      glow.className = "spotlight";
      glow.setAttribute("aria-hidden", "true");
      card.classList.add("has-spotlight");
      card.appendChild(glow);

      card.addEventListener("pointermove", (event) => {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
        card.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
      });
    });
  };

  // ---- events from script.js ---------------------------------------------------

  document.addEventListener("pagechange", (event) => {
    const { page } = event.detail;
    placeIndicator(true);
    initPage(page);
    enterPage(page);
  });

  document.addEventListener("filterchange", () => {
    const items = document.querySelectorAll(".project-item.active");
    gsap.fromTo(items, { opacity: 0, y: 22, scale: 0.97 }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.045,
      ease: EASE,
      overwrite: true,
      clearProps: "transform,opacity",
    });
    ScrollTrigger.refresh();
  });

  // the mobile "Show Contacts" drawer shifts everything below it
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  if (sidebarBtn) sidebarBtn.addEventListener("click", () => gsap.delayedCall(0.4, () => ScrollTrigger.refresh()));

  // ---- boot ---------------------------------------------------------------------

  const activePage = document.querySelector("[data-page].active");

  setupScrollProgress();
  setupNavIndicator();
  setupSignalField();
  setupMagnetic();
  setupSpotlight();
  initPage(activePage, skipIntro ? 0 : 1.1);

  if (skipIntro) {
    // the page already showed without motion; don't hide it again
    placeIndicator(false);
    startTypedText();
    if (activePage && activePage.dataset.page === "about") {
      const hero = activePage.querySelector(".hero-panel");
      if (hero) hero.dataset.played = "true";
    }
  } else {
    playIntro(activePage);
  }

  releasePending();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
