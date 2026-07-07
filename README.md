# Remarkable

A creative-agency site built with **Next.js 16** + **Sanity 6**, designed around
Sanity's **visual editing** (Presentation). Instead of rigid, pre-baked page
templates, you compose pages from a set of **core building blocks** and build
highly custom sections from scratch — all visually, with drag controls and
live click-to-edit overlays.

---

## Quick start

```bash
# 1. Install (already done if you're reading this)
npm install

# 2. Point the app at a Sanity project
#    Either run the guided init…
npx sanity@latest init --env
#    …or copy .env.example to .env.local and fill in the values by hand.
cp .env.example .env.local

# 3. (Optional) load the demo home page so there's something to see
npx sanity dataset import sanity/seed.ndjson production

# 4. Run it
npm run dev
```

- Site: <http://localhost:3000>
- Studio: <http://localhost:3000/studio>
- Visual editor: open the **Presentation** tab inside the Studio.

### Environment variables (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API date, e.g. `2024-10-01` |
| `SANITY_API_READ_TOKEN` | A **Viewer** token — required for draft mode / Presentation |

Until these are set, the homepage shows a friendly setup screen instead of
crashing.

---

## The building blocks

Every block can be dropped into a **Section** — and the container blocks
(**Grid**, **Slider**, **Card**, **Button Group**) can hold blocks too, so you
can nest and compose freely.

| Block | Key visual controls |
| --- | --- |
| **Eyebrow** | size, color, alignment |
| **Heading** | semantic level (h1–h6) *and* visual size, weight, color, alignment, **drag-to-set max width** |
| **Paragraph** | size, color, alignment, **drag-to-set max width** |
| **Button** | **style dropdown** (primary / secondary / outline / ghost / link), **size dropdown** (sm–xl), link, new-tab, full-width |
| **Button Group** | direction, alignment, wrap, gap slider |
| **Image** | aspect-ratio, fit, corner-radius slider, max-width slider, hotspot |
| **Looping Video** | file upload or URL, poster, aspect-ratio, fit, autoplay, radius + max-width sliders |
| **Card** | variant (surface / elevated / outline / ghost / brand), padding, gap, radius sliders, optional link |
| **Slider** | **slides-per-view per breakpoint** (three drag sliders), gap, loop, arrows, dots |
| **Grid** | **columns per breakpoint** (three drag sliders), column/row gap, vertical alignment |

### Sections & theming

A **Section** is the top-level composable container. It exposes:

- **Theme**: `light` · `dark` · `brand`. The theme sets CSS variables that
  **cascade to every child** — buttons, cards, and text automatically restyle to
  match. (A Card with the *brand* variant re-themes its own subtree too.)
- **Spacing**: drag sliders for **top padding**, **bottom padding**, and the gap
  between blocks.
- **Layout**: container max-width slider, horizontal alignment, full-viewport-
  height mode (great for heroes) with vertical alignment.
- **Background**: optional image with an overlay-opacity slider.

Because theming is driven by CSS custom properties (see
[`globals.css`](src/app/globals.css)), changing a section's theme is instant and
consistent across all nested blocks.

---

## How the visual editing works

- **Live content** — [`defineLive`](src/sanity/live.ts) + `<SanityLive />` stream
  updates to the page as you edit, in both preview and production.
- **Draft previews** — [`src/sanity/fetch.ts`](src/sanity/fetch.ts) wraps
  `sanityFetch` in `strict` mode: published requests can never leak drafts, and
  draft mode turns on stega encoding for overlays.
- **Click-to-edit** — every rendered block carries a `data-sanity` attribute
  built by [`dataAttr`](src/sanity/dataAttr.ts), so you can click any element in
  Presentation to jump straight to its field.
- **Drag controls** — custom Studio inputs power the sliders:
  [`RangeSliderInput`](src/sanity/components/RangeSliderInput.tsx) (single value)
  and [`ResponsiveNumberInput`](src/sanity/components/ResponsiveNumberInput.tsx)
  (one slider per breakpoint).

---

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx                     Root <html>/<body>
│  ├─ (frontend)/                    The public site (live + visual editing)
│  │  ├─ layout.tsx                  SanityLive + VisualEditing wiring
│  │  ├─ page.tsx                    Home (slug "home")
│  │  └─ [slug]/page.tsx             All other pages
│  ├─ studio/[[...tool]]/page.tsx    Embedded Sanity Studio at /studio
│  └─ api/draft-mode/{enable,disable}
├─ components/
│  ├─ PageBuilder.tsx                Renders a page's sections
│  ├─ Section.tsx                    Theme + spacing + layout
│  ├─ BlockRenderer.tsx              Recursive block switch
│  └─ blocks/*                       One component per building block
├─ sanity/
│  ├─ schemaTypes/                   Documents, section, and block schemas
│  ├─ components/                    Custom drag/responsive Studio inputs
│  ├─ client.ts · live.ts · fetch.ts · image.ts · dataAttr.ts
│  └─ structure.ts · presentation.ts
└─ lib/                              Shared types + style helpers
```

Add a new block by creating its schema in
[`src/sanity/schemaTypes/blocks`](src/sanity/schemaTypes/blocks), registering it
in [`blocks.ts`](src/sanity/schemaTypes/shared/blocks.ts) and
[`index.ts`](src/sanity/schemaTypes/index.ts), then adding a matching component
and a `case` in [`BlockRenderer.tsx`](src/components/BlockRenderer.tsx).

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run typegen` | Generate `sanity.types.ts` from your schema + queries |
| `node scripts/generate-seed.mjs` | Rebuild the demo `sanity/seed.ndjson` |
