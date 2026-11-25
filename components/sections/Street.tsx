"use client";

import { useRef, useState, type CSSProperties } from "react";
import { ScrollTrigger, clamp, ease, lerp, useGSAP } from "@/lib/motion";

const SLIDES = [
  { src: "/img/ffx-street-1.jpg", pos: "55% 50%", alt: "Fragment x Travis Scott Jordan 1s hanging by their laces at Fairfax" },
  { src: "/img/ffx-street-2.jpg", pos: "30% 50%", alt: "A pair of Jordan 1 Highs hanging in front of the Fairfax lettering" },
  { src: "/img/ffx-street-3.jpg", pos: "50% 50%", alt: "A Jordan 1 High on a rail in the dark" },
  { src: "/img/ffx-street-4.jpg", pos: "60% 50%", alt: "A pair of Yeezy Boost 350 V2 Bone in the dark" },
];

const CAPTIONS: [string, string[]][] = [
  ["01 / 4 — FRAGMENT × TRAVIS SCOTT · ON THE HOOK", ["GRAILS ARE", "MEANT TO BE", "WORN."]],
  ["02 / 4 — AIR JORDAN 1 HIGH · THE FAIRFAX WALL", ["STRAIGHT HEAT", "FROM THE", "STREETS."]],
  ["03 / 4 — AIR JORDAN 1 HIGH · AFTER DARK", ["DUBAI NEVER", "SLEEPS. NEITHER", "DO WE."]],
  ["04 / 4 — YEEZY BOOST 350 V2 · BONE", ["IF IT'S ON", "THE WALL, IT'S", "THE REAL THING."]],
];

/** share of the scroll spent opening the card to full screen */
const INTRO = 0.16;

export function Street() {
  const [cap, setCap] = useState(0);
  const capRef = useRef(0);
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const shade = useRef<HTMLDivElement>(null);
  const otL = useRef<HTMLSpanElement>(null);
  const otR = useRef<HTMLSpanElement>(null);
  const caption = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const render = (self: ScrollTrigger) => {
      const p = self.progress;
      const vw = innerWidth, vh = innerHeight;
      const e = ease(clamp(p / INTRO));

      // the card opens from a centred portrait to the full screen
      const cardW = Math.min(vw * 0.3, vh * 0.56);
      const cardH = vh * 0.74;
      const cx = ((vw - cardW) / 2) * (1 - e);
      const ct = ((vh - cardH) / 2) * (1 - e);
      const f = frame.current!;
      f.style.setProperty("--cx", cx + "px");
      f.style.setProperty("--ct", ct + "px");
      f.style.setProperty("--cb", ct + "px");
      f.style.setProperty("--cr", 14 * (1 - e) + "px");
      shade.current!.style.setProperty("--shade", String(e));

      // OUT / THERE part to let it through
      const push = e * vw * 0.32;
      otL.current!.style.transform = `translateX(${-push - 60}px)`;
      otR.current!.style.transform = `translateX(${push + 60}px)`;
      otL.current!.style.opacity = otR.current!.style.opacity = String(1 - e);

      // then each photo wipes up over the last
      const s = clamp((p - INTRO) / (1 - INTRO)) * CAPTIONS.length;
      let idx = 0;
      slides.current.forEach((sl, k) => {
        if (!sl) return;
        const img = sl.firstElementChild as HTMLElement;
        if (k === 0) {
          img.style.setProperty("--s", String(lerp(1.22, 1.04, e) - clamp(s) * 0.04));
          return;
        }
        const t = clamp((s - k + 0.45) / 0.55);
        const te = ease(t);
        sl.style.setProperty("--reveal", (1 - te) * 100 + "%");
        img.style.setProperty("--s", String(lerp(1.25, 1.02, te)));
        img.style.setProperty("--py", (1 - te) * 6 + "vh");
        if (t > 0.5) idx = k;
      });
      if (idx !== capRef.current) {
        capRef.current = idx;
        setCap(idx);
      }
      caption.current!.classList.toggle("on", e > 0.92);
    };
    const st = ScrollTrigger.create({ trigger: section.current, start: "top top", end: "bottom bottom", onUpdate: render, onRefresh: render });
    render(st);
  });

  const [meta, lines] = CAPTIONS[cap];

  return (
    <section id="street" ref={section} className="seam street">
      <div className="street-sticky">
        <div className="sec-head sec-head--over">
          <span>03 · STRAIGHT FROM THE WALL</span>
          <span>SHOT AT FAIRFAX · DUBAI</span>
        </div>

        <div className="out-there">
          <span className="ot ot-l" ref={otL}>OUT</span>
          <span className="ot ot-r txt-outline" ref={otR}>THERE</span>
        </div>

        <div className="street-frame" ref={frame}>
          {SLIDES.map((s, i) => (
            <figure key={s.src} className="slide" style={{ "--i": i } as CSSProperties} ref={(el) => { slides.current[i] = el; }}>
              <img src={s.src} alt={s.alt} style={{ objectPosition: s.pos }} />
            </figure>
          ))}
          <div className="street-shade" ref={shade} />
        </div>

        <div className="street-caption" ref={caption}>
          <div className="cap-meta">{meta}</div>
          <h2 className="cap-title swap" key={cap}>
            {lines.map((l) => (
              <span className="ln" key={l}>
                <span>{l}</span>
              </span>
            ))}
          </h2>
        </div>
        <div className="street-scroll">SCROLL ↓</div>
      </div>
    </section>
  );
}
