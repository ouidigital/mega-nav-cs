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
- **Framework packages:** Ready-to-drop components for **Astro** (static + data-driven variants) and **Eleventy** (Nunjucks partial), in addition to plain HTML.

---

## Files

| File / Folder | Purpose |
| ------------- | ------- |
| `mega-menu.css` | Ship-ready stylesheet (flat CSS). |
| `mega-menu.scss` | SCSS source, nested under `#cs-navigation`. |
| `mega-menu.less` | LESS source, identical rules to the SCSS version. |
| `mega-menu.js` | ~2KB IIFE, no dependencies. |
| `index.html` | Full demo showcasing **all four grid layouts** side-by-side: 1-col standard dropdown, 2-col mega, 3-col mega + promo, 4-col mega, plus a right-edge-aligned dropdown, CTA, SVG sprite, and iconography showcase. |
| `Astro/StaticHeader.astro` | Drop-in Astro component with hardcoded nav markup. Uses `Astro.url.pathname` for active-state. |
| `Astro/DynamicHeader.astro` | Data-driven Astro variant that reads from `navData.json`. Iterates the tree and renders mega / dropdown / simple items automatically. |
| `Astro/navData.json` | Nav tree consumed by `DynamicHeader.astro`. Supports simple links, standard dropdowns, mega panels with categories + promo blocks, and right-aligned dropdowns. |
| `11ty/header.html` | Eleventy Nunjucks partial with the same markup and active-state resolution via `{% if page.url == … %}`. |
| `docs/icons/*.svg` | Individual icon files used by this README for the Iconography showcase below. Not required at runtime (the sprite in `index.html` is the source of truth). |

Ship whichever stylesheet variant matches your toolchain — they compile to the same output.

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

---

## Astro

Two variants are provided in the `Astro/` folder. Pick whichever suits your workflow:

### Static variant — `Astro/StaticHeader.astro`

Hardcoded nav markup. Edit the JSX-style list directly. Good when the nav is unique to the project and you don't need a data layer.

```astro
---
import StaticHeader from "@components/Navigation/StaticHeader.astro";
---
<StaticHeader />
```

Active states are resolved inline with `Astro.url.pathname`:

```astro
<a class:list={["cs-li-link", { "cs-active": Astro.url.pathname === "/" }]}>Home</a>
```

The component ships with its styles inlined in a `<style lang="less">` block, so you only need to drop it in, copy `mega-menu.js` next to it, and make sure your root `:root` exposes the Core Styles variables. No extra CSS import required.

### Dynamic variant — `Astro/DynamicHeader.astro` + `Astro/navData.json`

Data-driven. Reads the nav tree from `navData.json` and renders mega / standard / simple items automatically. Good when content editors (or you) want to edit one JSON file instead of touching component markup.

```astro
---
import DynamicHeader from "@components/Navigation/DynamicHeader.astro";
---
<DynamicHeader />
```

**`navData.json` shape:**

```jsonc
[
  { "key": "Home", "url": "/" },

  // 2-column mega-menu — two side-by-side categories
  {
    "key": "Solutions",
    "panelClass": "cs-grid-2",             // cs-grid-2 | cs-grid-3 | cs-grid-4
    "activePrefix": "/solutions/",         // sets cs-active when pathname starts with this
    "categories": [
      {
        "title": "Small Business",
        "links": [
          { "key": "Starter Plan", "url": "/solutions/starter/", "icon": "briefcase" },
          { "key": "Growth Plan",  "url": "/solutions/growth/",  "icon": "tag" },
          { "key": "Pro Plan",     "url": "/solutions/pro/",     "icon": "star" }
        ]
      },
      {
        "title": "Enterprise",
        "links": [
          { "key": "Security & SSO", "url": "/solutions/security/",   "icon": "shield" },
          { "key": "Multi-Site",     "url": "/solutions/multi-site/", "icon": "building" },
          { "key": "Compliance",     "url": "/solutions/compliance/", "icon": "clipboard" }
        ]
      }
    ]
  },

  // 3-column mega-menu — two categories + featured promo
  {
    "key": "Services",
    "panelClass": "cs-grid-3",
    "activePrefix": "/services/",
    "categories": [
      {
        "title": "Professional",
        "links": [
          { "key": "Website Design", "url": "/services/web/",       "icon": "layout" },
          { "key": "SEO Audits",     "url": "/services/seo/",       "icon": "search" },
          { "key": "Marketing",      "url": "/services/marketing/", "icon": "bar-chart" }
        ]
      },
      {
        "title": "Trades",
        "links": [
          { "key": "Plumbing",   "url": "/services/plumbing/",   "icon": "wrench" },
          { "key": "Electrical", "url": "/services/electrical/", "icon": "bolt" },
          { "key": "Painting",   "url": "/services/painting/",   "icon": "paint-roller" }
        ]
      }
    ],
    "promo": {
      "title":    "Need a quote?",
      "text":     "Get an expert assessment for your project, entirely for free.",
      "btnLabel": "Get Estimate",
      "btnUrl":   "/contact/",
      "btnIcon":  "arrow-right"
    }
  },

  // 4-column mega-menu — four categories, no promo
  {
    "key": "Resources",
    "panelClass": "cs-grid-4",
    "activePrefix": "/resources/",
    "categories": [
      { "title": "Learn",     "links": [ /* … */ ] },
      { "title": "Media",     "links": [ /* … */ ] },
      { "title": "Tools",     "links": [ /* … */ ] },
      { "title": "Community", "links": [ /* … */ ] }
    ]
  },

  // 1-column standard dropdown (non-mega)
  {
    "key": "Company",
    "children": [
      { "key": "About Us", "url": "/about/",    "icon": "building" },
      { "key": "Our Team", "url": "/team/",     "icon": "users" },
      { "key": "Careers",  "url": "/careers/",  "icon": "briefcase" }
    ]
  },

  // Edge-aligned 1-column dropdown (anchors to the right edge of the parent)
  {
    "key": "Contact",
    "align": "right",
    "children": [
      { "key": "Message Us",      "url": "/contact/",       "icon": "message" },
      { "key": "Call Support",    "url": "tel:+1234567890", "icon": "phone" },
      { "key": "Find a Location", "url": "/locations/",     "icon": "map-pin" }
    ]
  }
]
```

> See `Astro/navData.json` for the full, non-abbreviated version (including the four Resources categories).

Active state resolves in this order:
1. `activePrefix` → matches `pathname.startsWith(prefix)` (ideal for mega sections like `/services/…`).
2. `children` / `categories` → active if any child URL equals the current path.
3. Simple link → exact equality.

Panel and toggle IDs are generated automatically by slugifying `key` (e.g. `cs-panel-services` + `services-dropdown-toggle`). Icons map 1:1 to `<symbol id="icon-{name}">` in the inline sprite — add or remove `<symbol>` entries in the component's sprite block to match your own menu.

Both Astro variants import `mega-menu.js` via a local `<script>` tag. Place the JS file next to the component.

---

## Eleventy (11ty)

`11ty/header.html` is a ready-to-use Nunjucks partial. Save it to `src/_includes/header.html` (or any include path) and render it from your base layout:

```njk
{% include "header.html" %}
```

Prerequisites — in your base layout, link the stylesheet and script:

```html
<link rel="stylesheet" href="/assets/css/mega-menu.css">
<script src="/assets/js/mega-menu.js" defer></script>
```

Make sure `mega-menu.css` and `mega-menu.js` are in your Eleventy passthrough-copy config.

Active states are resolved via `page.url`:

```njk
<a class="cs-li-link{% if page.url == '/' %} cs-active{% endif %}"
   {% if page.url == '/' %}aria-current="page"{% endif %}>
  Home
</a>
```

For mega items spanning a URL prefix, 11ty doesn't have `startsWith` natively — use `{% if page.url == '/services/' or page.url == '/services/web/' or … %}` or add a custom filter.

---

## Required vs optional

**Required:**
- `mega-menu.css` + `mega-menu.js`
- Core Styles `--primary` and `--headerColor` defined on `:root`
- The `#cs-navigation` block markup (from `index.html`, the Astro components, or the 11ty partial)

**Optional:**
- `.cs-top-bar` (contact + social strip above the main nav)
- `.cs-mega` panels (add to any `.cs-li.cs-dropdown`)
- `.cs-mega-promo` featured CTA block inside a mega panel
- `#dark-mode-toggle` button (commented in `index.html`; a `<DarkModeToggle />` slot is provided in the Astro components)
- `.cs-button-solid` CTA inside the nav
- `Astro/navData.json` (only needed if you use `DynamicHeader.astro`)

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

The demo nav in `index.html` showcases **all four column layouts** side-by-side: a 1-column standard dropdown (Company), a 2-column mega (Solutions), a 3-column mega with a featured promo (Services), and a 4-column mega (Resources).

Mega panels opt into a column count with `.cs-grid-2`, `.cs-grid-3`, or `.cs-grid-4` — **on the `.cs-drop-panel` itself**, not on the inner grid. (The `.cs-mega-grid` is the grid container; the `cs-grid-*` modifier on the panel is what drives `grid-template-columns`.)

```html
<!-- Pattern: panel class selects column count -->
<div class="cs-drop-panel cs-grid-3" id="cs-panel-services">
  <div class="cs-drop-inner">
    <div class="cs-mega-grid">
      <!-- cs-mega-category / cs-mega-promo cells here -->
    </div>
  </div>
</div>
```

### 1 column — standard (non-mega) dropdown

The **1-column layout is just a standard dropdown** — no `.cs-mega`, no `.cs-mega-grid`, no `cs-grid-*`. `.cs-drop-ul` goes directly inside `.cs-drop-inner`:

```html
<li class="cs-li cs-dropdown">
  <button class="cs-li-link cs-dropdown-button"
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="cs-panel-company">
    Company
    <svg class="cs-drop-icon" aria-hidden="true"><use href="#icon-arrow-down"></use></svg>
  </button>

  <div class="cs-drop-panel" id="cs-panel-company">
    <div class="cs-drop-inner">
      <ul class="cs-drop-ul">
        <li class="cs-drop-li"><a href="/about/"   class="cs-li-link cs-drop-link"><svg class="cs-icon" aria-hidden="true"><use href="#icon-building"></use></svg> About Us</a></li>
        <li class="cs-drop-li"><a href="/team/"    class="cs-li-link cs-drop-link"><svg class="cs-icon" aria-hidden="true"><use href="#icon-users"></use></svg> Our Team</a></li>
        <li class="cs-drop-li"><a href="/careers/" class="cs-li-link cs-drop-link"><svg class="cs-icon" aria-hidden="true"><use href="#icon-briefcase"></use></svg> Careers</a></li>
      </ul>
    </div>
  </div>
</li>
```

Add `.cs-drop-right` to the `.cs-drop-panel` for right-edge items so the panel anchors to the right of the parent instead of the left.

### 2 columns — mega panel with two categories

Add `.cs-mega` to the `<li>` and `cs-grid-2` to the `.cs-drop-panel`. Inside `.cs-mega-grid`, drop in two `.cs-mega-category` blocks:

```html
<li class="cs-li cs-dropdown cs-mega">
  <button class="cs-li-link cs-dropdown-button"
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="cs-panel-solutions">
    Solutions
    <svg class="cs-drop-icon" aria-hidden="true"><use href="#icon-arrow-down"></use></svg>
  </button>

  <div class="cs-drop-panel cs-grid-2" id="cs-panel-solutions">
    <div class="cs-drop-inner">
      <div class="cs-mega-grid">

        <div class="cs-mega-category">
          <h3 class="cs-mega-category-title">Small Business</h3>
          <ul class="cs-drop-ul">
            <li class="cs-drop-li"><a href="/solutions/starter/" class="cs-li-link cs-drop-link">Starter Plan</a></li>
            <li class="cs-drop-li"><a href="/solutions/growth/"  class="cs-li-link cs-drop-link">Growth Plan</a></li>
            <li class="cs-drop-li"><a href="/solutions/pro/"     class="cs-li-link cs-drop-link">Pro Plan</a></li>
          </ul>
        </div>

        <div class="cs-mega-category">
          <h3 class="cs-mega-category-title">Enterprise</h3>
          <ul class="cs-drop-ul">
            <li class="cs-drop-li"><a href="/solutions/security/"   class="cs-li-link cs-drop-link">Security &amp; SSO</a></li>
            <li class="cs-drop-li"><a href="/solutions/multi-site/" class="cs-li-link cs-drop-link">Multi-Site</a></li>
            <li class="cs-drop-li"><a href="/solutions/compliance/" class="cs-li-link cs-drop-link">Compliance</a></li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</li>
```

### 3 columns — two categories + a featured promo

Same as 2-column but with `cs-grid-3` and a third cell that's a `.cs-mega-promo` instead of a category. The promo block can live anywhere in the grid; by convention it goes in the last column:

```html
<div class="cs-drop-panel cs-grid-3" id="cs-panel-services">
  <div class="cs-drop-inner">
    <div class="cs-mega-grid">

      <div class="cs-mega-category">
        <h3 class="cs-mega-category-title">Professional</h3>
        <ul class="cs-drop-ul">…</ul>
      </div>

      <div class="cs-mega-category">
        <h3 class="cs-mega-category-title">Trades</h3>
        <ul class="cs-drop-ul">…</ul>
      </div>

      <!-- Featured promo block fills the third column -->
      <div class="cs-mega-promo">
        <h4 class="cs-mega-promo-title">Need a quote?</h4>
        <p class="cs-mega-promo-text">Get an expert assessment for your project, entirely for free.</p>
        <a href="/contact/" class="cs-mega-promo-btn">
          Get Estimate
          <svg class="cs-icon" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
        </a>
      </div>

    </div>
  </div>
</div>
```

### 4 columns — four categories

`cs-grid-4` on the panel, four `.cs-mega-category` cells inside the grid. Good for a Resources / Learn-more panel:

```html
<div class="cs-drop-panel cs-grid-4" id="cs-panel-resources">
  <div class="cs-drop-inner">
    <div class="cs-mega-grid">
      <div class="cs-mega-category">
        <h3 class="cs-mega-category-title">Learn</h3>
        <ul class="cs-drop-ul">…</ul>
      </div>
      <div class="cs-mega-category">
        <h3 class="cs-mega-category-title">Media</h3>
        <ul class="cs-drop-ul">…</ul>
      </div>
      <div class="cs-mega-category">
        <h3 class="cs-mega-category-title">Tools</h3>
        <ul class="cs-drop-ul">…</ul>
      </div>
      <div class="cs-mega-category">
        <h3 class="cs-mega-category-title">Community</h3>
        <ul class="cs-drop-ul">…</ul>
      </div>
    </div>
  </div>
</div>
```

### More columns (opt-in)

Need 5 or 6 columns? The stylesheet includes an opt-in escape hatch via a CSS custom property — set `--cs-cols` inline on the `.cs-drop-panel`:

```html
<div class="cs-drop-panel" id="cs-panel-huge" style="--cs-cols: 5;">
  <div class="cs-drop-inner">
    <div class="cs-mega-grid"> … </div>
  </div>
</div>
```

### Mobile behavior

On mobile (≤1023.5px), **all mega panels collapse to a single column** regardless of `cs-grid-*`, the `.cs-mega-grid` stacks vertically, and the `.cs-mega-promo` (if present) renders inline with the rest of the list.

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

Toggle `body.dark-mode` from your CS dark-mode button. The nav ships with full mobile + desktop dark variants. Uncomment the `#dark-mode-toggle` block in `index.html` (or keep `<DarkModeToggle />` in the Astro variants) and pair it with the standard CS dark-mode script.

---

## Iconography library

43 inline SVG icons live in the sprite at the bottom of `index.html`. Use via `<use href="#icon-name">`:

```html
<svg class="cs-icon" aria-hidden="true"><use href="#icon-search"/></svg>
```

### Customizing icons

All icons are **stroke-based line art** (Feather-style) rendered by the `.cs-icon` class:

```css
.cs-icon {
    width: 1.15em;
    height: 1.15em;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5px;
    stroke-linecap: round;
    stroke-linejoin: round;
}
```

That means you have three knobs:

**1. Color — change the parent's `color`.**
Icons inherit from `currentColor`, so they recolor with the surrounding text automatically. You never set `stroke` or `fill` on the icon itself.

```css
/* All icons inside the CTA button turn red */
.my-nav .cs-button-solid { color: crimson; }

/* One-off override for a specific icon */
.cs-drop-link:hover .cs-icon { color: var(--primary); }
```

**2. Thickness — override `stroke-width`.**
The default is `1.5px`. Bump it for a bolder look, drop it for a hairline feel. The value is a plain CSS length (no `px` required on SVG, but CSS requires it here):

```css
/* Chunkier icons site-wide */
#cs-navigation .cs-icon { stroke-width: 2px; }

/* Extra-bold just for the mobile drawer rows */
@media (max-width: 1023.5px) {
    #cs-navigation .cs-drop-link .cs-icon { stroke-width: 2.25px; }
}
```

The chevron next to each dropdown label is a separate `.cs-drop-icon` class — tweak that one independently if you want a beefier caret without affecting the menu rows.

**3. Size — override `width` / `height` (or scale the parent `font-size`).**
Because `.cs-icon` sizes itself in `em`, the easiest scaling lever is the surrounding text size. For a specific one-off, set explicit dimensions:

```html
<!-- Inline override (used in the promo-button arrow) -->
<svg class="cs-icon" aria-hidden="true" style="width:0.875em;height:0.875em;">
  <use href="#icon-arrow-right"/>
</svg>
```

```css
/* Site-wide bump */
#cs-navigation .cs-mega-promo .cs-icon { width: 1.25em; height: 1.25em; }
```

**Filled icons?** A few symbols (`bolt`, `star`, `home`, `house`, `leaf`, `flame`, `droplet`, `cross`) are drawn as polygons rather than lines. They currently render as outlines because `.cs-icon` sets `fill: none`. To fill them instead, flip `fill` to `currentColor` on those specific uses:

```css
.cs-icon.is-filled { fill: currentColor; stroke: none; }
```

```html
<svg class="cs-icon is-filled" aria-hidden="true"><use href="#icon-star"/></svg>
```

**Adding your own icon.** Copy any 24×24 line-art SVG (Feather, Lucide, Tabler all work) into the `<defs>` sprite block as a `<symbol id="icon-yourname" viewBox="0 0 24 24">…</symbol>`, strip its own `fill`/`stroke`/`width`/`height` attributes so `.cs-icon` can control them, then reference it with `<use href="#icon-yourname"/>`.

### Icon grid

### Interface & Layout

| <img src="docs/icons/menu.svg" width="32" height="32" alt="menu"> | <img src="docs/icons/close.svg" width="32" height="32" alt="close"> | <img src="docs/icons/arrow-down.svg" width="32" height="32" alt="arrow-down"> | <img src="docs/icons/arrow-right.svg" width="32" height="32" alt="arrow-right"> | <img src="docs/icons/external-link.svg" width="32" height="32" alt="external-link"> | <img src="docs/icons/check.svg" width="32" height="32" alt="check"> |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `menu` | `close` | `arrow-down` | `arrow-right` | `external-link` | `check` |
| <img src="docs/icons/search.svg" width="32" height="32" alt="search"> | <img src="docs/icons/layout.svg" width="32" height="32" alt="layout"> | <img src="docs/icons/gear.svg" width="32" height="32" alt="gear"> | <img src="docs/icons/download.svg" width="32" height="32" alt="download"> | <img src="docs/icons/upload.svg" width="32" height="32" alt="upload"> | <img src="docs/icons/shield.svg" width="32" height="32" alt="shield"> |
| `search` | `layout` | `gear` | `download` | `upload` | `shield` |

### Contact & Support

| <img src="docs/icons/envelope.svg" width="32" height="32" alt="envelope"> | <img src="docs/icons/phone.svg" width="32" height="32" alt="phone"> | <img src="docs/icons/message.svg" width="32" height="32" alt="message"> | <img src="docs/icons/map-pin.svg" width="32" height="32" alt="map-pin"> | <img src="docs/icons/help.svg" width="32" height="32" alt="help"> | <img src="docs/icons/lifebuoy.svg" width="32" height="32" alt="lifebuoy"> |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `envelope` | `phone` | `message` | `map-pin` | `help` | `lifebuoy` |
| <img src="docs/icons/user.svg" width="32" height="32" alt="user"> | <img src="docs/icons/users.svg" width="32" height="32" alt="users"> | | | | |
| `user` | `users` | | | | |

### Media & Data

| <img src="docs/icons/image.svg" width="32" height="32" alt="image"> | <img src="docs/icons/camera.svg" width="32" height="32" alt="camera"> | <img src="docs/icons/file-text.svg" width="32" height="32" alt="file-text"> | <img src="docs/icons/bar-chart.svg" width="32" height="32" alt="bar-chart"> | <img src="docs/icons/clipboard.svg" width="32" height="32" alt="clipboard"> | <img src="docs/icons/tag.svg" width="32" height="32" alt="tag"> |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `image` | `camera` | `file-text` | `bar-chart` | `clipboard` | `tag` |
| <img src="docs/icons/star.svg" width="32" height="32" alt="star"> | <img src="docs/icons/calendar.svg" width="32" height="32" alt="calendar"> | <img src="docs/icons/clock.svg" width="32" height="32" alt="clock"> | | | |
| `star` | `calendar` | `clock` | | | |

### Industries & Tools

| <img src="docs/icons/briefcase.svg" width="32" height="32" alt="briefcase"> | <img src="docs/icons/building.svg" width="32" height="32" alt="building"> | <img src="docs/icons/wrench.svg" width="32" height="32" alt="wrench"> | <img src="docs/icons/paint-roller.svg" width="32" height="32" alt="paint-roller"> | <img src="docs/icons/bolt.svg" width="32" height="32" alt="bolt"> | <img src="docs/icons/droplet.svg" width="32" height="32" alt="droplet"> |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `briefcase` | `building` | `wrench` | `paint-roller` | `bolt` | `droplet` |
| <img src="docs/icons/snowflake.svg" width="32" height="32" alt="snowflake"> | <img src="docs/icons/flame.svg" width="32" height="32" alt="flame"> | <img src="docs/icons/house.svg" width="32" height="32" alt="house"> | <img src="docs/icons/home.svg" width="32" height="32" alt="home"> | <img src="docs/icons/leaf.svg" width="32" height="32" alt="leaf"> | <img src="docs/icons/cross.svg" width="32" height="32" alt="cross"> |
| `snowflake` | `flame` | `house` | `home` | `leaf` | `cross` |
| <img src="docs/icons/scissors.svg" width="32" height="32" alt="scissors"> | <img src="docs/icons/coffee.svg" width="32" height="32" alt="coffee"> | | | | |
| `scissors` | `coffee` | | | | |

> Icons in this README are rendered with a neutral stroke (`#888`) so they're visible in both GitHub light and dark mode. At runtime inside `#cs-navigation`, `.cs-icon` uses `stroke: currentColor` so they inherit the surrounding text color instead.
