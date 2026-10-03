'use strict';

/*
  main.js - JavaScript for Gyubum Kim's portfolio site (Project 3)

  This one file is linked from the <head> of all four pages with the
  "defer" attribute, so it runs only after the HTML has been parsed.
  Every feature first checks that the elements it needs exist, so a
  page without them never throws an error.

  Google Map (map.html) - features added beyond the base code:
    1. Numbered pins in the site's colours, one for each listed place
    2. Info windows that open when a pin is clicked, tapped, or
       selected with the keyboard
    3. A circle that shades the Greater Toronto Area
    4. "Show on map" buttons in the place list, plus a
       "Show all places" button, that move the map
    5. Customized controls and phone-friendly gesture handling
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
//
// The places come from the list in map.html (data-lat, data-lng,
// data-zoom, and an optional data-radius in metres), so the page
// still shows every place if JavaScript or the map is unavailable.
// ---------------------------------------------------------------
const MAP_COLORS = {
  pin: '#5b3a82',
  pinBorder: '#2b193d',
  pinNumber: '#f2b134',
  area: '#f2b134'
};

// Turn each <li> in the place list into a place object
function readPlaces() {
  const listItems = document.querySelectorAll('.place-list li');

  return Array.from(listItems).map((item, index) => ({
    item: item,
    number: String(index + 1),
    name: item.querySelector('h3').textContent,
    details: item.querySelector('p').textContent,
    position: {
      lat: Number(item.dataset.lat),
      lng: Number(item.dataset.lng)
    },
    zoom: Number(item.dataset.zoom) || 14,
    radius: Number(item.dataset.radius) || 0
  }));
}

// Build info window content with DOM methods instead of HTML strings
function createInfoContent(place) {
  const box = document.createElement('div');
  const title = document.createElement('p');
  const text = document.createElement('p');

  title.className = 'info-window-title';
  title.textContent = place.name;
  text.className = 'info-window-text';
  text.textContent = place.details;
  box.append(title, text);

  return box;
}

function createButton(label, onClick) {
  const button = document.createElement('button');

  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', onClick);

  return button;
}

function scrollToMap(mapElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  mapElement.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'center'
  });
}

function showMapError(mapElement, error) {
  const message = document.createElement('p');

  console.warn('The map could not be loaded:', error.message);
  message.className = 'map-message';
  message.textContent = 'Sorry, the map could not be loaded right now. The places are listed below.';
  mapElement.textContent = '';
  mapElement.append(message);
}

async function buildMap(mapElement, places) {
  if (!window.google || !window.google.maps || !window.google.maps.importLibrary) {
    throw new Error('the Google Maps script did not load');
  }

  const [mapsLibrary, markerLibrary, coreLibrary] = await Promise.all([
    google.maps.importLibrary('maps'),
    google.maps.importLibrary('marker'),
    google.maps.importLibrary('core')
  ]);
  const { Map, InfoWindow, Circle } = mapsLibrary;
  const { AdvancedMarkerElement, PinElement } = markerLibrary;
  const { ControlPosition, LatLngBounds } = coreLibrary;

  // Remove the "map appears here" message before Google draws the map
  mapElement.textContent = '';

  // Base code: a map with a center and a zoom level (read from #map)
  const map = new Map(mapElement, {
    center: {
      lat: Number(mapElement.dataset.lat),
      lng: Number(mapElement.dataset.lng)
    },
    zoom: Number(mapElement.dataset.zoom),
    mapId: 'DEMO_MAP_ID', // Google's test map ID, required for advanced markers

    // Feature 5: customized controls and gestures
    gestureHandling: 'cooperative', // on phones, one finger scrolls the page
    streetViewControl: false,
    minZoom: 4,
    mapTypeControlOptions: {
      position: ControlPosition.BLOCK_END_INLINE_CENTER
    }
  });

  const infoWindow = new InfoWindow();
  const allPlacesBounds = new LatLngBounds();

  // Open the info window for a place and highlight it in the list
  function selectPlace(place) {
    infoWindow.setContent(createInfoContent(place));
    infoWindow.open({ map: map, anchor: place.marker });

    places.forEach((otherPlace) => {
      otherPlace.item.classList.toggle('is-active', otherPlace === place);
    });
  }

  // Move the map to a place: the whole circle for an area, or zoom in on a point
  function goToPlace(place) {
    if (place.circle) {
      map.fitBounds(place.circle.getBounds());
    } else {
      map.setZoom(place.zoom);
      map.panTo(place.position);
    }

    selectPlace(place);
  }

  places.forEach((place) => {
    // Feature 1: numbered pins in the site's colours
    const pin = new PinElement({
      background: MAP_COLORS.pin,
      borderColor: MAP_COLORS.pinBorder,
      glyphColor: MAP_COLORS.pinNumber,
      glyphText: place.number,
      scale: 1.2
    });

    place.marker = new AdvancedMarkerElement({
      map: map,
      position: place.position,
      title: place.name,
      gmpClickable: true
    });
    place.marker.append(pin);
    allPlacesBounds.extend(place.position);

    // Feature 2: info window on click, tap, or Enter key
    place.marker.addEventListener('gmp-click', () => {
      selectPlace(place);
    });

    // Feature 3: shade an area for places that have a data-radius
    if (place.radius > 0) {
      place.circle = new Circle({
        map: map,
        center: place.position,
        radius: place.radius,
        clickable: false,
        fillColor: MAP_COLORS.area,
        fillOpacity: 0.15,
        strokeColor: MAP_COLORS.area,
        strokeWeight: 2
      });
      allPlacesBounds.union(place.circle.getBounds());
    }

    // Feature 4: a "Show on map" button for each place in the list
    const showButton = createButton('Show on map', () => {
      goToPlace(place);
      scrollToMap(mapElement);
    });

    showButton.setAttribute('aria-label', `Show ${place.name} on the map`);
    place.item.append(showButton);
  });

  // Feature 4 (continued): zoom out to fit every place
  const actions = document.createElement('p');

  actions.className = 'map-actions';
  actions.append(createButton('Show all places', () => {
    infoWindow.close();
    places.forEach((place) => {
      place.item.classList.remove('is-active');
    });
    map.fitBounds(allPlacesBounds);
  }));
  mapElement.after(actions);

  return map;
}

function initMapPage() {
  const mapElement = document.getElementById('map');
  const places = readPlaces();

  if (!mapElement || places.length === 0) {
    return;
  }

  // Google calls this global function if it rejects the API key
  window.gm_authFailure = () => {
    showMapError(mapElement, new Error('Google Maps rejected the API key'));
  };

  buildMap(mapElement, places).catch((error) => {
    showMapError(mapElement, error);
  });
}

// ---------------------------------------------------------------
// Start-up
// ---------------------------------------------------------------
updateCopyrightYear();
markCurrentNavLink();
initMapPage();
