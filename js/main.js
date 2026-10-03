'use strict';

/*
  main.js - JavaScript for Gyubum Kim's portfolio site (Project 3)

  This one file is linked from the <head> of all four pages with the
  "defer" attribute, so it runs only after the HTML has been parsed.
  Every feature first checks that the elements it needs exist, so a
  page without them never throws an error.
*/

// ---------------------------------------------------------------
// Footer: keep the copyright year current
// ---------------------------------------------------------------
function updateCopyrightYear() {
  const yearElement = document.querySelector('footer .year');

  if (!yearElement) {
    return;
  }

  yearElement.textContent = String(new Date().getFullYear());
}

// ---------------------------------------------------------------
// Navigation: tell screen readers which link is the current page
// ---------------------------------------------------------------
function markCurrentNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

// ---------------------------------------------------------------
// Start-up
// ---------------------------------------------------------------
updateCopyrightYear();
markCurrentNavLink();
