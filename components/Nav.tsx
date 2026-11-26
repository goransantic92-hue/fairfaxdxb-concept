"use client";

import { useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import { useShop } from "./ShopProvider";
import { BagCount, ScrollLink } from "./ui";

const LINKS = [
  ["heat", "HEAT"],
  ["story", "STORY"],
  ["street", "STREETS"],
  ["legit", "LEGIT CHECK"],
  ["next", "NEXT"],
  ["shop", "SHOP"],
] as const;

export function Nav() {
  const { openBag } = useShop();
  const [active, setActive] = useState("heat");

  // the link of whichever section crosses the middle of the screen is lit
  useGSAP(() => {
    [...LINKS.map(([id]) => id), "footer"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(id === "footer" ? "shop" : id),
      });
    });
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center bg-linear-to-b from-[rgba(4,6,15,.55)] to-[rgba(4,6,15,0)] px-[var(--gutter)] py-[18px] font-mono text-[11px] uppercase tracking-[.08em] animate-[kr-fadein_1s_.2s_var(--ease)_both] max-[860.98px]:grid-cols-[1fr_1fr] max-[860.98px]:bg-[rgba(4,6,15,.72)] max-[860.98px]:backdrop-blur-md max-[860.98px]:py-3.5">
      <ScrollLink
        href="#heat"
        className="inline-flex items-baseline gap-2 justify-self-start font-display text-[22px] font-black tracking-[-.02em] [font-stretch:75%]"
      >
        FAIRFAX<small className="font-mono text-[9px] font-semibold tracking-[.14em] text-lime">DXB CONCEPT</small>
      </ScrollLink>

      <nav className="flex gap-3.5 max-[860.98px]:hidden">
        {LINKS.map(([id, label]) => {
          const on = active === id;
          return (
            <ScrollLink
              key={id}
              href={`#${id}`}
              aria-current={on ? "true" : undefined}
              className={`whitespace-nowrap transition-colors duration-300 hover:text-ink ${on ? "font-bold text-ink" : "font-medium text-[rgba(244,241,234,.5)]"}`}
            >
              <span className={`transition-opacity duration-300 ${on ? "opacity-100" : "opacity-55"}`}>[</span> {label}{" "}
              <span className={`transition-opacity duration-300 ${on ? "opacity-100" : "opacity-55"}`}>]</span>
            </ScrollLink>
          );
        })}
      </nav>

      <button
        type="button"
        aria-label="Bag"
        onClick={openBag}
        className="inline-flex items-center gap-1.5 justify-self-end text-[11px] font-bold tracking-[.08em]"
      >
        <span className="opacity-55">[</span> BAG <BagCount /> <span className="opacity-55">]</span>
      </button>
    </header>
  );
}
