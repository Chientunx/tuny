# TUNY Portfolio — updated starter

## Updated behavior
- Fixed viewport: the page itself does not scroll.
- Search has been removed.
- Responsive layout switch: carousel view and grid view.
- Project cards auto-slide from right to left.
- Hovering the showcase pauses the automatic slide.
- Footer buttons filter projects by their tags: Product, Website, Brand, Logofolio, Graphic.
- The carousel only renders projects matching the active footer category.
- Includes basic drag and previous/next controls.

## Files
- `index.html` — page structure and editable project data
- `styles.css` — visual styling and responsive layout
- `script.js` — category filtering, carousel, view switch and drag
- `assets/` — add your real thumbnails, logos, and video previews here

## Run
Open `index.html` in a browser or use VS Code Live Server.

## Customize
1. Edit each card's `data-tags` in `index.html`. Use one or more of: `product`, `website`, `brand`, `logofolio`, `graphic`.
2. Replace the CSS artwork blocks with `<img>` or video previews when your assets are ready.
3. Edit the About Me text and contact email.
4. Add/remove project cards; the carousel duplicates the filtered set for a continuous loop.

Note: "No scroll" applies to the page viewport. On very narrow or short screens, the footer category strip can scroll horizontally so every category remains reachable.
