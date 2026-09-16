'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}



// Typed hero text, scroll reveals and metric counters live in motion.js.



// "Listen to Podcast" style in-page jumps to a nav page
const navJumpLinks = document.querySelectorAll("[data-nav-jump]");
navJumpLinks.forEach((jump) => {
  jump.addEventListener("click", (event) => {
    event.preventDefault();
    const targetPage = jump.dataset.navJump;
    const navBtn = [...document.querySelectorAll("[data-nav-link]")].find(
      (btn) => btn.innerHTML.trim().toLowerCase() === targetPage
    );
    if (navBtn) navBtn.click();
  });
});

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category.toLowerCase()) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

  document.dispatchEvent(new CustomEvent("filterchange", { detail: { value: selectedValue } }));

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// contact form submission (Formspree)
if (form) {
  const thankYou = document.querySelector("#thank-you");
  const honeypot = form.querySelector(".hp-field");

  const showThankYou = () => {
    if (thankYou) {
      thankYou.classList.add("is-visible");
      window.location.hash = "thank-you";
    }
  };

  if (window.location.hash === "#thank-you") {
    showThankYou();
  }

  form.addEventListener("submit", async (event) => {
    if (!form.action.includes("formspree")) {
      return;
    }

    if (honeypot && honeypot.value) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        form.reset();
        formBtn.setAttribute("disabled", "");
        showThankYou();
      }
    } catch (error) {
      // Fall back to default submission if fetch fails.
      form.submit();
    }
  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    const previous = document.querySelector("[data-page].active");
    let next = null;

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        next = pages[i];
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

    // let the motion layer (motion.js) animate the incoming page
    if (next && next !== previous) {
      document.dispatchEvent(new CustomEvent("pagechange", { detail: { page: next, link: this } }));
    }

  });
}

// hash-based deep linking (shareable pages, e.g. #podcast)
const pageNames = [...pages].map((page) => page.dataset.page);

const activatePageByName = (name) => {
  const navBtn = [...navigationLinks].find(
    (btn) => btn.innerHTML.trim().toLowerCase() === name
  );
  if (navBtn) navBtn.click();
};

const applyHash = () => {
  const name = window.location.hash.replace("#", "").toLowerCase();
  if (pageNames.includes(name)) {
    activatePageByName(name);
  }
};

// activate the correct page on first load and on hash changes
applyHash();
window.addEventListener("hashchange", applyHash);

// keep the URL hash in sync when navigating via the navbar
navigationLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.innerHTML.trim().toLowerCase();
    if (history.replaceState) {
      history.replaceState(null, "", "#" + name);
    }
  });
});



// research: copy a paper's BibTeX entry
const citeButtons = document.querySelectorAll("[data-copy-cite]");

citeButtons.forEach((btn) => {
  const label = btn.textContent;

  btn.addEventListener("click", async () => {
    const source = document.querySelector(`[data-bibtex="${btn.dataset.copyCite}"]`);
    if (!source) return;

    try {
      await navigator.clipboard.writeText(source.textContent);
      btn.textContent = "Copied";
    } catch (error) {
      btn.textContent = "Copy failed";
    }

    btn.classList.add("is-copied");
    setTimeout(() => {
      btn.textContent = label;
      btn.classList.remove("is-copied");
    }, 1800);
  });
});



// external links behavior
const externalLinks = document.querySelectorAll('a[href^="http"]');

externalLinks.forEach((link) => {
  const isExternal = !link.href.includes(window.location.hostname);
  if (isExternal) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }
});
