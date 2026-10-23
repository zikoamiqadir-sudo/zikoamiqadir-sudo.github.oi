
/* =========================================
   ZAKARIA AMIQADIR — PORTFOLIO INTERACTIONS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const loader = $("#loader");
  const header = $("#header");
  const progress = $("#scrollProgress");
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  const backToTop = $("#backToTop");
  const copyButton = $("#copyLink");
  const copyFeedback = $("#copyFeedback");

  // 1. Écran de chargement
  const hideLoader = () => {
    loader?.classList.add("loaded");
  };

  window.addEventListener("load", () => {
    setTimeout(hideLoader, 350);
  }, { once: true });

  // Évite de bloquer la page si le chargement prend trop de temps.
  setTimeout(hideLoader, 2500);

  // 2. Année automatique dans le footer
  const year = $("#currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // 3. Menu mobile
  function closeMenu() {
    menuToggle?.classList.remove("open");
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Ouvrir le menu");
    document.body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );

    document.body.classList.toggle("menu-open", isOpen);
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // 4. Barre de progression et navigation
  const sections = $$("main section[id]");
  const navigationLinks = $$(".nav-link");

  function updateScroll() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    if (progress) {
      progress.style.width = `${percentage}%`;
    }

    header?.classList.toggle("scrolled", window.scrollY > 35);
    backToTop?.classList.toggle("show", window.scrollY > 500);

    let currentSection = "accueil";

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 180) {
        currentSection = section.id;
      }
    });

    navigationLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${currentSection}`;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollScheduled = false;

  window.addEventListener("scroll", () => {
    if (scrollScheduled) return;

    scrollScheduled = true;

    requestAnimationFrame(() => {
      updateScroll();
      scrollScheduled = false;
    });
  }, { passive: true });

  updateScroll();

  // 5. Animations d'apparition au défilement
  const revealElements = $$(".reveal");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // 6. Bouton de retour en haut
  backToTop?.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });

  // 7. Copier l'adresse du portfolio
  copyButton?.addEventListener("click", async () => {
    if (!window.isSecureContext || !navigator.clipboard) {
      copyFeedback.textContent =
        "Copie indisponible ici. Sélectionne l'adresse dans ton navigateur.";
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);

      copyFeedback.textContent =
        "Adresse copiée ! Tu peux maintenant la partager.";

      copyButton.textContent = "Adresse copiée ✓";

      setTimeout(() => {
        copyButton.textContent = "Copier le lien du portfolio";
        copyFeedback.textContent = "";
      }, 3000);
    } catch (error) {
      copyFeedback.textContent =
        "Impossible de copier l'adresse. Réessaie depuis ton navigateur.";
    }
  });

  // 8. Animation discrète du dessin technique à la souris
  const visual = $(".hero-visual");

  if (visual && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      visual.style.transform =
        `perspective(1000px) rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;
    });

    visual.addEventListener("pointerleave", () => {
      visual.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    });

    visual.style.transition = "transform 0.25s ease";
  }

  // 9. Ajustement après redimensionnement
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      closeMenu();
    }

    updateScroll();
  });

  console.log("Portfolio de Zakaria Amiqadir initialisé.");
});
