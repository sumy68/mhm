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