"use client";

import { useRef, useState, type CSSProperties } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import { MailForm, ScrollLink } from "./ui";

const MARQUEE = "STRAIGHT HEAT FROM THE STREETS ✦ 100% AUTHENTIC ✦ DELIVERY ACROSS THE UAE ✦ JORDAN · YEEZY · NIKE · KAWS · BEARBRICK ✦ ";
const SHOES = [
  ["kaws", "-4deg"],
  ["guava", "3deg"],
  ["satin", "-3deg"],
  ["bearbrick", "5deg"],
] as const;

const head = "m-0 mb-4 text-[11px] font-medium text-dim";
const link =
  "relative block w-fit py-1 after:absolute after:inset-x-0 after:bottom-[2px] after:h-px after:origin-right after:scale-x-0 after:bg-current after:[transition:scale_.45s_var(--ease)] hover:after:origin-left hover:after:scale-x-100";

export function Footer() {
  const word = useRef<HTMLDivElement>(null);
  const [risen, setRisen] = useState(false);

  // the big FAIRFAX rises once a quarter of it is on screen
  useGSAP(() => {
    ScrollTrigger.create({ trigger: word.current, start: "25% bottom", once: true, onEnter: () => setRisen(true) });
  });

  return (
    <footer id="footer" className="relative overflow-hidden bg-abyss">
      <div aria-hidden="true" className="overflow-hidden whitespace-nowrap border-y border-white/8 py-3.5 font-mono text-[12px] uppercase tracking-[.08em] text-dim">
        <div className="inline-flex animate-[kr-marquee_28s_linear_infinite]">
          <span>{MARQUEE}</span>
          <span>{MARQUEE}</span>
        </div>
      </div>

      <div className="grid grid-cols-[1.1fr_1fr] gap-[60px] px-[var(--gutter)] pt-[90px] pb-10 max-[860.98px]:grid-cols-1">
        <div>
          <div className="mb-3.5 font-mono text-[11px] uppercase tracking-[.08em] text-dim">07 · FIRST ON THE WALL</div>
          <p className="m-0 mb-[30px] max-w-[13em] text-[clamp(28px,3.4vw,50px)] font-bold leading-[1.05] tracking-[-.02em] [font-stretch:100%]">
            New heat lands every week. Get the drop before Dubai does.
          </p>
          <MailForm tone="orange" cta="Sign me up" doneLabel="You're in" />
        </div>
        <div className="grid grid-cols-3 gap-5 font-mono text-[11px] uppercase tracking-[.08em] max-[600.98px]:grid-cols-2">
          <div>
            <h4 className={head}>SHOP</h4>
            <ScrollLink href="#shop" filter="SNEAKERS" className={link}>SNEAKERS</ScrollLink>
            <ScrollLink href="#shop" filter="STREETWEAR" className={link}>STREETWEAR</ScrollLink>
            <ScrollLink href="#shop" filter="COLLECTIBLES" className={link}>COLLECTIBLES</ScrollLink>
            <ScrollLink href="#shop" filter="ACCESSORIES" className={link}>ACCESSORIES</ScrollLink>
          </div>
          <div>
            <h4 className={head}>HELP</h4>
            <ScrollLink href="#legit" className={link}>AUTHENTICITY</ScrollLink>
            <a href="#" className={link}>UAE DELIVERY</a>
            <a href="#" className={link}>RETURNS</a>
            <a href="https://wa.me/971555239130" target="_blank" rel="noopener" className={link}>WHATSAPP</a>
          </div>
          <div>
            <h4 className={head}>STORE</h4>
            <span className="block py-1">DUBAI</span>
            <span className="block py-1">UNITED ARAB EMIRATES</span>
            <a href="https://www.instagram.com/fairfaxdxb/" target="_blank" rel="noopener" className={link}>INSTAGRAM</a>
            <a href="https://www.tiktok.com/@fairfaxdxb" target="_blank" rel="noopener" className={link}>TIKTOK</a>
          </div>
        </div>
      </div>

      <div className="relative mt-10 px-[var(--gutter)]">
        <div className="relative z-2 -mb-[2.2vw] flex items-end justify-around px-[4%]">
          {SHOES.map(([id, r]) => (
            <img
              key={id}
              src={`/img/${id}.webp`}
              alt=""
              style={{ "--r": r } as CSSProperties}
              className="h-[clamp(70px,10vw,160px)] w-auto object-contain [filter:drop-shadow(0_18px_16px_rgba(0,0,0,.55))] [transform:rotate(var(--r))] [transition:transform_.6s_var(--ease)] hover:[transform:translateY(-14px)_rotate(0deg)_scale(1.05)] max-[700.98px]:h-[14vw]"
            />
          ))}
        </div>
        <div aria-label="FAIRFAX" className="flex select-none justify-between text-[18.6vw] font-black leading-[.78] tracking-[-.02em] text-ink [font-stretch:75%]">
          {"FAIRFAX".split("").map((l, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block [transition:transform_1.2s_var(--ease)]"
              style={{ transform: `translateY(${risen ? 0 : 40}%)`, transitionDelay: risen ? `${i * 0.07}s` : undefined }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-[3vw] flex flex-wrap justify-between gap-3 border-t border-white/8 px-[var(--gutter)] pt-7 pb-[26px] font-mono text-[10px] uppercase tracking-[.08em] text-dim">
        <span>© 2026 FAIRFAX DXB</span>
        <span>UNOFFICIAL CONCEPT REDESIGN · NOT AFFILIATED WITH FAIRFAX DXB · NO ORDERS ARE PROCESSED</span>
        <span>EST. DUBAI — UAE</span>
      </div>
    </footer>
  );
}
