// =====================================================
// NAVIGATION: Sticky-Zustand, Mobil-Overlay, Scroll-Spy
// =====================================================
(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  if (!header) return;

  var burger = header.querySelector(".burger");
  var menu = header.querySelector("#mobile-menu");
  var desktopMq = window.matchMedia("(min-width: 981px)");
  var reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var SCROLL_THRESHOLD = 8;
  var CLOSE_MS = 300;
  var closeTimer = null;
  var lastFocus = null;

  // Body hat overflow-x:hidden → je nach Browser scrollt window oder body
  function scrollTop() {
    return Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0, document.body.scrollTop || 0);
  }

  // ---------- Scroll-Spy (nur Abschnitte, die auf der Seite existieren) ----------
  var navLinks = Array.prototype.slice.call(header.querySelectorAll("a[data-nav]"));
  var sections = navLinks
    .map(function (a) { return a.getAttribute("href"); })
    .filter(function (h, i, arr) { return h.charAt(0) === "#" && arr.indexOf(h) === i; })
    .map(function (h) { return document.getElementById(h.slice(1)); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", id !== null && a.getAttribute("href") === "#" + id);
    });
  }

  function updateSpy() {
    if (!sections.length) return;
    var line = header.offsetHeight + window.innerHeight * 0.3;
    var current = null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) current = s.id;
    });
    var last = sections[sections.length - 1].getBoundingClientRect();
    if (current && last.bottom < line - window.innerHeight * 0.3) current = null;
    setActive(current);
  }

  // ---------- Sticky-Zustand ----------
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      header.classList.toggle("is-scrolled", scrollTop() > SCROLL_THRESHOLD);
      updateSpy();
      ticking = false;
    });
  }
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if (!burger || !menu) return;

  // ---------- Mobil-Overlay ----------
  function isOpen() {
    return burger.getAttribute("aria-expanded") === "true";
  }

  function setBackgroundInert(on) {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el === header || el.tagName === "SCRIPT") return;
      if (on) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  }

  function focusables() {
    return Array.prototype.slice
      .call(header.querySelectorAll("a[href], button:not([disabled])"))
      .filter(function (el) { return el.getClientRects().length > 0; });
  }

  function open() {
    if (isOpen()) return;
    window.clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    menu.hidden = false;
    void menu.offsetWidth; // Reflow, damit die Einblend-Transition startet
    menu.classList.add("is-open");
    header.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Menü schließen");
    document.documentElement.classList.add("nav-locked");
    setBackgroundInert(true);
    var first = menu.querySelector("a");
    if (first) first.focus({ preventScroll: true });
  }

  function close(restoreFocus) {
    if (!isOpen()) return;
    menu.classList.remove("is-open");
    header.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Menü öffnen");
    document.documentElement.classList.remove("nav-locked");
    setBackgroundInert(false);
    closeTimer = window.setTimeout(function () { menu.hidden = true; }, reducedMq.matches ? 0 : CLOSE_MS);
    if (restoreFocus) (lastFocus && lastFocus.focus ? lastFocus : burger).focus({ preventScroll: true });
  }

  burger.addEventListener("click", function () {
    if (isOpen()) close(true);
    else open();
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) close(false);
  });

  document.addEventListener("keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key !== "Tab") return;
    var items = focusables();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (!header.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  });

  function onBreakpoint() {
    if (desktopMq.matches) close(false);
  }
  if (desktopMq.addEventListener) desktopMq.addEventListener("change", onBreakpoint);
  else desktopMq.addListener(onBreakpoint);
})();
