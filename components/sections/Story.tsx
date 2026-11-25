"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import { ScrollTrigger, clamp, useGSAP } from "@/lib/motion";

type Token = { w: string; tone?: "grad" | "hot" | "lime" } | { chip: string; c: string };

const MANIFESTO: Token[] = [
  { w: "STRAIGHT" }, { w: "HEAT" }, { chip: "phantom", c: "#4b4f63" },
  { w: "FROM" }, { w: "THE" }, { w: "STREETS" }, { w: "OF" }, { w: "DUBAI.", tone: "grad" }, { chip: "guava", c: "#ff8fb1" },
  { w: "NO" }, { w: "FAKES,", tone: "hot" }, { w: "NO" }, { w: "FILLERS." }, { chip: "bearbrick", c: "#ff6ec7" },
  { w: "JUST" }, { w: "GRAILS,", tone: "lime" }, { w: "CHECKED" }, { w: "BY" }, { w: "HAND" }, { chip: "redcement", c: "#e63323" },
  { w: "AND" }, { w: "SHIPPED" }, { w: "ACROSS" }, { w: "THE" }, { w: "UAE." },
];

export function Story() {
  const section = useRef<HTMLElement>(null);
  const items = useRef<(HTMLSpanElement | null)[]>([]);
  const bar = useRef<HTMLElement>(null);

  useGSAP(() => {
    const n = MANIFESTO.length;
    const light = (self: ScrollTrigger) => {
      const lit = clamp((self.progress - 0.08) / 0.72) * n;
      items.current.forEach((el, i) => el?.classList.toggle("on", i < lit));
    };
    // words light up from when the section's top reaches 35% of the screen until it scrolls out
    ScrollTrigger.create({ trigger: section.current, start: "top 35%", end: "bottom bottom", onUpdate: light, onRefresh: light });
    const rule = (self: ScrollTrigger) => (bar.current!.style.transform = `scaleX(${self.progress})`);
    ScrollTrigger.create({ trigger: section.current, start: "top top", end: "bottom bottom", onUpdate: rule, onRefresh: rule });
  });

  return (
    <section id="story" ref={section} className="seam story">
      <div className="story-sticky">
        <div className="sec-head">
          <span>02 · THE STORY</span>
          <span>AUTHENTIC ONLY · DUBAI, UAE</span>
        </div>
        <p className="manifesto">
          {MANIFESTO.map((t, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              {"w" in t ? (
                <span className={`w${t.tone ? " " + t.tone : ""}`} ref={(el) => { items.current[i] = el; }}>
                  {t.w}
                </span>
              ) : (
                <span className="chip" style={{ "--c": t.c } as CSSProperties} ref={(el) => { items.current[i] = el; }}>
                  <img src={`/img/${t.chip}.webp`} alt="" />
                </span>
              )}
            </Fragment>
          ))}
        </p>
        <div className="story-rule">
          <i ref={bar} />
        </div>
      </div>
    </section>
  );
}
