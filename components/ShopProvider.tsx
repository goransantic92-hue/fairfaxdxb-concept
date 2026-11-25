"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { byId, priceOf, sizeText, type Filter } from "@/lib/products";
import { useScroll } from "./SmoothScroll";

export interface BagLine {
  id: string;
  size: string;
  qty: number;
}

interface ShopApi {
  bag: BagLine[];
  qty: number;
  subtotal: number;
  /** increments whenever the bag changes from a user action (drives the count "pop") */
  bump: number;
  addToBag: (id: string, size: string) => boolean;
  removeLine: (id: string, size: string) => void;
  clearBag: () => void;

  pdpId: string | null;
  pdpOpen: boolean;
  /** increments on every openProduct call, so re-opening the same product still swaps */
  pdpNonce: number;
  openProduct: (id: string) => void;
  closeProduct: () => void;

  drawerOpen: boolean;
  openBag: () => void;
  closeBag: () => void;

  filter: Filter;
  setFilter: (f: Filter) => void;

  toast: { node: ReactNode; n: number } | null;
  showToast: (node: ReactNode) => void;
}

const ShopCtx = createContext<ShopApi | null>(null);

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}

const STORAGE_KEY = "ffx-bag";

export function ShopProvider({ children }: { children: ReactNode }) {
  const { setLocked } = useScroll();
  const [bag, setBag] = useState<BagLine[]>([]);
  const bagRef = useRef<BagLine[]>([]);
  const [bump, setBump] = useState(0);
  const [pdp, setPdp] = useState<{ id: string | null; open: boolean; nonce: number }>({ id: null, open: false, nonce: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [toast, setToast] = useState<{ node: ReactNode; n: number } | null>(null);

  const commit = useCallback((next: BagLine[], userAction = true) => {
    bagRef.current = next;
    setBag(next);
    if (userAction) setBump((n) => n + 1);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode: the bag just won't persist */
    }
  }, []);

  // the bag persists in this browser
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as BagLine[];
      const valid = saved.filter((l) => byId[l.id]);
      bagRef.current = valid;
      setBag(valid);
    } catch {
      /* ignore a corrupt or blocked store */
    }
  }, []);

  const showToast = useCallback((node: ReactNode) => setToast((t) => ({ node, n: (t?.n ?? 0) + 1 })), []);

  const addToBag = useCallback(
    (id: string, size: string) => {
      const p = byId[id];
      // resale stock is one pair per size
      if (bagRef.current.some((l) => l.id === id && l.size === size)) {
        showToast(<><b>{p.short}</b> · {sizeText(p, size)} is already in your bag</>);
        return false;
      }
      commit([...bagRef.current, { id, size, qty: 1 }]);
      showToast(<>Added <b>{p.short}</b> · {sizeText(p, size)}</>);
      return true;
    },
    [commit, showToast],
  );
  const removeLine = useCallback(
    (id: string, size: string) => commit(bagRef.current.filter((l) => !(l.id === id && l.size === size))),
    [commit],
  );
  const clearBag = useCallback(() => commit([]), [commit]);

  const openProduct = useCallback((id: string) => {
    if (!byId[id]) return;
    setPdp((s) => ({ id, open: true, nonce: s.nonce + 1 }));
  }, []);
  const closeProduct = useCallback(() => setPdp((s) => ({ ...s, open: false })), []);
  const openBag = useCallback(() => setDrawerOpen(true), []);
  const closeBag = useCallback(() => setDrawerOpen(false), []);

  // overlays freeze the page underneath
  useEffect(() => setLocked(pdp.open || drawerOpen), [pdp.open, drawerOpen, setLocked]);

  const api = useMemo<ShopApi>(() => {
    const qty = bag.reduce((s, l) => s + l.qty, 0);
    const subtotal = bag.reduce((s, l) => s + priceOf(l.id, l.size) * l.qty, 0);
    return {
      bag, qty, subtotal, bump, addToBag, removeLine, clearBag,
      pdpId: pdp.id, pdpOpen: pdp.open, pdpNonce: pdp.nonce, openProduct, closeProduct,
      drawerOpen, openBag, closeBag,
      filter, setFilter,
      toast, showToast,
    };
  }, [bag, bump, addToBag, removeLine, clearBag, pdp, openProduct, closeProduct, drawerOpen, openBag, closeBag, filter, toast, showToast]);

  return <ShopCtx.Provider value={api}>{children}</ShopCtx.Provider>;
}
