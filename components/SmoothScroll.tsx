"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

type Target = number | string | HTMLElement;

interface ScrollApi {
  /** Smooth-scroll to a y position, an element, or a "#section" hash. */
  scrollTo: (target: Target) => void;
  /** Freeze page scroll while an overlay (product view, bag) is open. */
  setLocked: (on: boolean) => void;
}

const ScrollCtx = createContext<ScrollApi | null>(null);

export function useScroll() {
  const ctx = useContext(ScrollCtx);
  if (!ctx) throw new Error("useScroll must be used inside <SmoothScroll>");
  return ctx;
}

/** Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger and Lenis share one clock. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // honour deep links (#legit, #shop…) once layout settles
  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id || id === "heat") return;
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) window.scrollTo(0, el.offsetTop);
    }, 60);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = useCallback((target: Target) => {
    let dest: number | HTMLElement | null;
    if (typeof target === "string") dest = target === "#heat" ? 0 : document.getElementById(target.replace(/^#/, ""));
    else dest = target;
    if (dest === null) return;
    const l = lenis.current;
    if (l) l.scrollTo(dest, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else if (typeof dest === "number") window.scrollTo({ top: dest, behavior: "smooth" });
    else dest.scrollIntoView({ behavior: "smooth" });
  }, []);

  const setLocked = useCallback((on: boolean) => {
    document.documentElement.classList.toggle("is-locked", on);
    const l = lenis.current;
    if (l) {
      if (on) l.stop();
      else l.start();
    }
  }, []);

  const api = useMemo(() => ({ scrollTo, setLocked }), [scrollTo, setLocked]);
  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>;
}
