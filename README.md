# IIT_Project_3_Fundamentals_of_Web-Development

Personal portfolio site for Gyubum Kim, built from scratch for the Fundamentals of Web Development course at Illinois Institute of Technology. Project 3 adds JavaScript, a mobile-first page, and a Google Maps page to the Project 2 site.

Live site: https://chris970715.github.io/IIT_Project_3_Fundamentals_of_Web-Development/

## Pages

- `index.html` - Home. The mobile-friendly page: mobile-first base styles plus two `min-width` media queries (40em and 64em).
- `resume.html` - Resume. Fixed-width layout.
- `page3.html` - Projects. Fluid layout.
- `map.html` - Map. Google Maps JavaScript API.

## Files

- `css/normalize.css` - CSS reset (normalize.css v8.0.1)
- `css/style.css` - site styles
- `js/main.js` - the site's one JavaScript file, loaded with `defer` from the head of all four pages

## Google Map features beyond the base code (center and zoom)

1. Numbered pins in the site's colours, one for each place in the page's list
2. Info windows that open when a pin is clicked, tapped, or selected with the keyboard
3. A circle that shades the Greater Toronto Area
4. "Show on map" and "Show all places" buttons that move the map
5. Customized controls and phone-friendly gesture handling
