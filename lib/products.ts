/* Catalogue taken from fairfaxdxb.com: names, AED prices per size, sizes in stock. */

/** [size, price in AED, in stock (1) or sold out (0)] */
export type Variant = readonly [size: string, price: number, inStock: 0 | 1];
export type Category = "SNEAKERS" | "STREETWEAR" | "COLLECTIBLES" | "ACCESSORIES";

interface ProductInput {
  id: string;
  name: string;
  short: string;
  brand: string;
  cat: Category;
  color: string;
  accent?: string;
  ar: string;
  /** a second photo, shown by the PDP's second view button */
  img2?: string;
  label?: string;
  grail?: boolean;
  v: Variant[];
}

export interface Product extends ProductInput {
  label: string;
  /** lowest in-stock price */
  from: number;
  inStock: number;
  lastOne: boolean;
}

const US = "SIZE · US";

function finish(p: ProductInput): Product {
  const inStock = p.v.filter((x) => x[2]);
  return {
    ...p,
    label: p.label ?? US,
    from: Math.min(...(inStock.length ? inStock : p.v).map((x) => x[1])),
    inStock: inStock.length,
    lastOne: p.v.length >= 4 && inStock.length === 1,
  };
}

const WALL: ProductInput[] = [
  { id: "phantom", name: "Jordan 1 Retro Low OG SP Travis Scott Black Phantom", short: "Black Phantom", brand: "JORDAN", cat: "SNEAKERS", color: "#7d84a8", accent: "#c9c3b6", ar: "جوردان 1 ريترو لو أو جي إس بي ترافيس سكوت بلاك فانتوم",
    v: [["7", 6500, 0], ["8", 6000, 0], ["8.5", 5500, 0], ["9", 5500, 1], ["9.5", 6500, 0], ["10.5", 4000, 0], ["11", 6500, 0], ["11.5", 6000, 0]] },
  { id: "mocha", name: "Jordan 1 Retro Low OG Mocha", short: "Mocha Low", brand: "JORDAN", cat: "SNEAKERS", color: "#a8693f", ar: "جوردان 1 ريترو لو أو جي موكا",
    v: [["7.5", 1200, 0], ["10", 1200, 1], ["10.5", 1900, 0], ["11", 1900, 1]] },
  { id: "redcement", name: "Jordan 4 Retro Red Cement", short: "Red Cement", brand: "JORDAN", cat: "SNEAKERS", color: "#e63323", ar: "جوردان 4 ريترو ريد أسمنت", img2: "redcement2",
    v: [["9", 2500, 0], ["11", 2900, 1]] },
  { id: "guava", name: "Air Jordan 4 Retro SP Union Guava Ice", short: "Guava Ice", brand: "JORDAN × UNION", cat: "SNEAKERS", color: "#ff8fb1", accent: "#ffe27a", ar: "اير جوردان 4 ريترو اس بي يونيون جوافة ايس",
    v: [["9.5", 5800, 1], ["10", 4725, 0]] },
  { id: "habibi", name: "Nike SB Dunk Low Frame Skate Habibi", short: "Habibi", brand: "NIKE SB", cat: "SNEAKERS", color: "#1f9e5a", accent: "#ff4a3d", ar: "نايك اس بي دانك لو فريم سكيت حبيبي",
    v: [["10", 4725, 0], ["11", 5500, 1]] },
  { id: "beluga", name: "Yeezy Boost 350 V2 Carbon Beluga", short: "Carbon Beluga", brand: "YEEZY", cat: "SNEAKERS", color: "#ff5a12", ar: "ييزي بوست 350 في 2 كربون بيلوجا",
    v: [["5", 1600, 1], ["7", 2500, 0], ["7.5", 1500, 1], ["8", 1500, 1], ["8.5", 1500, 1], ["9", 1500, 1], ["10", 2500, 0], ["11", 2500, 0], ["11.5", 1500, 1], ["12", 1600, 1], ["12.5", 2500, 0]] },
  { id: "satin", name: "Jordan 1 Retro High Satin Snake Chicago (W)", short: "Satin Snake", brand: "JORDAN", cat: "SNEAKERS", color: "#b0123a", ar: "جوردان 1 ريترو هاي ساتان سنيك شيكاغو",
    v: [["7", 1890, 0], ["10.5W", 1800, 0], ["11W", 1800, 1], ["12W", 1800, 1]] },
  { id: "oxidized", name: "Jordan 4 Retro Oxidized Green", short: "Oxidized Green", brand: "JORDAN", cat: "SNEAKERS", color: "#1f6f5c", accent: "#39ff6a", ar: "جوردان 4 ريترو أخضر مؤكسد",
    v: [["10", 1800, 1]] },
  { id: "panda", name: "Nike Dunk Low Retro White Black Panda (2021) (W)", short: "Panda", brand: "NIKE", cat: "SNEAKERS", color: "#9aa0a6", ar: "نايك دانك لو ريترو أبيض أسود باندا",
    v: [["6W", 1800, 1]] },
  { id: "azure", name: "Yeezy Slide Azure", short: "Slide Azure", brand: "YEEZY", cat: "SNEAKERS", color: "#2340d8", accent: "#7d8cff", ar: "ييزي سلايد آزور",
    v: [["4", 1300, 0], ["5", 1300, 0], ["6", 650, 1], ["7", 650, 1], ["8", 650, 1]] },
  { id: "fogtee", name: "Fear of God Essentials Tee Dusty Beige", short: "Essentials Tee", brand: "ESSENTIALS", cat: "STREETWEAR", color: "#c9b79a", ar: "فير أوف جود إسنشلز تي شيرت بيج", label: "SIZE",
    v: [["XS", 700, 0], ["S", 700, 1], ["M", 700, 1], ["L", 700, 1]] },
  { id: "drewls", name: "Drew House Mascot LS Black", short: "Mascot LS", brand: "DREW HOUSE", cat: "STREETWEAR", color: "#ffd400", ar: "درو هاوس ماسكوت بأكمام طويلة أسود", label: "SIZE",
    v: [["XXS", 450, 1], ["S", 500, 1]] },
  { id: "kaws", name: "KAWS Companion Open Edition Vinyl Figure Black", short: "Companion", brand: "KAWS", cat: "COLLECTIBLES", color: "#5a5f74", accent: "#ffd400", ar: "كاوس كومبانيون فينيل أسود", label: "EDITION",
    v: [["OPEN EDITION", 3500, 1]] },
  { id: "bearbrick", name: "Bearbrick Pink Panther 1000%", short: "Pink Panther", brand: "BEARBRICK", cat: "COLLECTIBLES", color: "#ff6ec7", ar: "بيربريك بينك بانثر 1000٪", label: "SCALE",
    v: [["1000%", 4500, 1]] },
  { id: "supreme", name: "Supreme Enamel Logo 6-Panel Red", short: "6-Panel Red", brand: "SUPREME", cat: "ACCESSORIES", color: "#e3201b", ar: "سوبريم قبعة شعار مينا أحمر", label: "SIZE",
    v: [["ONE SIZE", 550, 1]] },
];

/** The 15 pieces on the wall, in shop order. */
export const PRODUCTS: Product[] = WALL.map(finish);

/** The legit-check grail: sold through the scan section, not on the wall. */
export const FRAGMENT: Product = finish({
  id: "fragment", name: "Jordan 1 High OG SP Fragment x Travis Scott", short: "Fragment × Travis", brand: "JORDAN × FRAGMENT", cat: "SNEAKERS", color: "#2a4fb8", accent: "#f4f1ea", ar: "جوردان 1 هاي أو جي إس بي فراجمنت × ترافيس سكوت", img2: "fragment2", grail: true,
  v: [["10", 22000, 1]],
});

export const byId: Record<string, Product> = Object.fromEntries([...PRODUCTS, FRAGMENT].map((p) => [p.id, p]));

/** The 8 pairs on the hero ring, in turning order. */
export const RING: Product[] = ["phantom", "guava", "redcement", "habibi", "mocha", "beluga", "satin", "oxidized"].map((id) => byId[id]);

export const CATEGORIES = ["ALL", "SNEAKERS", "STREETWEAR", "COLLECTIBLES", "ACCESSORIES"] as const;
export type Filter = (typeof CATEGORIES)[number];

export const imgOf = (p: Product) => `/img/${p.id}.webp`;
export const img2Of = (p: Product) => (p.img2 ? `/img/${p.img2}.webp` : imgOf(p));
export const priceOf = (id: string, size: string) => (byId[id].v.find((x) => x[0] === size) ?? [0, byId[id].from])[1];
export const sizeText = (p: Product, s: string) => (p.label === US ? `US ${s}` : s);
export const isUsSized = (p: Product) => p.label === US;

export const money = (n: number) => "AED " + n.toLocaleString("en-US");

export const FREE_SHIP = 1000;
export const STD_SHIP = 25;
export const EXP_SHIP = 50;
export type ShipMethod = "standard" | "express";
export const shipCost = (sub: number, method: ShipMethod) => (method === "express" ? EXP_SHIP : sub >= FREE_SHIP ? 0 : STD_SHIP);
