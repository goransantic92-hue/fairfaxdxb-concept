"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import type { Filter } from "@/lib/products";
import { replayClass } from "@/lib/motion";
import { useScroll } from "./SmoothScroll";
import { useShop } from "./ShopProvider";

/** In-page link that smooth-scrolls (and can set the shop filter on the way). */
export function ScrollLink({ href, filter, onClick, ...rest }: ComponentProps<"a"> & { href: `#${string}`; filter?: Filter }) {
  const { scrollTo } = useScroll();
  const { setFilter } = useShop();
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        e.preventDefault();
        if (filter) setFilter(filter);
        scrollTo(href);
        history.replaceState(null, "", href);
      }}
      {...rest}
    />
  );
}

/** Bag item count; pops whenever the bag changes. */
export function BagCount() {
  const { qty, bump } = useShop();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (bump) replayClass(ref.current, "pop");
  }, [bump]);
  return (
    <span ref={ref} className="bag-count">
      {qty}
    </span>
  );
}

/** Email sign-up pill (demo: nothing is sent). */
export function MailForm({ tone, cta, doneLabel }: { tone: "lime" | "orange"; cta: string; doneLabel: string }) {
  const [done, setDone] = useState(false);
  const [value, setValue] = useState("");
  const btn =
    tone === "lime"
      ? "bg-lime text-[#04150a] hover:shadow-[0_8px_30px_rgba(57,255,106,.35)]"
      : "bg-orange text-[#1a0700] hover:shadow-[0_8px_30px_rgba(255,90,18,.4)]";
  return (
    <form
      className="flex w-[min(380px,100%)] items-center gap-1.5 rounded-full border border-white/12 bg-white/6 py-[5px] pr-[5px] pl-[18px] [transition:border-color_.3s,background_.3s] focus-within:border-white/35 focus-within:bg-white/9"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
        setValue("");
      }}
    >
      <input
        type="email"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={done ? "See you Friday." : "you@email.com"}
        aria-label="Email"
        className="min-w-0 flex-1 border-0 bg-transparent font-display text-[14px] font-medium text-ink outline-none [font-stretch:100%] placeholder:text-[rgba(244,241,234,.4)]"
      />
      <button
        type="submit"
        className={`whitespace-nowrap rounded-full px-[18px] py-3 text-[13px] font-bold [font-stretch:100%] [transition:translate_.3s_var(--ease),box-shadow_.3s] hover:-translate-y-px ${done ? "bg-ink text-black" : btn}`}
      >
        {done ? doneLabel : cta}
      </button>
    </form>
  );
}
