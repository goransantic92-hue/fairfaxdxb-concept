"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PRODUCTS, byId, img2Of, imgOf, isUsSized, money, priceOf, sizeText, type Product } from "@/lib/products";
import { replayClass } from "@/lib/motion";
import { useShop } from "./ShopProvider";
import { BagCount } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");

/** The grail sits between the last pair on the wall and the first. */
function neighbours(p: Product) {
  const n = PRODUCTS.length;
  const idx = PRODUCTS.findIndex((x) => x.id === p.id);
  const base = p.grail ? n - 1 : idx;
  return { prev: PRODUCTS[(base - (p.grail ? 0 : 1) + n) % n], next: PRODUCTS[(base + 1) % n], idx };
}

export function ProductView() {
  const { pdpId, pdpOpen, pdpNonce, closeProduct, openProduct, openBag, closeBag, drawerOpen, addToBag } = useShop();

  const [p, setP] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [view, setView] = useState<"side" | "three">("side");
  const [flip, setFlip] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const openRef = useRef(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const addBtn = useRef<HTMLButtonElement>(null);

  const fill = (next: Product) => {
    setP(next);
    setView("side");
    setFlip(0);
    setAdded(false);
    // a single in-stock option is picked for you
    const inStock = next.v.filter((x) => x[2]);
    setPicked(next.v.length === 1 && inStock.length ? inStock[0][0] : null);
  };

  // open → curtain wipes down, then the content rises in; switching product fades out and back in
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (pdpOpen && pdpId) {
      const next = byId[pdpId];
      if (!openRef.current) {
        openRef.current = true;
        lastFocus.current = document.activeElement as HTMLElement | null;
        fill(next);
        setIsOpen(true);
        timers.push(
          setTimeout(() => {
            setShown(true);
            closeBtn.current?.focus({ preventScroll: true });
          }, 380),
        );
      } else {
        setShown(false);
        // fade out, swap the content while hidden, then let it rise in again
        timers.push(setTimeout(() => fill(next), 280));
        timers.push(setTimeout(() => setShown(true), 320));
      }
    } else if (!pdpOpen && openRef.current) {
      openRef.current = false;
      setShown(false);
      timers.push(
        setTimeout(() => {
          setIsOpen(false);
          lastFocus.current?.focus({ preventScroll: true });
        }, 200),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [pdpOpen, pdpId, pdpNonce]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const nav = p ? neighbours(p) : null;

  // keyboard: Esc closes the top layer, arrows flip products
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (drawerOpen) closeBag();
        else if (pdpOpen) closeProduct();
      }
      const tag = (document.activeElement as HTMLElement | null)?.tagName ?? "";
      if (pdpOpen && !drawerOpen && nav && !/INPUT|TEXTAREA|SELECT/.test(tag)) {
        if (e.key === "ArrowRight") openProduct(nav.next.id);
        if (e.key === "ArrowLeft") openProduct(nav.prev.id);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, pdpOpen, nav, closeBag, closeProduct, openProduct]);

  const onAdd = () => {
    if (!p) return;
    if (!picked) {
      replayClass(addBtn.current, "shake"); // no size yet: nudge
      return;
    }
    if (addToBag(p.id, picked)) setAdded(true);
  };

  let price = "";
  let soldText = "";
  if (p) {
    const prices = p.v.filter((x) => x[2]).map((x) => x[1]);
    const lo = Math.min(...prices), hi = Math.max(...prices);
    price = picked ? money(priceOf(p.id, picked)) : lo === hi ? money(lo) : `${money(lo)} – ${hi.toLocaleString("en-US")}`;
    const sold = p.v.filter((x) => !x[2]).length;
    soldText = sold ? `${sold} SOLD OUT` : "IN STOCK";
  }
  const addLabel = added ? "Added to bag ✓" : p && picked ? `Add ${sizeText(p, picked)} · ${money(priceOf(p.id, picked))}` : "Pick a size";

  const cls = ["pdp", isOpen && "is-open", shown && "is-shown", p?.img2 && "has-back"].filter(Boolean).join(" ");
  const style = p ? ({ "--pc": p.color, "--pa": p.accent || p.color } as CSSProperties) : undefined;

  return (
    <div className={cls} style={style} data-view={view} role="dialog" aria-modal="true" aria-labelledby="pdpName" aria-hidden={!isOpen}>
      <div className="pdp-bg" />
      <div className="pdp-top">
        <button className="pdp-close" type="button" onClick={openBag}>
          BAG <BagCount />
        </button>
        <button className="pdp-close" type="button" ref={closeBtn} onClick={closeProduct}>
          BACK TO THE WALL <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="pdp-stage">
        <div className="pdp-ghost" aria-hidden="true">
          {p?.brand.split(/[ ×]/)[0]}
        </div>
        <div className={`pdp-shot${flip ? " flip" : ""}`}>
          {p && <img key={flip} src={view === "three" && p.img2 ? img2Of(p) : imgOf(p)} alt={`${p.name}, side view`} />}
        </div>
        <div className="pdp-views" role="tablist" aria-label="View">
          {(["side", "three"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              className={view === v ? "is-active" : undefined}
              onClick={() => {
                setView(v);
                if (p?.img2) setFlip((f) => f + 1);
              }}
            >
              {v === "side" ? "SIDE" : p?.img2 ? "BACK" : "3/4"}
            </button>
          ))}
        </div>
      </div>

      <div className="pdp-info">
        <div className="pdp-count rv">
          {p && nav && (p.grail ? `04 · THE GRAIL · ${p.brand}` : `${pad(nav.idx + 1)} / ${PRODUCTS.length} · ${p.brand}`)}
        </div>
        <h2 className="pdp-name rv" id="pdpName">
          {p?.short.toUpperCase()}
        </h2>
        <p className="pdp-full rv">{p?.name}</p>
        <p className="pdp-ar rv" dir="rtl" lang="ar">
          {p?.ar}
        </p>
        <div className="pdp-price rv">{price}</div>

        <div className="pdp-size-head rv">
          <span>{p?.label}</span>
          <span>{soldText}</span>
        </div>
        <div className={`pdp-sizes rv${p && !isUsSized(p) ? " is-wide" : ""}`} role="radiogroup" aria-label="Size">
          {p?.v.map(([s, , ok]) => (
            <button
              key={p.id + s}
              type="button"
              className={`size${picked === s ? " is-picked" : ""}`}
              role="radio"
              aria-checked={picked === s}
              aria-label={ok ? sizeText(p, s) : `${sizeText(p, s)}, sold out`}
              disabled={!ok}
              onClick={() => {
                setPicked(s);
                setAdded(false);
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          ref={addBtn}
          type="button"
          className={`pdp-add rv${picked ? "" : " is-off"}${added ? " is-added" : ""}`}
          aria-disabled={!picked}
          onClick={onAdd}
        >
          <span className="pdp-add-label">{addLabel}</span>
          <span className="pdp-add-go" aria-hidden="true">→</span>
        </button>

        <div className="pdp-notes rv">
          <span>100% AUTHENTIC · CHECKED IN DUBAI</span>
          <span>FREE UAE DELIVERY OVER AED 1,000</span>
        </div>

        <div className="pdp-nav rv">
          <button type="button" onClick={() => nav && openProduct(nav.prev.id)}>
            ← <span>{nav?.prev.short.toUpperCase()}</span>
          </button>
          <button type="button" onClick={() => nav && openProduct(nav.next.id)}>
            <span>{nav?.next.short.toUpperCase()}</span> →
          </button>
        </div>
      </div>
    </div>
  );
}
