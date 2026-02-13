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



// typed text effect
const typedText = document.querySelector("[data-typed-words]");

if (typedText) {
  const words = typedText.dataset.typedWords.split("|").map((word) => word.trim()).filter(Boolean);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || words.length === 0) {
    typedText.textContent = words[0] || "";
  } else {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentWord = words[wordIndex];
      charIndex += isDeleting ? -1 : 1;
      typedText.textContent = currentWord.substring(0, charIndex);

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(tick, 1200);
        return;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }

      setTimeout(tick, isDeleting ? 50 : 80);
    };

    tick();
  }
}



// reveal animations on scroll
const revealTargets = document.querySelectorAll(
  ".hero-panel, .about-text, .service-item, .testimonials-item, .timeline-item, .skills-item, .project-item, .blog-post-item, .contact-form"
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

revealTargets.forEach((target) => target.classList.add("reveal"));

if (reduceMotion) {
  revealTargets.forEach((target) => {
    target.classList.add("is-visible");
    const skillFill = target.querySelector(".skill-progress-fill");
    if (skillFill) {
      skillFill.classList.add("is-animated");
    }
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          const skillFill = entry.target.querySelector(".skill-progress-fill");
          if (skillFill) {
            skillFill.classList.add("is-animated");
          }

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

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

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// external links behavior
const externalLinks = document.querySelectorAll('a[href^="http"]');

externalLinks.forEach((link) => {
  const isExternal = !link.href.includes(window.location.hostname);
  if (isExternal) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }
});
