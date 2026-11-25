# FAIRFAX DXB — Concept Redesign

An unofficial concept redesign of [fairfaxdxb.com](https://fairfaxdxb.com), the Dubai sneaker, streetwear and collectibles store. **Not affiliated with Fairfax DXB. No orders are processed.**

## Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**. The page is prerendered as static HTML at build time.
- **Tailwind CSS 4** for the UI pieces: nav, shop wall, bag drawer, checkout and footer.
- **Plain CSS** in `styles/` for the cinematic parts where utilities would get in the way: the 3D ring, clip-path photo reveals, masks and the legit-check scan.
- **GSAP ScrollTrigger** drives every scroll animation.
- **Lenis** handles smooth scrolling on the GSAP ticker, so both run on one clock.
- **next/font** self-hosts Archivo (variable width), Geist Mono and Noto Kufi Arabic.

## Sections

- **Heat**: a 3D ring of 8 pairs that turns as you scroll. Click a card to shop it.
- **Story**: a manifesto whose words light up as you scroll.
- **Streets**: full-screen photos that open out of a card.
- **Legit check**: a scan beam sweeps the grail and lights up five authentication checks.
- **Next drop**: a flashlight reveal, with a countdown to Friday 20:00 Dubai time.
- **Shop the wall**: 15 products with category filters.
- **Product view and bag**: real sizes, stock and AED prices, a bag drawer and a demo checkout. Nothing is sent anywhere; the bag lives in `localStorage`.

## Project layout

```
app/          layout (fonts, metadata), page, globals.css (Tailwind + tokens)
components/   SmoothScroll (Lenis), ShopProvider (bag / product view state), Nav, ProductView, BagDrawer, Footer
components/sections/   Heat, Story, Street, Legit, NextDrop, Shop
lib/          products.ts (catalogue), motion.ts (GSAP setup + helpers), countdown.ts
styles/       base.css (tokens, shared) and one file per cinematic section
public/img/   product cutouts and street photos
```

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Run `npm run build` for a production build.

## Credits

Product names, prices and photos come from fairfaxdxb.com and belong to Fairfax DXB. The layout and motion are inspired by the KERB demo by smartduke studio. The code was written from scratch.
