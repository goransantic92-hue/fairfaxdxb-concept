# PRD — FAIRFAX DXB Concept

Status: **v2.0 live** (Next.js rebuild), https://fairfaxdxb-concept.vercel.app · Last updated: 2026-11-26
Engineering rules and gotchas: [AGENTS.md](../AGENTS.md)

## 1. Summary

A concept redesign of [fairfaxdxb.com](https://fairfaxdxb.com), a Dubai store for authentic sneakers, streetwear and collectibles. It shows what the store could feel like as an immersive, motion-led experience: a 3D ring of grails, scroll stories, a legit-check scan and a fast shop wall with a product view and bag.

The art direction comes from the KERB demo by smartduke studio (dark navy, condensed display type, mono labels, lime and orange accents). The real Fairfax catalogue, prices and photos are used.

## 2. Goals

- Present Fairfax as a premium, trustworthy "authentic only" store, with energy that fits Dubai street culture.
- Show the whole browse → product → bag → checkout journey, with realistic sizes, stock and AED pricing.
- Be a clean, modern codebase (Next.js, Tailwind, GSAP) that can grow into a real headless store.

## 3. Non-goals (current phase)

- No real orders, payments, accounts, emails or inventory sync. Checkout and newsletter forms are demos.
- No SEO. The site is `noindex` so it never competes with the real store.
- No CMS or admin. The catalogue is hard-coded in `lib/products.ts`.

## 4. Audience

- **Primary:** the Fairfax DXB owners, as a pitch for a redesign.
- **Secondary:** sneaker buyers in the UAE, who are mobile-first and know drops and resale pricing.

## 5. Experience, section by section

Each pinned section scrolls through a tall track while a sticky 100vh stage animates. Progress comes from GSAP ScrollTrigger.

| # | Section (id) | Track | Behaviour |
|---|---|---|---|
| — | Nav | fixed | Logo "FAIRFAX / DXB CONCEPT". Section links light up for the section at mid-screen (hidden at 860px and below). `[ BAG n ]` opens the drawer. |
| 01 | **Heat** (`#heat`) | 420vh | 8 cards on a 3D ring (`RING`) turn as you scroll. The background light takes each pair's colour. A huge "FAIRFAX" ghost word sits behind the ring. The name, count and price CTA sit under the cards, and the name is auto-sized so the CTA never touches the progress bar. Clicking a front card or the CTA opens that product. |
| 02 | **Story** (`#story`) | 260vh | A manifesto whose words light up one by one, with product "chips" popping in between. A progress rule runs along the bottom. |
| 03 | **Streets** (`#street`) | 620vh | A portrait card opens to full screen while "OUT / THERE" splits apart. 4 Fairfax photos then wipe up in turn, each with its own caption. |
| 04 | **Legit check** (`#legit`) | 380vh | The grail (Fragment × Travis Scott J1) enters, and a lime scan beam sweeps it. 5 authentication checks appear as callouts as the beam passes, then a "VERIFIED AUTHENTIC" badge and a "Shop the grail · AED 22,000" CTA. On phones, the callouts become a legend. |
| 05 | **Next drop** (`#next`) | auto | "DROP 09. CLASSIFIED." A dark silhouette shows the shoe under a flashlight that follows the pointer and drifts by itself when idle. A countdown runs to Friday 20:00 Dubai time, with a "Notify me" form (demo). |
| 06 | **Shop the wall** (`#shop`) | auto | 15 products on lit shelves. Filters: All, Sneakers, Streetwear, Collectibles, Accessories; footer links also set a filter. Cards show price "from", size count or "LAST SIZE", and lift with a glint on hover. |
| — | Footer | — | A marquee, a "First on the wall" sign-up (demo), link columns (WhatsApp, Instagram, TikTok), 4 floating products, a giant FAIRFAX word that rises into view, and the unofficial-concept disclaimer. |

### Commerce flow
- **Product view** (full-screen overlay):
  - The brand ghost word in the background, a floating cutout, and a second view (a back photo when there is one, otherwise a 3/4 tilt).
  - The name, the full name, the Arabic name and the price (a range until a size is picked).
  - The size grid, with sold-out sizes struck through. A single in-stock option is pre-selected.
  - The add button shakes until a size is picked.
  - "Authentic · free delivery over AED 1,000" notes, and prev/next buttons. Arrow keys flip products, and Esc closes.
- **Bag drawer:**
  - A free-delivery meter and the items, each with an "✓ AUTHENTICATED" tag and a remove link; clicking an item's thumbnail reopens its product.
  - Subtotal, delivery and total. An empty state links to the wall.
  - The bag persists in `localStorage`.
- **Checkout (demo):**
  - Email, mobile (+971), first and last name, address and emirate (all 7).
  - Standard (1–3 days, AED 25, free from AED 1,000) or same-day (Dubai, AED 50).
  - Fields are validated inline. A fake order number and summary end the flow, and the bag is cleared. "Concept store — no payment is taken."
- **Rules:** one pair per size (resale stock), so there is no quantity control, and a duplicate add shows a toast.

## 6. Data model (`lib/products.ts`)

`Product { id, name, short, brand, cat, color, accent?, ar, img2?, label, grail?, v: [size, priceAED, inStock][] }`

Derived fields: `from` (lowest in-stock price), `inStock` count and `lastOne`.

Images live at `/img/<id>.webp`, and the second view at `/img/<img2>.webp`.

The 15 wall products:
- **Sneakers:** phantom, mocha, redcement, guava, habibi, beluga, satin, oxidized, panda, azure
- **Streetwear:** fogtee, drewls
- **Collectibles:** kaws, bearbrick
- **Accessories:** supreme

Plus the grail `fragment`. The data was taken from the Shopify JSON on fairfaxdxb.com (`/products/<handle>.js`) and is a snapshot, not live.

## 7. Design system

- **Colours:**
  - Backgrounds: navy `#070b1f`, with deeper `#04060f` and `#050816`.
  - Ink: `#f4f1ea`.
  - Accents: lime `#39ff6a` (success, verified), orange `#ff5a12` (CTA, urgency) and periwinkle `#7d8cff`.
  - Each product brings its own `color` and `accent`.
- **Type:**
  - Archivo 900 at 62–78% width for display.
  - Geist Mono, uppercase with .08em tracking, for labels.
  - Noto Kufi Arabic for Arabic names.
- **Motion:**
  - Easing `cubic-bezier(.22,1,.36,1)`.
  - Lenis smooth scroll (lerp .09).
  - Staggered character rises, clip-path wipes and a film-grain overlay.
  - `prefers-reduced-motion` disables Lenis and shortens animations.
- **Layout:** gutter `clamp(16px, 3.2vw, 44px)`. Breakpoints are 1100, 860, 700 and 600px; at 860px and below the layout becomes single column, nav links are hidden, and the product view stacks vertically.

## 8. Quality bar

- Pixel parity with the reference build (commit `554c8a3`) at 1440×860 and 390×844.
- No horizontal scroll on phones.
- The hero CTA stays at least 24px above the progress bar from 1024×640 up to 1920×1080.
- Keyboard: cards, the CTA, shop cards (Enter and Space), Esc and arrows all work.
- `npm run build` stays clean, and the page is prerendered statically.

## 9. Constraints

- Unofficial: keep the footer disclaimer and `noindex`. Photos and names belong to Fairfax DXB. Showing it publicly long-term needs their permission.
- Don't publish `assets/` (raw and backup images), and never handle real personal or payment data.

## 10. Status

**Done:**
- [x] v1: a static HTML/CSS/JS build, live since 2026-11-25.
- [x] v2: rebuilt in Next.js 16, Tailwind 4, GSAP ScrollTrigger and Lenis, with pixel parity checked and live since 2026-11-26.

**Known gaps:**
- [ ] The product view and drawer don't trap focus, and don't set `inert` on the page behind.
- [ ] Footer links "UAE DELIVERY" and "RETURNS" point to `#`.
- [ ] Email forms only change their label; nothing is stored.
- [ ] Images use plain `<img>`. `next/image` could add AVIF and responsive sizes, but needs a parity re-check.
- [ ] There is no ESLint and there are no automated tests.

## 11. Roadmap (proposed, not started)

1. **Quality:**
   - Focus traps and `inert`.
   - ESLint.
   - Playwright smoke tests covering the flow in AGENTS.md "Verifying a change".
   - A Lighthouse pass.
2. **Real catalogue:** read products from the Shopify Storefront API (fairfaxdxb.com runs on Shopify) instead of `lib/products.ts`, revalidated on a schedule.
3. **Real commerce (needs Fairfax's approval and a Storefront token):** a Shopify cart, then redirect to Shopify Checkout. Never build a custom payment form.
4. **Content pages:** delivery, returns and authenticity.
5. **Optional:** Arabic RTL version, real drop sign-ups (email or WhatsApp), 3D models for the product view.

## 12. Related

The root of `C:\Users\Goranche\Desktop\Tike website` also holds the **KERB clone**, the original style study, with a Salomon "Taken apart" section. It is a separate static site that is neither deployed nor in this repo.
