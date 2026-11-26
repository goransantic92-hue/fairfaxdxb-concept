# AGENTS.md — FAIRFAX DXB Concept

Read this before changing anything. Product scope and status are in [docs/PRD.md](docs/PRD.md).

## What this is

An unofficial, scroll-driven concept redesign of the Dubai sneaker store fairfaxdxb.com. It is a single page with a 3D hero ring, scroll stories, a shop wall, a product view, a bag drawer and a demo checkout. **No real orders, payments or emails are processed.** The page is public, but on purpose it is not indexed by search engines.

- Live: https://fairfaxdxb-concept.vercel.app
- Repo: https://github.com/goransantic92-hue/fairfaxdxb-concept (branch `main`)
- Vercel project: `fairfaxdxb-concept` in scope `gorans-projects-7bb38d55`, connected to the repo

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build; must pass before any push
npm run typecheck    # tsc --noEmit
```

Node >= 20.9. No linter and no test suite are set up yet.

## Stack

- Next.js 16 (App Router, Turbopack), React 19 and TypeScript 5.9 (strict). `app/page.tsx` is prerendered as static HTML.
- Tailwind CSS 4 through `@tailwindcss/postcss`, **without Preflight** (see below).
- GSAP 3 with ScrollTrigger and `@gsap/react` (`useGSAP`).
- Lenis 1.3, driven by the GSAP ticker.
- `next/font/google` self-hosts Archivo (variable `wdth` 62–125, used through `font-stretch`), Geist Mono and Noto Kufi Arabic.

## Layout

```
app/layout.tsx         fonts, metadata (robots noindex), providers
app/page.tsx           page composition (server component)
app/globals.css        Tailwind imports, @theme tokens, imports styles/*.css
components/SmoothScroll.tsx   Lenis + scrollTo() + setLocked() context
components/ShopProvider.tsx   bag, product-view, drawer, filter, toast state
components/ui.tsx      ScrollLink, BagCount, MailForm
components/Nav.tsx, Toast.tsx, ProductView.tsx, BagDrawer.tsx, Footer.tsx
components/sections/   Heat (3D ring), Story, Street, Legit, NextDrop, Shop
lib/products.ts        catalogue + money/size/shipping helpers (single source of truth)
lib/motion.ts          GSAP registration, clamp/lerp/ease, replayClass()
lib/countdown.ts       next Friday 20:00 Asia/Dubai
styles/base.css        :root tokens, base layer, shared pieces, all keyframes
styles/{heat,story,street,legit,next,pdp}.css   bespoke section CSS
public/img/            product cutouts (.webp) and street photos (.jpg)
assets/                LOCAL ONLY, gitignored: raw downloads and backups, never publish
```

## Rules and gotchas

### CSS and Tailwind
1. **No Preflight.** `globals.css` imports only `tailwindcss/theme.css` and `tailwindcss/utilities.css`. The site's own resets live in `@layer base` in `styles/base.css`.
   - Keep resets in that layer. If they are unlayered, they beat Tailwind utilities: this already happened once with `button { font: inherit; background: none }`, which wiped out `bg-*` and `text-[13px]` on every button.
2. **Section CSS (`styles/*.css`) is unlayered on purpose**, so it beats utilities. Don't put a custom class and a utility that set the same property on one element.
3. **Don't name custom classes after Tailwind utilities.** Tailwind scans `.tsx` files and generates any utility it finds, so a custom `.ring` would get a box-shadow ring and `.outline` would get a 1px outline. The ring is therefore `.carousel` and stroked text is `.txt-outline`. Avoid `hidden`, `block`, `grid`, `container`, `shadow` and the like as custom class names.
4. **Tokens live once, in `:root` in `styles/base.css`** (`--bg`, `--ink`, `--lime`, `--orange`, `--ease`, `--gutter`, …).
   - `@theme inline` in `globals.css` maps them to utilities: `text-ink`, `bg-night`, `bg-abyss`, `text-dim`, `bg-lime`, `bg-orange`, `font-mono`, `font-display`.
   - The colour is named `night`, not `bg`, so `ring-bg` can't become a utility.
5. Breakpoints copy the original CSS. In CSS, use `max-width: 860px`, `600px`, `700px` and `1100px`, or `min-width: 861px`. In Tailwind, use `max-[860.98px]:` and so on, because Tailwind's `max-*` is `width < X`.
6. Use `font-stretch` (62–125%) for the condensed display type, not a different font. Tailwind has no stretch utility here, so write `[font-stretch:78%]`.

### Animation and React
7. **Scroll animation = ScrollTrigger callback + direct DOM writes through refs.**
   - Each section creates `ScrollTrigger.create({ trigger, start, end, onUpdate, onRefresh })` inside `useGSAP`, which cleans up automatically.
   - Per-frame values (transforms, CSS variables, `classList` toggles) go straight onto DOM nodes. Never put them in React state.
   - React state is only for discrete changes: the active ring index and the street caption index.
8. **Don't give a changing `className` prop to an element whose classes are toggled imperatively.** Examples: `.card` (`is-back`), `.ring-sticky` (`is-turning`), shop `article` (`hide`/`gone`) and the scan marks (`on`). React would overwrite the toggled classes.
9. Lenis and ScrollTrigger share the GSAP ticker (`SmoothScroll.tsx`). Overlays freeze the page with `setLocked()`, which stops Lenis and adds `html.is-locked`; `ShopProvider` handles that.
10. Server and client render must match.
    - The hero specks use a seeded PRNG.
    - The countdown renders `00` on the server and starts ticking only on the client.
    - The bag loads from `localStorage` (`ffx-bag`) after mount.
11. **Heat title sizing (`fit()` in `Heat.tsx`).** The shoe name gets one font size per window size: the largest size at which the longest name fits the width *and* the "Shop this pair" button stays at least 24px above the progress bar.
    - It measures with `offsetTop`, not `getBoundingClientRect`, because the button enters with a transform.
    - Don't remove `white-space: nowrap` on `.ring-title`.
12. **ProductView timing is deliberate.**
    - Open: the curtain wipes in, then `is-shown` follows after 380 ms.
    - Swap: the content fades out, is refilled at 280 ms and reappears at 320 ms.
    - Close: 200 ms.
    - Use `setTimeout` here, not double `requestAnimationFrame`. rAF can stall in background or hidden tabs, which left the panel stuck invisible.
13. `.rv` reveal delays in the product view depend on the order of children in `.pdp-info`. Keep the order when adding elements.
14. Plain `<img>` is used instead of `next/image` on purpose, because exact sizing and `object-fit` had to match the original pixel for pixel. If you switch, re-check geometry.

### Data
15. `lib/products.ts` is the only catalogue.
    - A variant is `[size, AED price, inStock 1|0]`.
    - Resale stock is **one pair per size**, so the bag has no quantity stepper and adding a duplicate shows a toast.
    - `FRAGMENT` (the grail, AED 22,000) is sold only from the Legit section and is not on the wall.
    - `RING` lists the 8 hero pairs.
16. Shipping: free from AED 1,000, standard AED 25, same-day AED 50.

### Content and legal (do not remove)
17. Keep `robots: { index: false, follow: false }` in `app/layout.tsx`.
18. Keep the footer line "UNOFFICIAL CONCEPT REDESIGN · NOT AFFILIATED WITH FAIRFAX DXB · NO ORDERS ARE PROCESSED".
19. Product names, prices and photos belong to Fairfax DXB. Never publish `assets/` (raw downloads), and never collect or send real personal or payment data: checkout and email forms are demos.

## Verifying a change

- `npm run build` must pass.
- **Visual parity:** the reference is commit `554c8a3`, the original static site. Serve it next to the dev server:

  ```bash
  git archive 554c8a3 | tar -x -C <tmpdir>
  python -m http.server 5530 --directory <tmpdir>
  ```

  Then compare element rectangles at **1440×860** and **390×844** (hero title, CTA, cards, manifesto, street caption, scan, countdown, shop cards, footer word). After the migration they matched to the pixel.
- **Hero check:** at 1920×1080, 1440×860, 1280×720 and 1024×640, the gap between the CTA and the progress bar must be at least 24px for all 8 shoes.
- **Commerce smoke test:**
  1. Open a card and try to add without a size: the button shakes.
  2. Pick a size and add it: a toast appears and the count goes up.
  3. Add the same size again: a duplicate toast appears.
  4. Arrow keys flip products, and Esc closes the drawer first, then the product view.
  5. Submit the checkout empty: 6 invalid fields. Then fill it in and finish on the done pane, with the bag cleared.

## Deploy

- A push to `main` deploys to production. Any other branch gets a preview at `fairfaxdxb-concept-git-<branch>-gorans-projects-7bb38d55.vercel.app`, behind Vercel login.
- `vercel.json` sets `"framework": "nextjs"`, because the project was first created as a static site. Don't remove it.
- Work on a branch, check the preview, then merge to `main`. Only commit or push when the owner asks.
