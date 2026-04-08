# CodeStitch Mega Navigation

A production-ready, CodeStitch-native navigation component with first-class mega-menu support. Drop-in compatible with any CodeStitch project — same class conventions (`cs-*`), same breakpoint (1023.5px / 1024px), same `body.dark-mode` + `body.cs-open` + `body.scroll` state model — while adding richer multi-column mega panels, grouped categories, featured promo blocks, and stronger keyboard / ARIA handling than the stock CodeStitch navs.

Built with vanilla JS (~2KB), semantic HTML, and CSS Grid. Zero dependencies.

## Features

- **CodeStitch-native:** Uses `#cs-navigation`, `.cs-toggle`, `.cs-ul-wrapper`, `.cs-ul`, `.cs-li`, `.cs-dropdown`, `.cs-drop-panel`, `.cs-li-link`, `body.cs-open`, `body.scroll`, `body.dark-mode`. Plugs straight into any CS Core Styles setup.
- **Mega panels:** Add `.cs-mega` to any `.cs-li.cs-dropdown` for a full-width panel with 2, 3, or 4 columns (`.cs-grid-2/3/4`), grouped categories (`.cs-mega-category`), and an optional featured promo / CTA block (`.cs-mega-promo`).
- **Click-only disclosure:** Dropdowns never open on hover or focus — only on an explicit click / Enter / Space on the parent `.cs-dropdown-button`. Matches the stock CodeStitch behavior exactly.
- **Accessible-first:** Disclosure pattern (no `role="menubar"`), `aria-expanded` / `aria-controls`, `inert` management on closed panels, `Escape` stack-unwind (closes deepest open panel first, then the drawer), focus return, `:focus-visible` outlines.
- **Single-button parent:** Parent dropdown items are a single `<button class="cs-li-link cs-dropdown-button">` containing the label and the chevron — identical to the stock CodeStitch pattern.
- **Core Styles theming:** All colors flow from `--primary`, `--primaryLight`, `--headerColor`, `--bodyTextColor`, `--bodyTextColorWhite`. A small scoped layer (`--cs-nav-panel-shadow`, `--cs-nav-panel-radius`, `--cs-nav-ease`) is defined under `#cs-navigation` for panel-only tokens Core Styles doesn't provide.
- **Dark mode:** Manual `body.dark-mode` class (CS convention). No `prefers-color-scheme` surprises.
- **Edge-aware dropdowns:** Add `.cs-drop-right` to right-edge panels to anchor them to the right of the parent instead of the left.
- **Icon sprite:** Inline SVG `<symbol>` sprite with 40+ icons, used via `<use href="#icon-…">` and inheriting `currentColor`.

---

## Files

| File | Purpose |
| ---- | ------- |
| `mega-menu.css` | Ship-ready stylesheet (flat CSS). |
| `mega-menu.scss` | SCSS source, nested under `#cs-navigation`. |
| `mega-menu.less` | LESS source, identical rules to the SCSS version. |
| `mega-menu.js` | ~2KB IIFE, no dependencies. |
| `index.html` | Full demo with top bar, standard dropdown, 3-column mega panel, edge-aligned dropdown, CTA, and SVG sprite. |

Ship whichever stylesheet variant matches your toolchain. They compile to the same output.

---

## Quick start (plain HTML)

```html
<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
  <link rel="stylesheet" href="/mega-menu.css">
  <!-- Core Styles variables should already be defined on :root -->
</head>
<body>
  <!-- Paste the #cs-navigation block from index.html here -->
  <header id="cs-navigation"> ... </header>

  <!-- Paste the SVG sprite at the bottom of <body> -->
  <svg style="display:none" xmlns="http://www.w3.org/2000/svg"> ... </svg>

  <script src="/mega-menu.js" defer></script>
</body>
</html>
```

The JS removes `no-js` from `<html>` on load; the CSS `:focus-within` fallback still works for JS-off visitors.

## Astro

Drop `index.html`'s `<header id="cs-navigation">` block into a `src/components/Navigation.astro` component. Import the CSS in your layout and place the JS with `is:inline` or load it from `/public`:

```astro
---
// src/components/Navigation.astro
---
<header id="cs-navigation"> ... </header>

<style is:global>@import '/mega-menu.css';</style>
<script src="/mega-menu.js" is:inline defer></script>
```

## 11ty

Save the `<header>` block as `_includes/nav.njk` and include it in your base layout. Copy `mega-menu.css` / `mega-menu.js` into your passthrough-copied assets directory.

```njk
{% include "nav.njk" %}
```

---

## Required vs optional

**Required:**
- `mega-menu.css` + `mega-menu.js`
- Core Styles `--primary` and `--headerColor` defined on `:root`
- The `#cs-navigation` block markup

**Optional:**
- `.cs-top-bar` (contact + social strip above the main nav)
- `.cs-mega` panels (add to any `.cs-li.cs-dropdown`)
- `.cs-mega-promo` featured CTA block inside a mega panel
- `#dark-mode-toggle` button (commented in `index.html`)
- `.cs-button-solid` CTA inside the nav

---

## Class map (from the original fork)

The component used to use BEM `mega-nav__*` classes; it's been fully renamed to the flat CodeStitch convention.

| Old | New |
| --- | --- |
| `mega-nav__list` | `cs-ul` |
| `mega-nav__item` | `cs-li` (+ `cs-dropdown`, + `cs-mega`) |
| `mega-nav__item-header` | *(removed — single button parent)* |
| `mega-nav__link` | `cs-li-link` |
| `mega-nav__toggle` | `cs-dropdown-button` (the whole parent) |
| `mega-nav__panel` | `cs-drop-panel` |
| `mega-nav__panel-inner` | `cs-drop-inner` |
| `mega-nav__panel-grid` | `cs-mega-grid` |
| `mega-nav__panel-list` | `cs-drop-ul` |
| `mega-nav__panel-link` | `cs-drop-link` (+ `cs-li-link`) |
| `mega-nav__category` | `cs-mega-category` |
| `mega-nav__category-title` | `cs-mega-category-title` |
| `mega-nav__promo*` | `cs-mega-promo*` |
| `mn-grid-2/3/4` | `cs-grid-2/3/4` |
| `mn-align-right` | `cs-drop-right` |
| `.is-open` | `body.cs-open` + `.cs-active` |
| `--mn-*` | Core Styles vars + scoped `--cs-nav-*` |

---

## Building grids

Mega panels opt into a column count via `.cs-grid-2`, `.cs-grid-3`, or `.cs-grid-4` on `.cs-mega-grid`:

```html
<li class="cs-li cs-dropdown cs-mega">
  <button class="cs-li-link cs-dropdown-button"
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="panel-services">
    Services
    <svg class="cs-drop-icon" aria-hidden="true"><use href="#icon-arrow-down"></use></svg>
  </button>

  <div class="cs-drop-panel" id="panel-services">
    <div class="cs-drop-inner">
      <div class="cs-mega-grid cs-grid-3">

        <div class="cs-mega-category">
          <h3 class="cs-mega-category-title">Residential</h3>
          <ul class="cs-drop-ul">
            <li class="cs-drop-li"><a href="#" class="cs-li-link cs-drop-link">Plumbing</a></li>
            <li class="cs-drop-li"><a href="#" class="cs-li-link cs-drop-link">Electrical</a></li>
          </ul>
        </div>

        <div class="cs-mega-promo">
          <h4 class="cs-mega-promo-title">Need a quote?</h4>
          <p class="cs-mega-promo-text">Free on-site assessment.</p>
          <a href="/contact" class="cs-mega-promo-btn">
            Estimate
            <svg class="cs-icon" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
          </a>
        </div>

      </div>
    </div>
  </div>
</li>
```

A standard (non-mega) dropdown is the same shape minus `.cs-mega` and `.cs-mega-grid`: put `.cs-drop-ul` directly inside `.cs-drop-inner`. Add `.cs-drop-right` to `.cs-drop-panel` for right-edge items so the panel anchors to the right of the parent.

---

## Theming

All colors come from Core Styles. Set these on `:root` (any CS theme already does):

- `--primary`, `--primaryLight`, `--secondary`
- `--headerColor`, `--bodyTextColor`, `--bodyTextColorWhite`
- `--dark`, `--medium` (dark-mode)

Panel-only local tokens are scoped under `#cs-navigation` and can be overridden there:

```css
#cs-navigation {
  --cs-nav-panel-shadow: 0 10px 30px rgba(0,0,0,.15);
  --cs-nav-panel-radius: 8px;
  --cs-nav-ease: 250ms cubic-bezier(.4,0,.2,1);
}
```

## Dark mode

Toggle `body.dark-mode` from your CS dark-mode button. The nav ships with full mobile + desktop dark variants. Uncomment the `#dark-mode-toggle` block in `index.html` to enable the button, and pair it with the standard CS dark-mode script.

---

## Iconography library

40+ inline SVG icons live in the sprite at the bottom of `index.html`. Use via `<use href="#icon-name">` — fill inherits from `currentColor`, so they recolor with the surrounding text.

**Interface & Layout:** `menu`, `close`, `arrow-down`, `arrow-right`, `external-link`, `check`, `search`, `layout`, `gear`, `download`, `upload`, `shield`
**Contact & Support:** `envelope`, `phone`, `message`, `map-pin`, `help`, `lifebuoy`, `user`, `users`
**Media & Data:** `image`, `camera`, `file-text`, `bar-chart`, `clipboard`, `tag`, `star`, `calendar`, `clock`
**Industries & Tools:** `briefcase`, `building`, `wrench`, `paint-roller`, `bolt`, `droplet`, `snowflake`, `flame`, `house`, `leaf`, `cross`, `scissors`, `coffee`
