"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { EXP_SHIP, FREE_SHIP, STD_SHIP, byId, imgOf, money, priceOf, shipCost, sizeText, type ShipMethod } from "@/lib/products";
import { useScroll } from "./SmoothScroll";
import { useShop } from "./ShopProvider";

type Pane = "bag" | "checkout" | "done";
const STEP: Record<Pane, string> = { bag: "YOUR BAG", checkout: "CHECKOUT", done: "CONFIRMED" };
const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];

const pad = "px-[26px]";
const mono = "font-mono font-medium tracking-[.1em]";
const sumRow = `flex justify-between py-[5px] ${mono} text-[11px] text-[rgba(244,241,234,.7)]`;
const sumTotal = "flex justify-between pt-3 pb-4 font-mono text-[14px] font-bold tracking-[.1em] text-ink";
const coLabel = "mt-2 font-mono text-[11px] font-medium tracking-[.12em] text-dim";
const control =
  "h-[46px] rounded-[10px] border border-white/14 bg-white/5 font-display text-[15px] font-medium text-ink outline-none [font-stretch:100%] [transition:border-color_.25s,background_.25s] focus:border-white/50 focus:bg-white/8";
const bad = "border-orange! animate-[kr-shake_.4s]";
const cta =
  "group flex h-14 w-full items-center justify-between rounded-full bg-orange pr-2 pl-6 text-[16px] font-bold text-[#1a0700] [font-stretch:100%] [transition:translate_.3s_var(--ease),box-shadow_.3s] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(255,90,18,.35)]";
const ctaGo =
  "grid size-10 place-items-center rounded-full bg-[#0b0d18] font-mono text-[16px] font-bold text-orange [transition:transform_.45s_var(--ease)] group-hover:[transform:translateX(3px)_rotate(-45deg)]";

function Field({ label, name, invalid, className = "", ...input }: { label: string; name: string; invalid: boolean; className?: string } & React.ComponentProps<"input">) {
  return (
    <label className={`flex min-w-0 flex-1 flex-col gap-1.5 ${className}`}>
      <span className="text-[12px] text-[rgba(244,241,234,.65)] [font-stretch:100%]">{label}</span>
      <input name={name} required className={`${control} px-3.5 ${invalid ? bad : ""}`} {...input} />
    </label>
  );
}

export function BagDrawer() {
  const { bag, qty, subtotal, drawerOpen, closeBag, removeLine, clearBag, openProduct, closeProduct, pdpOpen } = useShop();
  const { scrollTo } = useScroll();
  const [pane, setPane] = useState<Pane>("bag");
  const [leaving, setLeaving] = useState<Set<string>>(new Set());
  const [ship, setShip] = useState<ShipMethod>("standard");
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState({ no: "ORDER FFX-0000", text: "See you on the street." });
  const closeBtn = useRef<HTMLButtonElement>(null);

  // every open starts on the bag
  useEffect(() => {
    if (!drawerOpen) return;
    setPane("bag");
    const t = setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 300);
    return () => clearTimeout(t);
  }, [drawerOpen]);

  const toWall = () => {
    closeBag();
    if (pdpOpen) closeProduct();
    setTimeout(() => scrollTo("#shop"), 250);
  };

  const remove = (key: string, id: string, size: string) => {
    setLeaving((s) => new Set(s).add(key));
    setTimeout(() => {
      removeLine(id, size);
      setLeaving((s) => {
        const n = new Set(s);
        n.delete(key);
        return n;
      });
    }, 380);
  };

  const empty = qty === 0;
  const left = Math.max(0, FREE_SHIP - subtotal);
  const stdShip = shipCost(subtotal, "standard");
  const coShip = shipCost(subtotal, ship);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input[required], select[required]"));
    const wrong = fields.filter((f) => !(f.value.trim() && f.checkValidity()));
    setInvalid(new Set(wrong.map((f) => f.name)));
    if (wrong.length) {
      wrong[0].focus();
      return;
    }
    setBusy(true);
    const data = new FormData(form);
    const first = String(data.get("first")).trim();
    const emirate = String(data.get("emirate"));
    const express = ship === "express";
    const total = money(subtotal + coShip);
    setTimeout(() => {
      setOrder({
        no: `ORDER FFX-${Math.floor(1000 + Math.random() * 9000)} · ${total}`,
        text: `Thanks, ${first}. ${qty} ${qty === 1 ? "piece is" : "pieces are"} heading to ${emirate} — ${express ? "today" : "in 1–3 days"}. We'll WhatsApp you the tracking.`,
      });
      clearBag();
      form.reset();
      setShip("standard");
      setBusy(false);
      setPane("done");
    }, 1300);
  };

  return (
    <>
      <div
        onClick={closeBag}
        className={`fixed inset-0 z-90 bg-[rgba(2,4,12,.6)] backdrop-blur-[4px] ${drawerOpen ? "visible opacity-100 [transition:opacity_.5s]" : "invisible opacity-0 [transition:opacity_.5s,visibility_0s_.5s]"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawerTitle"
        aria-hidden={!drawerOpen}
        className={`fixed inset-y-0 right-0 z-91 flex w-[min(480px,100vw)] flex-col border-l border-white/10 bg-[linear-gradient(180deg,#0b1030,#070b1f_40%)] ${drawerOpen ? "visible [transform:none] [transition:transform_.7s_var(--ease)]" : "invisible [transform:translateX(104%)] [transition:transform_.7s_var(--ease),visibility_0s_.7s]"}`}
      >
        <header className="flex items-center justify-between border-b border-white/8 px-[26px] py-[22px]">
          <h3 id="drawerTitle" className="m-0 font-mono text-[12px] font-bold tracking-[.1em]">
            <span className="opacity-50">[</span> {STEP[pane]} · {qty} <span className="opacity-50">]</span>
          </h3>
          <button
            ref={closeBtn}
            type="button"
            aria-label="Close bag"
            onClick={closeBag}
            className="size-[38px] rounded-full border border-white/20 [transition:transform_.4s_var(--ease),background_.3s] hover:[transform:rotate(90deg)] hover:bg-white/8"
          >
            ✕
          </button>
        </header>

        {pane === "bag" && (
          <section key="bag" className="flex min-h-0 flex-1 flex-col animate-[pane-in_.55s_var(--ease)]">
            {empty ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-[18px] p-[26px]">
                <div className="text-[76px] font-black leading-[.86] [font-stretch:78%]">
                  NO HEAT
                  <br />
                  <span className="txt-outline">YET.</span>
                </div>
                <p className="m-0 text-[rgba(244,241,234,.7)] [font-stretch:100%]">Your bag is empty. The wall is stacked with grails.</p>
                <a
                  href="#shop"
                  className="pill-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    toWall();
                  }}
                >
                  <span className="pill-label">SHOP THE WALL</span>
                  <span className="pill-arrow">→</span>
                </a>
              </div>
            ) : (
              <>
                <div className={`border-b border-white/6 ${pad} py-[18px]`}>
                  <div className="mb-2.5 font-mono text-[11px] font-medium tracking-[.08em] text-[rgba(244,241,234,.8)] [&_b]:text-lime">
                    {left > 0 ? (
                      <>
                        Add <b>{money(left)}</b> for free delivery
                      </>
                    ) : (
                      <>
                        <b>Free delivery</b> unlocked
                      </>
                    )}
                  </div>
                  <div className="h-1 overflow-hidden rounded-[4px] bg-white/8">
                    <i
                      className="block h-full rounded-[inherit] bg-linear-to-r from-orange to-lime [transition:width_.8s_var(--ease)]"
                      style={{ width: Math.min(100, (subtotal / FREE_SHIP) * 100) + "%" }}
                    />
                  </div>
                </div>

                <ul className={`m-0 flex-1 list-none overflow-y-auto ${pad} py-2`}>
                  {bag.map((l) => {
                    const p = byId[l.id];
                    const key = l.id + "|" + l.size;
                    return (
                      <li
                        key={key}
                        className={`grid grid-cols-[84px_1fr_auto] items-center gap-4 border-b border-white/7 py-4 ${leaving.has(key) ? "animate-[item-out_.4s_var(--ease)_both]" : "animate-[item-in_.6s_var(--ease)_both]"}`}
                      >
                        <button
                          type="button"
                          aria-label={`View ${p.short}`}
                          className="h-[72px] w-[84px] overflow-hidden rounded-xl bg-[color-mix(in_oklab,var(--c)_35%,#0b1030)]"
                          style={{ "--c": p.color } as CSSProperties}
                          onClick={() => {
                            closeBag();
                            setTimeout(() => openProduct(p.id), 350);
                          }}
                        >
                          <img src={imgOf(p)} alt="" className="h-full w-full object-contain p-1.5" />
                        </button>
                        <div>
                          <strong className="block text-[16px] font-bold [font-stretch:100%]">{p.short}</strong>
                          <small className={`mt-1 block text-[10px] text-dim ${mono}`}>
                            {p.brand} · {sizeText(p, l.size)}
                          </small>
                          <small className={`mt-1 block text-[10px] text-lime ${mono}`}>✓ AUTHENTICATED</small>
                        </div>
                        <div className="flex flex-col items-end gap-3.5 font-mono text-[13px] font-semibold">
                          <span>{money(priceOf(p.id, l.size) * l.qty)}</span>
                          <button
                            type="button"
                            onClick={() => remove(key, l.id, l.size)}
                            className={`text-[10px] text-dim underline underline-offset-[3px] hover:text-orange ${mono}`}
                          >
                            REMOVE
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <footer className={`border-t border-white/8 bg-[rgba(4,6,15,.5)] ${pad} pt-5 pb-[26px]`}>
                  <div className={sumRow}><span>SUBTOTAL</span><span>{money(subtotal)}</span></div>
                  <div className={sumRow}><span>DELIVERY</span><span>{stdShip ? money(stdShip) : "FREE"}</span></div>
                  <div className={sumTotal}><span>TOTAL</span><span>{money(subtotal + stdShip)}</span></div>
                  <button type="button" className={cta} onClick={() => setPane("checkout")}>
                    <span>Checkout</span>
                    <span className={ctaGo}>→</span>
                  </button>
                </footer>
              </>
            )}
          </section>
        )}

        {pane === "checkout" && (
          <section key="checkout" className="flex min-h-0 flex-1 flex-col animate-[pane-in_.55s_var(--ease)]">
            <form
              noValidate
              onSubmit={submit}
              onInput={(e) => {
                const name = (e.target as HTMLInputElement).name;
                if (invalid.has(name)) setInvalid((s) => { const n = new Set(s); n.delete(name); return n; });
              }}
              className={`flex flex-1 flex-col gap-3 overflow-y-auto ${pad} pt-[22px] pb-[26px]`}
            >
              <div className={coLabel}>01 · CONTACT</div>
              <Field label="Email" name="email" type="email" autoComplete="email" invalid={invalid.has("email")} />
              <Field label="Mobile" name="phone" type="tel" autoComplete="tel" placeholder="+971" invalid={invalid.has("phone")} />
              <div className={coLabel}>02 · DELIVERY</div>
              <div className="flex gap-2.5">
                <Field label="First name" name="first" autoComplete="given-name" invalid={invalid.has("first")} />
                <Field label="Last name" name="last" autoComplete="family-name" invalid={invalid.has("last")} />
              </div>
              <Field label="Address" name="address" autoComplete="street-address" placeholder="Building, street, area" invalid={invalid.has("address")} />
              <label className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[12px] text-[rgba(244,241,234,.65)] [font-stretch:100%]">Emirate</span>
                <select name="emirate" required defaultValue="" className={`${control} px-3 [&_option]:text-[#0b0d18] ${invalid.has("emirate") ? bad : ""}`}>
                  <option value="">Choose…</option>
                  {EMIRATES.map((em) => (
                    <option key={em}>{em}</option>
                  ))}
                </select>
              </label>

              <div className={coLabel}>03 · SHIPPING</div>
              <div className="flex flex-col gap-2">
                {([
                  ["standard", "Standard", "1–3 days", subtotal >= FREE_SHIP ? "FREE" : money(STD_SHIP)],
                  ["express", "Same day", "Dubai only", money(EXP_SHIP)],
                ] as const).map(([value, name, note, cost]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-white/14 bg-white/3 p-3.5 text-[14px] [font-stretch:100%] [transition:border-color_.25s,background_.25s] has-checked:border-ink has-checked:bg-white/8"
                  >
                    <input type="radio" name="ship" value={value} checked={ship === value} onChange={() => setShip(value)} className="accent-lime" />
                    <span className="flex-1 text-[rgba(244,241,234,.7)]">
                      <b className="mr-1.5 text-ink">{name}</b> {note}
                    </span>
                    <em className="font-mono text-[12px] font-semibold not-italic">{cost}</em>
                  </label>
                ))}
              </div>
              <p className={`m-0 mt-1 text-[10px] uppercase text-dim ${mono}`}>Concept store — no payment is taken.</p>
              <div className="mt-1 border-t border-white/8 pt-2.5">
                <div className={sumRow}><span>SUBTOTAL</span><span>{money(subtotal)}</span></div>
                <div className={sumRow}><span>DELIVERY</span><span>{coShip ? money(coShip) : "FREE"}</span></div>
                <div className={sumTotal}><span>TOTAL</span><span>{money(subtotal + coShip)}</span></div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPane("bag")}
                  className="h-14 whitespace-nowrap rounded-full border border-white/20 px-4 font-mono text-[11px] font-bold tracking-[.1em] hover:bg-white/8"
                >
                  ← BAG
                </button>
                <button type="submit" className={`${cta} ${busy ? "pointer-events-none opacity-80" : ""}`}>
                  <span>{busy ? "Placing order…" : "Place order"}</span>
                  <span className={`${ctaGo} ${busy ? "animate-[spin_.8s_linear_infinite]" : ""}`}>→</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {pane === "done" && (
          <section key="done" className="flex min-h-0 flex-1 flex-col animate-[pane-in_.55s_var(--ease)]">
            <div className="flex flex-1 flex-col items-start justify-center gap-4 p-[26px]">
              <svg className="size-[76px]" viewBox="0 0 80 80" aria-hidden="true">
                <circle cx="40" cy="40" r="36" className="fill-none stroke-lime [stroke-dasharray:227] [stroke-dashoffset:227] [stroke-width:3] animate-[draw_.9s_var(--ease)_forwards]" />
                <path
                  d="M24 41 L35 52 L57 29"
                  className="fill-none stroke-lime [stroke-dasharray:60] [stroke-dashoffset:60] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:5] animate-[draw_.6s_.6s_var(--ease)_forwards]"
                />
              </svg>
              <div className={coLabel}>{order.no}</div>
              <h4 className="m-0 text-[72px] font-black leading-[.86] [font-stretch:78%]">
                IT&apos;S ON
                <br />
                THE WAY.
              </h4>
              <p className="m-0 leading-[1.5] text-[rgba(244,241,234,.75)] [font-stretch:100%]">{order.text}</p>
              <button type="button" className="pill-cta" onClick={toWall}>
                <span className="pill-label">BACK TO THE WALL</span>
                <span className="pill-arrow">→</span>
              </button>
            </div>
          </section>
        )}
      </aside>
    </>
  );
}
