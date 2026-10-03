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
// Map page: Google Maps JavaScript API
// ---------------------------------------------------------------

function showMapError(mapElement, error) {
  const message = document.createElement('p');

  console.warn('The map could not be loaded:', error.message);
  message.className = 'map-message';
  message.textContent = 'Sorry, the map could not be loaded right now. The places are listed below.';
  mapElement.textContent = '';
  mapElement.append(message);
}

async function buildMap(mapElement) {
  if (!window.google || !window.google.maps || !window.google.maps.importLibrary) {
    throw new Error('the Google Maps script did not load');
  }

  const { Map } = await google.maps.importLibrary('maps');

  // Remove the "map appears here" message before Google draws the map
  mapElement.textContent = '';

  // Base code: a map with a center and a zoom level (read from #map)
  const map = new Map(mapElement, {
    center: {
      lat: Number(mapElement.dataset.lat),
      lng: Number(mapElement.dataset.lng)
    },
    zoom: Number(mapElement.dataset.zoom)
  });

  return map;
}

function initMapPage() {
  const mapElement = document.getElementById('map');

  if (!mapElement) {
    return;
  }

  // Google calls this global function if it rejects the API key
  window.gm_authFailure = () => {
    showMapError(mapElement, new Error('Google Maps rejected the API key'));
  };

  buildMap(mapElement).catch((error) => {
    showMapError(mapElement, error);
  });
}

// ---------------------------------------------------------------
// Start-up
// ---------------------------------------------------------------
updateCopyrightYear();
markCurrentNavLink();
initMapPage();
