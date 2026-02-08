// ===== TESTIMONIALS SLIDER =====
document.addEventListener("DOMContentLoaded", function () {
    const cards = Array.from(document.querySelectorAll(".testimonial-card"));
    const visibleCount = 3;
    let startIndex = 0;
  
    const prevBtn = document.querySelector(".testimonials-prev");
    const nextBtn = document.querySelector(".testimonials-next");
  
    if (!cards.length) return;
  
    function showCards() {
      cards.forEach(card => card.classList.remove("is-visible"));
  
      for (let i = 0; i < visibleCount; i++) {
        const idx = (startIndex + i) % cards.length;
        cards[idx].classList.add("is-visible");
      }
    }
  
    function next() {
      startIndex = (startIndex + visibleCount) % cards.length;
      showCards();
    }
  
    function prev() {
      startIndex = (startIndex - visibleCount) % cards.length;
      if (startIndex < 0) startIndex += cards.length;
      showCards();
    }
  
    showCards();
  
    let autoplay = setInterval(next, 6000);
  
    function resetAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(next, 6000);
    }
  
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        resetAutoplay();
      });
    }
  
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prev();
        resetAutoplay();
      });
    }
  });
  
  // ===== KONTAKTFORMULAR =====
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    
    if (form) {
      form.addEventListener("submit", async function(e) {
        e.preventDefault();
  
        const data = new FormData(form);
  
        const res = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });
  
        if (res.ok) {
          form.reset();
          alert("Vielen Dank! Ihre Nachricht wurde erfolgreich versendet.");
        } else {
          alert("Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut.");
        }
      });
    }
  });
  
  // ===== PAGE LOAD ANIMATION =====
  window.addEventListener('load', () => document.body.classList.add('loaded'));
  
  // ===== BURGER MENU =====
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');
  
  if (burger && links) {
    const toggle = () => {
      const isOpen = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
    };
  
    burger.addEventListener('click', toggle);
  
    // Close menu when clicking on a link
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      })
    );
  }
  
  // ===== HERO VIDEO AUTOPLAY =====
  window.addEventListener("load", function () {
    const vid = document.querySelector(".hero__video");
    if (!vid) return;
    
    const tryPlay = () => {
      const p = vid.play();
      if (p && p.catch) {
        p.catch(() => {});
      }
    };
    
    tryPlay();
  });

  // =========================
// Portfolio: Filter + Lightbox
// =========================
(function () {
  const grid = document.querySelector(".portfolio-grid");
  if (!grid) return; // nur auf portfolio.html aktiv

  const filterBtns = Array.from(document.querySelectorAll(".pf-btn"));
  const cards = Array.from(document.querySelectorAll(".pf-card"));
  const mediaBtns = Array.from(document.querySelectorAll(".pf-media"));

  function setActive(btn) {
    filterBtns.forEach(b => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
  }

  function applyFilter(filter) {
    cards.forEach(card => {
      const cat = card.getAttribute("data-cat");
      const show = filter === "all" || cat === filter;
      card.style.display = show ? "" : "none";
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      setActive(btn);
      applyFilter(filter);
    });
  });

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCap = document.getElementById("lightboxCap");
  const prevBtn = lightbox.querySelector(".lightbox__prev");
  const nextBtn = lightbox.querySelector(".lightbox__next");

  let currentIndex = -1;

  function visibleIndices() {
    const visibleCards = cards.filter(c => c.style.display !== "none");
    const indices = visibleCards.map(c => mediaBtns.indexOf(c.querySelector(".pf-media")));
    return indices.filter(i => i >= 0);
  }

  function openAt(index) {
    currentIndex = index;
    const btn = mediaBtns[currentIndex];
    const full = btn.getAttribute("data-full");
    const img = btn.querySelector("img");

    lbImg.src = full;
    lbImg.alt = img?.alt || "Projektbild";

    const card = btn.closest(".pf-card");
    const title = card.querySelector("h3")?.textContent || "";
    const meta  = card.querySelector("p")?.textContent || "";
    lbCap.textContent = [title, meta].filter(Boolean).join(" • ");

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLb() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  function go(delta) {
    const vis = visibleIndices();
    if (!vis.length) return;

    const pos = vis.indexOf(currentIndex);
    const nextPos = (pos + delta + vis.length) % vis.length;
    openAt(vis[nextPos]);
  }

  mediaBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => openAt(idx));
  });

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target && e.target.matches("[data-close]")) closeLb();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });
})();
