// "Ask my portfolio" — conversational assistant UI.
// Builds a floating button + chat panel, streams answers from the Netlify
// function (/api/ask), and renders citation chips that jump to the relevant
// section of the site. Additive: nothing here touches existing behaviour.

(() => {
  "use strict";

  const ENDPOINT = "/api/ask";
  const KB_URL = "./assets/data/portfolio-kb.json";
  const MAX_INPUT = 500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STARTERS = [
    "Does Advait have fintech experience?",
    "What is ClawbackVault AI?",
    "What did he do at IndiGo?",
    "What are his podcasts about?",
  ];

  let kbById = new Map();
  let panel, fab, messagesEl, inputEl, sendBtn, startersEl;
  let isOpen = false;
  let busy = false;
  let lastFocused = null;
  const history = []; // {role, content}

  // ---- helpers ----------------------------------------------------------

  const el = (tag, cls, attrs) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };

  // Render model text safely: text nodes only, newlines -> <br>, "- " bullets.
  const renderText = (container, text) => {
    container.textContent = "";
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (i > 0) container.appendChild(document.createElement("br"));
      container.appendChild(document.createTextNode(line));
    });
  };

  // ---- citation chips ---------------------------------------------------

  const jumpToChunk = (id) => {
    const chunk = kbById.get(id);
    if (!chunk) return;

    // Activate the right page via the existing nav mechanism.
    const navBtn = [...document.querySelectorAll("[data-nav-link]")].find(
      (b) => b.textContent.trim().toLowerCase() === chunk.section
    );
    if (navBtn) navBtn.click();

    // Then scroll to the anchor and briefly highlight it.
    const focusAnchor = () => {
      const target = chunk.anchor ? document.querySelector(chunk.anchor) : null;
      if (target) {
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center",
        });
        target.classList.add("kb-highlight");
        setTimeout(() => target.classList.remove("kb-highlight"), 1800);
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(focusAnchor));

    // On small screens the panel covers the page; close it so the jump shows.
    if (window.matchMedia("(max-width: 720px)").matches) closePanel();
  };

  const renderChips = (wrap, ids) => {
    const valid = ids.filter((id) => kbById.has(id));
    if (!valid.length) return;
    const row = el("div", "chat-chips", { role: "list", "aria-label": "Sources" });
    valid.forEach((id) => {
      const chunk = kbById.get(id);
      const chip = el("button", "chat-source-chip", {
        type: "button",
        role: "listitem",
        title: `Go to ${chunk.label}`,
      });
      chip.textContent = chunk.label;
      chip.addEventListener("click", () => jumpToChunk(id));
      row.appendChild(chip);
    });
    wrap.appendChild(row);
  };

  // ---- message bubbles --------------------------------------------------

  const addMessage = (role, text) => {
    const wrap = el("div", `chat-msg chat-msg--${role}`);
    const bubble = el("div", "chat-bubble");
    if (text) renderText(bubble, text);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return { wrap, bubble };
  };

  const scrollToBottom = () => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const setBusy = (state) => {
    busy = state;
    sendBtn.disabled = state || !inputEl.value.trim();
    inputEl.disabled = state;
  };

  // ---- networking -------------------------------------------------------

  async function ask(question) {
    addMessage("user", question);
    history.push({ role: "user", content: question });
    if (startersEl) startersEl.hidden = true;

    const { wrap, bubble } = addMessage("assistant", "");
    const typing = el("span", "chat-typing", { "aria-hidden": "true" });
    typing.innerHTML = "<i></i><i></i><i></i>";
    bubble.appendChild(typing);

    let answer = "";
    let citeIds = [];
    setBusy(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: history.slice(0, -1) }),
      });

      if (!res.ok || !res.body) {
        let msg = "Something went wrong. Please try again.";
        try {
          msg = (await res.json()).message || msg;
        } catch {
          /* keep default */
        }
        renderText(bubble, msg);
        setBusy(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() || "";
        for (const block of events) {
          const ev = parseEvent(block);
          if (!ev) continue;
          if (ev.event === "token" && ev.data.text) {
            if (typing.isConnected) typing.remove();
            answer += ev.data.text;
            renderText(bubble, answer);
            scrollToBottom();
          } else if (ev.event === "cite") {
            citeIds = Array.isArray(ev.data.ids) ? ev.data.ids : [];
          } else if (ev.event === "error") {
            if (typing.isConnected) typing.remove();
            if (!answer) renderText(bubble, ev.data.message || "Stream error.");
          }
        }
      }

      if (typing.isConnected) typing.remove();
      if (!answer) renderText(bubble, "I didn't catch that — try rephrasing?");
      else {
        history.push({ role: "assistant", content: answer });
        if (history.length > 8) history.splice(0, history.length - 8);
      }
      renderChips(wrap, citeIds);
      scrollToBottom();
    } catch {
      if (typing.isConnected) typing.remove();
      if (!answer) renderText(bubble, "I'm having trouble connecting right now. Please try again.");
    } finally {
      setBusy(false);
      inputEl.focus();
    }
  }

  const parseEvent = (block) => {
    let event = "message";
    let dataStr = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) dataStr += line.slice(5).trim();
    }
    if (!dataStr) return null;
    try {
      return { event, data: JSON.parse(dataStr) };
    } catch {
      return null;
    }
  };

  // ---- open / close + focus trap ----------------------------------------

  const FOCUSABLE = 'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])';

  const openPanel = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;
    panel.classList.add("is-open");
    panel.removeAttribute("hidden");
    fab.setAttribute("aria-expanded", "true");
    document.addEventListener("keydown", onKeydown, true);
    setTimeout(() => inputEl.focus(), 50);
  };

  const closePanel = () => {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeydown, true);
    // Hide after the transition so it's removed from the tab order.
    const hide = () => panel.setAttribute("hidden", "");
    if (reduceMotion) hide();
    else setTimeout(hide, 220);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    else fab.focus();
  };

  const onKeydown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter(
      (n) => !n.disabled && n.offsetParent !== null
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // ---- build UI ---------------------------------------------------------

  const buildStarters = () => {
    startersEl = el("div", "chat-starters", { "aria-label": "Suggested questions" });
    STARTERS.forEach((q) => {
      const chip = el("button", "chat-starter", { type: "button" });
      chip.textContent = q;
      chip.addEventListener("click", () => {
        if (busy) return;
        inputEl.value = "";
        ask(q);
      });
      startersEl.appendChild(chip);
    });
    return startersEl;
  };

  const build = () => {
    // Floating action button
    fab = el("button", "chat-fab", {
      type: "button",
      "aria-label": "Ask my portfolio",
      "aria-expanded": "false",
      "aria-controls": "ask-portfolio-panel",
    });
    fab.innerHTML =
      '<ion-icon name="chatbubble-ellipses-outline" aria-hidden="true"></ion-icon>' +
      '<span class="chat-fab-label">Ask my portfolio</span>';
    fab.addEventListener("click", () => (isOpen ? closePanel() : openPanel()));

    // Panel
    panel = el("section", "chat-panel", {
      id: "ask-portfolio-panel",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Ask my portfolio",
      hidden: "",
    });

    const header = el("div", "chat-header");
    const heading = el("div", "chat-heading");
    heading.innerHTML =
      '<span class="chat-title">Ask my portfolio</span>' +
      '<span class="chat-sub">Answers grounded in Advait’s actual work</span>';
    const closeBtn = el("button", "chat-close", { type: "button", "aria-label": "Close chat" });
    closeBtn.innerHTML = '<ion-icon name="close-outline" aria-hidden="true"></ion-icon>';
    closeBtn.addEventListener("click", closePanel);
    header.append(heading, closeBtn);

    messagesEl = el("div", "chat-messages", {
      role: "log",
      "aria-live": "polite",
      "aria-atomic": "false",
    });

    const intro = el("div", "chat-msg chat-msg--assistant");
    const introBubble = el("div", "chat-bubble");
    renderText(
      introBubble,
      "Hi! I'm Advait's portfolio assistant. Ask me about his experience, projects, or ClawbackVault — I'll point you to the sources."
    );
    intro.appendChild(introBubble);
    messagesEl.appendChild(intro);
    messagesEl.appendChild(buildStarters());

    // Composer
    const form = el("form", "chat-form");
    inputEl = el("input", "chat-input", {
      type: "text",
      placeholder: "Ask about Advait…",
      "aria-label": "Your question",
      maxlength: String(MAX_INPUT),
      autocomplete: "off",
    });
    sendBtn = el("button", "chat-send", { type: "submit", "aria-label": "Send", disabled: "" });
    sendBtn.innerHTML = '<ion-icon name="arrow-up-outline" aria-hidden="true"></ion-icon>';

    inputEl.addEventListener("input", () => {
      sendBtn.disabled = busy || !inputEl.value.trim();
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = inputEl.value.trim();
      if (!q || busy) return;
      inputEl.value = "";
      sendBtn.disabled = true;
      ask(q);
    });
    form.append(inputEl, sendBtn);

    panel.append(header, messagesEl, form);
    document.body.append(fab, panel);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  async function init() {
    build();
    try {
      const res = await fetch(KB_URL);
      const kb = await res.json();
      (kb.chunks || []).forEach((c) => kbById.set(c.id, c));
    } catch {
      /* chips just won't resolve; chat still works */
    }
  }
})();
