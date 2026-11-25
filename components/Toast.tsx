"use client";

import { useEffect, useState } from "react";
import { useShop } from "./ShopProvider";

export function Toast() {
  const { toast } = useShop();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed top-[62px] right-[var(--gutter)] z-60 rounded-[10px] border border-white/12 bg-[rgba(10,14,36,.85)] px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[.08em] backdrop-blur-[12px] [transition:opacity_.35s,translate_.45s_var(--ease)] [&_b]:text-lime ${show ? "translate-y-0 opacity-100" : "-translate-y-2.5 opacity-0"}`}
    >
      {toast?.node}
    </div>
  );
}
