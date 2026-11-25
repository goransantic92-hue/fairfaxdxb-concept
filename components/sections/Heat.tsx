"use client";

import { Fragment, useRef, useState, type CSSProperties } from "react";
import { RING, imgOf, money } from "@/lib/products";
import { ScrollTrigger, clamp, ease, lerp, useGSAP } from "@/lib/motion";
import { useShop } from "../ShopProvider";

const N = RING.length;
const STEP = 360 / N;
const hexToRgb = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const RING_RGB = RING.map((p) => hexToRgb(p.color));
const LONGEST = RING.map((p) => p.short.toUpperCase()).sort((a, b) => b.length - a.length)[0];
const pad = (n: number) => String(n).padStart(2, "0");

// background specks: seeded, so the server and the browser render the same field
const SPECKS = (() => {
  let seed = 9;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 70 }, () => {
    const r = rnd();
    const size = r < 0.15 ? 3 : r < 0.5 ? 2 : 1;
    return { left: rnd() * 100, top: rnd() * 100, d: 2 + rnd() * 4, dl: -rnd() * 5, size };
  });
})();

function Chars({ text }: { text: string }) {
  let i = 0;
  return text.split("").map((ch, k) =>
    ch === " " ? <span key={k} className="sp" /> : <span key={k} className="ch" style={{ "--i": i++ } as CSSProperties}>{ch}</span>,
  );
}

export function Heat() {
  const { openProduct } = useShop();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const section = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const title = useRef<HTMLHeadingElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLButtonElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    let radius = 0;
    let fittedFor = "";

    // same card spacing as the KERB original
    const layout = () => {
      radius = (ring.current!.offsetWidth / 2 / Math.tan(Math.PI / N)) * 1.1;
      cards.current.forEach((c, i) => c && (c.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`));
    };

    // Keep "Shop this pair" clear of the progress bar. One name size per window (no jumping between
    // shoes): the largest size at which the longest name fits the width and the button stays 24px above the bar.
    const fit = (force = false) => {
      const key = innerWidth + "x" + innerHeight;
      if (!force && key === fittedFor) return;
      fittedFor = key;
      const t = title.current!, pr = probe.current!, b = cta.current!;
      t.style.fontSize = pr.style.fontSize = "";
      const fs = parseFloat(getComputedStyle(t).fontSize);
      // layout position (offsetTop), not getBoundingClientRect: the button slides in with a transform
      const ctaBottom = b.parentElement!.getBoundingClientRect().top + b.offsetTop + b.offsetHeight;
      const overflowY = ctaBottom - (foot.current!.getBoundingClientRect().top - 24);
      const byY = overflowY > 0 ? fs - overflowY / 0.82 - 2 : fs;
      const byX = (fs * (innerWidth * 0.92)) / Math.max(pr.scrollWidth, 1);
      const size = Math.max(32, Math.min(fs, byY, byX));
      if (size < fs) t.style.fontSize = size + "px";
    };

    const update = (self: ScrollTrigger) => {
      const p = self.progress;
      const angle = p * STEP * (N - 1);
      ring.current!.style.transform = `translateZ(${-radius}px) rotateX(-6deg) rotateY(${-angle}deg)`;

      // the light behind the ring takes the colour of the pair in front
      const f = angle / STEP;
      const a = Math.floor(f), b = Math.min(a + 1, N - 1), t = f - a;
      const c = RING_RGB[a].map((v, k) => Math.round(lerp(v, RING_RGB[b][k], ease(t))));
      sticky.current!.style.setProperty("--theme", `rgb(${c.join(",")})`);

      cards.current.forEach((card, i) => {
        const d = ((((i * STEP - angle) % 360) + 540) % 360) - 180;
        card?.classList.toggle("is-back", Math.abs(d) > 95);
      });

      const idx = Math.round(f);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      sticky.current!.classList.toggle("is-turning", self.scroll() > self.start + 30 || p > 0.005);
      bar.current!.style.transform = `scaleX(${p})`;
      pct.current!.textContent = String(Math.round(p * 100)).padStart(3, "0") + "%";
    };

    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: update,
      onRefresh: (self) => {
        layout();
        fit(true);
        update(self);
      },
    });
    layout();
    fit(true);
    update(st);
    document.fonts?.ready.then(() => {
      fit(true);
      ScrollTrigger.refresh();
    });
  });

  const cur = RING[active];

  return (
    <section id="heat" ref={section} className="ring-section">
      <div className="ring-sticky" ref={sticky}>
        <div className="ring-bg" />
        <div className="specks" aria-hidden="true">
          {SPECKS.map((s, i) => (
            <i
              key={i}
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, "--d": `${s.d}s`, "--dl": `${s.dl}s` } as CSSProperties}
            />
          ))}
        </div>

        <div className="ring-meta ring-meta--left">
          <span>01 · THE HEAT</span>
          <span className="dim">8 PAIRS · ONE RING</span>
        </div>
        <div className="ring-meta ring-meta--right">
          <span>25.20° N · 55.27° E</span>
          <span>SCROLL TO TURN ↓</span>
        </div>

        <div className="ghost" aria-hidden="true">
          {"FAIRFAX".split("").map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>

        <div className="stage">
          <div className="carousel" ref={ring}>
            {RING.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className="card"
                aria-label={`Shop ${p.short}, ${money(p.from)}`}
                style={{ "--c": p.color, animationDelay: `${0.25 + i * 0.07}s` } as CSSProperties}
                onClick={() => openProduct(p.id)}
                ref={(el) => {
                  cards.current[i] = el;
                }}
              >
                <div className="card-in">
                  <div className="card-face">
                    <img src={imgOf(p)} alt="" draggable={false} />
                    <span className="card-hint">
                      SHOP · {money(p.from)}
                      <i>→</i>
                    </span>
                  </div>
                  <i className="card-edge" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="ring-info">
          <div className="ring-count">
            {pad(active + 1)} / {N} · {cur.brand}
          </div>
          <h1 className="ring-title in" ref={title} aria-live="polite">
            <Fragment key={active}>
              <Chars text={cur.short.toUpperCase()} />
            </Fragment>
          </h1>
          <button className="pill-cta" ref={cta} type="button" onClick={() => openProduct(RING[activeRef.current].id)}>
            <span className="pill-price">{money(cur.from)}</span>
            <span className="pill-label">SHOP THIS PAIR</span>
            <span className="pill-arrow">→</span>
          </button>
          {/* measures the longest name, to size the title once per window */}
          <div
            className="ring-title"
            aria-hidden="true"
            ref={probe}
            style={{ position: "absolute", visibility: "hidden", left: 0, top: 0, width: "auto" }}
          >
            {LONGEST}
          </div>
        </div>

        <div className="ring-foot" ref={foot}>
          <span>STRAIGHT HEAT FROM THE STREETS</span>
          <div className="ring-progress">
            <i ref={bar} />
          </div>
          <span ref={pct}>000%</span>
        </div>
      </div>
    </section>
  );
}
