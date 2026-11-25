# FAIRFAX DXB — Concept Redesign

An unofficial concept redesign of [fairfaxdxb.com](https://fairfaxdxb.com), the Dubai sneaker, streetwear and collectibles store. **Not affiliated with Fairfax DXB. No orders are processed.**

A static site (HTML, CSS and vanilla JS, with no build step):

- **Heat**: 3D ring of 8 pairs that turns as you scroll; click a card to shop it
- **Story**: manifesto with words lighting up as you scroll
- **Streets**: full-screen photos that expand from a card
- **Legit check**: a scan beam sweeps the grail and lights up five authentication checks
- **Next drop**: flashlight reveal and a countdown to Friday 20:00 Dubai time
- **Shop the wall**: 15 products with category filters
- **Product view and bag**: real sizes, stock and AED prices, a bag drawer and a demo checkout (nothing is sent anywhere)

## Run locally

```bash
python -m http.server 5520
```

Then open http://localhost:5520.

## Credits

Product names, prices and photos come from fairfaxdxb.com and belong to Fairfax DXB. The layout and motion are inspired by the KERB demo by smartduke studio. The code was written from scratch.
