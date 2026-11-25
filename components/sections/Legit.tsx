"use client";

import { useRef, type CSSProperties } from "react";
import { FRAGMENT, money } from "@/lib/products";
import { ScrollTrigger, clamp, ease, useGSAP } from "@/lib/motion";
import { useShop } from "../ShopProvider";

// callouts on the 1264 x 848 stage: line path, dot (x, y), label (x, y), label side
const CHECKS = [
  { title: "Reverse Swoosh", text: "Flipped black Swoosh — Travis Scott's signature.", path: "M757 716 H706 V530", dot: [706, 530], label: [760, 690], right: false },
  { title: "Wings logo", text: "Debossed on the military blue collar.", path: "M997 268 H852 V356", dot: [852, 356], label: [1000, 222], right: false },
  { title: "Military blue leather", text: "Tumbled overlays at the heel and toe.", path: "M997 503 H948", dot: [948, 503], label: [1000, 468], right: false },
  { title: "Sail midsole", text: "Pre-aged for a vintage finish.", path: "M523 716 H596 V584", dot: [596, 584], label: [520, 690], right: true },
  { title: "Checked in Dubai", text: "Stitching, box and label inspected.", path: "M236 539 H354", dot: [354, 539], label: [232, 500], right: true },
];
/** the beam's x (as a share of the shoe width) at which each check is found: swoosh, wings, heel, midsole, toe */
const FOUND_AT = [0.6, 0.8, 0.93, 0.45, 0.12];

const at = ([x, y]: number[]) => ({ "--x": x, "--y": y }) as CSSProperties;

export function Legit() {
  const { openProduct } = useShop();
  const section = useRef<HTMLElement>(null);
  const scan = useRef<HTMLDivElement>(null);
  const shoe = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLElement>(null);
  const verified = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const marks = [...scan.current!.querySelectorAll<HTMLElement | SVGPathElement>("[data-i]")];
    const render = (self: ScrollTrigger) => {
      const p = self.progress;
      shoe.current!.style.setProperty("--in", String(ease(clamp(p / 0.18))));
      // the beam sweeps left → right; each check lights up as it passes
      const sweep = clamp((p - 0.18) / 0.42);
      beam.current!.style.setProperty("--bx", String(sweep));
      beam.current!.classList.toggle("on", p > 0.17 && p < 0.64);
      marks.forEach((m) => m.classList.toggle("on", sweep >= FOUND_AT[Number(m.dataset.i)]));
      verified.current!.classList.toggle("on", p > 0.66);
      scan.current!.classList.toggle("is-verified", p > 0.66);
      cta.current!.classList.toggle("on", p > 0.72);
    };
    const st = ScrollTrigger.create({ trigger: section.current, start: "top top", end: "bottom bottom", onUpdate: render, onRefresh: render });
    render(st);
  });

  return (
    <section id="legit" ref={section} className="seam anatomy legit">
      <div className="anatomy-sticky">
        <div className="sec-head">
          <span>04 · THE GRAIL · FRAGMENT x TRAVIS SCOTT</span>
          <span>5 CHECKS · EVERY PAIR</span>
        </div>

        <div className="anatomy-copy">
          <h2 className="big-title">
            <span>LEGIT.</span>
            <span className="txt-outline">CHECKED.</span>
          </h2>
          <p>Every pair is inspected by hand in Dubai before it ships. Scroll the scan.</p>
        </div>

        <div className="anatomy-glow" />

        <div className="exploded scan" ref={scan} aria-label="Jordan 1 High OG SP Fragment x Travis Scott with five authentication checks">
          <div className="scan-shoe" ref={shoe}>
            <img src="/img/fragment.webp" alt="Jordan 1 High OG SP Fragment x Travis Scott" />
            <i className="scan-beam" ref={beam} />
          </div>

          <svg className="xlines" viewBox="0 0 1264 848" preserveAspectRatio="none" aria-hidden="true">
            {CHECKS.map((c, i) => (
              <path key={i} data-i={i} d={c.path} />
            ))}
          </svg>
          {CHECKS.map((c, i) => (
            <i key={i} className="xdot" data-i={i} style={at(c.dot)} />
          ))}
          {CHECKS.map((c, i) => (
            <div key={i} className={`xlabel${c.right ? " is-r" : ""}`} data-i={i} style={at(c.label)}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <strong>{c.title}</strong>
              <span>{c.text}</span>
            </div>
          ))}

          <div className="verified" ref={verified}>
            <span>✓</span> VERIFIED AUTHENTIC
          </div>
        </div>

        <ol className="parts-legend" aria-label="Checks">
          {CHECKS.map((c, i) => (
            <li key={i}>
              <b>{String(i + 1).padStart(2, "0")}</b> {c.title}
            </li>
          ))}
        </ol>

        <button className="pill-cta anatomy-cta" ref={cta} type="button" onClick={() => openProduct(FRAGMENT.id)}>
          <span className="pill-label">Shop the grail · {money(FRAGMENT.from)}</span>
          <span className="pill-arrow">→</span>
        </button>
      </div>
    </section>
  );
}
