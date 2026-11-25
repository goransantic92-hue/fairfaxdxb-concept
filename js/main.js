/* =========================================================
   FAIRFAX DXB CONCEPT — interactions
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- data ---------------- */
  // Catalogue taken from fairfaxdxb.com (names, AED prices per size, sizes in stock).
  // v: [size, price AED, in stock 1/0]
  const PRODUCTS = [
    { id: "phantom", name: "Jordan 1 Retro Low OG SP Travis Scott Black Phantom", short: "Black Phantom", brand: "JORDAN", cat: "SNEAKERS", color: "#7d84a8", accent: "#c9c3b6", ar: "جوردان 1 ريترو لو أو جي إس بي ترافيس سكوت بلاك فانتوم",
      v: [["7", 6500, 0], ["8", 6000, 0], ["8.5", 5500, 0], ["9", 5500, 1], ["9.5", 6500, 0], ["10.5", 4000, 0], ["11", 6500, 0], ["11.5", 6000, 0]] },
    { id: "mocha", name: "Jordan 1 Retro Low OG Mocha", short: "Mocha Low", brand: "JORDAN", cat: "SNEAKERS", color: "#a8693f", ar: "جوردان 1 ريترو لو أو جي موكا",
      v: [["7.5", 1200, 0], ["10", 1200, 1], ["10.5", 1900, 0], ["11", 1900, 1]] },
    { id: "redcement", name: "Jordan 4 Retro Red Cement", short: "Red Cement", brand: "JORDAN", cat: "SNEAKERS", color: "#e63323", ar: "جوردان 4 ريترو ريد أسمنت", img2: "redcement2",
      v: [["9", 2500, 0], ["11", 2900, 1]] },
    { id: "guava", name: "Air Jordan 4 Retro SP Union Guava Ice", short: "Guava Ice", brand: "JORDAN × UNION", cat: "SNEAKERS", color: "#ff8fb1", accent: "#ffe27a", ar: "اير جوردان 4 ريترو اس بي يونيون جوافة ايس",
      v: [["9.5", 5800, 1], ["10", 4725, 0]] },
    { id: "habibi", name: "Nike SB Dunk Low Frame Skate Habibi", short: "Habibi", brand: "NIKE SB", cat: "SNEAKERS", color: "#1f9e5a", accent: "#ff4a3d", ar: "نايك اس بي دانك لو فريم سكيت حبيبي",
      v: [["10", 4725, 0], ["11", 5500, 1]] },
    { id: "beluga", name: "Yeezy Boost 350 V2 Carbon Beluga", short: "Carbon Beluga", brand: "YEEZY", cat: "SNEAKERS", color: "#ff5a12", ar: "ييزي بوست 350 في 2 كربون بيلوجا",
      v: [["5", 1600, 1], ["7", 2500, 0], ["7.5", 1500, 1], ["8", 1500, 1], ["8.5", 1500, 1], ["9", 1500, 1], ["10", 2500, 0], ["11", 2500, 0], ["11.5", 1500, 1], ["12", 1600, 1], ["12.5", 2500, 0]] },
    { id: "satin", name: "Jordan 1 Retro High Satin Snake Chicago (W)", short: "Satin Snake", brand: "JORDAN", cat: "SNEAKERS", color: "#b0123a", ar: "جوردان 1 ريترو هاي ساتان سنيك شيكاغو",
      v: [["7", 1890, 0], ["10.5W", 1800, 0], ["11W", 1800, 1], ["12W", 1800, 1]] },
    { id: "oxidized", name: "Jordan 4 Retro Oxidized Green", short: "Oxidized Green", brand: "JORDAN", cat: "SNEAKERS", color: "#1f6f5c", accent: "#39ff6a", ar: "جوردان 4 ريترو أخضر مؤكسد",
      v: [["10", 1800, 1]] },
    { id: "panda", name: "Nike Dunk Low Retro White Black Panda (W)", short: "Panda", brand: "NIKE", cat: "SNEAKERS", color: "#9aa0a6", ar: "نايك دانك لو ريترو أبيض أسود باندا",
      v: [["6W", 1800, 1]] },
    { id: "azure", name: "Yeezy Slide Azure", short: "Slide Azure", brand: "YEEZY", cat: "SNEAKERS", color: "#2340d8", accent: "#7d8cff", ar: "ييزي سلايد آزور",
      v: [["4", 1300, 0], ["5", 1300, 0], ["6", 650, 1], ["7", 650, 1], ["8", 650, 1]] },
    { id: "fogtee", name: "Fear of God Essentials Tee Dusty Beige", short: "Essentials Tee", brand: "ESSENTIALS", cat: "STREETWEAR", color: "#c9b79a", ar: "فير أوف جود إسنشلز تي شيرت بيج", label: "SIZE",
      v: [["XS", 700, 0], ["S", 700, 1], ["M", 700, 1], ["L", 700, 1]] },
    { id: "drewls", name: "Drew House Mascot LS Black", short: "Mascot LS", brand: "DREW HOUSE", cat: "STREETWEAR", color: "#ffd400", ar: "درو هاوس ماسكوت بأكمام طويلة أسود", label: "SIZE",
      v: [["XXS", 450, 1], ["S", 500, 1]] },
    { id: "kaws", name: "KAWS Companion Open Edition Vinyl Figure Black", short: "Companion", brand: "KAWS", cat: "COLLECTIBLES", color: "#5a5f74", accent: "#ffd400", ar: "كاوس كومبانيون فينيل أسود", label: "EDITION",
      v: [["OPEN EDITION", 3500, 1]] },
    { id: "bearbrick", name: "Bearbrick Pink Panther 1000%", short: "Pink Panther", brand: "BEARBRICK", cat: "COLLECTIBLES", color: "#ff6ec7", ar: "بيربريك بينك بانثر 1000٪", label: "SCALE",
      v: [["1000%", 4500, 1]] },
    { id: "supreme", name: "Supreme Enamel Logo 6-Panel Red", short: "6-Panel Red", brand: "SUPREME", cat: "ACCESSORIES", color: "#e3201b", ar: "سوبريم قبعة شعار مينا أحمر", label: "SIZE",
      v: [["ONE SIZE", 550, 1]] },
  ];
  // the legit-check grail: sold, but not on the wall
  const FRAGMENT = { id: "fragment", name: "Jordan 1 High OG SP Fragment x Travis Scott", short: "Fragment × Travis", brand: "JORDAN × FRAGMENT", cat: "SNEAKERS", color: "#2a4fb8", accent: "#f4f1ea", ar: "جوردان 1 هاي أو جي إس بي فراجمنت × ترافيس سكوت", img2: "fragment2", grail: true,
    v: [["10", 22000, 1]] };
  PRODUCTS.concat(FRAGMENT).forEach((p) => {
    const inStock = p.v.filter((x) => x[2]);
    p.from = Math.min(...(inStock.length ? inStock : p.v).map((x) => x[1]));
    p.inStock = inStock.length;
    p.lastOne = p.v.length >= 4 && inStock.length === 1;
    p.label = p.label || "SIZE · US";
  });
  const byId = Object.fromEntries([...PRODUCTS, FRAGMENT].map((p) => [p.id, p]));
  const imgOf = (p) => `assets/img/${p.id}.webp`;
  const priceOf = (id, size) => (byId[id].v.find((x) => x[0] === size) || [0, byId[id].from])[1];
  const RING = ["phantom", "guava", "redcement", "habibi", "mocha", "beluga", "satin", "oxidized"].map((id) => byId[id]);

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    document.documentElement.classList.add("lenis");
  }
  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else (typeof target === "number" ? window.scrollTo({ top: target, behavior: "smooth" }) : target.scrollIntoView({ behavior: "smooth" }));
  };
  $$("[data-scroll]").forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || !id.startsWith("#")) return;
      e.preventDefault();
      if (a.dataset.filter) setFilter(a.dataset.filter);
      const el = $(id);
      if (!el) return;
      scrollToTarget(id === "#heat" ? 0 : el);
      history.replaceState(null, "", id);
    })
  );

  /* =========================================================
     BAG STATE (persists in this browser)
     ========================================================= */
  const bagCount = $("#bagCount");
  const toast = $("#toast");
  const money = (n) => "AED " + n.toLocaleString("en-US");
  const FREE_SHIP = 1000, STD_SHIP = 25, EXP_SHIP = 50;
  let bag = [];
  try { bag = JSON.parse(localStorage.getItem("ffx-bag") || "[]").filter((l) => byId[l.id]); } catch (_) { bag = []; }
  const saveBag = () => { try { localStorage.setItem("ffx-bag", JSON.stringify(bag)); } catch (_) {} };
  const bagQty = () => bag.reduce((s, l) => s + l.qty, 0);
  const bagSub = () => bag.reduce((s, l) => s + priceOf(l.id, l.size) * l.qty, 0);
  const sizeText = (p, s) => (p.label === "SIZE · US" ? `US ${s}` : s);

  let toastT;
  function showToast(html) {
    toast.innerHTML = html;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  const counts = [bagCount, $("#pdpBagCount")];
  function bumpCount() {
    counts.forEach((c) => {
      c.textContent = bagQty();
      c.classList.remove("pop");
      void c.offsetWidth;
      c.classList.add("pop");
    });
  }
  function addToBag(id, size) {
    const line = bag.find((l) => l.id === id && l.size === size);
    // resale stock is one pair per size
    if (line) { showToast(`<b>${byId[id].short}</b> · ${sizeText(byId[id], size)} is already in your bag`); return false; }
    bag.push({ id, size, qty: 1 });
    saveBag();
    bumpCount();
    renderBag();
    showToast(`Added <b>${byId[id].short}</b> · ${sizeText(byId[id], size)}`);
    return true;
  }
  counts.forEach((c) => (c.textContent = bagQty()));

  /* ---------------- scroll lock shared by overlays ---------------- */
  let locks = 0;
  function lock(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    document.documentElement.classList.toggle("is-locked", locks > 0);
    if (lenis) locks > 0 ? lenis.stop() : lenis.start();
  }

  /* =========================================================
     PRODUCT VIEW
     ========================================================= */
  const pdp = $("#pdp");
  const pdpImg = $("#pdpImg"), pdpShot = $("#pdpShot"), pdpGhost = $("#pdpGhost");
  const pdpSizes = $("#pdpSizes"), pdpAdd = $("#pdpAdd"), pdpAddLabel = $("#pdpAddLabel");
  const pdpPrev = $("#pdpPrev"), pdpNext = $("#pdpNext");
  let cur = null, picked = null, pdpOpen = false, addedT, lastFocus = null;

  function fillProduct(p) {
    cur = p;
    picked = null;
    pdp.style.setProperty("--pc", p.color);
    pdp.style.setProperty("--pa", p.accent || p.color);
    const wallIdx = PRODUCTS.indexOf(p);
    $("#pdpCount").textContent = p.grail ? `04 · THE GRAIL · ${p.brand}` : `${String(wallIdx + 1).padStart(2, "0")} / ${PRODUCTS.length} · ${p.brand}`;
    $("#pdpName").textContent = p.short.toUpperCase();
    $("#pdpFull").textContent = p.name;
    $("#pdpAr").textContent = p.ar || "";
    const sold = p.v.filter((x) => !x[2]).length;
    $("#pdpSold").textContent = sold ? `${sold} SOLD OUT` : "IN STOCK";
    $("#pdpSizeLabel").textContent = p.label;
    pdpGhost.textContent = p.brand.split(/[ ×]/)[0];
    pdpImg.src = imgOf(p);
    pdpImg.alt = `${p.name}, side view`;
    $("#pdpView2").textContent = p.img2 ? "BACK" : "3/4";
    pdp.dataset.view = "side";
    $$(".pdp-views button").forEach((b) => b.classList.toggle("is-active", b.dataset.view === "side"));

    pdpSizes.classList.toggle("is-wide", p.label !== "SIZE · US");
    pdpSizes.innerHTML = p.v.map(([s, , ok]) =>
      `<button type="button" class="size" role="radio" aria-checked="false" data-size="${s}" ${ok ? `aria-label="${sizeText(p, s)}"` : `disabled aria-label="${sizeText(p, s)}, sold out"`}>${s}</button>`
    ).join("");
    // a single in-stock option is picked for you
    const inStock = p.v.filter((x) => x[2]);
    if (p.v.length === 1 && inStock.length) {
      picked = inStock[0][0];
      pdpSizes.firstElementChild.classList.add("is-picked");
      pdpSizes.firstElementChild.setAttribute("aria-checked", "true");
    }
    setPrice();
    setAddState();

    const base = p.grail ? PRODUCTS.length - 1 : wallIdx; // the grail sits between the last pair and the first
    const prev = PRODUCTS[(base - (p.grail ? 0 : 1) + PRODUCTS.length) % PRODUCTS.length];
    const next = PRODUCTS[(base + 1) % PRODUCTS.length];
    pdpPrev.dataset.id = prev.id; pdpPrev.querySelector("span").textContent = prev.short.toUpperCase();
    pdpNext.dataset.id = next.id; pdpNext.querySelector("span").textContent = next.short.toUpperCase();
  }
  function setPrice() {
    const prices = cur.v.filter((x) => x[2]).map((x) => x[1]);
    const lo = Math.min(...prices), hi = Math.max(...prices);
    $("#pdpPrice").textContent = picked ? money(priceOf(cur.id, picked)) : lo === hi ? money(lo) : `${money(lo)} – ${hi.toLocaleString("en-US")}`;
  }

  function setAddState(state) {
    clearTimeout(addedT);
    pdpAdd.classList.remove("is-added");
    if (state === "added") {
      pdpAdd.classList.add("is-added");
      pdpAddLabel.textContent = "Added to bag ✓";
      addedT = setTimeout(() => setAddState(), 1800);
      return;
    }
    pdpAdd.classList.toggle("is-off", !picked);
    pdpAdd.setAttribute("aria-disabled", String(!picked));
    pdpAddLabel.textContent = picked ? `Add ${sizeText(cur, picked)} · ${money(priceOf(cur.id, picked))}` : "Pick a size";
  }

  pdpSizes.addEventListener("click", (e) => {
    const b = e.target.closest(".size");
    if (!b || b.disabled) return;
    $$(".size", pdpSizes).forEach((x) => { x.classList.toggle("is-picked", x === b); x.setAttribute("aria-checked", x === b); });
    picked = b.dataset.size;
    setPrice();
    setAddState();
  });
  pdpAdd.addEventListener("click", () => {
    if (!picked) {
      // no size yet: nudge
      pdpAdd.classList.remove("shake"); void pdpAdd.offsetWidth; pdpAdd.classList.add("shake");
      return;
    }
    if (addToBag(cur.id, picked)) setAddState("added");
  });

  function swapProduct(p) {
    pdp.classList.remove("is-shown");
    setTimeout(() => {
      fillProduct(p);
      requestAnimationFrame(() => requestAnimationFrame(() => pdp.classList.add("is-shown")));
    }, 280);
  }
  function openProduct(id) {
    const p = byId[id];
    if (!p) return;
    if (pdpOpen) return swapProduct(p);
    lastFocus = document.activeElement;
    fillProduct(p);
    pdpOpen = true;
    pdp.setAttribute("aria-hidden", "false");
    pdp.classList.add("is-open");
    lock(true);
    setTimeout(() => { pdp.classList.add("is-shown"); $("#pdpClose").focus({ preventScroll: true }); }, 380);
  }
  function closeProduct() {
    if (!pdpOpen) return;
    pdpOpen = false;
    pdp.classList.remove("is-shown");
    setTimeout(() => {
      pdp.classList.remove("is-open");
      pdp.setAttribute("aria-hidden", "true");
      lock(false);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }, 200);
  }
  $("#pdpClose").addEventListener("click", closeProduct);
  pdpPrev.addEventListener("click", () => openProduct(pdpPrev.dataset.id));
  pdpNext.addEventListener("click", () => openProduct(pdpNext.dataset.id));
  $$(".pdp-views button").forEach((b) =>
    b.addEventListener("click", () => {
      pdp.dataset.view = b.dataset.view;
      $$(".pdp-views button").forEach((x) => x.classList.toggle("is-active", x === b));
      // products with a second photo show it; the rest tilt into a 3/4 view
      pdp.classList.toggle("has-back", !!cur.img2);
      if (cur.img2) {
        pdpShot.classList.remove("flip"); void pdpShot.offsetWidth; pdpShot.classList.add("flip");
        pdpImg.src = b.dataset.view === "three" ? `assets/img/${cur.img2}.webp` : imgOf(cur);
      }
    })
  );
  $$("[data-product]").forEach((b) => b.addEventListener("click", () => openProduct(b.dataset.product)));

  /* =========================================================
     BAG DRAWER + CHECKOUT
     ========================================================= */
  const drawer = $("#drawer"), scrim = $("#bagScrim"), bagList = $("#bagList");
  let drawerOpen = false;

  function setPane(name) {
    $$(".drawer-pane", drawer).forEach((p) => p.classList.toggle("is-on", p.dataset.pane === name));
    $("#drawerStep").textContent = { bag: "YOUR BAG", checkout: "CHECKOUT", done: "CONFIRMED" }[name];
  }
  function shipCost(sub, method) {
    if (method === "express") return EXP_SHIP;
    return sub >= FREE_SHIP ? 0 : STD_SHIP;
  }
  function renderBag() {
    const sub = bagSub(), qty = bagQty();
    $("#drawerQty").textContent = qty;
    drawer.classList.toggle("is-empty", qty === 0);
    const left = Math.max(0, FREE_SHIP - sub);
    $("#shipText").innerHTML = left > 0 ? `Add <b>${money(left)}</b> for free delivery` : `<b>Free delivery</b> unlocked`;
    $("#shipBar").style.width = Math.min(100, (sub / FREE_SHIP) * 100) + "%";
    const ship = shipCost(sub, "standard");
    $("#sumSub").textContent = money(sub);
    $("#sumShip").textContent = qty ? (ship ? money(ship) : "FREE") : "—";
    $("#sumTotal").textContent = money(sub + (qty ? ship : 0));
    $("#optStd").textContent = sub >= FREE_SHIP ? "FREE" : money(STD_SHIP);
    updateCheckoutSum();

    const existing = new Map($$(".bag-item", bagList).map((li) => [li.dataset.key, li]));
    bag.forEach((l) => {
      const key = l.id + "|" + l.size;
      const p = byId[l.id];
      let li = existing.get(key);
      if (!li) {
        li = document.createElement("li");
        li.className = "bag-item";
        li.dataset.key = key;
        li.innerHTML = `
          <div class="bag-thumb is-svg" style="--c:${p.color}" data-open="${p.id}"><img src="${imgOf(p)}" alt="" /></div>
          <div class="bag-meta"><strong>${p.short}</strong><small>${p.brand} · ${sizeText(p, l.size)}</small><small class="bag-auth">✓ AUTHENTICATED</small></div>
          <div class="bag-right"><span class="line-price"></span><button type="button" class="bag-remove">REMOVE</button></div>`;
        bagList.appendChild(li);
      }
      existing.delete(key);
      li.querySelector(".line-price").textContent = money(priceOf(p.id, l.size) * l.qty);
    });
    existing.forEach((li) => li.remove());
  }

  bagList.addEventListener("click", (e) => {
    const li = e.target.closest(".bag-item");
    if (!li) return;
    const [id, size] = li.dataset.key.split("|");
    const line = bag.find((l) => l.id === id && l.size === size);
    if (e.target.closest("[data-open]")) { closeBag(); setTimeout(() => openProduct(id), 350); return; }
    if (e.target.closest(".bag-remove")) removeLine(li, line);
  });
  function removeLine(li, line) {
    li.classList.add("out");
    setTimeout(() => {
      bag = bag.filter((l) => l !== line);
      saveBag(); bumpCount(); renderBag();
    }, 380);
  }

  function openBag() {
    if (drawerOpen) return;
    drawerOpen = true;
    setPane("bag");
    renderBag();
    drawer.classList.add("is-open");
    scrim.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    lock(true);
    setTimeout(() => $("#drawerClose").focus({ preventScroll: true }), 300);
  }
  function closeBag() {
    if (!drawerOpen) return;
    drawerOpen = false;
    drawer.classList.remove("is-open");
    scrim.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    lock(false);
  }
  $(".bag").addEventListener("click", openBag);
  $("#pdpBag").addEventListener("click", openBag);
  $("#drawerClose").addEventListener("click", closeBag);
  scrim.addEventListener("click", closeBag);
  $("#toWall").addEventListener("click", (e) => {
    e.preventDefault();
    closeBag();
    if (pdpOpen) closeProduct();
    setTimeout(() => scrollToTarget($("#shop")), 250);
  });
  $("#toCheckout").addEventListener("click", () => setPane("checkout"));
  $("#coBack").addEventListener("click", () => setPane("bag"));

  const coForm = $("#checkoutForm");
  function updateCheckoutSum() {
    const sub = bagSub();
    const method = coForm.elements.ship.value;
    const ship = shipCost(sub, method);
    $("#coSub").textContent = money(sub);
    $("#coShip").textContent = ship ? money(ship) : "FREE";
    $("#coTotal").textContent = money(sub + ship);
  }
  coForm.addEventListener("change", updateCheckoutSum);
  coForm.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("bad"));
  coForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstBad = null;
    $$("input[required], select[required]", coForm).forEach((inp) => {
      const ok = inp.value.trim() && inp.checkValidity();
      inp.closest(".field").classList.toggle("bad", !ok);
      if (!ok && !firstBad) firstBad = inp;
    });
    if (firstBad) return firstBad.focus();
    const btn = coForm.querySelector(".drawer-cta");
    btn.classList.add("is-busy");
    btn.firstElementChild.textContent = "Placing order…";
    setTimeout(() => {
      const first = coForm.elements.first.value.trim();
      const total = $("#coTotal").textContent;
      const express = coForm.elements.ship.value === "express";
      const emirate = coForm.elements.emirate.value;
      $("#orderNo").textContent = `ORDER FFX-${Math.floor(1000 + Math.random() * 9000)} · ${total}`;
      $("#doneText").textContent = `Thanks, ${first}. ${bagQty()} ${bagQty() === 1 ? "piece is" : "pieces are"} heading to ${emirate} — ${express ? "today" : "in 1–3 days"}. We'll WhatsApp you the tracking.`;
      bag = []; saveBag(); bumpCount(); renderBag();
      coForm.reset();
      btn.classList.remove("is-busy");
      btn.firstElementChild.textContent = "Place order";
      setPane("done");
    }, 1300);
  });
  $("#doneBtn").addEventListener("click", () => {
    closeBag();
    if (pdpOpen) closeProduct();
    setTimeout(() => scrollToTarget($("#shop")), 250);
  });

  // keyboard: Esc closes the top layer, arrows flip products
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (drawerOpen) closeBag(); else if (pdpOpen) closeProduct(); }
    if (pdpOpen && !drawerOpen && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      if (e.key === "ArrowRight") openProduct(pdpNext.dataset.id);
      if (e.key === "ArrowLeft") openProduct(pdpPrev.dataset.id);
    }
  });
  renderBag();

  /* =========================================================
     01 RING
     ========================================================= */
  const ringSection = $("#heat");
  const ringSticky = $(".ring-sticky");
  const ring = $("#ring");
  const ringTitle = $("#ringTitle");
  const ringCount = $("#ringCount");
  const ringPrice = $("#ringPrice");
  const ringBar = $("#ringBar");
  const ringPct = $("#ringPct");
  const STEP = 360 / RING.length;

  RING.forEach((p, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.setAttribute("aria-label", `Shop ${p.short}, ${money(p.from)}`);
    card.style.setProperty("--c", p.color);
    card.style.animationDelay = `${0.25 + i * 0.07}s`;
    card.innerHTML = `<div class="card-in"><div class="card-face is-cutout"><img src="${imgOf(p)}" alt="" draggable="false" /><span class="card-hint">SHOP · ${money(p.from)}<i>→</i></span></div><i class="card-edge"></i></div>`;
    ring.appendChild(card);
  });
  const cards = $$(".card", ring);

  let radius = 0;
  function layoutRing() {
    const w = ring.offsetWidth;
    radius = (w / 2 / Math.tan(Math.PI / RING.length)) * 1.1; // same spacing as the KERB original
    cards.forEach((c, i) => {
      c.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`;
    });
  }

  // specks
  const specks = $("#specks");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--d", 2 + Math.random() * 4 + "s");
    s.style.setProperty("--dl", -Math.random() * 5 + "s");
    const sz = Math.random() < 0.15 ? 3 : Math.random() < 0.5 ? 2 : 1;
    s.style.width = s.style.height = sz + "px";
    specks.appendChild(s);
  }

  const hexToRgb = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
  const ringRgb = RING.map((p) => hexToRgb(p.color));

  function renderTitle(text) {
    let i = 0;
    ringTitle.innerHTML = text
      .split("")
      .map((ch) => (ch === " " ? `<span class="sp"></span>` : `<span class="ch" style="--i:${i++}">${ch}</span>`))
      .join("");
    ringTitle.classList.remove("in");
    void ringTitle.offsetWidth;
    ringTitle.classList.add("in");
  }

  let activeRing = -1;
  function setActiveRing(i) {
    if (i === activeRing) return;
    activeRing = i;
    const p = RING[i];
    renderTitle(p.short.toUpperCase());
    ringCount.textContent = `${String(i + 1).padStart(2, "0")} / ${RING.length} · ${p.brand}`;
    ringPrice.textContent = money(p.from);
    fitRingInfo();
  }
  // Keep "Shop this pair" clear of the progress bar. One name size per window (no jumping between
  // shoes): the largest size at which the longest name fits the width and the button stays 24px
  // above the bar.
  const ringCta = $("#ringCta");
  const ringFoot = $(".ring-foot");
  const LONGEST = RING.map((p) => p.short.toUpperCase()).sort((a, b) => b.length - a.length)[0];
  const probe = document.createElement("div");
  probe.className = "ring-title";
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;visibility:hidden;left:0;top:0;width:auto;";
  probe.textContent = LONGEST;
  ringTitle.parentElement.appendChild(probe);
  let fittedFor = "";
  function fitRingInfo(force) {
    const key = innerWidth + "x" + innerHeight;
    if (!force && key === fittedFor) return;
    fittedFor = key;
    ringTitle.style.fontSize = probe.style.fontSize = "";
    const fs = parseFloat(getComputedStyle(ringTitle).fontSize);
    // layout position (offsetTop), not getBoundingClientRect: the button slides in with a transform at load
    const ctaBottom = ringCta.parentElement.getBoundingClientRect().top + ringCta.offsetTop + ringCta.offsetHeight;
    const overflowY = ctaBottom - (ringFoot.getBoundingClientRect().top - 24);
    const byY = overflowY > 0 ? fs - overflowY / 0.82 - 2 : fs;
    const byX = fs * (innerWidth * 0.92) / Math.max(probe.scrollWidth, 1);
    const size = Math.max(32, Math.min(fs, byY, byX));
    if (size < fs) ringTitle.style.fontSize = size + "px";
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitRingInfo(true));
  $("#ringCta").addEventListener("click", () => openProduct(RING[Math.max(0, activeRing)].id));
  cards.forEach((c, i) => c.addEventListener("click", () => openProduct(RING[i].id)));

  function updateRing(y, vh) {
    const top = ringSection.offsetTop;
    const span = ringSection.offsetHeight - vh;
    const p = clamp((y - top) / span);
    const angle = p * STEP * (RING.length - 1);
    ring.style.transform = `translateZ(${-radius}px) rotateX(-6deg) rotateY(${-angle}deg)`;

    const f = angle / STEP;
    const a = Math.floor(f), b = Math.min(a + 1, RING.length - 1), t = f - a;
    const c = ringRgb[a].map((v, k) => Math.round(lerp(v, ringRgb[b][k], ease(t))));
    ringSticky.style.setProperty("--theme", `rgb(${c.join(",")})`);

    cards.forEach((card, i) => {
      let d = ((i * STEP - angle) % 360 + 540) % 360 - 180;
      card.classList.toggle("is-back", Math.abs(d) > 95);
    });

    setActiveRing(Math.round(f));
    ringSticky.classList.toggle("is-turning", y > top + 30 || p > 0.005);
    ringBar.style.transform = `scaleX(${p})`;
    ringPct.textContent = String(Math.round(p * 100)).padStart(3, "0") + "%";
  }

  /* =========================================================
     02 MANIFESTO
     ========================================================= */
  const story = $("#story");
  const storyItems = $$("#manifesto .w, #manifesto .chip");
  const storyBar = $("#storyBar");
  function updateStory(y, vh) {
    const p = clamp((y - story.offsetTop + vh * 0.35) / (story.offsetHeight - vh * 0.65));
    const n = storyItems.length;
    const lit = clamp((p - 0.08) / 0.72) * n;
    storyItems.forEach((el, i) => el.classList.toggle("on", i < lit));
    storyBar.style.transform = `scaleX(${clamp((y - story.offsetTop) / (story.offsetHeight - vh))})`;
  }

  /* =========================================================
     03 STREET
     ========================================================= */
  const street = $("#street");
  const frame = $("#streetFrame");
  const slides = $$(".slide", frame);
  const otL = $("#otL"), otR = $("#otR");
  const caption = $("#streetCaption");
  const capMeta = $("#capMeta");
  const capTitle = $("#capTitle");
  const shade = $(".street-shade");
  const CAPTIONS = [
    ["01 / 4 — FRAGMENT × TRAVIS SCOTT · ON THE HOOK", ["GRAILS ARE", "MEANT TO BE", "WORN."]],
    ["02 / 4 — AIR JORDAN 1 HIGH · THE FAIRFAX WALL", ["STRAIGHT HEAT", "FROM THE", "STREETS."]],
    ["03 / 4 — AIR JORDAN 1 HIGH · AFTER DARK", ["DUBAI NEVER", "SLEEPS. NEITHER", "DO WE."]],
    ["04 / 4 — YEEZY BOOST 350 V2 · BONE", ["IF IT'S ON", "THE WALL, IT'S", "THE REAL THING."]],
  ];
  let capIdx = -1;
  function setCaption(i) {
    if (i === capIdx) return;
    capIdx = i;
    capMeta.textContent = CAPTIONS[i][0];
    capTitle.innerHTML = CAPTIONS[i][1].map((l) => `<span class="ln"><span>${l}</span></span>`).join("");
    capTitle.classList.remove("swap");
    void capTitle.offsetWidth;
    capTitle.classList.add("swap");
  }
  setCaption(0);

  function updateStreet(y, vh, vw) {
    const p = clamp((y - street.offsetTop) / (street.offsetHeight - vh));
    const INTRO = 0.16;
    const e = ease(clamp(p / INTRO));

    const cardW = Math.min(vw * 0.3, vh * 0.56);
    const cardH = vh * 0.74;
    const cx = ((vw - cardW) / 2) * (1 - e);
    const ct = ((vh - cardH) / 2) * (1 - e);
    frame.style.setProperty("--cx", cx + "px");
    frame.style.setProperty("--ct", ct + "px");
    frame.style.setProperty("--cb", ct + "px");
    frame.style.setProperty("--cr", 14 * (1 - e) + "px");
    shade.style.setProperty("--shade", e);

    const pre = clamp(y - (street.offsetTop - vh)) / vh; // entering viewport
    const push = e * vw * 0.32;
    otL.style.transform = `translateX(${-push + (1 - pre) * -60}px)`;
    otR.style.transform = `translateX(${push + (1 - pre) * 60}px)`;
    otL.style.opacity = otR.style.opacity = 1 - e;

    const s = clamp((p - INTRO) / (1 - INTRO)) * CAPTIONS.length;
    let idx = 0;
    slides.forEach((sl, k) => {
      const img = sl.firstElementChild;
      if (k === 0) {
        img.style.setProperty("--s", lerp(1.22, 1.04, e) - clamp(s) * 0.04);
        return;
      }
      const t = clamp((s - k + 0.45) / 0.55);
      const te = ease(t);
      sl.style.setProperty("--reveal", (1 - te) * 100 + "%");
      img.style.setProperty("--s", lerp(1.25, 1.02, te));
      img.style.setProperty("--py", (1 - te) * 6 + "vh");
      if (t > 0.5) idx = k;
    });
    setCaption(idx);
    caption.classList.toggle("on", e > 0.92);
  }

  /* =========================================================
     04 LEGIT CHECK — a scan beam sweeps the grail, checks light up as it passes
     ========================================================= */
  const anatomy = $("#legit");
  const scan = $("#scan");
  const scanShoe = $("#scanShoe");
  const scanBeam = $("#scanBeam");
  const verified = $("#verified");
  const anatomyCta = $("#anatomyCta");
  const xmarks = $$(".xlines path, .xdot, .xlabel", scan);
  // the beam's x (as a share of the shoe width) at which each check is "found": swoosh, wings, heel, midsole, toe
  const FOUND_AT = [0.6, 0.8, 0.93, 0.45, 0.12];
  $("#legitCtaLabel").textContent = `Shop the grail · ${money(FRAGMENT.from)}`;
  function updateAnatomy(y, vh) {
    const p = clamp((y - anatomy.offsetTop) / (anatomy.offsetHeight - vh));
    const enter = ease(clamp(p / 0.18));
    scanShoe.style.setProperty("--in", enter);
    // the beam sweeps left → right, then back once every check is lit
    const sweep = clamp((p - 0.18) / 0.42);
    scanBeam.style.setProperty("--bx", sweep);
    scanBeam.classList.toggle("on", p > 0.17 && p < 0.64);
    xmarks.forEach((m) => m.classList.toggle("on", sweep >= FOUND_AT[+m.dataset.i]));
    verified.classList.toggle("on", p > 0.66);
    scan.classList.toggle("is-verified", p > 0.66);
    anatomyCta.classList.toggle("on", p > 0.72);
  }

  /* =========================================================
     05 TORCH + COUNTDOWN
     ========================================================= */
  const room = $("#torchRoom");
  let torchActive = false, torchIdleT, tx = 0, ty = 0;
  const litImg = $(".torch-lit");
  function setTorch(x, y) {
    room.style.setProperty("--x", x + "px");
    room.style.setProperty("--y", y + "px");
    // same point, expressed in the (scaled) image's own box for its mask
    const rr = room.getBoundingClientRect();
    const ir = litImg.getBoundingClientRect();
    const sx = litImg.offsetWidth / ir.width || 1;
    room.style.setProperty("--ix", (x + rr.left - ir.left) * sx + "px");
    room.style.setProperty("--iy", (y + rr.top - ir.top) * sx + "px");
    room.style.setProperty("--r", 150 * sx + "px");
  }
  room.addEventListener("pointermove", (e) => {
    const r = room.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    setTorch(tx, ty);
    torchActive = true;
    clearTimeout(torchIdleT);
    torchIdleT = setTimeout(() => (torchActive = false), 2500);
  });
  room.addEventListener("pointerleave", () => (torchActive = false));
  function idleTorch(time) {
    if (torchActive || reduce) return;
    const r = room.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const t = time / 1000;
    const x = r.width * (0.5 + Math.sin(t * 0.7) * 0.28);
    const y = r.height * (0.5 + Math.sin(t * 1.1 + 1) * 0.2);
    tx = lerp(tx || x, x, 0.08);
    ty = lerp(ty || y, y, 0.08);
    setTorch(tx, ty);
  }

  const cdEls = Object.fromEntries($$("#countdown b").map((b) => [b.dataset.u, b]));
  // next drop: Friday 20:00 Dubai time
  const lisbonFmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai", hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  function lisbonWall(now) {
    const o = Object.fromEntries(lisbonFmt.formatToParts(now).map((p) => [p.type, p.value]));
    return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute, +o.second);
  }
  function nextDrop(now) {
    const wall = lisbonWall(now);
    const offset = wall - Math.floor(now.getTime() / 1000) * 1000;
    const d = new Date(wall);
    let add = (5 - d.getUTCDay() + 7) % 7;
    const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + add, 20, 0, 0));
    if (target.getTime() <= wall) target.setUTCDate(target.getUTCDate() + 7);
    return target.getTime() - offset;
  }
  let dropAt = nextDrop(new Date());
  function tick() {
    let ms = dropAt - Date.now();
    if (ms <= 0) { dropAt = nextDrop(new Date()); ms = dropAt - Date.now(); }
    const s = Math.floor(ms / 1000);
    const vals = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    for (const k in vals) {
      const v = String(vals[k]).padStart(2, "0");
      if (cdEls[k].textContent !== v) cdEls[k].textContent = v;
    }
  }
  tick();
  setInterval(tick, 1000);

  $$("form[data-form]").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = f.querySelector("button");
      const input = f.querySelector("input");
      f.classList.add("done");
      btn.textContent = f.dataset.form === "drop" ? "You're on the list" : "You're in";
      input.value = "";
      input.placeholder = "See you Friday.";
    })
  );

  /* =========================================================
     06 SHOP
     ========================================================= */
  const wall = $("#wall");
  const filtersEl = $("#filters");
  PRODUCTS.forEach((p, i) => {
    const el = document.createElement("article");
    el.className = "card-p";
    el.dataset.cat = p.cat;
    el.style.setProperty("--c", p.color);
    el.innerHTML = `
      <div class="shelf">
        <div class="tile is-cutout"><img src="${imgOf(p)}" alt="${p.name}" loading="lazy" /></div>
        <button class="card-add" type="button" aria-label="Shop ${p.short}">+</button>
      </div>
      <div class="ledge"></div>
      <div class="card-row"><strong>${p.short}</strong><span>${money(p.from)}</span></div>
      <div class="card-meta">${p.brand}${p.lastOne ? ` · <em>LAST SIZE</em>` : p.v.length > 1 ? ` · ${p.inStock} ${p.inStock === 1 ? "SIZE" : "SIZES"}` : ""}</div>`;
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `${p.name}, ${money(p.from)}`);
    el.addEventListener("click", () => openProduct(p.id));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProduct(p.id); } });
    wall.appendChild(el);
  });
  const shopCards = $$(".card-p", wall);

  $("#wallEyebrow").textContent = `06 · THE WALL · ${PRODUCTS.length} PIECES`;
  const cats = ["ALL", "SNEAKERS", "STREETWEAR", "COLLECTIBLES", "ACCESSORIES"];
  cats.forEach((c) => {
    const n = c === "ALL" ? 0 : PRODUCTS.filter((p) => p.cat === c).length;
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.cat = c;
    b.setAttribute("role", "tab");
    b.innerHTML = `[ ${c}${n ? `<sup>${n}</sup>` : ""} ]`;
    b.addEventListener("click", () => setFilter(c));
    filtersEl.appendChild(b);
  });

  let filterT;
  function setFilter(cat) {
    $$("button", filtersEl).forEach((b) => {
      const on = b.dataset.cat === cat;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on);
    });
    clearTimeout(filterT);
    shopCards.forEach((c) => {
      const show = cat === "ALL" || c.dataset.cat === cat;
      if (!show) c.classList.add("hide");
    });
    filterT = setTimeout(() => {
      let k = 0;
      shopCards.forEach((c) => {
        const show = cat === "ALL" || c.dataset.cat === cat;
        c.classList.toggle("gone", !show);
        if (show) {
          c.classList.add("hide");
          const d = k++ * 60;
          setTimeout(() => requestAnimationFrame(() => c.classList.remove("hide")), d);
        }
      });
    }, 380);
  }
  setFilter("ALL");

  /* ---------------- reveal on view ---------------- */
  const footerWord = $(".footer-word");
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
    { threshold: 0.25 }
  );
  io.observe(footerWord);

  /* ---------------- nav active ---------------- */
  const navLinks = $$(".nav-links a");
  const navIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id === "footer" ? "shop" : en.target.id;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === id));
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );
  ["heat", "story", "street", "legit", "next", "shop", "footer"].forEach((id) => navIO.observe($("#" + id)));

  /* =========================================================
     LOOP
     ========================================================= */
  let lastY = -1, lastW = 0, lastH = 0;
  function frameLoop(time) {
    if (lenis) lenis.raf(time);
    const y = window.scrollY;
    const vw = window.innerWidth, vh = window.innerHeight;
    if (vw !== lastW || vh !== lastH) {
      layoutRing();
      if (activeRing >= 0) fitRingInfo(true);
      lastW = vw; lastH = vh; lastY = -1;
    }
    if (y !== lastY) {
      lastY = y;
      updateRing(y, vh);
      updateStory(y, vh);
      updateStreet(y, vh, vw);
      updateAnatomy(y, vh);
    }
    idleTorch(time);
    requestAnimationFrame(frameLoop);
  }
  requestAnimationFrame(frameLoop);

  // honour deep links after layout settles
  if (location.hash && location.hash !== "#heat") {
    const el = $(location.hash);
    if (el) setTimeout(() => window.scrollTo(0, el.offsetTop), 60);
  }
})();
