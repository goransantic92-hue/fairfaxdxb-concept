"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { CATEGORIES, PRODUCTS, imgOf, money } from "@/lib/products";
import { useShop } from "../ShopProvider";

export function Shop() {
  const { filter, setFilter, openProduct } = useShop();
  const cards = useRef<(HTMLElement | null)[]>([]);

  // filter: the leaving cards fade out, then the rest come back in one by one
  useEffect(() => {
    const show = (i: number) => filter === "ALL" || PRODUCTS[i].cat === filter;
    const timers: ReturnType<typeof setTimeout>[] = [];
    cards.current.forEach((c, i) => !show(i) && c?.classList.add("hide"));
    timers.push(
      setTimeout(() => {
        let k = 0;
        cards.current.forEach((c, i) => {
          if (!c) return;
          c.classList.toggle("gone", !show(i));
          if (!show(i)) return;
          c.classList.add("hide");
          timers.push(setTimeout(() => requestAnimationFrame(() => c.classList.remove("hide")), k++ * 60));
        });
      }, 380),
    );
    return () => timers.forEach(clearTimeout);
  }, [filter]);

  return (
    <section id="shop" className="seam relative overflow-hidden bg-night pt-[16vh] pb-[12vh]">
      <div
        aria-hidden="true"
        className="absolute -inset-10 z-0 bg-[url(/img/ffx-store.jpg)] bg-cover bg-[center_40%] bg-no-repeat opacity-55 [filter:blur(26px)_saturate(1.3)_brightness(.45)] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,var(--bg)_0%,rgba(11,26,85,.75)_35%,rgba(22,56,255,.25)_70%,var(--bg)_100%)]"
      />
      <div className="relative z-1 mx-auto max-w-[1500px] px-[var(--gutter)]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-[30px]">
          <div>
            <div className="mb-3.5 font-mono text-[11px] uppercase tracking-[.08em] text-dim">06 · THE WALL · {PRODUCTS.length} PIECES</div>
            <h2 className="m-0 text-[clamp(48px,8vw,128px)] font-black leading-[.88] [font-stretch:78%]">
              SHOP THE
              <br />
              WALL
            </h2>
          </div>
          <div className="flex max-w-[420px] flex-wrap gap-x-3.5 gap-y-2 font-mono text-[11px] uppercase tracking-[.08em]" role="tablist">
            {CATEGORIES.map((c) => {
              const n = c === "ALL" ? 0 : PRODUCTS.filter((p) => p.cat === c).length;
              const on = filter === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(c)}
                  className={`px-0.5 py-1.5 tracking-[.08em] transition-colors duration-300 hover:text-ink ${on ? "font-bold text-ink" : "text-[rgba(244,241,234,.55)]"}`}
                >
                  [ {c}
                  {n ? <sup className="ml-0.5 text-[9px] opacity-70">{n}</sup> : null} ]
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-x-[22px] gap-y-11 max-[1100.98px]:grid-cols-3 max-[600.98px]:grid-cols-2 max-[600.98px]:gap-x-3.5 max-[600.98px]:gap-y-8">
          {PRODUCTS.map((p, i) => (
            <article
              key={p.id}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="card-p group relative flex cursor-pointer flex-col gap-3"
              style={{ "--c": p.color } as CSSProperties}
              tabIndex={0}
              role="button"
              aria-label={`${p.name}, ${money(p.from)}`}
              onClick={() => openProduct(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openProduct(p.id);
                }
              }}
            >
              <div className="relative grid aspect-[1/.92] [place-items:end_center]">
                <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-[radial-gradient(70%_55%_at_50%_60%,color-mix(in_oklab,var(--c)_45%,transparent),transparent_75%),rgba(255,255,255,.03)] shadow-[inset_0_0_0_1px_rgba(255,255,255,.14)] [transition:transform_.6s_var(--ease),box-shadow_.5s] after:absolute after:inset-y-0 after:left-0 after:w-[40%] after:bg-linear-to-r after:from-transparent after:via-white/35 after:to-transparent after:[transform:translateX(-130%)_skewX(-18deg)] group-hover:[transform:translateY(-10px)_rotate(-1.2deg)] group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,.3),0_24px_40px_rgba(0,0,0,.45)] group-hover:after:animate-[kr-glint_.9s_var(--ease)]">
                  <img
                    src={imgOf(p)}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-contain p-[12%] [filter:drop-shadow(0_16px_14px_rgba(0,0,0,.45))] [transition:transform_1s_var(--ease)] group-hover:[transform:scale(1.08)_rotate(-4deg)]"
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Shop ${p.short}`}
                  className="absolute top-2.5 right-2.5 z-2 grid size-[34px] scale-0 place-items-center rounded-full bg-ink text-[18px] font-bold text-black [transition:scale_.4s_var(--ease)] group-hover:scale-100 focus-visible:scale-100"
                >
                  +
                </button>
              </div>
              <div className="mt-2 h-2 rounded-[2px] bg-[linear-gradient(180deg,rgba(160,175,255,.55),rgba(125,140,255,.12))] shadow-[0_10px_24px_rgba(22,56,255,.35)]" />
              <div className="flex items-baseline justify-between gap-2">
                <strong className="text-[16px] font-bold [font-stretch:100%]">{p.short}</strong>
                <span className="whitespace-nowrap font-mono text-[12px]">{money(p.from)}</span>
              </div>
              <div className="-mt-1.5 font-mono text-[10px] uppercase tracking-[.08em] text-dim">
                {p.brand}
                {p.lastOne ? (
                  <>
                    {" · "}
                    <em className="not-italic text-orange before:mr-1.5 before:mb-px before:ml-1 before:inline-block before:size-1.5 before:rounded-full before:bg-orange before:animate-[kr-live_1.2s_infinite]">
                      LAST SIZE
                    </em>
                  </>
                ) : p.v.length > 1 ? (
                  ` · ${p.inStock} ${p.inStock === 1 ? "SIZE" : "SIZES"}`
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
