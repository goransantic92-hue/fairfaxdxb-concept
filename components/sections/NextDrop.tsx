"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, lerp, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { nextDrop, splitTime } from "@/lib/countdown";
import { MailForm } from "../ui";

const UNITS = [
  ["d", "DAYS"],
  ["h", "HRS"],
  ["m", "MIN"],
  ["s", "SEC"],
] as const;

function Countdown() {
  // null on the server: the clock only exists in the browser
  const [left, setLeft] = useState<ReturnType<typeof splitTime> | null>(null);
  useEffect(() => {
    let dropAt = nextDrop();
    const tick = () => {
      let ms = dropAt - Date.now();
      if (ms <= 0) {
        dropAt = nextDrop();
        ms = dropAt - Date.now();
      }
      setLeft(splitTime(ms));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="countdown">
      {UNITS.map(([u, label]) => (
        <div key={u} className="cd kr-corners">
          <b>{String(left ? left[u] : 0).padStart(2, "0")}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function NextDrop() {
  const room = useRef<HTMLDivElement>(null);
  const lit = useRef<HTMLImageElement>(null);
  const torch = useRef({ active: false, x: 0, y: 0, idle: 0 as ReturnType<typeof setTimeout> | 0 });

  const setTorch = (x: number, y: number) => {
    const r = room.current!, img = lit.current!;
    r.style.setProperty("--x", x + "px");
    r.style.setProperty("--y", y + "px");
    // the same point, in the (scaled) image's own box for its mask
    const rr = r.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    const sx = img.offsetWidth / ir.width || 1;
    r.style.setProperty("--ix", (x + rr.left - ir.left) * sx + "px");
    r.style.setProperty("--iy", (y + rr.top - ir.top) * sx + "px");
    r.style.setProperty("--r", 150 * sx + "px");
  };

  // when nobody is holding the light, it drifts over the shoe by itself
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const drift = (time: number) => {
      const t = torch.current;
      if (t.active || !room.current) return;
      const r = room.current.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const x = r.width * (0.5 + Math.sin(time * 0.7) * 0.28);
      const y = r.height * (0.5 + Math.sin(time * 1.1 + 1) * 0.2);
      t.x = lerp(t.x || x, x, 0.08);
      t.y = lerp(t.y || y, y, 0.08);
      setTorch(t.x, t.y);
    };
    gsap.ticker.add(drift);
    return () => gsap.ticker.remove(drift);
  });

  return (
    <section id="next" className="seam next">
      <div className="sec-head">
        <span>05 · NEXT DROP</span>
        <span>CLASSIFIED · FRIDAY 20:00 DUBAI</span>
      </div>
      <div className="next-head">
        <h2 className="next-title">
          <span>DROP 09.</span> <span className="txt-outline">CLASSIFIED.</span>
        </h2>
        <p className="next-sub">MOVE YOUR LIGHT OVER IT</p>
      </div>

      <div
        className="torch-room"
        ref={room}
        onPointerMove={(e) => {
          const t = torch.current;
          const r = room.current!.getBoundingClientRect();
          t.x = e.clientX - r.left;
          t.y = e.clientY - r.top;
          setTorch(t.x, t.y);
          t.active = true;
          if (t.idle) clearTimeout(t.idle);
          t.idle = setTimeout(() => (t.active = false), 2500);
        }}
        onPointerLeave={() => (torch.current.active = false)}
      >
        <img className="torch-base" src="/img/redcement2.webp" alt="" aria-hidden="true" />
        <img className="torch-lit" ref={lit} src="/img/redcement2.webp" alt="Silhouette of the next Fairfax drop" />
        <div className="reticle">
          <i />
        </div>
      </div>

      <div className="next-foot">
        <Countdown />
        <MailForm tone="lime" cta="Notify me" doneLabel="You're on the list" />
      </div>
    </section>
  );
}
